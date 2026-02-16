import { useCallback, useState } from 'react';
import { appFireStore, timeStamp } from '../../firebase/config'
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'

const useFireClassData = () => {
  const db = appFireStore;
  const colRef = collection(db, "classRooms");
  const [klassRtData, setKlassRtData] = useState(null);
  const [klassListRtData, setKlassListRtData] = useState(null);
  //1. 클래스 추가(250205 이동)
  const addClassroom = useCallback(async (klassInfo, studentPetList) => {
    const { subject, type } = klassInfo;
    const createdTime = timeStamp.fromDate(new Date());
    const klassDoc = await addDoc(colRef, { ...klassInfo, createdTime });
    await updateDoc(klassDoc, { id: klassDoc.id, });
    const petColRef = collection(klassDoc, "students");
    const promises = studentPetList.map(async studentPet => {
      if (type === "subject") { await addDoc(petColRef, { ...studentPet, type, subject: subject }); }
      else if (type === "homeroom") { await addDoc(petColRef, { ...studentPet, type }); }
    });
    await Promise.all(promises);
  }, []);
  //2. 클래스 불러오기(250122)
  const fetchClassrooms = useCallback(async (field, value) => {
    const q = query(colRef, where(field, "==", value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }, []);
  //2-1 클래스 리스트 실시간 구독(260202)
  const klassListDataListener = useCallback((uid) => {
    if (!uid) return
    const q = query(colRef, where("uid", "==", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      console.log(list)
      list.sort((a, b) => a.grade.localeCompare(b.grade)).sort((a, b) => a.classNumber.localeCompare(b.classNumber)) //2차 소팅
      setKlassListRtData(list);
    })
    return () => unsubscribe();
  }, []);
  //2-2. 클래스 정보 실시간 구독
  const klassDataListener = useCallback((id) => {
    if (!id) return
    const klassDocRef = doc(colRef, id);
    const unsubscribe = onSnapshot(klassDocRef, (snapshot) => {
      if (snapshot.exists()) setKlassRtData(snapshot.data());
      else setKlassRtData(null);
    })
    return () => unsubscribe();
  }, []);
  //3. 클래스 업데이트(260120)
  const updateKlassroom = async (klassInfo, id) => {
    const klassDocRef = doc(colRef, id);
    updateDoc(klassDocRef, klassInfo)
      .catch((err) => {
        console.log("업데이트 에러", err);
        alert("업데이트 에러: 관리자에게 문의하세요(useFireClassData_03)", err)
      })
  };
  //4. 클래스 배열형 정보 수정(250220)
  const updateKlassroomArrayInfo = async (klassId, field, info) => {
    const klassDocRef = doc(colRef, klassId);
    try {
      setDoc(klassDocRef, { [field]: arrayUnion(info) }, { merge: true });
    } catch (error) {
      console.log(error);
      window.alert(error);
    }
  };
  //5. 클래스 배열형 정보 삭제(250225)
  const deleteKlassroomArrayInfo = async (klassId, field, info) => {
    const klassDocRef = doc(colRef, klassId);
    try {
      setDoc(klassDocRef, { [field]: arrayRemove(info) }, { merge: true });
    } catch (error) {
      console.log(error);
      window.alert(error);
    }
  };
  //6. 클래스 복제(2501511 추가)
  const copyKlassroom = async (klassInfo, studentPetList, newTitle) => {
    const { id, classTitle, ...klassInfoRest } = klassInfo;
    const type = klassInfo.type;
    const createdTime = timeStamp.fromDate(new Date());
    const docRef = doc(colRef);
    await setDoc(docRef, { ...klassInfoRest, classTitle: newTitle, createdTime, id: docRef.id });
    const klassDocRef = doc(colRef, docRef.id);
    const petColRef = collection(klassDocRef, "students");
    const promises = studentPetList.map(studentPet => {
      const { studentNumber, subject, writtenName } = studentPet;
      let studentPetInfo
      if (type === "subject") { studentPetInfo = { studentNumber, subject, type, writtenName: writtenName !== undefined ? writtenName : null } }
      else if (type === "homeroom") { studentPetInfo = { studentNumber, subject: null, type, writtenName: writtenName !== undefined ? writtenName : null } }
      return addDoc(petColRef, studentPetInfo);
    })
    await Promise.all(promises);
  };
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
  //클래스 업데이트(260120) ==> todo 삭제
  const updateKlassroomInfo = async (klassId, field, info) => {
    const klassDocRef = doc(colRef, klassId);
    try {
      setDoc(klassDocRef, { [field]: info }, { merge: true });
    } catch (error) {
      console.log(error);
      window.alert(error);
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
  //반 분류하기(250122)
  const sortClassrooms = useCallback((list = []) => {
    const subjClassList = [];
    const homeroomClassList = [];
    list.forEach(classroom => {
      if (!classroom.type || classroom.type === "subject") subjClassList.push(classroom)
      else homeroomClassList.push(classroom)
    })
    return { subjClassList, homeroomClassList }
  }, []);

  return ({
    addClassroom, fetchClassrooms, klassListDataListener, klassDataListener, updateKlassroom, addStudent, copyKlassroom,
    updateKlassroomInfo, updateKlassroomArrayInfo, deleteKlassroomArrayInfo, addSeatMap, deleteSeatMap, sortClassrooms, klassRtData, klassListRtData
  })
}

export default useFireClassData
