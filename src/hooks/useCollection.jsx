import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { appFireStore } from "../firebase/config"

//문서 여러 개를 한번에 읽어올 때 사용한다.
const useCollection = (collectionName, myQuery, order) => { 
  const [documents, setDocuments] = useState(null)
  const [err, setErr] = useState(null)
  const colRef = collection(appFireStore, collectionName)

  useEffect(() => {
    let q;
    if (myQuery) {
      q = query(colRef, where(...myQuery), orderBy(order, 'desc'))
    }

    const unsubscribe = onSnapshot(
      (myQuery ? q : colRef),
      (snapshot) => {
        let result = []
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id })
        })
        setDocuments(result)
      }
      , (error) => {
        setErr(error.message)
      }
    )
    return unsubscribe
  }, [])

  return { documents, err }
}

export default useCollection
