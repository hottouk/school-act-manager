import { doc, runTransaction } from 'firebase/firestore'
import { appFireStore } from '../../firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import { setHomeworkList } from '../../store/userSlice'

const useFireActi = () => {
  const user = useSelector(({ user }) => user)
  const db = appFireStore
  const dispatcher = useDispatch()

  const deleteActi = async (actId) => {
    const actiDocRef = doc(db, "activities", actId)
    const teacherDocRef = doc(db, "user", user.uid)
    let homeworkList;
    await runTransaction(db, async (transaction) => {
      let actiDoc = await transaction.get(actiDocRef)
      let teacherDoc = await transaction.get(teacherDocRef)
      if (!actiDoc.exists()) { throw new Error("활동 읽기 에러") }
      if (!teacherDoc.exists()) { throw new Error("교사 읽기 에러") }
      homeworkList = teacherDoc.data().homeworkList //없으면 undefined
      if (homeworkList) {
        homeworkList = homeworkList.filter((item) => {
          let itemId = item.id.split("/")[1]
          return itemId !== actId
        })
      } else { homeworkList = [] }
      transaction.update(teacherDocRef, { homeworkList })
      transaction.delete(actiDocRef)
    }).then(() => {
      dispatcher(setHomeworkList(homeworkList)) //전역변수
    }).catch(err => {
      window.alert("삭제에 실패했습니다. 관리자에게 문의하세요.");
      console.log(err);
    })
  }

  return (
    { deleteActi }
  )
}

export default useFireActi