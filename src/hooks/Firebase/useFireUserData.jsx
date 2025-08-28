import { useDispatch, useSelector } from 'react-redux'
import { collection, doc, getDoc, runTransaction, updateDoc, arrayUnion, arrayRemove, getDocFromCache, getDocFromServer, setDoc, onSnapshot, } from 'firebase/firestore'
import { appFireStore } from '../../firebase/config'
import { setUserPersonalInfo } from '../../store/userSlice'

//user collection 함수 모음
const useFireUserData = () => {
  const user = useSelector(({ user }) => user);
  const db = appFireStore;
  const col = collection(db, "user");
  const dispatcher = useDispatch();

  //1. 유저 정보 하나 가져오기
  const fetchUserData = async (id) => {
    const userDocRef = doc(col, id);
    const userDoc = await getDoc(userDocRef).catch((error) => {
      alert(`관리자에게 문의하세요(useFireUserData_01), ${error}`);
      console.log(error);
    })
    return userDoc.data();
  }
  //1-1. 유저 정보 실시간 구독
  const userDataListener = (id, callback) => {
    if (!id) return
    const userDocRef = doc(col, id);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) { callback(snapshot.data()); }
      else { callback(null); }
    })
    return () => unsubscribe();
  }

  //2. 유저 기본 업데이트(250217)
  const updateUserInfo = async (field, info, otherId) => {
    let userDocRef = doc(col, user.uid);
    if (otherId) { userDocRef = doc(col, otherId); }
    else { userDocRef = doc(col, user.uid); }
    await setDoc(userDocRef, { [field]: info }, { merge: true }).catch((error) => {
      alert(`관리자에게 문의하세요(useFireUserData_02), ${error}`);
      console.log(error);
    })
  }

  //3. 유저 배열형 정보 추가(250127)
  const updateUserArrayInfo = async (id, field, info) => {
    const userDoc = doc(col, id);
    await setDoc(userDoc, { [field]: arrayUnion(info) }, { merge: true }).catch((error) => {
      alert(`관리자에게 문의하세요(useFireUserData_03), ${error}`);
      console.log(error);
    })
  }

  //4. 유저 배열형 정보 삭제(250201)
  const deleteUserArrayInfo = async (id, field, info) => {
    const userDoc = doc(col, id);
    await updateDoc(userDoc, { [field]: arrayRemove(info) }).catch((error) => {
      alert(`관리자에게 문의하세요(useFireUserData_04), ${error}`);
      console.log(error);
    })
  }

  //5. 학생: 샵 아이템 구매(250630)
  const purchaseShopItem = async (student, rira, item, quantity, teacherId) => {
    const { title, price, stock, order } = item;
    const userDoc = doc(col, user.uid);
    const teacherDoc = doc(col, teacherId);
    await runTransaction(db, async (transaction) => {
      //1. 교사 데이터 읽기
      const teacherSnapshot = await transaction.get(teacherDoc);
      if (!teacherSnapshot.exists()) throw new Error("Error: 교사 데이터를 읽어올 수 없습니다.");
      const teacherData = teacherSnapshot.data();
      const { rira: tRira, shopItemList, name } = teacherData;
      //2. 편집
      const trade = { teacher: name, student, title, quantity, stock: stock - quantity, cost: quantity * price }
      const arr = shopItemList.map((ele) => {
        if (ele.order === order) { return { ...ele, stock: stock - quantity } }
        else { return ele }
      });
      //학생 리라 정산 및 아이템 배달
      transaction.update(userDoc, { purchasedItemList: arrayUnion(trade), rira: rira - price * quantity });
      //교사 리라 정산 및 명세서 배달
      transaction.update(teacherDoc, { soldItemList: arrayUnion(trade), rira: tRira + price * quantity, shopItemList: arr });
    }).catch((error) => {
      alert(`관리자에게 문의하세요(useFireUserData_05), ${error}`);
      console.log(error);
    })
  }

  //6. 학생: 가입 신청
  const applyKlassTransaction = async (info) => {
    const { klass, petId, petLabel, user, pet } = info
    const klassInfo = { ...klass, isApproved: false } //신청 정보
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const submitInfo =
    {
      studentId: user.uid, studentName: user.name, studentNumber: user.studentNumber, school: user.school.schoolName, petId, petLabel, pet,
      classId: klass.id, classTitle: klass.classTitle, classSubj: klass.subject, applyDate: today, type: "join"
    } //상신 정보
    const studentDocRef = doc(col, user.uid);
    const teacherDocRef = doc(col, klassInfo.uid);
    await runTransaction(db, async (transaction) => {
      const studentDoc = await transaction.get(studentDocRef);
      if (!studentDoc.exists()) throw new Error("학생 읽기 에러");
      //이미 신청 확인
      const isApplied = studentDoc.data().myClassList?.find((item) => item.id === klass.id);
      if (isApplied) throw new Error("이미 가입되었거나 가입 신청한 클래스입니다.");
      //학생 신청 정보 업데이트, 교사 상신
      transaction.update(studentDocRef, { "myClassList": arrayUnion(klassInfo) });
      transaction.update(teacherDocRef, { "onSubmitList": arrayUnion(submitInfo) });
    }).then(() => {
      window.alert("가입 신청되었습니다.")
    }).catch(err => {
      window.alert(err);
      console.log(err);
    })
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
      })
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


  return ({ fetchUserData, userDataListener, updateUserInfo, updateUserPetInfo, updateUserPetGameInfo, updateUserArrayInfo, deleteUserArrayInfo, fetchCopiesData, updateMyInfo, purchaseShopItem, applyKlassTransaction })
}

export default useFireUserData
