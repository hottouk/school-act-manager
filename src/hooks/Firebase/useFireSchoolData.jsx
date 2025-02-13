import { appFireStore } from '../../firebase/config'
import { arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore';

//250209
const useFireSchoolData = () => {
  const db = appFireStore;
  const col = collection(db, "school")

  const fetchSchoolByCode = async (code) => {
    const schoolRef = doc(col, code);
    const schoolDoc = await getDoc(schoolRef);
    return schoolDoc.data();
  }

  const findSchoolByName = async (field, name) => {

  }

  //회원가입 시 학교 가입(250209)
  const signUpSchool = (code, userInfo) => {
    const { email, isTeacher, name, profileImg, uid } = userInfo;
    const memberInfo = { email, isTeacher, name, profileImg, uid };
    const schoolRef = doc(col, code);
    updateDoc(schoolRef, { memberList: arrayUnion(memberInfo) })
  }

  return ({ fetchSchoolByCode, signUpSchool })
}

export default useFireSchoolData
