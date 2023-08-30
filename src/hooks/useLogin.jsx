import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { appAuth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

const useLogin = () => {
  const [err, setErr] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext();

  const login = (email, password) => {
    setErr(null)
    setIsPending(true)

    signInWithEmailAndPassword(appAuth, email, password).then((userCredential) => {
      const user = userCredential.user
      setErr(null)
      setIsPending(false)
      dispatch({ type: 'login', payload: user })
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

  const googleLogin = () => {
    setErr(null)
    setIsPending(true)

    const provider = new GoogleAuthProvider();
    signInWithPopup(appAuth, provider)
      .then((userCredential) => {
        const user = userCredential.user
        setErr(null)
        setIsPending(false)
        dispatch({ type: 'login', payload: user })
        console.log('구글 로그인 유저 정보', user)

      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
        setErr(errorMessage)
        setIsPending(false)
      })
  }

  return (
    { err, isPending, login, googleLogin }
  )
}

export default useLogin