//라이브러리
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { appAuth, appFireStore, timeStamp } from '../firebase/config'
//redux
import { setUser } from '../store/userSlice'
import { setTempUser } from '../store/tempUserSlice';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

const useLogin = () => { //데이터 통신
  const db = appFireStore
  const [isPending, setIsPending] = useState(false)
  const [err, setErr] = useState(null)
  const dispatcher = useDispatch()

  //기존 유저 검사(24.02.21)
  const findUser = async (userInfo, sns) => {
    let isUserExist;
    let userInfofromServer = null;
    let uid
    switch (sns) {
      case "google":
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

  //신규 유저 추가(24.02.22)
  const addUser = async (userInfo) => {
    let uid = String(userInfo.uid) //카카오 id가 숫자
    let userRef = doc(db, "user", uid)
    try {
      const createdTime = timeStamp.fromDate(new Date());
      await setDoc(userRef, { ...userInfo, uid, createdTime }); //핵심 로직; 만든 날짜와 doc을 받아 파이어 스토어에 col추가
    } catch (err) {
      window.alert(err)
      console.error(err)
    }
  }

  //구글 팝업 로그인(24.02.21)
  const googleLogin = (openSnsModal) => {
    setErr(null)
    setIsPending(true)
    const provider = new GoogleAuthProvider();
    signInWithPopup(appAuth, provider)
      .then((userCredential) => {
        let userInfo = userCredential.user
        let tempUser = { name: userInfo.displayName, profileImg: userInfo.photoURL, phoneNumber: userInfo.phoneNumber, ...userInfo }
        dispatcher(setTempUser(tempUser))
        findUser(tempUser, "google").then(({ isUserExist, userInfofromServer }) => { //기존 유저?
          //uid가 db에 없는 경우만, sns 가입창 열기
          if (isUserExist !== true) { openSnsModal(true) }
          else { //기존 유저
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

  //카카오 로그인(24.07.24)
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
    console.log(user)
    dispatcher(setTempUser(user))
    findUser(userInfo, "kakao").then(({ isUserExist, userInfofromServer }) => { //기존 유저?
      if (isUserExist !== true) { openModal(true) } //신규
      else {
        dispatcher(setUser(userInfofromServer))
        window.alert(`${userInfofromServer.name}으로 로그인 되었습니다.`)
      } //기존
      setErr(null)
      setIsPending(false)
    }).catch((err) => {
      window.alert(err.code, err.message)
      setErr(err.message)
      setIsPending(false)
    })
  }
  // //카카오 로그인(24.01.21)
  // const KakaoLoginOnSuccess = (data, openModal) => {
  //   setErr(null)
  //   setIsPending(true)
  //   console.log(data.profile.id, typeof (data.profile.id))
  //   let user = {
  //     uid: String(data.profile.id),
  //     name: data.profile.kakao_account.profile.nickname,
  //     email: data.profile.kakao_account.email || "no-email",
  //     profileImg: data.profile.kakao_account.profile.profile_image_url || "no-image",
  //     phoneNumber: null
  //   }
  //   dispatcher(setTempUser(user))
  //   findUser(data, "kakao").then(({ isUserExist, userInfofromServer }) => { //기존 유저?
  //     if (isUserExist !== true) { openModal(true) } //신규
  //     else { dispatcher(setUser(userInfofromServer)) } //기존
  //     setErr(null)
  //     setIsPending(false)
  //   }).catch((error) => {
  //     window.alert(error.code, error.message)
  //     setErr(error.message)
  //     setIsPending(false)
  //   })
  // }
  return (
    { googleLogin, kakaoLogin, addUser, isPending, err, }
  )
}

export default useLogin