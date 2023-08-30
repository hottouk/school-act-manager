import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { appFireStore } from "../firebase/config"

const useCollection = (collectionName, myQuery) => {
  const [documents, setDocuments] = useState(null)
  const [err, setErr] = useState(null)
  const colRef = collection(appFireStore, collectionName)

  useEffect(() => {
    let q;
    if (myQuery) {
      q = query(colRef, where(...myQuery), orderBy('title', 'desc'))
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
  }, [colRef])

  return { documents, err }
}

export default useCollection
