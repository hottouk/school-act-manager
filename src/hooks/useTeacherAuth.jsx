import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//2024.10.21 생성
const useTeacherAuth = () => {
  const user = useSelector(({ user }) => { return user; })
  const navigate = useNavigate();
  const [log, setLog] = useState('')
  useEffect(() => {
    if (user.isTeacher !== true) {
      navigate(-1)
      setLog('인증된 교사만 사용 가능합니다.')
    }
  }, [])
  return { log }
}

export default useTeacherAuth