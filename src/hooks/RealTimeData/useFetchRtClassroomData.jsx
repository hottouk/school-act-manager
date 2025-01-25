import { useEffect, useState } from 'react'
import { appFireStore } from '../../firebase/config'
import { collection, doc, onSnapshot } from 'firebase/firestore'

//반 하나 실시간(2025.01.25)
const useFetchRtClassroomData = (klassId) => {
  const db = appFireStore;
  const col = collection(db, "classRooms");
  const [klassData, setKlassData] = useState(null);
  const klassDocRef = doc(col, klassId)

  useEffect(() => {
    let unsubscribe = onSnapshot(klassDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setKlassData({ ...snapshot.data(), id: snapshot.id })
      } else {
        console.log("문서 없음");
      }
    });

    return () => unsubscribe;
  }, [klassId])

  return { klassData }
}

export default useFetchRtClassroomData