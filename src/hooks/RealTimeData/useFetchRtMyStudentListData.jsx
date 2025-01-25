import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { appFireStore } from "../../firebase/config"

//하위 Col에서 문서 여러 개를 한번에 읽어올 때 사용, 사용처(1): 담임반 학생) -> 12.30 docName 의존성 추가
const useFetchRtMyStudentData = (colName, docName, subColName, order) => {
  const db = appFireStore
  const [studentDataList, setStudentDataList] = useState(null)
  const colRef = collection(db, colName, docName, subColName)
  useEffect(() => {
    let q;
    if (order) {
      q = query(colRef, orderBy(order, 'asc'));
    }

    const unsubscribe = onSnapshot( //언마운트 시, 또는 위의 코드보다 먼저 실행
      (order ? q : colRef),
      (snapshot) => {
        let result = []
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id })
        })
        setStudentDataList(result)
      }
      , (error) => {
        console.log(error.message)
      }
    )

    return unsubscribe;
  }, [docName])

  return { studentDataList }
}

export default useFetchRtMyStudentData
