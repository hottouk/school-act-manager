import { useState } from 'react'
import { signOut } from 'firebase/auth';
import { appAuth } from '../firebase/config';
import { persistor } from '..'

const useLogout = () => {
  const [err, setErr] = useState(null);
  const [isPending, setIsPending] = useState(false)

  // 로그아웃에 사용
  const purge = async () => {
    await persistor.purge(); // persistStore의 데이터 전부 날림
  };
  const logout = () => {
    setErr(null)
    setIsPending(true)
    signOut(appAuth).then(() => {
      setErr(null)
      setIsPending(false)
      purge();
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