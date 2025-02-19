import { appFireStore } from '../../firebase/config'
import { arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import useFireBasic from './useFireBasic';

const useFireSchoolData = () => {
  const db = appFireStore;
  const { setData } = useFireBasic("school");
  const col = collection(db, "school")

  const fetchSchoolByCode = async (code) => {
    const schoolRef = doc(col, code);
    const schoolDoc = await getDoc(schoolRef);
    return schoolDoc.data();
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

  return ({ fetchSchoolByCode, signUpSchool, joinSchool, searchSchoolByField })
}

export default useFireSchoolData
