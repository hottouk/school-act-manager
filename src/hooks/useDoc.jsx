import { doc, getDoc} from "firebase/firestore"
import { useEffect, useState } from "react"
import { appFireStore } from "../firebase/config"

//문서 하나를 읽어올 때 사용한다.
const useDoc = (path) => {
  const [document, setDocument] = useState(null)
  const [err, setErr] = useState(null)
  const docRef = doc(appFireStore, "classRooms", `${path.id}`)
  const docSnap = getDoc(docRef)

  useEffect(() => {
    docSnap.then((docSnap) => {
      if (docSnap.exists()) {
        setDocument(docSnap.data())
      } else {
        setErr('No such document Found')
      }
    })
  }, [path])

  return { document, err }
}

export default useDoc
