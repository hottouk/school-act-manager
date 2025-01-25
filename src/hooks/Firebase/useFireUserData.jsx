import { useSelector } from 'react-redux'
import { collection, doc, getDoc, getDocFromCache, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { appFireStore } from '../../firebase/config'
import { arrayUnion } from 'firebase/firestore/lite';

const useFireUserData = () => {
  const user = useSelector(({ user }) => user)
  const db = appFireStore;
  const col = collection(db, "user")

  const updateUser = async (id, field, info) => {
    const userRef = doc(col, id)
    try {
      await updateDoc(userRef, { [field]: arrayUnion(info) })
    } catch (error) {
      console.log(error)
    }
  }

  //해당 유저 정보 가져오기
  const fetchUserData = async (uid) => {
    const userDocRef = doc(col, uid || user.uid)
    try {
      const userDoc = await getDoc(userDocRef)
      return userDoc.data()
    } catch (error) {
      console.log(error)
    }
  }

  return ({ fetchUserData, updateUser })
}

export default useFireUserData
