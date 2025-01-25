import { appFireStore } from '../../firebase/config'
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'

//25.01.22 생성
const useFirePetData = () => {
  const db = appFireStore;

  //5. fetch 클래스 petList 
  const fetchPets = async (klassId) => {
    let petColRef = collection(db, "classRooms", klassId, "students");
    try {
      const docsSnapshot = await getDocs(petColRef);
      return docsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.log(err)
      window.alert(err.message)
    }
  }

  const addPet = async (data, classId) => {
    let petColRef = collection(db, "classRooms", classId, "students");
    try {
      addDoc(petColRef, { ...data })
    } catch (error) {
      console.log(error);
    }
  }

  //4. pet update 함수(2024.1.6) 
  const updatePet = async (data, classId, petId) => {
    let petRef = doc(db, "classRooms", classId, "students", petId);
    try {
      updateDoc(petRef, { ...data }) //업데이트 로직; 만든 날짜와 doc을 받아 업데이트
    } catch (err) {
      window.alert(err.message)
      console.log(err)
    }
  }

  return ({ addPet, fetchPets })
}

export default useFirePetData
