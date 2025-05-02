import { appFireStore, timeStamp } from '../../firebase/config'
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'

const useFireClassData = () => {
  const db = appFireStore
  const colRef = collection(db, "classRooms")

  //클래스 기본 정보 수정(250219)
  const updateKlassroomInfo = async (klassId, field, info) => {
    const klassDocRef = doc(colRef, klassId);
    try {
      setDoc(klassDocRef, { [field]: info }, { merge: true });
    } catch (error) {
      console.log(error);
      window.alert(error);
    }
  }

  //클래스 배열형 정보 수정(250220)
  const updateKlassroomArrayInfo = async (klassId, field, info) => {
    const klassDocRef = doc(colRef, klassId);
    try {
      setDoc(klassDocRef, { [field]: arrayUnion(info) }, { merge: true });
    } catch (error) {
      console.log(error);
      window.alert(error);
    }
  }
  //클래스 배열형 정보 삭제(250225)
  const deleteKlassroomArrayInfo = async (klassId, field, info) => {
    const klassDocRef = doc(colRef, klassId);
    try {
      setDoc(klassDocRef, { [field]: arrayRemove(info) }, { merge: true });
    } catch (error) {
      console.log(error);
      window.alert(error);
    }
  }

  //클래스 추가(250205 이동)
  const addClassroom = async (klassInfo, studentPetList) => {
    const { type, subject } = klassInfo
    try {
      const createdTime = timeStamp.fromDate(new Date());
      const classRef = await addDoc(colRef, { ...klassInfo, createdTime });
      const petColRef = collection(classRef, "students");
      const promises = studentPetList.map(studentPet => {
        let studentPetInfo
        if (type === "subject") { studentPetInfo = { ...studentPet, subject: subject } }
        else if (type === "homeroom") { studentPetInfo = { ...studentPet, type } }
        return addDoc(petColRef, studentPetInfo);
      })
      await Promise.all(promises);
    } catch (error) {
      window.alert("클래스 생성 에러: ", error)
    }
  }

  //클래스 수정(250205 생성)
  const updateClassroom = async (klassInfo, id) => {
    const klassDocRef = doc(colRef, id);
    const { title, intro, notice } = klassInfo;
    try {
      updateDoc(klassDocRef, { classTitle: title, intro, notice })
    } catch (error) {
      window.alert("정보 업데이트 에러: ", error);
    }
  }

  //클래스 수정(250502 이동)
  const addStudent = async (newInfo, classId) => {
    let studentColRef = collection(db, "classRooms", classId, "students");
    let modifiedTime = timeStamp.fromDate(new Date());
    try {
      addDoc(studentColRef, { ...newInfo, modifiedTime })
    } catch (error) {
      console.log(error);
    }
  }

  //좌석배치도 저장(241210)
  const addSeatMap = async (id, info) => {
    let { seatMapsList, positionList, objPositionList, studentList, objInfoList } = info
    let docRef = doc(colRef, id)
    let createdTime = timeStamp.fromDate(new Date());
    try {
      await updateDoc(docRef, {
        seatInfo: [...seatMapsList, { studentList, positionList, objPositionList, objInfoList, createdTime }]
      })
    } catch (error) {
      window.alert("정보 업데이트 에러: ", error);
    }
  }

  //좌석배치도 삭제(241210)
  const deleteSeatMap = async (id, list, index) => {
    let deleted = list.filter((_, i) => i !== index)
    let docRef = doc(colRef, id)
    try { await updateDoc(docRef, { seatInfo: [...deleted] }) }
    catch (error) { window.alert("정보 업데이트 에러: ", error); }
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

  return ({ updateKlassroomInfo, updateKlassroomArrayInfo, deleteKlassroomArrayInfo, addClassroom, addStudent, updateClassroom, addSeatMap, deleteSeatMap, fetchClassrooms, sortClassrooms })
}

export default useFireClassData
