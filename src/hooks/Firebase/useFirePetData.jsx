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

  return ({ addPet, fetchPets })
}

export default useFirePetData
