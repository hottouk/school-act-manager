import React from 'react'
import styles from './Nav.module.css'
import { Link } from 'react-router-dom'
import useLogout from '../hooks/useLogout'
import { useSelector } from 'react-redux'

const Nav = () => {
  const { logout } = useLogout();
  const user = useSelector(({ user }) => { return user })
  console.log('Nav', user)

  return (
    <nav className={styles.nav}>
      <h2 className={styles.title}>호롤로 건강쌤 메인페이지</h2>
      <ul className={styles.list_nav}>
        {!user.uid && <>
          <li><Link to='/login'>로그인</Link></li>
          <li><Link to='/signup'>가입하기</Link></li>
        </>}
        {user.uid && <>
          <li>{user.displayName}선생님 환영합니다.</li>
          <li><Link to='/'>메인 화면</Link></li>
          <li><Link to='/activities'>활동 관리</Link></li>
          <li><Link to='/classRooms'>클래스 관리</Link></li>
          <li><button type='button' onClick={logout}>로그아웃</button></li>
          <li><img alt='이미지 없음.' src={user.photoURL} /></li>
        </>}
      </ul>
    </nav>
  )
}

export default Nav