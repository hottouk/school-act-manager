import { appFireStore } from '../../firebase/config'
import { addDoc, collection, deleteField, doc, getDocs, updateDoc } from 'firebase/firestore'
//생성(250122)
const useFirePetData = () => {
  const db = appFireStore;
  //1. 학생 추가
  const addPet = async (data, classId) => {
    let petColRef = collection(db, "classRooms", classId, "students");
    addDoc(petColRef, { ...data }).catch((error) => {
      console.log(error);
      alert("추가에 실패했습니다. 관리자에게 문의하세요(useuseFirePetData_01)")
    });
  }
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
    await updateDoc(petRef, { ...info }).catch((error) => {
      alert(`관리자에게 문의하세요(useFirePetData_03),${error}`);
      console.log(error);
    })
  }
  //4. 특정 필드 삭제(250720)
  const deletePetField = async (klassId, petId, field) => {
    const petRef = doc(db, "classRooms", klassId, "students", petId);
    await updateDoc(petRef, { [field]: deleteField() }).catch((error) => {
      alert(`구독자 정보를 삭제할 수 없습니다. 관리자에게 문의하세요(useFirePetData_04),${error}`);
      console.log(error);
    })
  }
  return ({ addPet, fetchPets, updatePetInfo, deletePetField })
}

export default useFirePetData
