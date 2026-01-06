import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { appFireStore, timeStamp } from '../../firebase/config';
import { arrayUnion, collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { setExamQuestionList } from '../../store/examSlice';
//생성(251216)
const useFireTestData = () => {
  const db = appFireStore;
  const colRef = collection(db, "test");
  const user = useSelector(({ user }) => user);
  const dispatcher = useDispatch();
  //1. 실시간 구독
  const examDataListener = (callback) => {
    const docRef = doc(colRef, user.uid,);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) return;
      callback(snapshot.data());
      dispatcher(setExamQuestionList(snapshot.data()));
    });
    return () => unsubscribe;
  }
  //2. 저장
  const addTestArrItem = async (field, item, followUp) => {
    const docRef = doc(colRef, user.uid);
    const thisId = () => doc(collection(db, "_")).id;
    const createdTime = timeStamp.fromDate(new Date());
    const data = { ...item, createdTime, id: thisId() };
    await setDoc(docRef, { [field]: arrayUnion(data) }, { merge: true })
      .then(
        () => { if (followUp) followUp(); alert("저장되었습니다.") },
        (err) => {
          console.log(err);
          alert(`관리자에게 문의하세요(useFireTestData_02),${err}`);
        })
  }
  //3. 업데이트
  const updateTestQuestion = async (field, info, followUp) => {
    const docRef = doc(colRef, user.uid);
    await setDoc(docRef, { [field]: info }, { merge: true })
      .then(
        () => { if (followUp) followUp(); alert("변경되었습니다.") },
        (err) => {
          console.log(err);
          alert(`관리자에게 문의하세요(useFireTestData_03),${err}`);
        })

  }
  return { examDataListener, addTestArrItem, updateTestQuestion }
}

export default useFireTestData
