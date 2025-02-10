import { useEffect, useState } from 'react'
import { appFireStore } from "../../firebase/config"
import { useSelector } from 'react-redux'
import { collection, onSnapshot, query, where } from 'firebase/firestore'

//24.01.25 -> 250210 수정
const useFetchRtMyClassData = () => {
  const db = appFireStore
  const user = useSelector(({ user }) => { return user })
  const [classList, setClassList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q;
    if (!user.isTeacher) return;
    q = query(collection(db, "classRooms"), where("uid", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result = []
      snapshot.docs.forEach((doc) => { result.push({ ...doc.data(), id: doc.id }) })
      result.sort((a, b) => a.grade.localeCompare(b.grade)).sort((a, b) => a.classNumber.localeCompare(b.classNumber)) //2차 소팅
      setClassList(result)
    }, (error) => {
      setError(error.message)
      console.log(error.message)
    })

    return () => unsubscribe();

  }, [user])

  return { classList, errByGetClass: error }
}

export default useFetchRtMyClassData