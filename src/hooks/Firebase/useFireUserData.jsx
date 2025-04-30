import { useDispatch, useSelector } from 'react-redux'
import { collection, doc, getDoc, runTransaction, updateDoc, arrayUnion, arrayRemove, getDocFromCache, getDocFromServer, setDoc, } from 'firebase/firestore'
import { appFireStore } from '../../firebase/config'
import { setUserPersonalInfo } from '../../store/userSlice'

//user collection 함수 모음
const useFireUserData = () => {
  const user = useSelector(({ user }) => user)
  const db = appFireStore;
  const col = collection(db, "user");
  const dispatcher = useDispatch();

  //유저 기본 업데이트(250217)
  const updateUserInfo = async (field, info) => {
    const userDocRef = doc(col, user.uid);
    try {
      setDoc(userDocRef, { [field]: info }, { merge: true });
    } catch (error) {
      window.alert(error);
      console.log(error);
    }
  }

  //유저 배열형 정보 추가(250127)
  const updateUserArrayInfo = async (id, field, info) => {
    const userDocRef = doc(col, id);
    try {
      await setDoc(userDocRef, { [field]: arrayUnion(info) }, { merge: true });
    } catch (error) {
      window.alert(error);
      console.log(error);
    }
  }

  //내 정보 창에서 정보 변경(250223)
  const updateMyInfo = async (info) => {
    const userDocRef = doc(col, user.uid);
    updateDoc(userDocRef, { ...info })
      .then(() => {
        dispatcher(setUserPersonalInfo(info))
      }).catch((err) => {
        window.alert(err)
        console.log(err)
      })
  }

  //유저 배열형 정보 삭제(250201)
  const deleteUserArrayInfo = async (id, field, info) => {
    const userDocRef = doc(col, id)
    try {
      await updateDoc(userDocRef, { [field]: arrayRemove(info) })
    } catch (error) {
      window.alert(error);
      console.log(error);
    }
  }

  //해당 유저 펫 업데이트(250127) 게임
  const updateUserPetGameInfo = async (pId, levelInfo, resultInfo) => {
    const userDocRef = doc(col, user.uid);
    const { spec, ...levelRest } = levelInfo;
    const { actiId, ...gameRest } = resultInfo;
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
            const updated = { ...quizRecord, [`${actiId}`]: [...recordList, { ...gameRest }] };
            return { ...pet, level: levelRest, quizRecord: updated, spec: spec };
          };
          return pet                                                      //나머지 pet 유지
        });
        transaction.update(userDocRef, { myPetList: updatedPetList });
      });
    } catch (error) {
      console.log(error);
      window.alert(error);
    }
  }

  //해당 유저 펫 진화(250427)
  const updateUserPetInfo = async (pId, nextMon, submitItem) => {
    const userDocRef = doc(col, user.uid);
    await runTransaction(db, async (transaction) => {
      //1. 읽기
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists()) throw new Error("Error: 문서가 없습니다. 관리자 문의 요망");
      //2. 수정
      const updated = userDoc.data().myPetList.map((pet) => {
        if (pet.petId === pId) {
          const { level, ...nextMonRest } = nextMon;
          const accExp = pet.level.accExp;
          const newLevel = { ...level, accExp }
          const newPetInfo = { ...pet, level: newLevel, ...nextMonRest }; //순서가 중요(덮어쓰기)
          return newPetInfo
        };
        return pet
      });
      //3. 업데이트 및 삭제 처리
      transaction.update(userDocRef, { myPetList: updated, onSubmitList: arrayRemove(submitItem) });
    }).catch((err) => {
      console.log(err)
      window.alert(err)
    })
  }

  //퍼온 Acti 리스트 - 활동관리(250210) 이동
  const fetchCopiesData = async () => {
    const userRef = doc(db, "user", String(user.uid))
    try {
      const userDoc = await getDocFromCache(userRef);
      if (!userDoc.exists()) { throw new Error("유저 정보 캐시에서 찾지 못했습니다."); }
      if (!userDoc.data().copiedList) { throw new Error("업어온 활동 캐시에서 찾지 못함."); }
      return userDoc.data().copiedList;
    } catch (error) {
      console.log("서버에서 불러옵니다.")
      try {
        const userDoc = await getDocFromServer(userRef);
        if (!userDoc.exists()) { throw new Error("해당 유저를 찾지 못했습니다."); }
        return userDoc.data().copiedActiList || []
      } catch (err) {
        window.alert(err.message)
        console.log(err)
      }
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

  return ({ updateUserInfo, fetchUserData, updateUserPetInfo, updateUserPetGameInfo, updateUserArrayInfo, deleteUserArrayInfo, fetchCopiesData, updateMyInfo })
}

export default useFireUserData
