import { appFireStore } from '../../firebase/config'
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore'

//250122 생성
const useFirePetData = () => {
  const db = appFireStore;

  //3. Pet 업데이트(250207)
  const updatePetInfo = async (klassId, petId, info) => {
    const petRef = doc(db, "classRooms", klassId, "students", petId);
    await updateDoc(petRef, { ...info }).catch((error) => {
      alert(`관리자에게 문의하세요(useFirePetData_03),${error}`);
      console.log(error);
    })
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

  const addPet = async (data, classId) => {
    let petColRef = collection(db, "classRooms", classId, "students");
    try {
      addDoc(petColRef, { ...data })
    } catch (error) {
      console.log(error);
    }
  }

  return ({ addPet, fetchPets, updatePetInfo })
}

export default useFirePetData
