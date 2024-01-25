//라이브러리
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
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
        const user = { name: userCredential.user.displayName, ...userCredential.user }
        dispatcher(setTempUser(user))
        findUser(user, "google").then(({ isUserExist, userInfofromServer }) => { //기존 유저인지 검사
          if (isUserExist !== true) {//uid가 db에 없는 경우만, 즉 처음 접속하는 경우
            openSnsModal(true)     //sns 가입창 열기
          }
          else { //기존 유저라면 유저 정보 전역변수에 저장
            console.log(userInfofromServer)
            dispatcher(setUser(userInfofromServer))
            window.confirm(`${userInfofromServer.name}으로 로그인 되었습니다.`)
          }
        })
        setErr(null)
        setIsPending(false)
      }).catch((error) => {
        window.alert.error(error.code, error.message)
        setErr(error.message)
        setIsPending(false)
      })
    return loginInfo
  }

  //카카오 로그인(24.01.21)
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
    findUser(data, "kakao").then(({ isUserExist, userInfofromServer }) => {
      if (isUserExist !== true) {//uid가 db에 없는 경우만, 즉 처음 접속하는 경우
        openModal(true)
      }
      else { //기존 유저라면 유저 정보 전역변수에 저장
        dispatcher(setUser(userInfofromServer))
      }
      setErr(null)
      setIsPending(false)
    }).catch((error) => {
      window.alert(error.code, error.message)
      setErr(error.message)
      setIsPending(false)
    })
  }

  return (
    { err, isPending, googleLogin, KakaoLoginOnSuccess }
  )
}

export default useLogin