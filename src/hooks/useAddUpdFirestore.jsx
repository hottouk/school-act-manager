import { appFireStore, timeStamp } from "../firebase/config"
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { useSelector } from "react-redux"

const useAddUpdFireStore = (collectionName) => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const colRef = collection(db, collectionName)

  const getInfo = async (id, type) => {
    let info = null
    switch (type) {
      case "student":
        let studentRef = doc(db, "user", id)
        let studentSnapshot = await getDoc(studentRef)
        studentSnapshot.then((studentSnap) => {
          info = studentSnap.data()
        })
        break;
      case "acti":
        let actiRef = doc(db, "activities", id)
        info = await getDoc(actiRef);
        break;
      default: return
    }
    return info
  }

  //클래스룸 추가 함수(24.2.18)
  const addClassroom = async (classParams, studentPetList) => {
    try {
      const createdTime = timeStamp.fromDate(new Date());
      const docRef = await addDoc(colRef, { ...classParams, createdTime });
      const subColRef = collection(docRef, "students")
      await studentPetList.map(item => {
        addDoc(subColRef, { ...item, subject: classParams.subject });
        return null;
      })
    } catch (err) {
      window.alert(err)
      console.error(err)
    }
  }

  //워드set 추가 함수(24.6.22)
  const addWordSet = async (wordInfo) => {
    try {
      const createdTime = timeStamp.fromDate(new Date());
      let setTitle = wordInfo.title
      let wordSet = wordInfo.wordSet
      let result = await addDoc(colRef, { setTitle, wordSet, createdTime, madeBy: user.uid });
      return result;
    } catch (err) {
      window.alert(err.message)
      console.error(err)
    }
  }

  //활동 추가 함수
  const addActivity = async (activity) => {
    try {
      const createdTime = timeStamp.fromDate(new Date());
      await addDoc(colRef, { ...activity, createdTime }); //핵심 로직; 만든 날짜와 doc을 받아 파이어 스토어에 col추가
    } catch (err) {
      window.alert(err.message)
    }
  }

  //활동 수정 함수: 새로운 활동과 활동 id(제목) 주면 수정
  const updateAct = async (activity, actId) => {
    try {
      let createdTime = timeStamp.fromDate(new Date());
      let actiRef = doc(db, collectionName, actId)
      let actiDoc = await getDoc(actiRef)
      let studentDoneList = []
      let particiList = []
      let particiSIdList = []
      if (actiDoc.data().studentDoneList) { studentDoneList = actiDoc.data().studentDoneList }
      if (actiDoc.data().particiList) { particiList = actiDoc.data().particiList }
      if (actiDoc.data().particiSIdList) { particiSIdList = actiDoc.data().particiSIdList }
      await setDoc(actiRef, { ...activity, studentDoneList, particiList, particiSIdList, createdTime }); //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
    } catch (error) {
      window.alert(error)
      console.log(error)
    }
  }

  //학생 추가 함수(2024.1.7)
  const addStudent = async (newInfo, classId) => {
    let studentColRef = collection(db, "classRooms", classId, "students");
    let modifiedTime = timeStamp.fromDate(new Date());
    try {
      addDoc(studentColRef, { ...newInfo, modifiedTime })
    } catch (error) {
      console.log(error);
    }
  }

  // 학생 update 함수(2024.1.6)
  const updateStudent = async (newInfo, classId, studentId) => {
    let studentRef = doc(db, "classRooms", classId, "students", studentId);
    let modifiedTime = timeStamp.fromDate(new Date());
    try {
      updateDoc(studentRef, { ...newInfo, modifiedTime }) //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
    } catch (error) {
      window.alert.log(error)
    }
  }

  //학생 삭제 함수
  const deleteStudent = async (classId, studentId) => {
    try {
      let studentRef = doc(db, collectionName, classId, 'students', studentId)
      await deleteDoc(studentRef)
    } catch (error) {
      console.log(error)
    }
  }

  //데이터 삭제 함수: 문서 id(제목) 주면 삭제
  const deleteDocument = async (id) => {
    deleteDoc(doc(colRef, id)).then(() => {
      window.alert("삭제 되었습니다.")
    }).catch((err) => {
      console.log(err)
    })
  }

  //학생 클래스 정보 업데이트
  const updateClassListInfo = async (classList, type) => {
    let userRef = doc(db, "user", user.uid)
    if (type === "joinedClassList") {
      updateDoc(userRef, { joinedClassList: classList })
    } else if (type === "appliedClassList") {
      updateDoc(userRef, { appliedClassList: classList })
    }
  }

  return (
    { getInfo, addActivity, updateAct, updateStudent, deleteStudent, deleteDocument, addClassroom, addStudent, addWordSet, updateClassListInfo }
  )
}

export default useAddUpdFireStore