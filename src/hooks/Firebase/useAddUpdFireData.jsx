import { appFireStore, timeStamp } from "../../firebase/config"
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { useSelector } from "react-redux"

const useAddUpdFireData = (collectionName) => {
  const user = useSelector(({ user }) => { return user })
  const db = appFireStore
  const colRef = collection(db, collectionName)
  //10. 이거 어디에 쓰는지 보고 없으면 제거
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

  //10. 공지사항(24.07.16)
  const addNotice = async (noticeList) => {
    try {
      let createdTime = timeStamp.fromDate(new Date()).toDate().toISOString();
      await setDoc(doc(db, collectionName, "notice"), { noticeList, createdTime })
      console.log("공지 수정")
    } catch (err) {
      console.error(err)
      window.alert(err.message)
    }
  }


  //9. 클래스룸 추가 함수(24.2.18)
  const addClassroom = async (classParams, studentPetList) => {
    try {
      let createdTime = timeStamp.fromDate(new Date());
      let docRef = await addDoc(colRef, { ...classParams, createdTime });
      let subColRef = collection(docRef, "students")
      await studentPetList.map(item => {
        addDoc(subColRef, { ...item, subject: classParams.subject });
        return null;
      })
    } catch (err) {
      console.error(err)
    }
  }

  //8. 워드set 추가 함수(24.6.22)
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

  //7. 활동 추가 함수
  const addActi = async (activity) => {
    try {
      let createdTime = timeStamp.fromDate(new Date());
      await addDoc(colRef, { ...activity, createdTime }); //핵심 로직; 만든 날짜와 doc을 받아 파이어 스토어에 col추가
    } catch (err) {
      window.alert(err.message)
    }
  }

  //6. 활동 수정 함수: 새로운 활동과 활동 id(제목) 주면 수정
  const updateActi = async (acti, colName, path) => {
    try {
      let createdTime = timeStamp.fromDate(new Date());
      let docRef = doc(db, colName, path)
      await updateDoc(docRef, { ...acti, createdTime }); //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
    } catch (error) {
      window.alert(error)
      console.log(error)
    }
  }

  //5. 학생 추가 함수(2024.1.7)
  const addStudent = async (newInfo, classId) => {
    let studentColRef = collection(db, "classRooms", classId, "students");
    let modifiedTime = timeStamp.fromDate(new Date());
    try {
      addDoc(studentColRef, { ...newInfo, modifiedTime })
    } catch (error) {
      console.log(error);
    }
  }

  //4. 학생 update 함수(2024.1.6)
  const updateStudent = async (newInfo, classId, studentId) => {
    let studentRef = doc(db, "classRooms", classId, "students", studentId);
    let modifiedTime = timeStamp.fromDate(new Date());
    try {
      updateDoc(studentRef, { ...newInfo, modifiedTime }) //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
    } catch (err) {
      window.alert(err.message)
      console.log(err)
    }
  }

  //3. 학생 삭제 함수
  const deleteStudent = async (classId, studentId) => {
    try {
      let studentRef = doc(db, collectionName, classId, 'students', studentId)
      await deleteDoc(studentRef)
    } catch (error) {
      console.log(error)
    }
  }

  //1. 학생 클래스 정보 업데이트
  const updateClassListInfo = async (classList, type) => {
    let userRef = doc(db, "user", user.uid)
    if (type === "joinedClassList") {
      updateDoc(userRef, { joinedClassList: classList })
    } else if (type === "appliedClassList") {
      updateDoc(userRef, { appliedClassList: classList })
    }
  }

  return (
    { getInfo, addNotice, addActi, updateActi, updateStudent, deleteStudent, addClassroom, addStudent, addWordSet, updateClassListInfo }
  )
}

export default useAddUpdFireData