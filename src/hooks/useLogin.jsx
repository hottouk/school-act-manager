//라이브러리
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { appAuth } from '../firebase/config'
//redux
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice'
import useFirestore from './useFirestore';
import { setTempUser } from '../store/tempUserSlice';

const useLogin = () => {
  const [err, setErr] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const dispatcher = useDispatch()
  const { findUser } = useFirestore('user')

  //구글 팝업 로그인(24.01.14)
  const googleLogin = (openSnsModal) => {
    setErr(null)
    setIsPending(true)
    const provider = new GoogleAuthProvider();
    const loginInfo = signInWithPopup(appAuth, provider)
      .then((userCredential) => {
        const user = userCredential.user
        console.log('구글 로그인 유저 정보', user)
        dispatcher(setTempUser(user))
        setErr(null)
        setIsPending(false)
        findUser(user, "google").then((userExist) => { //기존 유저인지 검사
          if (userExist !== true) {//uid가 db에 없는 경우만, 즉 처음 접속하는 경우
            openSnsModal(true)     //sns 가입창 열기
          }
          else { //기존 유저라면 유저 정보 전역변수에 저장
            dispatcher(setUser(user))
          }
        })
      }).catch((error) => {
        window.alert.error(error.code, error.message)
        setErr(error.message)
        setIsPending(false)
      })
    return loginInfo
  }

  const KakaoLoginOnSuccess = (data, openModal) => {
    setErr(null)
    setIsPending(true)
    let user = {
      uid: data.profile.id,
      name: data.profile.kakao_account.profile.nickname,
      email: data.profile.kakao_account.email,
      profileImg: data.profile.kakao_account.profile.profile_image_url
    }
    dispatcher(setTempUser(user))
    setErr(null)
    setIsPending(false)
    findUser(data, "kakao").then((userExist) => {
      if (userExist !== true) {//uid가 db에 없는 경우만, 즉 처음 접속하는 경우
        openModal(true)
      }
      else { //기존 유저라면 유저 정보 전역변수에 저장
        dispatcher(setUser(user))
      }
    }).catch((error) => {
      window.alert(error.code, error.message)
      setErr(error.message)
      setIsPending(false)
    })
  }

  //이메일 로그인
  const loginWithEmail = (email, password) => {
    setErr(null)
    setIsPending(true)
    signInWithEmailAndPassword(appAuth, email, password).then((userCredential) => {
      const user = userCredential.user
      setErr(null)
      setIsPending(false)
      console.log('로그인 유저 정보', user)
      if (!user) {
        setIsPending(false)
        throw new Error('로그인에 실패했습니다. 다시 시도해주세요.')
      }
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage)
      setErr(errorMessage)
      setIsPending(false)
    })
  }

  return (
    { err, isPending, loginWithEmail, googleLogin, KakaoLoginOnSuccess }
  )
}

export default useLogin