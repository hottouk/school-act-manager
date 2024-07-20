import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { appFireStore } from '../../firebase/config';

//24.01.23
const useFetchRtUserData = () => {
  //1. 변수
  const db = appFireStore
  let q = query(collection(db, "user"))
  const [teacherList, setTUserList] = useState([])
  const [studentList, setSUserList] = useState([])
  const [error, setError] = useState(null)
  useEffect(() => { //실시간 구독
    let unsubscribe = onSnapshot(q, (snapshot) => {
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
    }, (error) => {
      setError(error.message)
    })
    return unsubscribe;
  }, [])

  const sortByLikedCount = () => {
    let arr = teacherList
      .filter((teacher) => { return teacher.likedCount !== undefined })
      .sort((a, b) => b.likedCount - a.likedCount)
      .slice(0, 10)

    let influencerList = arr.map((teacher) => {
      return { ...teacher, name: teacher.name.charAt(0) + "**" }
    })
    return influencerList
  }


  return { teacherList, studentList, useFetchRtUserErr: error, sortByLikedCount }
}

export default useFetchRtUserData