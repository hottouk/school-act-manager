import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'

//24.2.22
const useGetActivity = (thisClass) => { //데이터 통신
  const db = appFireStore
  const user = useSelector(({ user }) => { return user }) //전역변수 user정보
  const [activityList, setActivityList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q
    if (user.isTeacher) { //교사
      if (!thisClass) { //활동 관리
        q = query(collection(db, "activities"), where("uid", "==", user.uid), orderBy("subject", "desc"));
      } else {  //반 활동
        q = query(collection(db, "activities"), where("uid", "==", user.uid), where("subject", "==", thisClass.subject));
      }
    } else { //학생
      if (!thisClass) {
        return //반 활동에서만
      } else {
        q = query(collection(db, "activities"), where("uid", "==", thisClass.uid), where("subject", "==", thisClass.subject));
      }
    }

    onSnapshot(q, (snapshot) => {
      let result = []
      snapshot.docs.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id })
      })
      setActivityList(result)
    }, (error) => {
      setError(error.message)
      console.log(error.message)
    })
  }, [user])
  return { activityList, errByGetActi: error }
}

export default useGetActivity