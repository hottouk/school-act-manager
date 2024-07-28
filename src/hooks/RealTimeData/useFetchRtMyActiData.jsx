import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { appFireStore } from '../../firebase/config'

//2024.07.09 
const useFetchRtMyActiData = () => {
  const db = appFireStore
  const user = useSelector(({ user }) => { return user })
  const actiColRef = collection(db, "activities")
  const [actiList, setActiList] = useState([])

  useEffect(() => {
    let q = query(actiColRef, where("uid", "==", user.uid), orderBy("subject", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setActiList(data)
    })
    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, [db])

  return actiList;
}

export default useFetchRtMyActiData