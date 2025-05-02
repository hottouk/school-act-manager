import { appFireStore, timeStamp } from "../../firebase/config"
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore"
import { useSelector } from "react-redux"

const useAddUpdFireData = (collectionName) => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore

  //10. 공지사항(24.07.16)
  const addNotice = async (noticeList) => {
    try {
      let createdTime = timeStamp.fromDate(new Date()).toDate().toISOString();
      await setDoc(doc(db, collectionName, "notice"), { noticeList, createdTime })
      console.log("공지 수정")
    } catch (err) {
      console.error(err)
      window.alert(err.message)
    }
  }
  //9. 클래스룸 추가 함수(24.09.18 1차 수정: 담임반 추가)

  //5. 학생 추가 함수(2024.1.7)

  //4. 학생 update 함수(2024.1.6) 사용처(2): 행발 저장, 행발 특성 데이터 저장
  const updateStudent = async (newInfo, classId, studentId) => {
    let studentRef = doc(db, "classRooms", classId, "students", studentId);
    try {
      updateDoc(studentRef, { ...newInfo }) //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
    } catch (err) {
      window.alert(err.message)
      console.log(err)
    }
  }

  //3. 학생 삭제 함수
  const deleteStudent = async (classId, studentId) => {
    try {
      let studentRef = doc(db, collectionName, classId, 'students', studentId)
      await deleteDoc(studentRef)
    } catch (error) {
      console.log(error)
    }
  }

  //1. 학생 클래스 정보 업데이트
  const updateClassListInfo = async (classList, type) => {
    let userRef = doc(db, "user", user.uid)
    if (type === "joinedClassList") {
      updateDoc(userRef, { joinedClassList: classList })
    } else if (type === "appliedClassList") {
      updateDoc(userRef, { appliedClassList: classList })
    }
  }

  return (
    { addNotice, updateStudent, deleteStudent, updateClassListInfo }
  )
}

export default useAddUpdFireData