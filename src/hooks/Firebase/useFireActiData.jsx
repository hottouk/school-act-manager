import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { appFireStore, timeStamp } from '../../firebase/config'
import { useSelector } from 'react-redux'
import useFireUserData from './useFireUserData'

const useFireActiData = () => {
  const user = useSelector(({ user }) => user)
  const { fetchUserData } = useFireUserData();
  const db = appFireStore
  const colRef = collection(db, "activities")

  //모든 활동(250125)
  const fetchAllActis = async (field, value, field2 = null, value2 = null) => {
    let q = query(colRef, value, where(field, "==", value))
    if (field2 !== null && value2 !== null) { q = query(q, where(field2, "==", value2)); }
    const querySnapshot = await getDocs(q).catch(err => {
      window.alert("활동을 불러오는데 실패했습니다. 관리자에게 문의하세요(useFireActi_00)");
      console.log(err);
    })
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  }

  //활동 생성(250419_이동)
  const addActi = async (acti) => {
    const createdTime = timeStamp.fromDate(new Date());
    await addDoc(colRef, { ...acti, createdTime }).catch(err => {
      window.alert("생성에 실패했습니다. 관리자에게 문의하세요(useFireActi_01)");
      console.log(err);
    })
  }

  //활동 수정(250419_이동)
  const updateActi = async (acti, actiId) => {
    const actiDocRef = doc(colRef, actiId);
    const createdTime = timeStamp.fromDate(new Date());
    await updateDoc(actiDocRef, { ...acti, createdTime }).catch(err => {
      window.alert("수정에 실패했습니다. 관리자에게 문의하세요(useFireActi_02)");
      console.log(err);
    })
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
    const allActiListSnap = await fetchAllActis("uid", id);       //교과 + 담임 + 퀴즈
    const myDataSnap = await fetchUserData(user.uid);
    const copied = myDataSnap.copiedActiList || [];               //업어온 활동
    const combined = allActiListSnap.concat(copied);
    const filtered = filterActiBySubject(combined, subject)   //같은 과목만
    return sortActiType(filtered)
  }

  //게임 결과 활동에 입력(250419)
  const updateGameResult = async (actiId, record) => {
    const actiDocRef = doc(colRef, actiId);
    await updateDoc(actiDocRef, {
      gameRecord: arrayUnion(record)
    }).catch(err => {
      console.log(err, "결과 입력 실패. 관리자에게 문의하세요(useFireActi_06)");
    })
  }

  //활동 삭제(250310)
  const deleteActi = async (actiId) => {
    const actiDocRef = doc(colRef, actiId);
    await deleteDoc(actiDocRef).catch(err => {
      window.alert("삭제에 실패했습니다. 관리자에게 문의하세요(useFireActi_07)");
      console.log(err);
    })
  }

  return (
    { fetchAllActis, addActi, updateActi, deleteActi, sortActiType, filterActiBySubject, getSubjKlassActiList, updateGameResult, }
  )
}

export default useFireActiData