import { useDispatch, useSelector } from 'react-redux'
import { appFireStore } from '../firebase/config'
import { doc, getDoc, runTransaction, updateDoc } from 'firebase/firestore'
import useGetRidOverlap from './useGetRidOverlap'
import { setHomeworkList, setMyActList, setMyHomeworkList, setClassNewsList } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'

const useDoActivity = () => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const dispatcher = useDispatch()
  const { makeUniqueArrWithEle, replaceItem } = useGetRidOverlap()
  const navigate = useNavigate()

  //학생의 활동 참가 신청
  const takePartInThisActivity = async (activityParam, classParam) => {
    const studentRef = doc(db, "user", user.uid)
    const activityRef = doc(db, "activities", activityParam.id)
    const studentInfo = { uid: user.uid, name: user.name, email: user.email, studentNumber: user.studentNumber };
    const acitivityInfo = { ...activityParam, fromWhere: classParam.id }
    let myActList = []
    let studentParticipatingList = []
    await runTransaction(db, async (transaction) => {
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
      //학생
      if (myActList) { //기존
        myActList = makeUniqueArrWithEle(myActList, acitivityInfo, "id")
      } else { myActList = [acitivityInfo] } //신규
      transaction.update(studentRef, { myActList })
      //활동
      if (studentParticipatingList) {
        studentParticipatingList = makeUniqueArrWithEle(studentParticipatingList, studentInfo, "uid")
      } else { studentParticipatingList = [studentInfo] }
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
      navigate(-1)
    }).catch((err) => {
      console.log(err)
    })
  };

  //학생의 과제 제출 -> 교사
  const submitHomework = async (fileParam, actiParam, isModified) => {
    const id = `${user.uid}/${actiParam.id}`
    const fileName = fileParam.name
    const homeworkInfo = { id, studentName: user.name, fileName, actTitle: actiParam.title, fromWhere: actiParam.fromWhere }
    const myHomeworkInfo = { id, actTitle: actiParam.title, fileName, fromWhere: actiParam.fromWhere }
    let homeworkList = [] //교사
    let myHomeworkList = [] //학생
    const studentRef = doc(db, "user", user.uid)
    const teacherRef = doc(db, "user", actiParam.uid)
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
      //교사 
      if (homeworkList && homeworkList.length > 0) {
        if (!isModified) {
          homeworkList = makeUniqueArrWithEle(homeworkList, homeworkInfo, "id")
        } else {
          homeworkList = replaceItem(homeworkList, homeworkInfo, "id")
        }
      } else { homeworkList = [homeworkInfo] } //기존
      transaction.update(teacherRef, { homeworkList })
      //학생
      if (myHomeworkList && myHomeworkList.length > 0) {
        if (!isModified) {
          myHomeworkList = makeUniqueArrWithEle(myHomeworkList, myHomeworkInfo, "id")
        } else {
          myHomeworkList = replaceItem(myHomeworkList, myHomeworkInfo, "id")
        }
      } else { myHomeworkList = [myHomeworkInfo] } //기존
      transaction.update(studentRef, { myHomeworkList })
    }).then(() => {
      dispatcher(setMyHomeworkList(myHomeworkList))
    }).catch((err) => {
      window.alert("오류가 발생했습니다.")
      window.console.log(err)
    })
  }

  //학생의 과제 제출 취소
  const cancelSubmission = async (actiParam) => {
    const id = actiParam.id
    let homeworkList
    let myHomeworkList
    const studentRef = doc(db, "user", user.uid)
    const teacherRef = doc(db, "user", actiParam.uid)
    await runTransaction(db, async (transaction) => {
      const studentDoc = await transaction.get(studentRef)
      const teacherDoc = await transaction.get(teacherRef)
      if (teacherDoc.data().homeworkList) {
        homeworkList = teacherDoc.data().homeworkList.filter((item) => {
          let itemId = item.id.split("/")[1]
          return itemId !== id
        })
      } else {
        throw new Error("교사가 받은 과제 목록이 없음.")
      }
      transaction.update(teacherRef, { homeworkList })

      if (studentDoc.data().myHomeworkList) {
        myHomeworkList = studentDoc.data().myHomeworkList.filter((item) => {
          let itemId = item.id.split("/")[1]
          return itemId !== id
        })
      } else {
        throw new Error("학생 제출 과제 목록이 없음.")
      }
      transaction.update(studentRef, { myHomeworkList })
    }).then(() => {
      dispatcher(setMyHomeworkList(myHomeworkList))
    }).catch((err) => { window.alert(err) });
  }

  //학생의 과제 결과 확인
  const confirmHomeworkResult = async (params, callRewardModal) => {
    let isApproved = params.isApproved
    let id = params.id
    let classNewsList
    let userRef = doc(db, "user", user.uid)
    let studentUser = await getDoc(userRef)
    classNewsList = studentUser.data().classNewsList
    if (classNewsList) { //삭제
      classNewsList = classNewsList.filter((item) => { return item.id !== id })
    }
    updateDoc(userRef, { classNewsList }).then(() => {
      dispatcher(setClassNewsList(classNewsList))
      if (isApproved) { //승인된 경우만 보상 대화창 확인
        callRewardModal({ type: params.type, title: params.title, money: params.money, scores: params.scores })
      }
    }).catch(err => {
      console.log(err)
      window.alert(err)
    })
  }

  //교사의 과제 승인 -> 학생
  const approveHomework = async (studentParam, actiParam, fromWhere) => {
    //id
    const homeworkId = `${studentParam.uid}/${actiParam.id}`
    const actId = actiParam.id
    const studentId = studentParam.uid
    const classId = fromWhere
    //ref
    const teacherRef = doc(db, "user", user.uid)
    const studentRef = doc(db, "user", studentParam.uid)
    const activityRef = doc(db, "activities", actiParam.id)
    let studentInfo = { uid: studentParam.uid, studentNumber: studentParam.studentNumber, name: studentParam.name }
    let actiInfo = {
      id: actiParam.id,
      uid: actiParam.uid,
      title: actiParam.title,
      scores: actiParam.scores,
      record: actiParam.record,
      money: actiParam.money,
      content: actiParam.content,
    }
    let myActList; //학생 
    let myHomeworkList;
    let classNewsList;
    let homeworkList; //교사용
    let studentParticipatingList; //활동
    let studentDoneList;
    let actList; //펫
    let accRecord = ""
    await runTransaction(db, async (transaction) => {
      let teacherDoc = await transaction.get(teacherRef)
      let studentDoc = await transaction.get(studentRef)
      let activityDoc = await transaction.get(activityRef)
      let studentPetId = studentDoc.data().joinedClassList.find((item) => { return item.id === classId }).petId
      let petRef = doc(db, "classRooms", classId, "students", studentPetId)
      let petDoc = await transaction.get(petRef)
      if (!studentDoc.exists()) {
        throw new Error("학생 정보 없음")
      }
      if (!teacherDoc.exists()) {
        throw new Error("교사 정보 없음")
      }
      if (!activityDoc.exists()) {
        throw new Error("활동 정보 없음")
      }
      if (!petDoc.exists()) {
        throw new Error("펫 정보 없음")
      }
      //학생
      myActList = studentDoc.data().myActList
      myHomeworkList = studentDoc.data().myHomeworkList
      classNewsList = studentDoc.data().classNewsList
      //교사
      homeworkList = teacherDoc.data().homeworkList
      //활동
      studentParticipatingList = activityDoc.data().studentParticipatingList
      studentDoneList = activityDoc.data().studentDoneList
      //펫
      actList = petDoc.data().actList
      accRecord = petDoc.data().accRecord
      if (!actList || actList.length === 0) { //신규
        if (!accRecord || accRecord === "") {
          actList = [actiInfo]
          accRecord = actiInfo.record
        } else { //actList는 신규, record는 기존
          actList = [actiInfo]
          accRecord = accRecord.concat(" ", actiInfo.record)
        }
      } else if (actList && accRecord) { //기존 활동, 기존 기록
        actList = makeUniqueArrWithEle(actList, actiInfo, "id")
        accRecord = accRecord.concat(" ", actiInfo.record)
      }
      transaction.update(petRef, { actList, accRecord })
      //학생(삭제 및 기록)
      if (myActList && myActList.length > 0) { myActList = myActList.filter((item) => { return item.id !== actId }) } //삭제
      if (myHomeworkList && myHomeworkList.length > 0) { myHomeworkList = myHomeworkList.filter((item) => { return item.id !== homeworkId }) } //삭제
      if (classNewsList && classNewsList.length > 0) { //기록
        classNewsList = makeUniqueArrWithEle(classNewsList, { ...actiInfo, type: "homework", isApproved: true }, "id")
      } else { classNewsList = [{ ...actiInfo, type: "homework", isApproved: true }] }
      transaction.update(studentRef, { myHomeworkList, myActList, classNewsList }) //업데이트
      //교사(삭제)
      if (homeworkList && homeworkList.length > 0) { homeworkList = homeworkList.filter((item) => { return item.id !== homeworkId }) }
      transaction.update(teacherRef, { homeworkList }) //업데이트
      //활동(이동)
      if (studentParticipatingList && studentParticipatingList.length > 0) {
        studentParticipatingList = studentParticipatingList.filter((item) => { return item.uid !== studentId })
      } //삭제
      if (studentDoneList) { //기록
        studentDoneList = makeUniqueArrWithEle(studentDoneList, { studentInfo }, "uid")
      } else { studentDoneList = [studentInfo] }
      transaction.update(activityRef, { studentParticipatingList, studentDoneList }) //업데이트
    }).then(() => {
      window.alert("과제가 승인되었습니다.")
      dispatcher(setHomeworkList(homeworkList))
      navigate(-1)
    }).catch((err) => {
      window.alert(err.message)
    })
  }

  //교사의 과제 반려 -> 학생
  const denyHomework = async (homeworkParam, feedback) => {
    const homeworkId = homeworkParam.id
    const studentId = homeworkId.split("/")[0]
    const teacherRef = doc(db, "user", user.uid)
    const studentRef = doc(db, "user", studentId)
    let homeworkInfo = { ...homeworkParam, feedback }
    let myHomeworkList; //학생
    let classNewsList;
    let homeworkList; //교사
    await runTransaction(db, async (transaction) => {
      let teacherDoc = await transaction.get(teacherRef)
      let studentDoc = await transaction.get(studentRef)
      myHomeworkList = studentDoc.data().myHomeworkList
      classNewsList = studentDoc.data().classNewsList
      homeworkList = teacherDoc.data().homeworkList
      //삭제
      myHomeworkList = replaceItem(myHomeworkList, homeworkInfo, "id") //피드백 있는 과제로 대체
      homeworkList = homeworkList.filter((item) => { return item.id !== homeworkId })
      if (classNewsList && classNewsList.length > 0) {
        classNewsList = makeUniqueArrWithEle(classNewsList, { ...homeworkInfo, type: "homework", isApproved: false }, "id")
      } else { classNewsList = [{ ...homeworkInfo, type: "homework", isApproved: false }] }
      transaction.update(studentRef, { myHomeworkList, classNewsList })
      transaction.update(teacherRef, { homeworkList })
    }).then(() => {
      window.alert("과제가 반려되었습니다.")
      dispatcher(setHomeworkList(homeworkList))
      navigate(-1)
    });
  }
  return { takePartInThisActivity, cancelThisActivity, submitHomework, cancelSubmission, approveHomework, denyHomework, confirmHomeworkResult }
}


export default useDoActivity