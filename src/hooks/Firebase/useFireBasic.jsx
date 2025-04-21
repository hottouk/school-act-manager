import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { appFireStore, timeStamp } from '../../firebase/config'
import { useSelector } from 'react-redux'

//2024.12.05 생성(firebase 기본 기능)
const useFireBasic = (col) => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const colRef = collection(db, col)
  //새로 생성
  const addData = async (data) => {
    try {
      let createdTime = timeStamp.fromDate(new Date());
      await addDoc(colRef, { ...data, createdTime, uid: String(user.uid) })
      console.log("저장 성공")
    } catch (err) {
      console.error(err)
    }
  }
  //수정 or 경로지정 생성
  const setData = async (data, docId) => {
    try {
      let createdTime = timeStamp.fromDate(new Date());
      let docRef = doc(db, col, docId)
      await setDoc(docRef, { ...data, createdTime, uid: String(user.uid) }, { merge: true })
      console.log("덮어쓰기 성공")
    } catch (err) {
      console.error(err)
    }
  }
  //삭제
  const deleteData = async (docId) => {
    try {
      let docRef = doc(db, col, docId)
      await deleteDoc(docRef, null)
    } catch (err) {
      console.error(err)
    }
  }
  //문서 하나
  const fetchDoc = async (id) => {
    let docRef = doc(colRef, id)
    try {
      let docSnapshot = await getDoc(docRef);
      return docSnapshot.data();
    } catch (err) {
      console.log(err)
    }
  }
  //문서 여러개
  const fetchData = async (field) => {
    let q = query(colRef, where(field, "==", String(user.uid)));
    try {
      let querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.log(err)
    }
  }

  return ({ addData, setData, fetchData, fetchDoc, deleteData })
}

export default useFireBasic