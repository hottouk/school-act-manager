import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { appFireStore, timeStamp } from '../../firebase/config'
import { useSelector } from 'react-redux'

//2024.12.05 생성(firebase 기본 기능)
const useFireBasic = (col) => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const colRef = collection(db, col)

  const addData = async (data, name) => {
    try {
      let createdTime = timeStamp.fromDate(new Date());
      await addDoc(colRef, { [name]: data, createdTime, uid: String(user.uid) })
      console.log("저장 성공")
    } catch (err) {
      console.error(err)
    }
  }
  const setData = async (data, name) => {
    try {
      let createdTime = timeStamp.fromDate(new Date());
      let docRef = doc(db, col, name)
      await setDoc(docRef, { ...data, createdTime, uid: String(user.uid) })
      console.log("저장 성공")
    } catch (err) {
      console.error(err)
    }
  }

  const fetchData = async () => {
    let q = query(colRef, where("uid", "==", String(user.uid)));
    try {
      let querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.log(err)
    }
  }
  return ({ addData, fetchData })
}

export default useFireBasic