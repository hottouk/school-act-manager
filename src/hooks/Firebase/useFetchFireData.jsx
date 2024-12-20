import { appFireStore } from '../../firebase/config'
import { collection, doc, getDocFromCache, getDocFromServer, getDocs, orderBy, query, where } from 'firebase/firestore'
import useGetLevel from '../useGetLevel'
import PetImg from '../../components/PetImg'
import { useSelector } from 'react-redux'

const useFetchFireData = () => {
  const db = appFireStore
  const { getExpAndLevelByActList } = useGetLevel()

  const user = useSelector(({ user }) => { return user })
  const actiColRef = collection(appFireStore, "activities")
  const userColRef = collection(appFireStore, "user")
  const wordColRef = collection(db, "words")

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

  //4. 내 Acti 리스트(개별클래스 내에서 사용)
  const fetchActiList = async (subject) => {
    let actiList = []
    let q = query(actiColRef, where("uid", "==", user.uid), where("subject", "==", subject));
    try {
      let querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => { actiList.push({ id: doc.id, ...doc.data() }) })
      await fetchCopiedActiList().then((copiedList) => {
        let filterdList = !copiedList || copiedList.filter((copied) => { return copied.subject === subject })
        actiList = actiList.concat(filterdList)
      })
      actiList.sort((a, b) => a.title.localeCompare(b.title))
    } catch (err) {
      window.alert(err.message);
      console.log(err);
    }
    return actiList;
  }

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

  //2. 워드 리스트 출력
  const fetchWordList = async () => {
    let wordList = []
    let q = query(wordColRef, where("madeBy", "==", user.uid))
    try {
      let querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        wordList.push({ id: doc.id, ...doc.data() })
      });
    } catch (err) {
      window.alert(err.message)
      console.log(err)
    }
    return wordList;
  }

  //1. 유저 리스트 출력
  const fetchUserList = async (type, propKnd, prop) => {
    let userList = []
    let q = userQSetter(type, propKnd, prop)
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userList.push({ ...doc.data(), id: doc.id })
    });
    userList = filterDataList(propKnd, userList, prop)
    userList = modiDataList(type, userList)
    userList = sortDataList(type, userList)
    return userList
  }

  //1-4. 데이터 정렬
  const sortDataList = (type, userList) => { //학번 정렬
    if (type === "student") {
      userList.sort(function (a, b) {
        if (a.studentNumber.toUpperCase() > b.studentNumber.toUpperCase()) {
          return 1;
        }
        if (a.studentNumber.toUpperCase() < b.studentNumber.toUpperCase()) {
          return -1;
        }
        return 0;
      })
    }
    return userList;
  }

  //1-3. 데이터 2차 가공(유저 레벨 산정)
  const modiDataList = (type, userList) => {
    let modiList = userList
    if (type === "student") {
      modiList = userList.map(student => {
        let userLevel = 0 //유저레벨 구하기
        let petList = student.myPetList //펫이 등록되어 있다면
        let petImgList = []
        if (petList) {
          petImgList = petList.map((pet) => {
            let actList = pet.actList
            let expAndLevel = { exp: 0, level: 0 }; //기본값
            if (actList) { expAndLevel = getExpAndLevelByActList(actList); } //있다면 펫마다 각각 레벨 계산하기
            userLevel = + expAndLevel.level //펫 레벨 유저레벨에 합산
            return <PetImg subject={pet.subject} level={expAndLevel.level} onClick={() => { }} />
          })
        }
        return { userLevel, petImgList, ...student }
      })
    }
    return modiList
  }

  //1-2. DB 데이터 1차 필터링
  const filterDataList = (propKnd, DBdata, prop) => {
    let result = DBdata
    if (propKnd === "schoolName") {
      result = DBdata.filter((user) => {
        return user.school.schoolName.includes(prop)
      })
    }
    return result;
  }

  //1-1. DB에서 검색
  const userQSetter = (type, propKnd, prop) => {
    let q
    if (propKnd === "schoolName") { //전체 학교 검색
      if (type === "teacher") { //전체 교사 검색
        q = query(userColRef, where("isTeacher", "==", true))
      } else if (type === "student") { //전체 학생 검색
        q = query(userColRef, where("isTeacher", "==", false))
      }
    } else { //이름 검색, 값이 완전히 같아야 함.
      if (type === "teacher") { //교사 이름 검색
        q = query(userColRef, where("isTeacher", "==", true), where(`${propKnd}`, "==", `${prop}`))
      } else if (type === "student") { //학생 이름 검색
        q = query(userColRef, where("isTeacher", "==", false), where(`${propKnd}`, "==", `${prop}`))
      }
    }
    return q
  }
  return ({ db, fetchDoc, fetchSubDoc, fetchUserList, fetchWordList, fetchTeacherList, fetchActiList, fetchAlActiiBySubjList, fetchCopiedActiList })
}

export default useFetchFireData