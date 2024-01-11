import { useReducer } from "react"
import { appFireStore, timeStamp } from "../firebase/config"
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"

const initState = {
  document: null,
  isPending: false,
  err: null,
  isSuccess: false
}

const storeReducer = (state, action) => {
  switch (action.type) {
    case 'isPending':
      return { isPending: true, err: null, isSuccess: false, document: null }
    case 'addDoc':
      return { isPending: false, document: action.payload, err: null, isSuccess: true }
    case 'error':
      return { isPending: false, document: null, success: false, error: action.payload }
    case 'deleteDoc':
      return { isPending: false, document: null, success: true, error: null }
    case 'setDoc':
      return { isPending: false, document: action.payload, success: true, error: null }
    default:
      return state
  }
}

const useFirestore = (collectionName) => {
  const db = appFireStore
  const colRef = collection(db, collectionName)
  const [response, dispatch] = useReducer(storeReducer, initState)

  //유저가 기존 DB에 있는지 체크
  const findUser = async (userInfo) => {
    let isUserExist = false
    let uid = userInfo.uid
    const q = query(colRef, where("uid", "==", uid))
    const userSnapshot = await getDocs(q);
    if (userSnapshot) {
      isUserExist = true
    }
    return isUserExist
  }

  //유저 추가
  const addUser = async (userInfo) => {
    console.log(userInfo)
    let uid = userInfo.uid
    let email = userInfo.email
    let name = userInfo.name
    let isTeacher = userInfo.isTeacher
    let docRef = doc(db, collectionName, uid)
    try {
      const createdTime = timeStamp.fromDate(new Date());
      await setDoc(docRef, { uid, name, email, isTeacher, createdTime }); //핵심 로직; 만든 날짜와 doc을 받아 파이어 스토어에 col추가
    } catch (error) {
      console.error(error.message)
    }
  }

  //클래스룸 추가 함수
  const addClassroom = async (classAtrs, studentList) => {
    dispatch({ type: 'isPending' });
    try {
      const createdTime = timeStamp.fromDate(new Date());
      const docRef = await addDoc(colRef, { ...classAtrs, createdTime });
      const subColRef = collection(docRef, 'students')
      await studentList.map(student => {
        addDoc(subColRef, student);
        return student.length
      })
      dispatch({ type: 'addDoc', payload: colRef }); //상태 전달
    } catch (error) {
      dispatch({ type: 'error', payload: error.message }) //상태 전달
    }
  }

  //활동 추가 함수
  const addActivity = async (activity) => {
    dispatch({ type: 'isPending' });
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
      const updatePromise = await setDoc(docRef, { ...activity, createdTime }); //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
      dispatch({ type: 'addDoc', payload: updatePromise }); //상태 전달
    } catch (error) {
      dispatch({ type: 'error', payload: error.message }) //상태 전달
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
      window.alert(error);
    }
  }

  // 학생 update 함수(2024.1.6)
  const updateStudent = async (newInfo, classId, studentId) => {
    let studentRef = doc(db, "classRooms", classId, "students", studentId);
    let modifiedTime = timeStamp.fromDate(new Date());
    try {
      updateDoc(studentRef, { ...newInfo, modifiedTime }) //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
    } catch (error) {
      dispatch({ type: 'error', payload: error.message }) //상태 전달
      console.log(error)
    }
  }

  //학생 delete 함수
  const deleteStudent = async (classId, studentId) => {
    dispatch({ type: 'isPending' });
    try {
      let studentRef = doc(db, collectionName, classId, 'students', studentId)
      let deleteTask = await deleteDoc(studentRef)
      dispatch({ type: 'deleteDoc', payload: deleteTask })
    } catch (error) {
      dispatch({ type: 'error', payload: error.message })
    }
  }

  //데이터 삭제 함수: 문서 id(제목) 주면 삭제
  const deleteDocument = async (id) => {
    dispatch({ type: 'isPending' });
    try {
      let deleteTask = await deleteDoc(doc(colRef, id))
      dispatch({ type: 'deleteDoc', payload: deleteTask })
    } catch (error) {
      dispatch({ type: 'error', payload: error.message })
    }
  }

  return (
    { addUser, findUser, addDocument: addActivity, updateAct, updateStudent, deleteStudent, deleteDocument, addClassroom, addStudent, response }
  )
}

export default useFirestore