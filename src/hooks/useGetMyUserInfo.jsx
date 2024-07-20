import { useEffect, useState } from 'react'
import { appFireStore } from '../firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import { doc, onSnapshot, runTransaction, updateDoc } from 'firebase/firestore'
import useGetRidOverlap from './useGetRidOverlap'
import { setUser, setmyPetList } from '../store/userSlice'

const useGetMyUserInfo = () => {
  const db = appFireStore
  const user = useSelector(({ user }) => { return user })
  const [error, setError] = useState(null)
  const { replaceItem } = useGetRidOverlap()
  const { makeUniqueArrWithEle } = useGetRidOverlap()
  const dispatcher = useDispatch()

  useEffect(() => {
    let unsub
    if (Object.keys(user).length !== 0 && user.constructor === Object) {
      const userRef = doc(db, "user", user.uid)
      unsub = onSnapshot(
        userRef,
        (snapshot) => {
          dispatcher(setUser(snapshot.data()))
        },
        (err) => {
          setError(err)
          window.alert(err)
          console.log(err)
        })
    }
    return unsub
  }, [])

  //2024.2.19
  const fetchMyPetInfo = async (petInfo) => {//학생
    let userRef = doc(db, "user", user.uid)
    let petActList = petInfo.actList //교사가 기록한 actList
    let myPetList = []
    let myDoneActList = []
    await runTransaction(db, async (transaction) => {
      let userDoc = await transaction.get(userRef)
      if (userDoc.data().myPetList) { //undefined 방지
        myPetList = userDoc.data().myPetList
      }
      if (userDoc.data().myDoneActList) { //undefined 방지
        myDoneActList = userDoc.data().myDoneActList
      }
      if (myPetList.length !== 0) {
        myPetList = replaceItem(myPetList, petInfo, "id")
      } else {
        myPetList = [petInfo]
      }
      let diffActList = []
      if (petActList) { //petActList가 있다면
        if (!myDoneActList) { //myDone이 없음. 생기부 기록 첫 열람.
          diffActList = [...petActList]
        } else {
          petActList.map((petActItem) => { //myDone 있음.
            let isFound = (myDoneActList.findIndex((doneActItem) => { return doneActItem.id === petActItem.id }) !== -1) //같은 요소 찾기
            if (!isFound) { //못 찾음 -> 차이 발생.
              diffActList.push(petActItem)
            }
            return null
          })
        }
      }
      //차이가 있는 경우
      if (diffActList.length !== 0) { //acti DoneList에 본인 정보 저장
        Promise.all(diffActList.map(async (item) => {
          let actiRef = doc(db, "activities", item.id)
          let studentInfo = { name: user.name, studentNumber: user.studentNumber, uid: user.uid }
          let studentDoneList
          await transaction.get(actiRef).then((actiDoc) => {
            studentDoneList = actiDoc.data().studentDoneList
            if (studentDoneList) { //기존
              studentDoneList = makeUniqueArrWithEle(studentDoneList, studentInfo, "uid")
            } else { //신규
              studentDoneList = [studentInfo]
            }
          })
          updateDoc(actiRef, { studentDoneList })
          return null
        }))
        myDoneActList = petActList
        transaction.update(userRef, { myPetList, myDoneActList })
      }
    }).then(() => {
      dispatcher(setmyPetList(myPetList))
    }).catch((err) => {
      window.alert(err)
      console.log(err)
    })
  }
  return ({ fetchMyPetInfo, errByGetMyUserInfo: error })
}

export default useGetMyUserInfo