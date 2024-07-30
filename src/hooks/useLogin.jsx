//라이브러리
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { appAuth, appFireStore, timeStamp } from '../firebase/config'
//redux
import { setUser } from '../store/userSlice'
import { setTempUser } from '../store/tempUserSlice';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import useStudent from './useStudent';

const useLogin = () => {
  //1. 변수
  //파이어베이스
  const auth = appAuth
  const db = appFireStore
  //메세지
  const [isPending, setIsPending] = useState(false)
  const [err, setErr] = useState(null)
  const [emailMsg, setEmailMsg] = useState('');
  //hooks
  const dispatcher = useDispatch()
  const { createStudentNumber } = useStudent()

  //2. 함수
  //기존 유저 검사(24.02.21)
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
        let profile = userInfo.profile
        uid = String(profile.id)
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

  //신규 유저 추가(24.02.22)
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

  //이메일 링크 인증(24.07.30)
  const sendEmailSignInLink = async (email) => {
    let actionCodeSettings = {
      url: "https://school-act-manager.web.app/login/email", // 사용자가 이메일 링크를 클릭한 후 리디렉션될 URL
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailMsg("인증 이메일 발송 완료. 이 창을 닫고 메일을 확인해주세요. 인증 이메일 확인 시 반드시 같은 브라우저를 사용하셔야 합니다.");
    } catch (error) {
      console.error("이메일 인증 에러 발생", error);
      setEmailMsg(`Error: ${error.message}`);
    }
  }

  //이메일 인증 정보(2024.07.30)
  const getEmailUserCredential = async (email, password) => {
    let userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential
  }

  //이메일 로그인(2024.07.30)
  const emailLogin = async (email, password) => {
    try {
      let userCredential = await signInWithEmailAndPassword(auth, email, password);
      let user = userCredential.user
      if (user) {
        findUser(user, "email").then(({ _, userInfofromServer }) => {
          dispatcher(setUser(userInfofromServer))
        })
        window.alert("로그인 성공");
      }
    } catch (err) {//오류 처리
      switch (err.code) {
        case 'auth/user-not-found':
          setEmailMsg("회원 가입되지 않은 id 입니다.");
          break;
        case 'auth/wrong-password':
          setEmailMsg("비밀번호가 틀렸습니다.");
          break;
        case 'auth/invalid-email':
          setEmailMsg("올바른 이메일 형식이 아닙니다.");
          break;
        default:
          setEmailMsg(`이 메세지를 캡쳐해서 hottouk로 보내주세요. Error: ${err.message}`);
          break;
      }
    }
  }

  //구글 팝업 로그인(24.02.21)
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

  //비밀번호 유효성 검사(24.07.30)
  const validatePassword = (password, samePassword) => {
    if (password.length < 6) { return "비밀 번호는 최소 6자를 넘어야 합니다."; }
    if (password !== samePassword) { return "비밀번호 확인란과 번호가 다릅니다."; }
    return null; // 비밀번호가 유효한 경우
  };

  //유저 가입(24.07.30)
  const classifyUserInfo = ({ uid, school, isTeacher, name, email, phoneNumber, profileImg, classNumber, grade, number, password, samePassword }) => {
    //이메일 가입: 비번 에러 시 return 
    if (!password) { password = null; }
    else {
      let errMsg = validatePassword(password, samePassword)
      if (errMsg) {
        setEmailMsg(errMsg)
        return
      }
    }
    //이메일, SNS 가입 로직 
    if (school) {
      if (isTeacher) { //교사
        let teacherUserInfo = { uid, school, isTeacher, name, email, phoneNumber, profileImg, password }
        if (window.confirm(`교사회원으로 가입 하시겠습니까?`)) {
          return teacherUserInfo
        }
      } else { //학생
        if (grade !== "default" && classNumber !== "default" && number) {
          let studentNumber = createStudentNumber(number - 1, grade, classNumber)
          let studentUserInfo = { uid, school, isTeacher, name, email, phoneNumber, profileImg, studentNumber, password }
          if (window.confirm(`${school.schoolName} 학번 ${studentNumber}로 회원가입 하시겠습니까?`)) {
            return studentUserInfo
          }
        } else {
          window.alert("학년, 반, 번호를 입력하세요.")
        }
      }
    } else {
      window.alert("학교를 입력하세요.")
    }
  }

  return (
    { addUser, googleLogin, emailLogin, sendEmailSignInLink, getEmailUserCredential, classifyUserInfo, emailMsg, isPending, err, }
  )
}

export default useLogin