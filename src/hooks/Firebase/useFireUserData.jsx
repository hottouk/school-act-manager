import { useSelector } from 'react-redux'
import { collection, doc, getDoc, runTransaction, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { appFireStore } from '../../firebase/config'

//user collection 함수 모음
const useFireUserData = () => {
  const user = useSelector(({ user }) => user)
  const db = appFireStore;
  const col = collection(db, "user")

  //유저 배열형 정보 추가(250127)
  const updateUserArrayInfo = async (id, field, info) => {
    const userDocRef = doc(col, id)
    try {
      await updateDoc(userDocRef, { [field]: arrayUnion(info) })
    } catch (error) {
      console.log(error)
    }
  }

  //유저 배열형 정보 삭제(250201)
  const deleteUserArrayInfo = async (id, field, info) => {
    const userDocRef = doc(col, id)
    try {
      await updateDoc(userDocRef, { [field]: arrayRemove(info) })
    } catch (error) {
      console.log(error)
    }
  }

  //해당 유저 펫 업데이트(250127) 게임
  const updateUserPetGameInfo = async (pId, levelInfo, gameInfo) => {
    const userDocRef = doc(col, user.uid);
    const { actiId, ...rest } = gameInfo
    try {
      await runTransaction(db, async (transaction) => {
        //1. 읽기
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) throw new Error("Error: 펫이 없습니다. 관리자 문의 요망");

        //2. 수정
        const updatedPetList = userDoc.data().myPetList.map((pet) => {
          if (pet.petId === pId) {                                        //해당 pet만 게임 결과 정보 수정
            const quizRecord = pet.quizRecord || {};
            const recordList = quizRecord[actiId] || [];
            const updated = { ...quizRecord, [`${actiId}`]: [...recordList, { ...rest }] }
            return { ...pet, level: levelInfo, quizRecord: updated }
          };
          return pet;                                                     //나머지 pet 유지
        })
        transaction.update(userDocRef, { myPetList: updatedPetList });
      });
    } catch (error) {
      console.log(error)
      window.alert(error)
    }
  }

  //해당 유저 펫 업데이트(250130) 진화
  const updateUserPetInfo = async (pId, info) => {
    const userDocRef = doc(col, user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        //1. 읽기
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) throw new Error("Error: 문서가 없습니다. 관리자 문의 요망");

        //2. 수정
        const updatedPetList = userDoc.data().myPetList.map((pet) => {
          if (pet.petId === pId) {
            const { monId, petId, classId, quizRecord } = pet
            console.log(pet)
            const newPetInfo = { ...info, classId, monId, petId, quizRecord }
            return { ...newPetInfo }
          };
          return pet;
        })
        console.log(updatedPetList)
        transaction.update(userDocRef, { myPetList: updatedPetList });
      });
    } catch (error) {
      console.log(error)
      window.alert(error)
    }
  }


  //해당 유저 정보 가져오기
  const fetchUserData = async (uid) => {
    const userDocRef = doc(col, uid || user.uid)
    try {
      const userDoc = await getDoc(userDocRef)
      return userDoc.data()
    } catch (error) {
      console.log(error)
    }
  }

  return ({ fetchUserData, updateUser: updateUserArrayInfo, updateUserPetInfo, updateUserPetGameInfo, updateUserArrayInfo, deleteUserArrayInfo })
}

export default useFireUserData
