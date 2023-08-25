import { useState } from 'react'
import { signOut } from 'firebase/auth';
import { appAuth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';


const useLogout = () => {
  const [err, setErr] = useState(null);
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext();

  const logout = () => {
    setErr(null)
    setIsPending(true)

    signOut(appAuth).then(() => {
      setErr(null)
      setIsPending(false)

      dispatch({ type: 'logout' })
      console.log('useLogout', '로그아웃 되었습니다.')

    }).catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('로그아웃 실패', errorCode, errorMessage)
      setErr(errorMessage)
      setIsPending(false)
    })
  }

  return (
    { err, isPending, logout }
  )
}

export default useLogout