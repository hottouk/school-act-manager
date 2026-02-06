//라이브러리
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { appAuth, appFireStore, timeStamp } from '../firebase/config'
//redux
import { setUser } from '../store/userSlice'
import { setTempUser } from '../store/tempUserSlice';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
//hooks
import useStudent from './useStudent';
import useFireBasic from './Firebase/useFireBasic';

const useLogin = () => {
  const auth = appAuth;
  const db = appFireStore;
  const dispatcher = useDispatch();
  const { createStudentNumber } = useStudent();
  const { fetchData } = useFireBasic("user");
  const [isPending, setIsPending] = useState(false);
  const [err, setErr] = useState(null);

  //기존 유저 검사(240221)
  const findUser = async (userInfo, sns) => {
    let isUserExist;
    let userInfofromServer = null;
    let uid
    switch (sns) {
      case "google": //동일 로직 처리
      case "email":
        uid = userInfo.uid
        break;
      case "kakao":
        let id = userInfo.id
        uid = String(id)
        break;
      default: return
    }
    try {
      const q = query(collection(db, "user"), where("uid", "==", uid))
      await getDocs(q).then((querySnapshot) => {
        isUserExist = querySnapshot.docs.length > 0//한명도 없을 경우, 즉 존재하지 않을 경우 false 존재하면 true
        querySnapshot.docs.forEach((doc) => {
          userInfofromServer = doc.data()          //존재할 경우 서버 데이터를 반환
        })
      })
      return { isUserExist, userInfofromServer }
    } catch (error) {
      window.alert(`서버 ${error} 오류입니다.`)
      console.error(error)
    }
  }

  //신규 유저 추가(240222)
  const addUser = async (userInfo) => {
    let uid = String(userInfo.uid) //카카오 id가 숫자 -> 문자열
    let userRef = doc(db, "user", uid)
    try {
      const createdTime = timeStamp.fromDate(new Date());
      await setDoc(userRef, { ...userInfo, uid, createdTime }); //핵심 로직; 만든 날짜와 doc을 받아 파이어 스토어에 col추가
    } catch (err) {
      window.alert(err)
      console.error(err)
    }
  }
  //test 로그인(20240730)
  const testLogin = async (email, password) => {
    const userInfo = await fetchData("email", email);
    console.log(userInfo)
    const isMatch = String(userInfo[0].password) === String(password);
    if (!userInfo || !isMatch) { alert("이메일 또는 비밀번호가 올바르지 않습니다."); return; }
    dispatcher(setUser(userInfo[0]));
    alert("로그인 성공");
  }

  //구글 팝업 로그인(240221)
  const googleLogin = (openSnsModal) => {
    setErr(null)
    setIsPending(true)
    let provider = new GoogleAuthProvider();
    signInWithPopup(appAuth, provider)
      .then((userCredential) => {
        let userInfo = userCredential.user
        let tempUser = { name: userInfo.displayName, profileImg: userInfo.photoURL, phoneNumber: userInfo.phoneNumber, ...userInfo }
        dispatcher(setTempUser(tempUser))
        findUser(tempUser, "google").then(({ isUserExist, userInfofromServer }) => { //기존 유저 체크
          if (isUserExist !== true) { openSnsModal(true) }                           //신규           
          else {                                                                     //기존 유저
            dispatcher(setUser(userInfofromServer))
            window.alert(`${userInfofromServer.name}으로 로그인 되었습니다.`)
          }
          setErr(null)
          setIsPending(false)
        })
      }).catch((error) => {
        window.alert(error.code, error.message)
        setErr(error.message)
        setIsPending(false)
      })
  }

  //카카오 로그인(240724)
  const kakaoLogin = (userInfo, openModal) => {
    setErr(null)
    setIsPending(true)
    let user
    if (userInfo) {
      user = {
        uid: String(userInfo.id),
        name: userInfo.kakao_account.profile.nickname,
        email: userInfo.kakao_account.email || "no-email",
        profileImg: userInfo.kakao_account.profile.profile_image_url || "no-image",
        phoneNumber: null
      }
    }
    dispatcher(setTempUser(user))
    findUser(userInfo, "kakao").then(({ isUserExist, userInfofromServer }) => { //기존 유저 체크
      if (isUserExist !== true) { openModal(true) }                             //신규
      else {                                                                    //기존
        dispatcher(setUser(userInfofromServer))
        alert(`${userInfofromServer.name}으로 로그인 되었습니다.`)
      }
      setErr(null)
      setIsPending(false)
    }).catch((err) => {
      window.alert(err.code, err.message)
      setErr(err.message)
      setIsPending(false)
    })
  }

  //유저 가입(240730) -> 이메일 가입 삭제(260106)
  const classifyUserInfo = ({ uid, school, isTeacher, name, email, phoneNumber, profileImg, classNumber, grade, number, isMyTermAgree }) => {
    if (isTeacher) { //교사
      const teacherUserInfo = { uid, school, isTeacher, name, email, phoneNumber, profileImg, isMyTermAgree }
      if (window.confirm(`교사회원으로 가입 하시겠습니까?`)) {
        return teacherUserInfo
      } else { return null; }
    } else { //학생
      const studentNumber = createStudentNumber(number - 1, grade, classNumber)
      const studentUserInfo = { uid, school, isTeacher, name, email, phoneNumber, profileImg, studentNumber, isMyTermAgree }
      if (window.confirm(`${school?.schoolName ?? "그외 학교"} 학번 ${studentNumber}로 회원가입 하시겠습니까?`)) {
        return studentUserInfo
      } else { return null; }
    }
  }
  return { addUser, googleLogin, kakaoLogin, testLogin, classifyUserInfo, isPending, err, }
}

export default useLogin