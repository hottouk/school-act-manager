import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { appFireStore } from "../firebase/config"

//문서 여러 개를 한번에 읽는다.
const useCollection = (collectionName, myQuery, order, isTeacher) => {
  const db = appFireStore
  const [documentList, setDocumentList] = useState(null)
  const [colErr, setColErr] = useState(null)

  useEffect(() => {
    if (isTeacher === true) { //교사일 경우 실행
      let firstWhere;
      let secondWhere;
      let q;
      if (myQuery.length > 3) { //쿼리를 2개 이상 입력 시
        firstWhere = myQuery.slice(0, 3)
        secondWhere = myQuery.slice(3)
        q = query(collection(db, collectionName), where(...firstWhere), where(...secondWhere))
      } else {
        q = query(collection(db, collectionName), where(...myQuery), orderBy(order, 'desc'))
      }
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          let result = []
          snapshot.docs.forEach((doc) => {
            result.push({ ...doc.data(), id: doc.id })
          })
          setDocumentList(result)
        }
        , (error) => {
          setColErr(error.message)
          console.log(error.message)
        }
      )
      return unsubscribe
    }
  }, [isTeacher])


  return { documentList, colErr }
}
export default useCollection
