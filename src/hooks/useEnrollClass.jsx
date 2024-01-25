import { useDispatch, useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import { doc, runTransaction } from 'firebase/firestore'
import { setAppliedClassList, setNewsBoxList } from '../store/userSlice'
import { setAppliedStudentList } from '../store/classSelectedSlice'


const useEnrollClass = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const dispatcher = useDispatch()

  //학생의 가입 신청
  const signUpUserInClass = async (classInfo) => {
    const studentUserRef = doc(db, "user", user.uid);
    const classRoomRef = doc(db, "classRooms", classInfo.id)
    const teacherRef = doc(db, "user", classInfo.uid)
    const userInfo = { name: user.name, email: user.email, uid: user.uid };
    const key = `${user.uid}${classInfo.id}`
    try {
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
          let appliedClassList = studentDoc.data().appliedClassList
          appliedClassList.push(classInfo)
          transaction.update(studentUserRef, { appliedClassList });
          dispatcher(setAppliedClassList(appliedClassList)) //user 전역변수 변경(바로 화면 반영)
        } else {//첫 클래스 가입 신청이라면
          let appliedClassList = [classInfo]
          transaction.update(studentUserRef, { appliedClassList });
          dispatcher(setAppliedClassList(appliedClassList)) //user 전역변수 변경(바로 화면 반영)
        }
        //클래스 side
        if (classRoomDoc.data().appliedStudentList) { //가입 신청한 다른 학생이 있다면
          let appliedStudentList = classRoomDoc.data().appliedStudentList
          appliedStudentList.push(userInfo)
          transaction.update(classRoomRef, { appliedStudentList });
          dispatcher(setAppliedStudentList(appliedStudentList)) //user 전역변수 변경(바로 화면 반영)
        } else { //클래스에서 가입 신청한 첫 학생이라면
          let appliedStudentList = [userInfo]
          transaction.update(classRoomRef, { appliedStudentList });
          dispatcher(setAppliedStudentList(appliedStudentList)) //user 전역변수 변경(바로 화면 반영)
        }
        //교사 side
        if (teacherDoc.data().appliedStudentClassList) { //가입 신청한 다른 학생이 있다면
          let appliedStudentClassList = teacherDoc.data().appliedStudentClassList
          appliedStudentClassList.push({ key, student: userInfo, classInfo: classInfo })
          transaction.update(teacherRef, { appliedStudentClassList });
        } else { //클래스에서 가입 신청한 첫 학생이라면
          let appliedStudentClassList = [{ key, student: userInfo, classInfo: classInfo }]
          transaction.update(teacherRef, { appliedStudentClassList });
        }
        //todo 중복 가입 방지 로직 
      });
      window.alert('성공적으로 가입되었습니다.')
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }

  //교사의 가입 승인
  const approveMembership = async (classInfo, studentInfo) => {
    const teacherUserRef = doc(db, "user", user.uid);
    const classRoomRef = doc(db, "classRooms", classInfo.id)
    const studentRef = doc(db, "user", studentInfo.uid)
    const key = `${studentInfo.uid}${classInfo.id}`
    try {
      await runTransaction(db, async (transaction) => {
        let classRoomDoc = await transaction.get(classRoomRef);
        let studentDoc = await transaction.get(studentRef);
        let teacherUserDoc = await transaction.get(teacherUserRef);
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
        //2. 지우기
        //교사 side
        if (teacherUserDoc.data().appliedStudentClassList) {
          let applyInfoList = teacherUserDoc.data().appliedStudentClassList
          let newAppliInfoList = applyInfoList.filter((item) => { return item.key !== key })
          transaction.update(teacherUserRef, { appliedStudentClassList: newAppliInfoList })
          dispatcher(setNewsBoxList(newAppliInfoList)) //user 전역변수 변경(바로 화면 반영)
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
          let joinedClassList = studentDoc.data().joinedClassList
          joinedClassList.push(classInfo)
          transaction.update(studentRef, { joinedClassList });
        } else {//클래스 첫 가입이라면
          let joinedClassList = [classInfo]
          transaction.update(studentRef, { joinedClassList });
        }
        //클래스 side
        if (classRoomDoc.data().memberList) { //이미 가입된 학생이 있다면
          let memberList = studentDoc.data().memberList
          memberList.push(studentInfo)
          transaction.update(classRoomRef, { memberList });
        } else { //가입하는 첫번째 학생이라면
          let memberList = [studentInfo]
          transaction.update(classRoomRef, { memberList });
        }
      });
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }

  //교사의 가입 거부
  const denyMembership = async (classInfo, studentInfo) => {
    const teacherUserRef = doc(db, "user", user.uid);
    const classRoomRef = doc(db, "classRooms", classInfo.id)
    const studentRef = doc(db, "user", studentInfo.uid)
    const key = `${studentInfo.uid}${classInfo.id}`
    try {
      await runTransaction(db, async (transaction) => {
        let classRoomDoc = await transaction.get(classRoomRef);
        let studentDoc = await transaction.get(studentRef);
        let teacherUserDoc = await transaction.get(teacherUserRef);
        //교사 side
        if (teacherUserDoc.data().appliedStudentClassList) {
          let applyInfoList = teacherUserDoc.data().appliedStudentClassList
          let newAppliInfoList = applyInfoList.filter((item) => { return item.key !== key })
          transaction.update(teacherUserRef, { appliedStudentClassList: newAppliInfoList })
          dispatcher(setNewsBoxList(newAppliInfoList)) //user 전역변수 변경(바로 화면 반영)
        } else {
          throw new Error("교사 newsBox 지우기 에러");
        }
        // //학생 side        
        if (studentDoc.data().appliedClassList) {
          let newAppliedClassList = studentDoc.data().appliedClassList.filter((item) => { return item.id !== classInfo.id })
          transaction.update(studentRef, { appliedClassList: newAppliedClassList })
        } else {
          throw new Error("학생 유저에서 신청반 지우기 에러");
        }
        // //교실 side
        if (classRoomDoc.data().appliedStudentList) {
          let newAappliedStudentList = classRoomDoc.data().appliedStudentList.filter((item) => { return item.uid !== studentInfo.uid })
          transaction.update(classRoomRef, { appliedStudentList: newAappliedStudentList })
        } else {
          throw new Error("교실에서 학생 지우기 에러");
        }
      })
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }
  return { signUpUserInClass, approveMembership, denyMembership }
}

export default useEnrollClass