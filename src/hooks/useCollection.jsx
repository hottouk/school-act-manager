import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { appFireStore } from "../firebase/config"

//문서 여러 개를 한번에 읽는다.
const useCollection = (collectionName, myQuery, order) => {
  const [documentList, setDocumentList] = useState(null)
  const [colErr, setColErr] = useState(null)
  const colRef = collection(appFireStore, collectionName)

  useEffect(() => {
    let firstWhere;
    let secondWhere;
    let q;
    if (myQuery.length > 3) { //쿼리를 2개 이상 입력 시
      firstWhere = myQuery.slice(0, 3)
      secondWhere = myQuery.slice(3)
      q = query(colRef, where(...firstWhere), where(...secondWhere))
    } else {
      q = query(colRef, where(...myQuery), orderBy(order, 'desc'))
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
  }, [])

  return { documentList, colErr }
}
export default useCollection
