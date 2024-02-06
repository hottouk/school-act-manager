import { useDispatch, useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import { doc, runTransaction } from 'firebase/firestore'
import { setAppliedClassList, setNewsBoxList } from '../store/userSlice'
import { setAppliedStudentList } from '../store/classSelectedSlice'
import useGetRidOverlap from './useGetRidOverlap'

const useEnrollClass = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const dispatcher = useDispatch()
  const { makeUniqueArrWithEle } = useGetRidOverlap()

  //학생의 가입 신청(24.01.26) - classRoomDetail
  const signUpUserInClass = async (params) => {
    let studentParam = params.studentInfo //받아온 변수 Param
    let classParam = params.classInfo
    let petParam = params.petInfo
    let paramId = params.id
    const studentUserRef = doc(db, "user", studentParam.uid);
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
      if (studentDoc.data().appliedClassList) { //가입 신청한 클래스가 있다면
        appliedClassList = makeUniqueArrWithEle(studentDoc.data().appliedClassList, classInfo, "id") //합산 후 중복 제거
        transaction.update(studentUserRef, { appliedClassList });
      } else {//첫 클래스 가입 신청이라면
        appliedClassList = [classInfo]
        transaction.update(studentUserRef, { appliedClassList });
      }
      //클래스 side
      if (classRoomDoc.data().appliedStudentList) { //기존 학생 배열이 있다면
        appliedStudentList = makeUniqueArrWithEle(classRoomDoc.data().appliedStudentList, studentInfo, "uid")
        transaction.update(classRoomRef, { appliedStudentList });
      } else { //클래스에서 가입 신청한 첫 학생이라면
        appliedStudentList = [studentInfo]
        transaction.update(classRoomRef, { appliedStudentList });
      }
      //교사 side
      if (teacherDoc.data().appliedStudentClassList) { //가입 신청한 다른 학생이 있다면
        let appliedStudentClassList = makeUniqueArrWithEle(teacherDoc.data().appliedStudentClassList, { id: paramId, petInfo: petParam, studentInfo, classInfo }, "id")
        transaction.update(teacherRef, { appliedStudentClassList });
      } else { //클래스에서 가입 신청한 첫 학생이라면
        let appliedStudentClassList = [{ id: paramId, petInfo: petParam, studentInfo, classInfo }]
        transaction.update(teacherRef, { appliedStudentClassList });
      }
    }).then(() => {
      //성공한 경우에만 전역변수 변경(바로 화면 반영)
      dispatcher(setAppliedClassList(appliedClassList))
      dispatcher(setAppliedStudentList(appliedStudentList))
      window.alert("가입 신청 되었습니다.")
    }).catch(err => {
      console.log(err)
    });
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
    let applyInfoList
    await runTransaction(db, async (transaction) => {
      let classRoomDoc = await transaction.get(classRoomRef);
      let studentDoc = await transaction.get(studentRef);
      let teacherUserDoc = await transaction.get(teacherUserRef);
      let petDoc = await transaction.get(petRef);
      //1. 읽기
      if (!classRoomDoc.exists()) {
        throw new Error("ClassRoom does not exist!");
      }
      if (!studentDoc.exists()) {
        throw new Error("Student does not exist!");
      }
      if (!teacherUserDoc.exists()) {
        throw new Error("TeacherUserInfo does not exist!");
      }
      if (!petDoc.exists()) {
        throw new Error("Pet does not exist!");
      }
      //2. 지우기
      //교사 side
      if (teacherUserDoc.data().appliedStudentClassList) {
        applyInfoList = teacherUserDoc.data().appliedStudentClassList.filter((item) => { return item.id !== paramId })
        transaction.update(teacherUserRef, { appliedStudentClassList: applyInfoList })
      } else {
        throw new Error("교사 newsBox 지우기 에러");
      }
      //학생 side        
      if (studentDoc.data().appliedClassList) {
        let newAppliedClassList = studentDoc.data().appliedClassList.filter((item) => { return item.id !== classInfo.id })
        transaction.update(studentRef, { appliedClassList: newAppliedClassList })
      } else {
        throw new Error("학생 유저에서 신청반 지우기 에러");
      }
      //교실 side
      if (classRoomDoc.data().appliedStudentList) {
        let newAappliedStudentList = classRoomDoc.data().appliedStudentList.filter((item) => { return item.uid !== studentInfo.uid })
        transaction.update(classRoomRef, { appliedStudentList: newAappliedStudentList })
      } else {
        throw new Error("교실에서 학생 지우기 에러");
      }
      //3. 업데이트
      //학생 side
      if (studentDoc.data().joinedClassList) {
        //이미 가입된 클래스가 있다면
        let joinedClassList = makeUniqueArrWithEle(studentDoc.data().joinedClassList, { ...classInfo, petId: petInfo.value }, "id")
        transaction.update(studentRef, { joinedClassList });
      } else {//클래스 첫 가입이라면
        let joinedClassList = [{ ...classInfo, petId: petInfo.value }]
        transaction.update(studentRef, { joinedClassList });
      }
      //클래스 side
      if (classRoomDoc.data().memberList) { //이미 가입된 학생이 있다면
        let memberList = makeUniqueArrWithEle(classRoomDoc.data().memberList, studentInfo, "uid")
        transaction.update(classRoomRef, { memberList });
      } else { //가입하는 첫번째 학생이라면
        let memberList = [studentInfo]
        transaction.update(classRoomRef, { memberList });
      }
      //펫 side
      if (petDoc.data().master) {
        throw new Error("이미 누군가 구독중인 학생입니다. 본인 정보만 열람 가능합니다.")
      } else {
        transaction.update(petRef, { master: studentInfo.uid });
      }
    }).then(() => {
      //성공한 경우에만 전역변수 변경(바로 화면 반영)
      dispatcher(setNewsBoxList(applyInfoList)) //user 전역변수 변경(바로 화면 반영)
    }).catch(err => {
      window.alert(err)
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
    let applyInfoList
    await runTransaction(db, async (transaction) => {
      let classRoomDoc = await transaction.get(classRoomRef);
      let studentDoc = await transaction.get(studentRef);
      let teacherUserDoc = await transaction.get(teacherUserRef);
      //교사 side
      if (teacherUserDoc.data().appliedStudentClassList) {
        applyInfoList = teacherUserDoc.data().appliedStudentClassList.filter((item) => { return item.id !== paramId })
        transaction.update(teacherUserRef, { appliedStudentClassList: applyInfoList })
      } else {
        throw new Error("교사 newsBox 지우기 에러");
      }
      //학생 side        
      if (studentDoc.data().appliedClassList) {
        let newAppliedClassList = studentDoc.data().appliedClassList.filter((item) => { return item.id !== classInfo.id })
        transaction.update(studentRef, { appliedClassList: newAppliedClassList })
      } else {
        throw new Error("학생 유저에서 신청반 지우기 에러");
      }
      //교실 side
      if (classRoomDoc.data().appliedStudentList) {
        let newAappliedStudentList = classRoomDoc.data().appliedStudentList.filter((item) => { return item.uid !== studentInfo.uid })
        transaction.update(classRoomRef, { appliedStudentList: newAappliedStudentList })
      } else {
        throw new Error("교실에서 학생 지우기 에러");
      }
    }).then(() => {
      dispatcher(setNewsBoxList(applyInfoList)) //user 전역변수 변경(바로 화면 반영)
    }).catch((err) => {
      console.log(err)
    })
  }
  return { signUpUserInClass, approveMembership, denyMembership }
}

export default useEnrollClass