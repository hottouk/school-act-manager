import { appFireStore } from '../firebase/config'
import { useSelector } from 'react-redux'
import { collection, getDocs, query, where } from 'firebase/firestore'

const useFetchFireData = () => {
  const db = appFireStore
  const user = useSelector(({ user }) => { return user })

  const fetchDataList = async (type, propKnd, tProp) => {
    let dataList = []
    let colRef = collection(db, type)
    let q;
    if (type === "teacher") { //교사 검색
      q = query(collection(db, "user"), where("isTeacher", "==", true), where(`${propKnd}`, "==", `${tProp}`))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dataList.push(doc.data())
      });
    } else { //그 외 데이터 검색
      q = query(colRef, where(`${propKnd}`, "==", `${tProp}`))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dataList.push({ ...doc.data(), id: doc.id })
      });
    }

    return dataList
  }
  return ({ fetchDataList })
}

export default useFetchFireData