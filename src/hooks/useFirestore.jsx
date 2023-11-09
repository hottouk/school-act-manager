import { useReducer } from "react"
import { appFireStore, timeStamp } from "../firebase/config"
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore"

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
    default:
      return state
  }
}

const useFirestore = (collectionName) => {
  const [response, dispatch] = useReducer(storeReducer, initState)
  const db = appFireStore
  const colRef = collection(db, collectionName)

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

  //데이터 추가 함수
  const addDocument = async (doc) => {
    dispatch({ type: 'isPending' });
    try {
      const createdTime = timeStamp.fromDate(new Date());
      const docRef = await addDoc(colRef, { ...doc, createdTime }); //핵심 로직; 만든 날짜와 doc을 받아 파이어 스토어에 col추가
      dispatch({ type: 'addDoc', payload: docRef }); //상태 전달
    } catch (error) {
      dispatch({ type: 'error', payload: error.message }) //상태 전달
    }
  }

  //데이터 삭제 함수
  const deleteDocument = async (id) => {
    dispatch({ type: 'isPending' });
    try {
      const docRef = await deleteDoc(doc(colRef, id))
      dispatch({ type: 'deleteDoc', payload: docRef })
    } catch (error) {
      dispatch({ type: 'error', payload: error.message })
    }
  }

  return (
    { addDocument, deleteDocument, addClassroom, response }
  )
}

export default useFirestore