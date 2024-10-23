import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//2024.10.21 생성
const useClassAuth = () => {
  const user = useSelector(({ user }) => { return user; })
  const thisClass = useSelector(({ classSelected }) => { return classSelected })
  const navigate = useNavigate();
  const [log, setLog] = useState('')
  useEffect(() => {
    if (user.uid !== thisClass.uid) {
      navigate(-1)
      setLog('인증된 담임교사만 사용 가능합니다.')
    }
  }, [])
  return { log }
}

export default useClassAuth