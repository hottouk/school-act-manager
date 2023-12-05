import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { appFireStore } from "../firebase/config"

//문서 하나를 읽어올 때 사용한다.
const useDoc = (firstPath, secondPath) => {
  const [document, setDocument] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (secondPath) { 
      const docRef = doc(appFireStore, "classRooms", `${firstPath.id}`, "students",`${secondPath.id}`)
      getDoc(docRef).then((doc) => {
        if(doc.exists()){
          setDocument(doc.data())
        } else{
          setErr('No such document Found')
        }
      })
    } else {
      const docRef = doc(appFireStore, "classRooms", `${firstPath.id}`)
      const docSnap = getDoc(docRef)
      docSnap.then((docSnap) => {
        if (docSnap.exists()) {
          setDocument(docSnap.data())
        } else { 
          setErr('No such document Found')
        }
      })
    }
  }
    , [firstPath, secondPath])

  return { document, err }
}

export default useDoc
