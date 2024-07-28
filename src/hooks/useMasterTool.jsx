import { collection, doc, updateDoc } from "firebase/firestore"
import { appFireStore } from "../firebase/config"

const useMasterTool = () => {
  const db = appFireStore
  const userColRef = collection(db, "user")

  const plusLikedCount = async (uid, actiList) => {
    let totalLikedCount = actiList
      .filter(acti => acti.uid === uid)
      .reduce((acc, acti) => {
        let likedCount = acti.likedCount || 0
        return acc + likedCount
      }, 0)
    let userDocRef = doc(userColRef, uid)
    await updateDoc(userDocRef, { likedCount: totalLikedCount }); //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
  }
  return { plusLikedCount }
}
export default useMasterTool