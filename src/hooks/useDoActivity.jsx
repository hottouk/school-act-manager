import { useDispatch, useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import { doc, runTransaction } from 'firebase/firestore'
import useGetRidOverlap from './useGetRidOverlap'
import { setMyActList, setMyHomeworkList } from '../store/userSlice'

const useDoActivity = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const dispatcher = useDispatch()
  const { makeUniqueArrWithEle, replaceItem } = useGetRidOverlap()

  //학생의 활동 참가 신청
  const takePartInThisActivity = async (activityParam) => {
    const studentRef = doc(db, "user", user.uid)
    const activityRef = doc(db, "activities", activityParam.id)
    const studentInfo = { uid: user.uid, name: user.name, email: user.email, studentNumber: user.studentNumber };
    const acitivityInfo = {
      id: activityParam.id,
      title: activityParam.title,
      content: activityParam.content,
      subject: activityParam.subject,
      scores: activityParam.scores,
      monImg: activityParam.monImg,
      money: activityParam.money,
      uid: activityParam.uid
    }
    let myActList = []
    let studentParticipatingList = []
    await runTransaction(db, async (transaction) => {
      //1. 읽기
      const studentDoc = await transaction.get(studentRef)
      const activityDoc = await transaction.get(activityRef)
      if (!studentDoc.exists()) {
        throw new Error("student does not exist")
      }
      if (!activityDoc.exists()) {
        throw new Error("activity does not exist")
      }
      myActList = studentDoc.data().myActList
      studentParticipatingList = activityDoc.data().studentParticipatingList
      //2. 쓰기
      //학생에 작성
      if (myActList) { //기존
        myActList = makeUniqueArrWithEle(myActList, acitivityInfo, "id")
      } else { //신규
        myActList = [acitivityInfo]
      }
      transaction.update(studentRef, { myActList })

      //활동에 작성
      if (studentParticipatingList) {
        studentParticipatingList = makeUniqueArrWithEle(studentParticipatingList, studentInfo, "uid")
      } else {
        studentParticipatingList = [studentInfo]
      }
      transaction.update(activityRef, { studentParticipatingList })

    }).then(() => {
      dispatcher(setMyActList(myActList))
      window.alert("활동이 신청되었습니다.")
    }).catch(err => {
      window.alert(err);
    })
  }

  //학생의 활동 참가 취소
  const cancelThisActivity = async (activityParam) => {
    const studentRef = doc(db, "user", user.uid)
    const activityRef = doc(db, "activities", activityParam.id)
    let id = activityParam.id
    let myActList = []
    let studentParticipatingList = []
    await runTransaction(db, async (transaction) => {
      const studentDoc = await transaction.get(studentRef)
      const activityDoc = await transaction.get(activityRef)
      myActList = studentDoc.data().myActList
      studentParticipatingList = activityDoc.data().studentParticipatingList
      if (myActList && myActList.length > 0) {
        myActList = myActList.filter((item) => { return item.id !== id })
      }
      transaction.update(studentRef, { myActList })
      if (studentParticipatingList && studentParticipatingList.length > 0) {
        studentParticipatingList = studentParticipatingList.filter((item) => {
          return item.uid !== user.uid
        })
        console.log(studentParticipatingList)
      }
      transaction.update(activityRef, { studentParticipatingList })
    }).then(() => {
      dispatcher(setMyActList(myActList))
      window.alert("활동 신청이 취소되었습니다.")
    }).catch((err) => {
      console.log(err)
    })
  };

  //학생의 과제 제출 교사 알림
  const noticeHomeworkSubmission = async (fileParam, activityParam) => {
    const id = activityParam.id
    const fileName = fileParam.name
    const homeworkInfo = { studentId: user.uid, studentName: user.name, fileName, id, actTitle: activityParam.title }
    const myHomeworkInfo = { id, actTitle: activityParam.title, fileName }
    let homeworkList = [] //교사
    let myHomeworkList = [] //학생
    const studentRef = doc(db, "user", user.uid)
    const teacherRef = doc(db, "user", activityParam.uid)
    await runTransaction(db, async (transaction) => {
      const studentDoc = await transaction.get(studentRef)
      const teacherDoc = await transaction.get(teacherRef)
      homeworkList = teacherDoc.data().homeworkList
      myHomeworkList = studentDoc.data().myHomeworkList
      if (!studentDoc.exists()) {
        throw new Error("학생 정보 없음")
      }
      if (!teacherDoc.exists()) {
        throw new Error("교사 정보 없음")
      }

      if (homeworkList && homeworkList.length !== 0) {
        homeworkList = replaceItem(teacherDoc.data().homeworkList, homeworkInfo, "id")
      } else {
        homeworkList = [homeworkInfo]
      }
      transaction.update(teacherRef, { homeworkList })

      if (myHomeworkList && myHomeworkList.length !== 0) {
        myHomeworkList = replaceItem(studentDoc.data().myHomeworkList, myHomeworkInfo, "id")
      } else {
        myHomeworkList = [myHomeworkInfo]
      }
      transaction.update(studentRef, { myHomeworkList })
    }).then(() => {
      dispatcher(setMyHomeworkList(myHomeworkList))
    }).catch((err) => {
      window.alert(err)
    })
  }

  //학생의 과제 제출 취소
  const cancelSubmission = async (activityParam) => {
    const id = activityParam.id
    let homeworkList
    let myHomeworkList
    const studentRef = doc(db, "user", user.uid)
    const teacherRef = doc(db, "user", activityParam.uid)
    await runTransaction(db, async (transaction) => {
      const studentDoc = await transaction.get(studentRef)
      const teacherDoc = await transaction.get(teacherRef)
      if (teacherDoc.data().homeworkList) {
        homeworkList = teacherDoc.data().homeworkList.filter((item) => { return item.id !== id })
      } else {
        throw new Error("교사가 받은 과제 목록이 없음.")
      }
      transaction.update(teacherRef, { homeworkList })
      if (studentDoc.data().myHomeworkList) {
        myHomeworkList = studentDoc.data().myHomeworkList.filter((item) => { return item.id !== id })
      } else {
        throw new Error("학생 제출 과제 목록이 없음.")
      }
      transaction.update(studentRef, { myHomeworkList })
    }).then(() => {
      dispatcher(setMyHomeworkList(myHomeworkList))
    }).catch((err) => { window.alert(err) });
  }

  return { takePartInThisActivity, cancelThisActivity, noticeHomeworkSubmission, cancelSubmission }
}


export default useDoActivity