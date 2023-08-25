import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { appFireStore } from "../firebase/config"

const useCollection = (collectionName) => {
  const [documents, setDocuments] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(appFireStore, collectionName),
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
  }, [collection])

  return { documents, err }
}

export default useCollection
