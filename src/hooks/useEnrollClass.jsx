import { useDispatch, useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import { doc, getDoc, runTransaction, updateDoc } from 'firebase/firestore'
import { setAppliedClassList, setNewsBoxList, setClassNewsList } from '../store/userSlice'
import { setAppliedStudentList } from '../store/classSelectedSlice'
import useGetRidOverlap from './useGetRidOverlap'

const useEnrollClass = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const dispatcher = useDispatch()
  const { makeUniqueArrWithEle } = useGetRidOverlap()

  //학생의 가입 신청(24.01.26) - classRoomDetail
  const signUpUserInClass = async (params) => {
    let classParam = params.classInfo
    let petParam = params.petInfo
    let paramId = params.id
    const studentUserRef = doc(db, "user", user.uid);
    const classRoomRef = doc(db, "classRooms", classParam.id)
    const teacherRef = doc(db, "user", classParam.uid)
    const studentInfo = { name: user.name, email: user.email, uid: user.uid, studentNumber: user.studentNumber };
    const classInfo = {
      id: classParam.id,
      classTitle: classParam.classTitle,
      grade: classParam.grade,
      classNumber: classParam.classNumber,
      subject: classParam.subject
    }
    let appliedClassList //학생의 신청 클래스 리스트
    let appliedStudentList //클래스의 신청 학생 리스트
    let appliedStudentClassList
    await runTransaction(db, async (transaction) => {
      //1. 읽기
      const classRoomDoc = await transaction.get(classRoomRef);
      const studentDoc = await transaction.get(studentUserRef);
      const teacherDoc = await transaction.get(teacherRef);
      if (!classRoomDoc.exists()) {
        throw new Error("ClassRoom does not exist!");
      }
      if (!studentDoc.exists()) {
        throw new Error("Student does not exist!");
      }
      if (!studentDoc.exists()) {
        throw new Error("Teacher does not exist!");
      }
      //2. 업데이트
      //학생 side
      appliedClassList = studentDoc.data().appliedClassList
      appliedStudentList = classRoomDoc.data().appliedStudentList
      appliedStudentClassList = teacherDoc.data().appliedStudentClassList
      if (appliedClassList) { //가입 신청한 클래스가 있다면
        appliedClassList = makeUniqueArrWithEle(appliedClassList, classInfo, "id") //중복 제거
      } else { appliedClassList = [classInfo] } //첫 클래스 가입 
      //클래스 side
      if (appliedStudentList) { //기존 학생 배열이 있다면
        appliedStudentList = makeUniqueArrWithEle(appliedStudentList, studentInfo, "uid")
      } else { appliedStudentList = [studentInfo] } //첫 가입 학생
      //교사 side
      if (appliedStudentClassList) { //가입 신청한 다른 학생이 있다면
        appliedStudentClassList = makeUniqueArrWithEle(teacherDoc.data().appliedStudentClassList, { id: paramId, petInfo: petParam, studentInfo, classInfo }, "id")
      } else { appliedStudentClassList = [{ id: paramId, petInfo: petParam, studentInfo, classInfo }] } //클래스 첫 학생
      transaction.update(studentUserRef, { appliedClassList });
      transaction.update(classRoomRef, { appliedStudentList });
      transaction.update(teacherRef, { appliedStudentClassList });
    }).then(() => {//성공한 경우 전역변수 변경
      dispatcher(setAppliedClassList(appliedClassList))
      dispatcher(setAppliedStudentList(appliedStudentList))
      window.alert("가입 신청 되었습니다.")
    }).catch(err => {
      window.alert(err)
    });
  }

  //학생의 가입 결과 확인 
  const confirmApplyResult = async (params, callRewardModal) => {
    console.log(params)
    let isApproved = params.isApproved
    let id = params.id
    let classNewsList
    let userRef = doc(db, "user", user.uid)
    let studentUser = await getDoc(userRef)
    classNewsList = studentUser.data().classNewsList
    if (classNewsList) { //삭제
      classNewsList = classNewsList.filter((item) => { return item.id !== id })
    }
    updateDoc(userRef, { classNewsList }).then(() => {
      dispatcher(setClassNewsList(classNewsList))
      if (isApproved) { //승인된 경우만 보상 대화창 확인
        callRewardModal({ type: params.type, subject: params.subject })
      }
    }).catch(err => {
      console.log(err)
      window.alert(err)
    })
  }

  //교사의 가입 승인
  const approveMembership = async (params) => {
    let studentInfo = params.studentInfo //받아온 변수 Param
    let classInfo = params.classInfo
    let petInfo = params.petInfo
    let paramId = params.id
    const teacherUserRef = doc(db, "user", user.uid);
    const classRoomRef = doc(db, "classRooms", classInfo.id)
    const studentRef = doc(db, "user", studentInfo.uid)
    const petRef = doc(db, "classRooms", classInfo.id, "students", petInfo.value)
    let appliedStudentClassList
    let appliedClassList
    let appliedStudentList
    let joinedClassList
    let myPetList
    let memberList
    let classNewsList
    await runTransaction(db, async (transaction) => {
      let classRoomDoc = await transaction.get(classRoomRef);
      let studentDoc = await transaction.get(studentRef);
      let teacherUserDoc = await transaction.get(teacherUserRef);
      let petDoc = await transaction.get(petRef);
      //1. 읽기
      if (!classRoomDoc.exists()) { throw new Error("ClassRoom does not exist!"); }
      if (!studentDoc.exists()) { throw new Error("Student does not exist!"); }
      if (!teacherUserDoc.exists()) { throw new Error("TeacherUserInfo does not exist!"); }
      if (!petDoc.exists()) { throw new Error("Pet does not exist!"); }
      //2. 수정
      //교사
      appliedStudentClassList = teacherUserDoc.data().appliedStudentClassList
      if (appliedStudentClassList) { appliedStudentClassList = appliedStudentClassList.filter((item) => { return item.id !== paramId }) }
      //학생
      appliedClassList = studentDoc.data().appliedClassList
      classNewsList = studentDoc.data().classNewsList
      joinedClassList = studentDoc.data().joinedClassList
      myPetList = studentDoc.data().myPetList
      if (appliedClassList) { appliedClassList = appliedClassList.filter((item) => { return item.id !== classInfo.id }) }
      if (classNewsList) { classNewsList = makeUniqueArrWithEle(classNewsList, { ...classInfo, type: "class", isApproved: true }, "id") }
      else { classNewsList = [{ ...classInfo, type: "class", isApproved: true, }] }
      if (joinedClassList) { joinedClassList = makeUniqueArrWithEle(joinedClassList, { ...classInfo, petId: petInfo.value }, "id") }
      else { joinedClassList = [{ ...classInfo, petId: petInfo.value }] }
      if (myPetList) { myPetList = makeUniqueArrWithEle(myPetList, { id: petDoc.id, ...petDoc.data() }, "id") }
      else { myPetList = [{ ...petDoc.data(), id: petDoc.id }] }
      //교실
      appliedStudentList = classRoomDoc.data().appliedStudentList
      memberList = classRoomDoc.data().memberList
      if (appliedStudentList) { appliedStudentList = appliedStudentList.filter((item) => { return item.uid !== studentInfo.uid }) }
      if (memberList) { memberList = makeUniqueArrWithEle(memberList, studentInfo, "uid") } else { memberList = [studentInfo] }
      //3. 업데이트
      transaction.update(teacherUserRef, { appliedStudentClassList }) //교사
      transaction.update(studentRef, { appliedClassList, joinedClassList, myPetList, classNewsList }) //교실
      transaction.update(classRoomRef, { appliedStudentList, memberList })
      if (petDoc.data().master) {
        throw new Error("이미 누군가 구독중인 학생입니다. 본인 정보만 열람 가능합니다.")
      } else { transaction.update(petRef, { master: studentInfo.uid }); }
    }).then(() => {//성공한 경우에만 전역변수 변경(바로 화면 반영)
      dispatcher(setNewsBoxList(appliedStudentClassList)) //user 전역변수 변경(바로 화면 반영)
      window.alert("승인되었습니다.")
    }).catch(err => {
      window.alert(err)
      console.log(err)
    })
  }

  //교사의 가입 거부
  const denyMembership = async (params) => {
    let studentInfo = params.studentInfo //받아온 변수 Param
    let classInfo = params.classInfo
    let paramId = params.id
    const teacherUserRef = doc(db, "user", user.uid);
    const classRoomRef = doc(db, "classRooms", classInfo.id)
    const studentRef = doc(db, "user", studentInfo.uid)
    let appliedStudentClassList //교사
    let appliedClassList //학생
    let appliedStudentList //교실
    let classNewsList
    await runTransaction(db, async (transaction) => {
      let classRoomDoc = await transaction.get(classRoomRef);
      let studentDoc = await transaction.get(studentRef);
      let teacherUserDoc = await transaction.get(teacherUserRef);
      appliedStudentClassList = teacherUserDoc.data().appliedStudentClassList
      appliedClassList = studentDoc.data().appliedClassList
      appliedStudentList = classRoomDoc.data().appliedStudentList
      classNewsList = studentDoc.data().classNewsList
      //1. 신청 정보 삭제
      //교사 side
      if (appliedStudentClassList) {
        appliedStudentClassList = appliedStudentClassList.filter((item) => { return item.id !== paramId })
        transaction.update(teacherUserRef, { appliedStudentClassList })
      } else { throw new Error("교사 news 지우기 에러"); }
      //학생 side        
      if (appliedClassList) {
        appliedClassList = appliedClassList.filter((item) => { return item.id !== classInfo.id })
        transaction.update(studentRef, { appliedClassList })
      } else { throw new Error("학생 유저 신청반 지우기 에러"); }
      //교실 side
      if (appliedStudentList) {
        appliedStudentList = appliedStudentList.filter((item) => { return item.uid !== studentInfo.uid })
        transaction.update(classRoomRef, { appliedStudentList })
      } else { throw new Error("교실반 학생 지우기 에러"); }
      //2. 학생에게 알리기
      if (classNewsList) {
        classNewsList = makeUniqueArrWithEle(classNewsList, { ...classInfo, type: "class", isApproved: false }, "id")
      } else { classNewsList = [{ ...classInfo, type: "class", isApproved: false }] }
      transaction.update(studentRef, { classNewsList })
    }).then(() => {
      dispatcher(setNewsBoxList(appliedStudentClassList)) //user 전역변수 변경(바로 화면 반영)
    }).catch((err) => {
      window.alert(err)
      console.log(err)
    })
  }
  return { signUpUserInClass, confirmApplyResult, approveMembership, denyMembership }
}

export default useEnrollClass