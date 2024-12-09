import { appFireStore, timeStamp } from '../../firebase/config'
import { useSelector } from 'react-redux'
import { collection, doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'

const useFireClassData = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const colRef = collection(db, "classRooms")

  //좌석배치도 저장하기(241210)
  const addSeatMaps = async (id, info) => {
    let { seatMapsList, positionList, objPositionList, studentList } = info
    let docRef = doc(colRef, id)
    let createdTime = timeStamp.fromDate(new Date());
    try {
      await updateDoc(docRef, {
        seatInfo: [...seatMapsList, { studentList, positionList, objPositionList, createdTime }]
      })
      window.alert("저장 성공")
    } catch (error) {
      window.alert("Error updating document: ", error);
    }
  }
  return ({ addSeatMaps })
}

export default useFireClassData
