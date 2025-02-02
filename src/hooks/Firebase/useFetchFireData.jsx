import { appFireStore } from '../../firebase/config'
import { collection, doc, getDocFromCache, getDocFromServer, getDocs, query, where } from 'firebase/firestore'
import { useSelector } from 'react-redux'

const useFetchFireData = () => {
  const db = appFireStore
  const user = useSelector(({ user }) => { return user })
  const actiColRef = collection(appFireStore, "activities")
  const userColRef = collection(appFireStore, "user")
  //todo 삭제 1순위
  //2024.06.30 수정
  //9. 하위 문서(학생) 1개 
  const fetchSubDoc = async (colName, docId, subColName, subDocId) => {
    let docRef = doc(collection(db, colName, docId, subColName), subDocId)
    try {
      let doc = await getDocFromServer(docRef);
      return doc.data()
    } catch (err) {
      console.log(err)
      window.alert(err.message)
    }
  }

  //8. 문서 한개(2024.07.19)
  const fetchDoc = async (colName, docId) => {
    let noticeDocRef = doc(collection(db, colName), docId)
    try {
      let doc = await getDocFromServer(noticeDocRef);
      return doc.data()
    } catch (err) {
      console.log(err)
      window.alert(err.message)
    }
  }

  //7. 퍼온 Acti 리스트 - 활동관리
  const fetchCopiedActiList = async () => {
    let userDocRef = doc(db, "user", String(user.uid))
    try {
      let userDoc = await getDocFromCache(userDocRef);
      if (!userDoc.exists()) { throw new Error("유저 정보 캐시에서 찾지 못했습니다."); }
      if (!userDoc.data().copiedList) { throw new Error("업어온 활동 캐시에서 찾지 못함."); }
      return userDoc.data().copiedList;
    } catch (error) {
      console.log("서버에서 불러옵니다.")
      try {
        let userDoc = await getDocFromServer(userDocRef);
        if (!userDoc.exists()) { throw new Error("해당 유저를 찾지 못했습니다."); }
        return userDoc.data().copiedActiList || []
      } catch (err) {
        window.alert(err.message)
        console.log(err)
      }
    }
  }

  //6. 과목 전체 Acti 리스트 - 활동관리
  const fetchAlActiiBySubjList = async (sbuj) => {
    try {
      let q = query(actiColRef, where("subject", "==", sbuj));
      let querySnapshot = await getDocs(q);
      let allActiBySubj = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((acti) => acti.isPrivate === false)
        .sort((a, b) => a.title.localeCompare(b.title))
      return allActiBySubj;
    } catch (err) {
      window.alert(err.message)
      console.log(err)
    }
  }
  //5. 다른 교사 Acti 리스트 - 활동관리(241215 삭제)

  //4. 내 Acti 리스트(250125 삭제)

  //3. 교사 리스트 출력
  const fetchTeacherList = async () => {
    let teacherList = []
    let q = query(userColRef, where("isTeacher", "==", true))
    try {
      let querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        teacherList.push({ id: doc.id, ...doc.data() })
      });
    } catch (err) {
      window.alert(err.message);
      console.log(err);
    }
    return teacherList;
  }

  //1. 유저 리스트 출력(20250127 삭제)

  //1-4. 데이터 정렬(20250127 삭제)

  //1-3. 데이터 2차 가공(유저 레벨 산정)(20250127 삭제)

  //1-2. DB 데이터 1차 필터링(20250127 삭제)

  //1-1. DB에서 검색(20250127 삭제)

  return ({ db, fetchDoc, fetchSubDoc, fetchTeacherList, fetchAlActiiBySubjList, fetchCopiedActiList })
}

export default useFetchFireData