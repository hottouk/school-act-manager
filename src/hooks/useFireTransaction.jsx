import { arrayRemove, arrayUnion, collection, doc, runTransaction } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import useGetRidOverlap from './useGetRidOverlap'

const useFireTransaction = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const userColRef = collection(db, "user")
  const { makeUniqueArrWithEle } = useGetRidOverlap()

  //4. 교사 가입 승인
  const approveKlassTransaction = async (info, pet) => {
    const { classId, petId, studentId, studentName } = info
    const teacherRef = doc(db, "user", user.uid);
    const studentRef = doc(db, "user", studentId)
    const petRef = doc(db, "classRooms", classId, "students", petId)

    await runTransaction(db, async (transaction) => {
      const studentDoc = await transaction.get(studentRef);
      const teacherDoc = await transaction.get(teacherRef);
      const petDoc = await transaction.get(petRef);
      //1. 읽기
      if (!studentDoc.exists()) { throw new Error("Student does not exist!"); }
      if (!teacherDoc.exists()) { throw new Error("TeacherUserInfo does not exist!"); }
      if (!petDoc.exists()) { throw new Error("Pet does not exist!"); }
      //2. 수정
      //교사: 상신 목록 삭제
      transaction.update(teacherRef, { onSubmitList: arrayRemove(info) }) //교사

      //학생: 펫 추가, 신청 -> 승인 수정
      const myClassList = studentDoc.data().myClassList || [];
      const updatedMyClassList = myClassList.map((item) => {
        if (item.id === classId) { return { ...item, isApproved: true } }
        return item
      })
      transaction.update(studentRef,
        { myClassList: updatedMyClassList, myPetList: arrayUnion(pet) })

      //펫: 학생 정보 추가
      const master = petDoc.data().master || null;
      if (petDoc.data().master) {
        const { studentName } = master
        throw new Error(`이미 ${studentName}(이)가 구독중인 학생 정보입니다. 학생 중복 구독 여부를 확인해주세요`)
      } else { transaction.update(petRef, { master: { studentId, studentName } }); }
    }).then(() => {
      window.alert("학생의 신청이 승인되었습니다.")
    }).catch(err => {
      window.alert(err)
      console.log(err)
    })
  }

  //3. 학생 가입 신청
  const applyKlassTransaction = async (info) => {
    const { uid, id, petId, petLabel, classTitle, subject, subjDetail, intro } = info
    const klassInfo = { uid, id, classTitle, intro, subject, subjDetail, isApproved: false } //신청 정보
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const submitInfo =
      { studentId: user.uid, studentName: user.name, studentNumber: user.studentNumber, school: user.school.schoolName, petId, petLabel, applyDate: today, type: "klass", classId: id, classTitle, classSubj: subject } //상신 정보
    const studentDocRef = doc(userColRef, user.uid)
    const teacherDocRef = doc(userColRef, uid)
    await runTransaction(db, async (transaction) => {
      const studentDoc = await transaction.get(studentDocRef)
      if (!studentDoc.exists()) { throw new Error("학생 읽기 에러") }

      //이미 신청 확인
      const isApplied = studentDoc.data().myClassList?.find((item) => item.id === id)
      if (isApplied) throw new Error("이미 가입되었거나 가입 신청한 클래스입니다.")

      //학생 신청 정보 업데이트, 교사 상신
      transaction.update(studentDocRef, { "myClassList": arrayUnion(klassInfo) })
      transaction.update(teacherDocRef, { "onSubmitList": arrayUnion(submitInfo) })
    }).then(() => {
      window.alert("가입 신청되었습니다.")
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
  }

  //2. 업어온 활동 삭제하기: 활동 관리 - 나의 활동 - 업어온 활동 - 삭제
  const delCopiedActiTransaction = async (actiId) => {
    let userDocRef = doc(userColRef, user.uid)
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef)
      if (!userDoc.exists()) { throw new Error("유저 읽기 에러") }
      let copiedActiList = userDoc.data().copiedActiList || [];
      copiedActiList = copiedActiList.filter((item) => { return item.id !== actiId })
      transaction.update(userDocRef, { copiedActiList })
    }).then(() => {
      window.alert("활동이 삭제되었습니다.")
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
  }

  //1. 활동 업어오기: 활동 관리 - 전체활동 - 타교사 - 퍼가기
  const copyActiTransaction = async (acti) => {
    const actiId = acti.id
    const othrId = acti.uid
    const actiRef = doc(db, "activities", actiId)
    const userRef = doc(db, "user", user.uid)
    const otrRef = doc(db, "user", othrId) //다른 교사 user
    //신규값
    await runTransaction(db, async (transaction) => {
      const actiDoc = await transaction.get(actiRef)
      const userDoc = await transaction.get(userRef)
      const otrDoc = await transaction.get(otrRef)
      if (!actiDoc.exists()) { throw new Error("활동 읽기 에러") }
      if (!userDoc.exists()) { throw new Error("유저 읽기 에러") }
      if (!otrDoc.exists()) { throw new Error("타교사 읽기 에러") }
      //기존 데이터 or undefined 반환 undefined인 경우엔 초기값 제공
      let copiedActiList = userDoc.data().copiedActiList || [];  //기존 업어간 활동 //기존 업어간 활동 + 새로 업어온 활동
      copiedActiList = makeUniqueArrWithEle(copiedActiList, { id: actiDoc.id, ...actiDoc.data(), madeById: actiDoc.data().uid, uid: user.uid }, "id")
      let likedCount = (actiDoc.data().likedCount || 0) + 1;
      let targetLikedCount = (otrDoc.data().likedCount || 0) + 1;  //기존 좋아요 + 1 
      //업데이트
      transaction.update(userRef, { copiedActiList })
      transaction.update(actiRef, { likedCount })
      transaction.update(otrRef, { targetLikedCount })
    }).then(() => {
      window.alert("활동이 저장되었습니다.")
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
  }
  return { copyActiTransaction, delCopiedActiTransaction, applyKlassTransaction, approveKlassTransaction }
}



export default useFireTransaction