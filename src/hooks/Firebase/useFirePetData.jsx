import { useCallback, useState } from 'react';
import { appFireStore } from '../../firebase/config'
import { addDoc, collection, deleteDoc, deleteField, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore'
//생성(250122)
const useFirePetData = () => {
  const db = appFireStore;
  const [petRtData, setPetRtData] = useState(null);
  const [petListRtData, setPetListRtData] = useState(null);
  //1. 학생 추가
  const addPet = async (data, classId) => {
    let petColRef = collection(db, "classRooms", classId, "students");
    addDoc(petColRef, { ...data }).catch((error) => {
      console.log(error);
      alert("추가에 실패했습니다. 관리자에게 문의하세요(useuseFirePetData_01)")
    });
  }
  //2. 실시간 one pet
  const petDataListener = useCallback((klassId, petId) => {
    const petDocRef = doc(db, "classRooms", klassId, "students", petId);
    const unsubscribe = onSnapshot(petDocRef, (snapshot) => {
      if (snapshot.exists()) setPetRtData({ ...snapshot.data(), id: snapshot.id });
      else setPetRtData(null);
    }, (error) => { throw new Error(error.message) }
    )
    return () => unsubscribe();
  }, []);
  //3. 실시간 petList
  const petListDataListener = useCallback((klassId, setter = setPetListRtData) => {
    const petColRef = collection(db, "classRooms", klassId, "students");
    const q = query(petColRef, orderBy("studentNumber", 'asc'));
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const result = [];
        snapshot.docs.forEach((doc) => { result.push({ ...doc.data(), id: doc.id }); })
        setter(result);
      }
    );
    return unsubscribe;
  }, [db]);
  //2. fetch 클래스 petList 
  const fetchPets = async (klassId) => {
    const petCol = collection(db, "classRooms", klassId, "students");
    const docsSnapshot = await getDocs(petCol).catch((error) => {
      alert(`관리자에게 문의하세요(useFirePetData_02),${error}`);
      console.log(error);
    })
    return docsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
  }
  //3. Pet 업데이트(250207)
  const updatePetInfo = async (klassId, petId, info) => {
    const petRef = doc(db, "classRooms", klassId, "students", petId);
    await updateDoc(petRef, { ...info });
  }
  //3. Pet 전체 업데이트(260120)
  const updateAllPetInfo = async (klassId, infoList) => {
    if (!klassId || !infoList) throw new Error("parameter Error, 변수 확인 필요");
    const petColRef = collection(db, "classRooms", klassId, "students");
    const promises = infoList.map(async (info) => {
      const { id } = info;
      const petDoc = doc(petColRef, id);
      await setDoc(petDoc, info, { merge: true });
    });
    await Promise.all(promises);
  }
  //4. 펫 삭제(260126)
  const deletePet = async (klassId, petId) => {
    let petDocRef = doc(db, "classRooms", klassId, 'students', petId);
    await deleteDoc(petDocRef);
  }
  //4_1. 특정 필드 삭제(250720)
  const deletePetField = async (klassId, petId, field) => {
    const petRef = doc(db, "classRooms", klassId, "students", petId);
    await updateDoc(petRef, { [field]: deleteField() }).catch((error) => {
      alert(`구독자 정보를 삭제할 수 없습니다. 관리자에게 문의하세요(useFirePetData_04),${error}`);
      console.log(error);
    })
  }
  return ({ petRtData, petListRtData, petDataListener, petListDataListener, addPet, fetchPets, updatePetInfo, updateAllPetInfo, deletePet, deletePetField, })
}

export default useFirePetData
