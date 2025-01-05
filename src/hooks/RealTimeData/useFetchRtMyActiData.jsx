import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { appFireStore } from '../../firebase/config'

//2024.07.09 
const useFetchRtMyActiData = () => {
  const db = appFireStore
  const user = useSelector(({ user }) => { return user })
  const actiColRef = collection(db, "activities")
  const [subjActiList, setSubjActiList] = useState([])
  const [homeActiList, setHomeActiList] = useState([])
  useEffect(() => {
    let q = query(actiColRef, where("uid", "==", user.uid), orderBy("subject", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let subjActiList = []
      let homeActiList = []
      snapshot.docs.forEach((doc) => {
        let acti = { id: doc.id, ...doc.data() }
        if (doc.data().subject === "담임") { homeActiList.push(acti) }
        else { subjActiList.push(acti) }
      });
      setSubjActiList(subjActiList)
      setHomeActiList(homeActiList)
    })
    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, [db])

  return { subjActiList, homeActiList };
}

export default useFetchRtMyActiData