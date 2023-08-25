import React from 'react'
import styles from './Nav.module.css'
import { Link } from 'react-router-dom'
import useLogout from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Nav = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  console.log('Nav', user)

  return (
    <nav className={styles.nav}>
      <h2 className={styles.title}>호롤로 건강쌤 메인페이지</h2>
      <ul className={styles.list_nav}>
        {!user && <>
          <li><Link to='/login'>로그인</Link></li>
          <li><Link to='/signup'>가입하기</Link></li>
        </>}
        {user && <>
          <li><Link to='/'>메인 화면</Link></li>
          <li><Link to='/activities'>활동 관리</Link></li>
          <li><button type='button' onClick={logout}>로그아웃</button></li>
        </>}
      </ul>
    </nav>
  )
}

export default Nav