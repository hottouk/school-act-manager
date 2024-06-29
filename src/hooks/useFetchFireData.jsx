import { appFireStore } from '../firebase/config'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import useGetLevel from './useGetLevel'
import PetImg from '../components/PetImg'
import { useSelector } from 'react-redux'

const useFetchFireData = () => {
  const db = appFireStore
  const { getExpAndLevelByActList } = useGetLevel()
  const user = useSelector(({ user }) => { return user })

  //6. 전체 Acti 리스트 출력
  const fetchAlActiiBySubjList = async (sbuj) => {
    let allActiBySubj = []
    let actiColRef = collection(appFireStore, "activities")
    let q = query(actiColRef, where("subject", "==", sbuj));
    try {
      let querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        allActiBySubj.push({ id: doc.id, ...doc.data() })
        allActiBySubj.sort((a, b) => a.title.localeCompare(b.title))
      })
    } catch (err) {
      window.alert(err.message)
      console.log(err)
    }
    return allActiBySubj
  }

  //5. 다른 교사 Acti 리스트 출력
  const fetchOtrActiList = async (otherTrId) => {
    let otrActiList = []
    let actiColRef = collection(appFireStore, "activities")
    let q = query(actiColRef, where("uid", "==", otherTrId), orderBy("subject", "desc"));
    try {
      let querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        otrActiList.push({ id: doc.id, ...doc.data() })
        otrActiList.sort((a, b) => a.title.localeCompare(b.title))
      })
    } catch (err) {
      window.alert(err.message);
      console.log(err);
    }
    return otrActiList;
  }

  //4. 본인 Acti 리스트 출력
  const fetchActiList = async (thisClass) => {
    let actiList = []
    let actiColRef = collection(appFireStore, "activities")
    let q
    if (user.isTeacher) { //교사
      if (!thisClass) { //활동 관리
        q = query(actiColRef, where("uid", "==", user.uid), orderBy("subject", "desc"));
      } else {  //반 활동
        q = query(actiColRef, where("uid", "==", user.uid), where("subject", "==", thisClass.subject));
      }
    } else { //학생
      if (!thisClass) { //활동 관리
        q = query(actiColRef, where("particiSIdList", "array-contains", user.uid));
      } else { //반 활동
        q = query(actiColRef, where("uid", "==", thisClass.uid), where("subject", "==", thisClass.subject));
      }
    }
    try {
      let querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        actiList.push({ id: doc.id, ...doc.data() })
        actiList.sort((a, b) => a.title.localeCompare(b.title))
      })
    } catch (err) {
      window.alert(err.message);
      console.log(err);
    }
    return actiList;
  }

  //3. 교사 리스트 출력
  const fetchTeacherList = async () => {
    let teacherList = []
    let teacherColRef = collection(appFireStore, 'user')
    let q = query(teacherColRef, where("isTeacher", "==", true))
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
    let wordColRef = collection(db, "words")
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
    let userColRef = collection(db, "user")
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
  return ({ fetchUserList, fetchWordList, fetchTeacherList, fetchActiList, fetchOtrActiList, fetchAlActiiBySubjList })
}

export default useFetchFireData