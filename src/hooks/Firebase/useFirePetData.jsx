import { appFireStore } from '../../firebase/config'
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'

//250122 생성
const useFirePetData = () => {
  const db = appFireStore;

  //3. Pet 업데이트(250207)
  const updatePetInfo = async (klassId, petId, info) => {
    const petRef = doc(db, "classRooms", klassId, "students", petId);
    try {
      await updateDoc(petRef, { ...info })
    } catch (error) {
      console.log(error)
      window.alert(error)
    }
  }

  //2. fetch 클래스 petList 
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

  return ({ addPet, fetchPets, updatePetInfo })
}

export default useFirePetData
