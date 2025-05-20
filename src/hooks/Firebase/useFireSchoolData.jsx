import { appFireStore } from '../../firebase/config'
import { arrayUnion, collection, doc, getDoc, getDocs, limit, query, startAfter, updateDoc, where } from 'firebase/firestore';
import useFireBasic from './useFireBasic';

const useFireSchoolData = () => {
  const db = appFireStore;
  const { setData } = useFireBasic("school");
  const col = collection(db, "school")

  //학교 데이터 검색
  const fetchSchoolByCode = async (code) => {
    const schoolDoc = doc(col, code);
    const schoolSnapshot = await getDoc(schoolDoc);
    return schoolSnapshot.data();
  }
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
  //학교 가입(250218)
  const joinSchool = (code, userInfo) => {
    const { email, isTeacher, name, profileImg, uid } = userInfo;
    const memberInfo = { email, isTeacher, name, profileImg, uid };
    const schoolRef = doc(col, code);
    try { updateDoc(schoolRef, { memberList: arrayUnion(memberInfo) }) }
    catch (error) {
      window.alert(error);
      console.log(error);
    }
  }
  //5. 교사 담당자 권한 변경(250514)
  const changeSchoolMaster = async (code, newId) => {
    console.log(code, newId)
    const schoolDoc = doc(col, code);
    await updateDoc(schoolDoc, { schoolMaster: newId })
      .catch((error) => {
        alert(`관리자에게 문의하세요(useFireSchoolData_05),${error}`)
        console.log(error);
      })
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

  return ({ fetchSchoolByCode, signUpSchool, joinSchool, searchSchoolByField, addFieldToAllDocs, changeSchoolMaster })
}

export default useFireSchoolData
