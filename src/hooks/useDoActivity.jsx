import React from 'react'
import { useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import { doc, runTransaction } from 'firebase/firestore'

const useDoActivity = () => {

  const user = useSelector(({ user }) => { return user })
  const db = appFireStore

  //학생의 엑티비티 참가 신청은 나중으로 미루자
  const doThisActivity = async (activity) => {
    const studentRef = doc(db, "user", user.uid)
    const teacherRef = doc(db, "user", activity.uid)
    const activityRef = doc(db, "activities", activity.id)
    await runTransaction(db, async (transaction) => {
      //1. 읽기
      const studentDoc = await transaction.get(studentRef)
      const teacherRefDoc = await transaction.get(teacherRef)
      const activityDoc = await transaction.get(activityRef)
      if (!studentDoc.exists()) {
        throw new Error("student does not exist")
      }
      if (!teacherRefDoc.exists()) {
        throw new Error("Teacher does not exist")
      }
      if (!activityDoc.exists()) {
        throw new Error("activity does not exist")
      }
      //2. 쓰기
      if (studentDoc.data().activityIng) { //기존

      } else { //신규

      }
    })
  }




  return (
    <div>useDoActivity</div>
  )

}

export default useDoActivity