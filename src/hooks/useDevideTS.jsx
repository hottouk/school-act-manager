import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { appFireStore } from '../firebase/config';

//24.01.23
const useDevideTS = () => {
  const [teacherList, setTUserList] = useState([])
  const [studentList, setSUserList] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let q = query(collection(appFireStore, 'user'))
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        let teacherListRes = []
        let studentListRes = []
        snapshot.docs.forEach((doc) => {
          if (doc.data().isTeacher) {
            teacherListRes.push({ ...doc.data(), id: doc.id })
          } else {
            studentListRes.push({ ...doc.data(), id: doc.id })
          }
        })
        setTUserList(teacherListRes)
        setSUserList(studentListRes)
      }
      , (error) => {
        setError(error.message)
      }
    )
    return unsubscribe
  },[])
  return { teacherList, studentList, errorByDevideTS: error }
}

export default useDevideTS