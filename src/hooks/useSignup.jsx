import { useState } from 'react'
import { appAuth } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useAuthContext } from './useAuthContext';

const useSignup = () => {
  const [err, setErr] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext();

  const signUp = (email, password, displayName) => {
    setErr(null)
    setIsPending(true)
    createUserWithEmailAndPassword(appAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (!user) {
          throw new Error('회원가입에 실패했습니다. 다시 시도해 주세요.')
        }

        updateProfile(user, { displayName }) //여기에 사진도 업데이트 가능
          .then(() => {
            setErr(null);
            setIsPending(false);
            dispatch({type: 'login', payload: user})
          }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage)
            setErr(errorMessage);
            setIsPending(false);
          })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
        setErr(errorMessage)
      });

  }
  return { err, isPending, signUp }
}

export default useSignup