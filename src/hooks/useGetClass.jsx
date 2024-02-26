import { useEffect, useState } from 'react'
import { appFireStore } from "../firebase/config"
import { useSelector } from 'react-redux'
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore'

//24.01.25
const useGetClass = () => {
  const db = appFireStore
  const user = useSelector(({ user }) => { return user }) //전역변수 user정보
  const isTeacher = user.isTeacher;
  const [classList, setClassList] = useState([]);
  const [appliedClassList, setAppliedClassList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q;
    if (isTeacher) { //교사
      q = query(collection(db, "classRooms"), where("uid", "==", user.uid), orderBy("subject", "desc"))
      onSnapshot(q, (snapshot) => {
        let result = []
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id })
        })
        setClassList(result)
      }, (error) => {
        setError(error.message)
        console.log(error.message)
      })
    } else { //학생
      try {
        if (user.joinedClassList) {
          renewClassData(user.joinedClassList, "joined")
        }
        if (user.appliedClassList) {
          renewClassData(user.appliedClassList, "applied")
        }
      } catch (error) {

      }
    }
  }, [user])

  const renewClassData = async (classList, type) => {
    let result = []
    await Promise.all(
      classList.map(async (item) => { //학생 유저정보 id로 classRoom 정보 데이터 통신
        const classRef = doc(db, "classRooms", item.id)
        const classDocSnap = getDoc(classRef)
        await classDocSnap.then((classDoc) => {
          result.push({ ...classDoc.data(), id: classDoc.id })
        })
      })
    )
    if (type === "joined") {
      setClassList(result)
    } else if (type === "applied") {
      setAppliedClassList(result)
    }
  }

  //교사 ID로 클래스 검색하기
  const getClassByTeacherId = (teacherId) => {
    let q = query(collection(db, "classRooms"), where('uid', '==', teacherId), orderBy("subject", 'desc'))
    onSnapshot(q,
      (snapshot) => {
        let result = []
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id })
        })
        setSearchResult(result)
      }
      , (error) => {
        setError(error.message)
        console.log(error.message)
      }
    )
  }
  return { classList, appliedClassList, searchResult, errByGetClass: error, getClassByTeacherId }
}

export default useGetClass