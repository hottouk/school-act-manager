import { arrayRemove, arrayUnion, collection, deleteDoc, deleteField, doc, getDocs, query, runTransaction, where, writeBatch } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import useGetRidOverlap from './useGetRidOverlap'
import useAcc from './useAcc'

//복합 collection 함수 모음
const useFireTransaction = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const userColRef = collection(db, "user")
  const userDocRef = doc(userColRef, user.uid)
  const { makeUniqueArrWithEle, replaceItem } = useGetRidOverlap()
  const { makeAccRec } = useAcc();

  //9. 코티칭 교사 가입 승인 
  const approveCoteahingTransaction = async (teacherId, klassId) => {
    const coTeacherRef = doc(userColRef, teacherId);
    try {
      await runTransaction(db, async (transaction) => {
        //1. read
        const coTeacherSnapshot = await transaction.get(coTeacherRef);
        if (!coTeacherSnapshot.exists()) { throw new Error("교사 정보 없음") };
        const coTeachingList = coTeacherSnapshot.data().coTeachingList;
        if (!coTeachingList) { throw new Error("코티칭 신청 정보 없음") };
        //2. edit
        const newList = coTeachingList.map((item) => {
          if (item.id === klassId) { return { ...item, isApproved: true } }
          return item
        });
        transaction.update(coTeacherRef, { coTeachingList: newList });
      })
    } catch (error) {
      console.log(error);
      window.alert(error);
    };
  }

  //8. 학교 탈퇴하기(250217)
  const leaveSchoolTransaction = async (schoolCode) => {
    const userRef = doc(db, "user", user.uid);
    const schoolRef = doc(db, "school", schoolCode);
    const classroomsRef = collection(db, "classRooms");
    try {
      await runTransaction(db, async (transaction) => {
        //1. read
        const userSnapshot = await transaction.get(userDocRef);
        const schoolSnapshot = await transaction.get(schoolRef);
        if (!userSnapshot.exists()) { throw new Error("유저 정보 없음"); };
        if (!schoolSnapshot.exists()) { throw new Error("학교 정보 없음"); };
        //2. write
        const memberList = schoolSnapshot.data().memberList;
        const deleted = memberList.filter((item) => { return item.uid !== user.uid });
        transaction.update(userRef, { school: deleteField(), coTeachingList: deleteField() });
        transaction.update(schoolRef, { memberList: deleted });
      })
      //3. classroom 컬렉션에서 특정 uid를 가진 문서들 삭제
      const q = query(classroomsRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      for (const klassSnapshot of querySnapshot.docs) {
        const klassId = klassSnapshot.id;
        const petsRef = collection(db, "classRooms", klassId, "students");
        while (true) { //무한 반복                                                                         
          const petSnapshots = await getDocs(petsRef);
          const innerBatch = writeBatch(db);
          if (petSnapshots.empty) break;
          petSnapshots.forEach((petSnapshot) => {
            innerBatch.delete(doc(db, "classRooms", klassSnapshot.id, "students", petSnapshot.id)); //subCollection 하위 문서 삭제
          })
          await innerBatch.commit(); // 🔥 subCollection 문서 반복 삭제
        }
        deleteDoc(doc(db, "classRooms", klassSnapshot.id));
      }
    } catch (err) {
      window.alert(err)
      console.log(err)
    }
  }

  //7. 거절 확인
  const confirmDenialTransaction = async (info) => {
    const userRef = doc(db, "user", user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        //1. read
        if (!userDoc.exists()) { throw new Error("유저 정보 없음"); }
        //2. update
        let deleted
        if (user.isTeacher) {
          const coTeachingList = userDoc.data().coTeachingList || [];
          deleted = coTeachingList.filter((item) => { return item.id !== info.id });
          transaction.update(userRef, { onSubmitList: arrayRemove(info), coTeachingList: deleted })
        } else {
          const myKlassList = userDoc.data().myClassList || [];
          deleted = myKlassList.filter((item) => { return item.id !== info.classId })
          transaction.update(userRef, { onSubmitList: arrayRemove(info), myClassList: deleted })
        }
      })
    } catch (err) {
      window.alert(err)
      console.log(err)
    }
  }

  //6. 교사 거절
  const denyTransaction = async (info, reason) => {
    const teacherRef = doc(db, "user", user.uid);
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    let denialInfo
    let otherRef
    if (info.type === "join") {
      const { school, classId, classTitle, petLabel, studentId } = info
      denialInfo = { school, classId, classTitle, petLabel, reason, type: "denial" }
      otherRef = doc(db, "user", studentId);
    } else if (info.type === "win") {
      const { sId, title } = info
      denialInfo = { title, reason, type: "denial" }
      otherRef = doc(db, "user", sId);
    } else if (info.type === "co-teacher") {
      const { klass, teacher } = info
      denialInfo = { id: klass.id, klassTitle: klass.classTitle, subject: klass.subject, name: teacher.name, reason, applyDate: today, type: "denial" }
      otherRef = doc(db, "user", teacher.uid);
    }

    await runTransaction(db, async (transaction) => {
      const teacherDoc = await transaction.get(teacherRef);
      const studentDoc = await transaction.get(otherRef);
      //1. 읽기
      if (!teacherDoc.exists()) { throw new Error("교사 정보 없음"); }
      if (!studentDoc.exists()) { throw new Error("학생 정보 없음"); }
      //2. 수정
      transaction.update(teacherRef, { onSubmitList: arrayRemove(info) })      //교사: 상신 목록 삭제
      transaction.update(otherRef, { onSubmitList: arrayUnion(denialInfo) })   //학생: 거절 목록 추가
    }).then(() => {
      window.alert("거절 사유가 해당 학생에게 전달되었습니다.")
    }).catch(err => {
      window.alert(err)
      console.log(err)
    })
  }

  //5. 교사 생기부 기록 승인
  const approvWinTransaction = async (info) => {
    const { actiId, classId, petId, actiRecord, title, date, tId } = info
    const actiInfo = { assignedDate: date, id: actiId, madeBy: "획득", record: actiRecord, title, uid: tId }
    const teacherRef = doc(db, "user", user.uid);
    const petRef = doc(db, "classRooms", classId, "students", petId)

    await runTransaction(db, async (transaction) => {
      const teacherDoc = await transaction.get(teacherRef);
      const petDoc = await transaction.get(petRef);
      //1. 읽기
      if (!teacherDoc.exists()) { throw new Error("TeacherUserInfo does not exist!"); }
      if (!petDoc.exists()) { throw new Error("Pet does not exist!"); }
      //2. 수정
      //교사: 상신 목록 삭제
      transaction.update(teacherRef, { onSubmitList: arrayRemove(info) })

      //펫: 생기부 기록
      const actiList = petDoc.data().actList || [];
      const uniqueList = replaceItem(actiList, actiInfo, "id");
      const accRecord = makeAccRec(uniqueList);
      transaction.update(petRef, { accRecord, actList: uniqueList })
    }).then(() => {
      window.alert("생기부가 해당 학생에게 기록되었습니다.")
    }).catch(err => {
      window.alert(err)
      console.log(err)
    })
  }

  //4. 학생 가입 승인
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
    const { klass, petId, petLabel, user } = info
    const klassInfo = { ...klass, isApproved: false } //신청 정보
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const submitInfo =
    {
      studentId: user.uid, studentName: user.name, studentNumber: user.studentNumber, school: user.school.schoolName, petId, petLabel,
      classId: klass.id, classTitle: klass.classTitle, classSubj: klass.subject, applyDate: today, type: "join"
    } //상신 정보
    const studentDocRef = doc(userColRef, user.uid)
    const teacherDocRef = doc(userColRef, klassInfo.uid)
    await runTransaction(db, async (transaction) => {
      const studentDoc = await transaction.get(studentDocRef)
      if (!studentDoc.exists()) { throw new Error("학생 읽기 에러") }

      //이미 신청 확인
      const isApplied = studentDoc.data().myClassList?.find((item) => item.id === klass.id)
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
  return { copyActiTransaction, delCopiedActiTransaction, applyKlassTransaction, approveKlassTransaction, approvWinTransaction, denyTransaction, confirmDenialTransaction, leaveSchoolTransaction, approveCoteahingTransaction }
}



export default useFireTransaction