import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { appFireStore } from '../../firebase/config'

//2025.1.3 실시간 한명 pet 정보 가져오기
const useFetchRtPetData = (classId, studentId) => {
  const db = appFireStore
  const [pet, setPet] = useState(null)
  const [err, setErr] = useState(null)
  const docRef = doc(db, "classRooms", classId, "students", studentId)
  useEffect(() => {
    const unsubscribe = onSnapshot( //언마운트 시, 또는 위의 코드보다 먼저 실행
      docRef,
      (snapshot) => { setPet({ ...snapshot.data(), id: snapshot.id }) }
      , (error) => {
        setErr(error.message)
      }
    )

    return unsubscribe
  }, [classId, studentId])

  return { pet, subColErr: err }
}

export default useFetchRtPetData
