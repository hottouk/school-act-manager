import { collection, doc, getDocs, query, runTransaction, where } from 'firebase/firestore'
import { appFireStore } from '../../firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import { setHomeworkList } from '../../store/userSlice'
import useFireUserData from './useFireUserData'

const useFireActiData = () => {
  const dispatcher = useDispatch()
  const user = useSelector(({ user }) => user)
  const { fetchUserData } = useFireUserData();
  const db = appFireStore
  const colRef = collection(db, "activities")

  //모든 활동(250125) Read //todo 캐시처리
  const fetchAllActis = async (field, value) => {
    const q = query(colRef, value, where(field, "==", value))
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() })
      )
    } catch (error) {
      console.log(error)
    }
  }

  //활동 타입으로 분류(250125)
  const sortActiType = (list) => {
    const homeActiList = []
    const subjActiList = []
    const quizActiList = []
    list.forEach((item) => {
      if (item.subject === "담임") { homeActiList.push(item) }
      else if (item.monster) { quizActiList.push(item) }
      else { subjActiList.push(item) }
    })
    return { homeActiList, subjActiList, quizActiList }
  }

  //과목 필터링(250125)
  const filterActiBySubject = (list, subject) => {
    return list.filter((item) => { return item.subject === subject }).sort((a, b) => a.title.localeCompare(b.title)) //필터 + 정렬
  }

  //과목 클라스 활동 조합(250125)
  const getSubjKlassActiList = async (id, subject) => {
    const allActiList = await fetchAllActis("uid", id);       //교과 + 담임 + 퀴즈
    const myData = await fetchUserData(user.uid);
    const copied = myData.copiedActiList || [];               //업어온 활동
    const combined = allActiList.concat(copied)
    const filtered = filterActiBySubject(combined, subject)   //같은 과목만
    return sortActiType(filtered)
  }

  //todo actiForm에서만 사용됨, 수정할것
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
    { fetchAllActis, deleteActi, sortActiType, filterActiBySubject, getSubjKlassActiList }
  )
}

export default useFireActiData