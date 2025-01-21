import { appFireStore, timeStamp } from '../../firebase/config'
import { useSelector } from 'react-redux'
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { useState } from 'react'

const useFireClassData = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const colRef = collection(db, "classRooms")

  //좌석배치도 저장하기(241210)
  const addSeatMap = async (id, info) => {
    let { seatMapsList, positionList, objPositionList, studentList, objInfoList } = info
    let docRef = doc(colRef, id)
    let createdTime = timeStamp.fromDate(new Date());
    try {
      await updateDoc(docRef, {
        seatInfo: [...seatMapsList, { studentList, positionList, objPositionList, objInfoList, createdTime }]
      })
    } catch (error) {
      window.alert("Error updating document: ", error);
    }
  }
  
  //좌석배치도 삭제하기(241210)
  const deleteSeatMap = async (id, list, index) => {
    let deleted = list.filter((_, i) => i !== index)
    let docRef = doc(colRef, id)
    try { await updateDoc(docRef, { seatInfo: [...deleted] }) }
    catch (error) { window.alert("Error updating document: ", error); }
  }

  //클래스 불러오기(250122)
  const fetchClassrooms = async (field, value) => {
    const q = query(colRef, where(field, "==", value))
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.log(error)
    }
  }

  //반 분류하기(250122)
  const sortClassrooms = (list) => {
    let subjClassList = [];
    let homeroomClassList = [];
    list.forEach(classroom => {
      if (!classroom.type || classroom.type === "subject") subjClassList.push(classroom)
      else homeroomClassList.push(classroom)
    })
    return { subjClassList, homeroomClassList }
  }

  return ({ addSeatMap, deleteSeatMap, fetchClassrooms, sortClassrooms })
}

export default useFireClassData
