import React from 'react'
import { useSelector } from 'react-redux';
import { appFireStore } from '../../firebase/config';
import { collection, doc, getDoc } from 'firebase/firestore';
//생성(250722)
const useFireQuizData = () => {
  const user = useSelector(({ user }) => user);
  const db = appFireStore;
  const colRef = collection(db, "quiz");
  //퀴즈 하나
  const fetchQuizData = async (quizId) => {
    const quizDocRef = doc(colRef, quizId);
    const quizDoc = await getDoc(quizDocRef).catch((error) => {
      alert("퀴즈를 불러오는데 실패했습니다. 관리자에게 문의하세요(useFireQuiz_01)");
      console.log(error);
    })
    return quizDoc.data();
  }
  return (
    { fetchQuizData }
  )
}

export default useFireQuizData
