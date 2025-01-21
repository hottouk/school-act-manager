import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { appFireStore } from '../../firebase/config'

//2024.07.09 -> 25.01.18 단어 퀴즈추가
const useFetchRtMyActiData = () => {
  const db = appFireStore
  const user = useSelector(({ user }) => { return user })
  const actiColRef = collection(db, "activities")
  const [subjActiList, setSubjActiList] = useState([])
  const [homeActiList, setHomeActiList] = useState([])
  const [quizActiList, setQuizActiList] = useState([])
  useEffect(() => {
    let q = query(actiColRef, where("uid", "==", user.uid), orderBy("subject", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        let acti = { id: doc.id, ...doc.data() }
        //타입 분류 
        if (doc.data().subject === "담임") { setHomeActiList(prev => [...prev, acti]) }
        else if (doc.data().monster) { setQuizActiList(prev => [...prev, acti]) }
        else { setSubjActiList(prev => [...prev, acti]) }
      });
    })
    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, [db])

  return { subjActiList, homeActiList, quizActiList };
}

export default useFetchRtMyActiData