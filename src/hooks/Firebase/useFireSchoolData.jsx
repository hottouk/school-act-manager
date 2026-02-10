import { appFireStore } from '../../firebase/config'
import { arrayUnion, collection, deleteDoc, deleteField, doc, getDoc, getDocs, limit, onSnapshot, query, runTransaction, startAfter, updateDoc, where, writeBatch } from 'firebase/firestore';
import useFireBasic from './useFireBasic';
import { useSelector } from 'react-redux';
import { useState } from 'react';
const useFireSchoolData = () => {
  const db = appFireStore;
  const user = useSelector(({ user }) => user);
  const [schoolRtData, setSchoolRtData] = useState(null);
  const { setData } = useFireBasic("school");
  const col = collection(db, "school")
  //01. 학교 데이터 검색
  const fetchSchoolByCode = async (code) => {
    const schoolDocRef = doc(col, code);
    const snapshot = await getDoc(schoolDocRef);
    return snapshot.data();
  }
  //01-1 학교 데이터 실시간 구독
  const schoolDataListener = (code) => {
    const skulDocRef = doc(col, code);
    const unsubscribe = onSnapshot(skulDocRef, (snapshot) => {
      if (!snapshot.exists()) return;
      setSchoolRtData(snapshot.data());
    })
    return () => unsubscribe();
  };
  //학교 검색(250218)
  const searchSchoolByField = async (field, value) => {
    try {
      const q = query(col, where(field, "==", value));
      const querySnapshots = await getDocs(q);
      return querySnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      window.alert(error);
      console.log(error);
    }
  }
  //회원가입 시 학교 가입(250209) -> 분기 수정(250218)
  const signUpSchool = async (schoolInfo, userInfo) => {
    const { schoolCode } = schoolInfo
    const { email, isTeacher, name, profileImg, uid } = userInfo;
    const memberInfo = { email, isTeacher, name, profileImg, uid };
    const schoolRef = doc(col, schoolCode);
    try {
      const schoolDoc = await getDoc(schoolRef);
      if (schoolDoc.exists()) {
        updateDoc(schoolRef, { memberList: arrayUnion(memberInfo) })
      } else {
        const memberList = [memberInfo]
        setData({ ...schoolInfo, memberList }, schoolCode)
      }
    } catch (error) {
      window.alert(error);
      console.log(error);
    }
  }
  //학교 가입(260209)
  const joinSchool = async (code, userInfo) => {
    const { email, isTeacher, name, uid } = userInfo;
    const memberInfo = { email, isTeacher, name, uid };
    const schoolRef = doc(col, code);
    await updateDoc(schoolRef, { memberList: arrayUnion(memberInfo) });
  }
  //5. 교사 담당자 권한 변경(250514)
  const changeSchoolMaster = async (code, newId) => {
    const schoolDoc = doc(col, code);
    await updateDoc(schoolDoc, { schoolMaster: newId });
  }
  //전체 학교 첫번째 교사 담당자 권한 부여(250514)
  const addFieldToAllDocs = async () => {
    try {
      const batchSize = 300; // 300개씩 처리
      let lastDoc = null;
      let totalUpdated = 0;
      while (true) {
        const q = lastDoc
          ? query(col, startAfter(lastDoc), limit(batchSize))
          : query(col, limit(batchSize));
        const snapshot = await getDocs(q);
        if (snapshot.empty) break;

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const memberList = data.memberList || [];
          if (memberList.length === 0 || !memberList[0].uid) {
            console.log(`문서 ${docSnap.id}는 memberlist가 비어있거나 uid 없음 → 건너뜀`);
            continue;
          }
          const schoolMasterUid = memberList[0].uid;
          const docRef = doc(col, docSnap.id);
          await updateDoc(docRef, {
            schoolMaster: schoolMasterUid
          });

          totalUpdated++;
        }
        lastDoc = snapshot.docs[snapshot.docs.length - 1];
      }

      alert(`총 ${totalUpdated}개의 문서를 업데이트했습니다.`);
    } catch (error) {
      console.error("업데이트 중 오류:", error);
      alert("오류 발생. 콘솔 확인.");
    } finally {
    }
  };
  //5. 학교 탈퇴
  const leaveSchoolTx = async (schoolCode) => {
    const userDoc = doc(db, "user", user.uid);
    const schoolDoc = doc(col, schoolCode);
    const klassroomsCol = collection(db, "classRooms");
    try {
      await runTransaction(db, async (tx) => {
        //1. read
        const userSnapshot = await tx.get(userDoc);
        const schoolSnapshot = await tx.get(schoolDoc);
        if (!userSnapshot.exists()) { throw new Error("유저 정보 없음"); };
        if (!schoolSnapshot.exists()) { throw new Error("학교 정보 없음"); };
        //2. write
        const memberList = schoolSnapshot.data().memberList || [];
        const deleted = memberList.filter((item) => item.uid !== user.uid);
        tx.update(userDoc, { school: deleteField(), coTeachingList: deleteField() });
        tx.update(schoolDoc, { memberList: deleted });
      })
      //3. classroom 컬렉션에서 특정 uid를 가진 문서들 삭제
      const q = query(klassroomsCol, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      for (const klassSnapshot of querySnapshot.docs) {
        const klassId = klassSnapshot.id;
        const petsRef = collection(db, "classRooms", klassId, "students");
        while (true) { //무한 반복                                                                         
          const petSnapshots = await getDocs(petsRef);
          const innerBatch = writeBatch(db);
          if (petSnapshots.empty) break;
          petSnapshots.forEach((petSnapshot) => {
            innerBatch.delete(doc(db, "classRooms", klassSnapshot.id, "students", petSnapshot.id)); //subCollection 하위 문서 삭제
          })
          await innerBatch.commit(); // 🔥 subCollection 문서 반복 삭제
        }
        await deleteDoc(doc(db, "classRooms", klassSnapshot.id));
      }
    } catch (err) {
      //todo 에러 로그 기록
    }
  }
  return ({ schoolRtData, fetchSchoolByCode, schoolDataListener, signUpSchool, joinSchool, searchSchoolByField, addFieldToAllDocs, changeSchoolMaster, leaveSchoolTx })
}

export default useFireSchoolData
