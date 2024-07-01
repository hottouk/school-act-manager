import { collection, doc, runTransaction } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'

const useFireTransaction = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const userColRef = collection(db, "user")

  //2. 업어온 활동 삭제하기: 활동 관리 - 나의 활동 - 업어온 활동 - 삭제
  const delCopiedActiTransaction = async (actiId) => {
    let userDocRef = doc(userColRef, user.uid)
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef)
      if (!userDoc.exists()) { throw new Error("유저 읽기 에러") }
      let copiedActiList = userDoc.data().copiedActiList || [];
      copiedActiList = copiedActiList.filter((item) => { return item.id !== actiId })
      transaction.update(userDocRef, { copiedActiList })
    }).then(() => {
      window.alert("활동이 삭제되었습니다.")
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
  }

  //1. 활동 업어오기: 활동 관리 - 전체활동 - 타교사 - 퍼가기
  const copyActiTransaction = async (acti) => {
    const actiId = acti.id
    const othrId = acti.uid
    const actiRef = doc(db, "activities", actiId)
    const userRef = doc(db, "user", user.uid)
    const otrRef = doc(db, "user", othrId) //다른 교사 user
    //신규값
    await runTransaction(db, async (transaction) => {
      const actiDoc = await transaction.get(actiRef)
      const userDoc = await transaction.get(userRef)
      const otrDoc = await transaction.get(otrRef)
      if (!actiDoc.exists()) { throw new Error("활동 읽기 에러") }
      if (!userDoc.exists()) { throw new Error("유저 읽기 에러") }
      if (!otrDoc.exists()) { throw new Error("타교사 읽기 에러") }
      //기존 데이터 or undefined 반환 undefined인 경우엔 초기값 제공
      let copiedActiList = userDoc.data().copiedActiList || [];
      copiedActiList.push({ id: actiDoc.id, ...actiDoc.data(), madeById: actiDoc.data().uid, uid: user.uid });
      let likedCount = (otrDoc.data().likedCount || 0) + 1;
      //업데이트
      transaction.update(userRef, { copiedActiList })
      transaction.update(actiRef, { likedCount })
    }).then(() => {
      window.alert("활동이 저장되었습니다.")
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
  }
  return { copyActiTransaction, delCopiedActiTransaction }
}



export default useFireTransaction