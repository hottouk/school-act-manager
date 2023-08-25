import { signInWithEmailAndPassword } from 'firebase/auth'
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
    console.log(`${user.displayName}으로 로그인 되었습니다.`)

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
  { err, isPending, login }
)
}

export default useLogin