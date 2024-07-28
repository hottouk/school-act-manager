import { collection, onSnapshot, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { appFireStore } from '../../firebase/config'

const useFetchRtAllActiData = () => {
  const db = appFireStore
  let q = query(collection(db, "activities"))
  const [actiList, setActiList] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => { //실시간 활동 구독
    let unsubscribe = onSnapshot(q, (snapshot) => {
      let arr = []
      snapshot.docs.forEach((acti) => {
        arr.push({ ...acti.data(), id: acti.id })
      })
      setActiList(arr)
    }, (err) => {
      setError(err.message + "useFetchRtAllActiData 파일 오류")
    })
    return unsubscribe;
  }, [])

  const sortTActiListByCriterion = (criterion) => {
    let arr = [...actiList] //배열을 복제해야 리랜더링. 복제하지 않을 경우 같은 배열로 여겨 랜더링 x
    arr.sort((a, b) => {
      const aValue = a[criterion];
      const bValue = b[criterion];
      if (aValue === undefined) return "ㅎ";
      if (bValue === undefined) return "ㅎ";
      return aValue.localeCompare(bValue);
    })
    setActiList(arr)
  }

  return { actiList, sortTActiListByCriterion, useFetchRtAllActiErr: error }

}

export default useFetchRtAllActiData
