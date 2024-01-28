import { appFireStore, timeStamp } from "../firebase/config"
import { addDoc, collection, deleteDoc, doc, getDocs, query, runTransaction, setDoc, updateDoc, where } from "firebase/firestore"
import { useDispatch, useSelector } from "react-redux"

const useFirestore = (collectionName) => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const colRef = collection(db, collectionName)

  //유저가 기존 DB에 있는지 체크, 없으면 false, 있다면 true와 회원정보 반환(24.01.21)
  const findUser = async (userInfo, sns) => {
    let isUserExist = true
    let userInfofromServer = null;
    let uid
    switch (sns) {
      case "google":
        uid = userInfo.uid
        break;
      case "kakao":
        let profile = userInfo.profile
        uid = String(profile.id)
        break;
      default: return
    }
    try {
      const q = query(colRef, where("uid", "==", uid))
      await getDocs(q).then((querySnapshot) => {
        isUserExist = querySnapshot.docs.length > 0//한명도 없을 경우, 즉 존재하지 않을 경우 false 존재하면 true
        querySnapshot.docs.forEach((doc) => {
          userInfofromServer = doc.data()          //존재할 경우 서버 데이터를 반환
        })
      })
      return { isUserExist, userInfofromServer }
    } catch (error) {
      window.alert(`서버 ${error} 오류입니다.`)
    }
  }

  //유저 추가(24.01.21)
  const addUser = async (userInfo) => {
    let uid = String(userInfo.uid)
    let email = userInfo.email
    let name = userInfo.name
    let isTeacher = userInfo.isTeacher
    let studentNumber = userInfo.studentNumber
    let docRef = doc(db, collectionName, uid)
    try {
      const createdTime = timeStamp.fromDate(new Date());
      await setDoc(docRef, { uid, name, email, isTeacher, createdTime, studentNumber }); //핵심 로직; 만든 날짜와 doc을 받아 파이어 스토어에 col추가
    } catch (error) {
      console.error(error.message)
    }
  }

  //클래스룸 추가 함수
  const addClassroom = async (classAtrs, studentList) => {
    try {
      const createdTime = timeStamp.fromDate(new Date());
      const docRef = await addDoc(colRef, { ...classAtrs, createdTime });
      const subColRef = collection(docRef, 'students')
      await studentList.map(student => {
        addDoc(subColRef, student);
        return student.length
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  //활동 추가 함수
  const addActivity = async (activity) => {
    try {
      const createdTime = timeStamp.fromDate(new Date());
      await addDoc(colRef, { ...activity, createdTime }); //핵심 로직; 만든 날짜와 doc을 받아 파이어 스토어에 col추가
    } catch (error) {
      window.alert(error.message)
    }
  }

  //활동 수정 함수: 새로운 활동과 활동 id(제목) 주면 수정
  const updateAct = async (activity, actId) => {
    try {
      let createdTime = timeStamp.fromDate(new Date());
      let docRef = doc(db, collectionName, actId)
      await setDoc(docRef, { ...activity, createdTime }); //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
    } catch (error) {
      console.log(error)
    }
  }

  //학생 추가 함수(2024.1.7)
  const addStudent = async (newInfo, classId) => {
    let studentColRef = collection(db, "classRooms", classId, "students");
    let modifiedTime = timeStamp.fromDate(new Date());
    try {
      addDoc(studentColRef, { ...newInfo, modifiedTime })
    } catch (error) {
      console.log(error);
    }
  }

  // 학생 update 함수(2024.1.6)
  const updateStudent = async (newInfo, classId, studentId) => {
    let studentRef = doc(db, "classRooms", classId, "students", studentId);
    let modifiedTime = timeStamp.fromDate(new Date());
    try {
      updateDoc(studentRef, { ...newInfo, modifiedTime }) //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
    } catch (error) {
      window.alert.log(error)
    }
  }

  //학생 삭제 함수
  const deleteStudent = async (classId, studentId) => {
    try {
      let studentRef = doc(db, collectionName, classId, 'students', studentId)
      await deleteDoc(studentRef)
    } catch (error) {
      console.log(error)
    }
  }

  //데이터 삭제 함수: 문서 id(제목) 주면 삭제
  const deleteDocument = async (id) => {
    try {
      await deleteDoc(doc(colRef, id))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    { findUser, addUser, addDocument: addActivity, updateAct, updateStudent, deleteStudent, deleteDocument, addClassroom, addStudent }
  )
}

export default useFirestore