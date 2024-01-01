//라이브러리
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { appAuth } from '../firebase/config'
//redux
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice'
import { useNavigate } from 'react-router-dom';
import useFirestore from './useFirestore';

const useLogin = () => {
  const [err, setErr] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const dispatcher = useDispatch()
  const navigate = useNavigate()
  const { findUser } = useFirestore('users')

  //구글 팝업 로그인
  const googleLogin = () => {
    setErr(null)
    setIsPending(true)
    const provider = new GoogleAuthProvider();
    const loginInfo = signInWithPopup(appAuth, provider)
      .then((userCredential) => {
        const user = userCredential.user
        setErr(null)
        setIsPending(false)
        console.log('구글 로그인 유저 정보', user)
        dispatcher(setUser(user)) //Redux 전역변수화
        findUser(user).then((userExist) => { //uid가 db에 없는 경우만
          if (!userExist) {
            navigate('/signUpWithSNS')
          }
        })
      }).catch((error) => {
        console.error(error.code, error.message)
        setErr(error.message)
        setIsPending(false)
      })
    return loginInfo
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
    { err, isPending, loginWithEmail, googleLogin }
  )
}

export default useLogin