import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { appFireStore } from "../firebase/config"

//하위 Col에서 문서 여러 개를 한번에 읽어올 때 사용한다.
const useSubCollection = (colName, docName, subColName, order) => {
  const [subDocuments, setSubDocuments] = useState(null)
  const [subColErr, setSubColErr] = useState(null)
  const colRef = collection(appFireStore, colName, docName, subColName)

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
        setSubDocuments(result)
      }
      , (error) => {
        setSubColErr(error.message)
      }
    )

    return unsubscribe
  }, [])

  return { subDocuments, subColErr }
}

export default useSubCollection
