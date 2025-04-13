import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { appFireStore } from '../../firebase/config';

//24.01.23
const useFetchRtAllUserData = () => {
  const db = appFireStore
  let q = query(collection(db, "user"));
  const [teacherList, setTUserList] = useState([]);
  const [studentList, setSUserList] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => { //실시간 구독
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let tList = [];
      let sList = [];
      snapshot.docs.forEach((user) => {
        if (user.data().isTeacher) {
          tList.push({ ...user.data(), id: user.id })
        } else {
          sList.push({ ...user.data(), id: user.id })
        }
      })
      setTUserList(tList);
      setSUserList(sList);
    }, (error) => {
      setError(error.message)
    })
    return unsubscribe;
  }, []);

  //정렬 by 좋아요
  const sortByLikedCount = () => {
    let arr = teacherList
      .filter((teacher) => { return teacher.likedCount !== undefined })
      .sort((a, b) => b.likedCount - a.likedCount)
      .slice(0, 10)

    let influencerList = arr.map((teacher) => { //새로운 배열 생성
      return { ...teacher, name: teacher.name.charAt(0) + "**" }
    })
    return influencerList
  }

  //정렬 by 기준
  const sortTListByCriterion = (criterion) => {
    let arr = [...teacherList] //배열을 복제해야 리랜더링. 복제하지 않을 경우 같은 배열로 여겨 랜더링 x
    switch (criterion) {
      case "school":
        arr.sort((a, b) => a[criterion].schoolName.localeCompare(b[criterion].schoolName))
        break;
      case "likedCount":
        arr.sort((a, b) => {
          const aValue = a[criterion];
          const bValue = b[criterion];
          if (aValue === undefined) return 1;
          if (bValue === undefined) return -1;
          return bValue - aValue
        })
        break;
      default:
        return;
    }
    return setTUserList(arr)
  }

  return { teacherList, studentList, useFetchRtUserErr: error, sortByLikedCount, sortTListByCriterion }
}

export default useFetchRtAllUserData