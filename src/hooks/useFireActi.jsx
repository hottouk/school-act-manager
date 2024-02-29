import { collection, doc, runTransaction } from 'firebase/firestore'
import { appFireStore } from '../firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import { setHomeworkList } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'

const useFireActi = () => {
  const user = useSelector(({ user }) => user)
  const db = appFireStore
  const dispatcher = useDispatch()
  const navigate = useNavigate()

  const deleteActi = async (actId) => {
    const actiRef = doc(db, "activities", actId)
    const teacherRef = doc(db, "user", user.uid)
    let homeworkList;
    await runTransaction(db, async (transaction) => {
      let actiDoc = await transaction.get(actiRef)
      let teacherDoc = await transaction.get(teacherRef)
      if (!actiDoc.exists()) { throw new Error("활동 읽기 에러") }
      if (!teacherDoc.exists()) { throw new Error("교사 읽기 에러") }
      homeworkList = teacherDoc.data().homeworkList //없으면 undefined
      if (homeworkList) {
        homeworkList = homeworkList.filter((item) => {
          let itemId = item.id.split("/")[1]
          return itemId !== actId
        })
      } else { homeworkList = [] }
      transaction.update(teacherRef, { homeworkList })
      transaction.delete(actiRef)
    }).then(() => {
      dispatcher(setHomeworkList(homeworkList)) //전역변수
      navigate(-1)
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