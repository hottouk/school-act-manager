import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { appFireStore, timeStamp } from '../../firebase/config'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'

//생성(241205)
const useFireBasic = (col) => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore;
  const colRef = collection(db, col);
  //새로 생성
  const addData = useCallback(async (data) => {
    const createdTime = timeStamp.fromDate(new Date());
    await addDoc(colRef, { ...data, createdTime, uid: String(user.uid) });
  }, []);
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
  //문서 하나
  const fetchDoc = useCallback(async (id) => {
    let docRef = doc(colRef, id)
    try {
      let docSnapshot = await getDoc(docRef);
      return docSnapshot.data();
    } catch (err) {
      console.log(err)
    }
  }, []);
  //문서 여러개
  const fetchData = useCallback(async (field, value = String(user.uid)) => {
    let q = query(colRef, where(field, "==", value));
    try {
      let querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.log(err)
    }
  }, []);
  //삭제
  const deleteData = async (docId) => {
    try {
      let docRef = doc(db, col, docId)
      await deleteDoc(docRef, null)
    } catch (err) {
      console.error(err)
    }
  }
  return ({ addData, setData, fetchData, fetchDoc, deleteData })
}

export default useFireBasic