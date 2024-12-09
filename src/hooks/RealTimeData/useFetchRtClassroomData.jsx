import { useEffect, useState } from 'react'
import { appFireStore } from '../../firebase/config'
import { collection, doc, onSnapshot } from 'firebase/firestore'

//반 하나 
const useFetchRtClassroomData = (classId) => {
  const db = appFireStore
  const col = collection(db, "classRooms")
  const [classroomInfo, setClassroomInfo] = useState('')
  useEffect(() => {
    let docRef = doc(col, classId)
    let unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setClassroomInfo(docSnapshot.data())
      } else {
        console.log("문서 없음");
      }
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, [])
  return classroomInfo
}

export default useFetchRtClassroomData