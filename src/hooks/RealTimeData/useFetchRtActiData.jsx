import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { appFireStore } from '../../firebase/config'

//2024.07.09 -> 25.01.18 단어 퀴즈추가
const useFetchRtMyActiData = (uid) => {
  const db = appFireStore
  const actiColRef = collection(db, "activities")
  const [subjActiList, setSubjActiList] = useState([])
  const [homeActiList, setHomeActiList] = useState([])
  const [quizActiList, setQuizActiList] = useState([])
  useEffect(() => {
    let q = query(actiColRef, where("uid", "==", uid), orderBy("subject", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const homeActis = [];
      const quizActis = [];
      const subjActis = [];
      snapshot.docs.forEach((doc) => {
        const acti = { id: doc.id, ...doc.data() };
        //타입 분류 
        if (doc.data().subject === "담임") { homeActis.push(acti) }
        else if (doc.data().monster) { quizActis.push(acti) }
        else { subjActis.push(acti) };
        setHomeActiList(homeActis);
        setSubjActiList(subjActis);
        setQuizActiList(quizActis);
      });
    })
    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, [uid])

  return { subjActiList, homeActiList, quizActiList };
}

export default useFetchRtMyActiData