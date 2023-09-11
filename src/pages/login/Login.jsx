import React from 'react'
//로그인 관련
import KakaoSocialLogin from './KakaoLogin';
//전역 변수 관련
import styles from './Login.module.css';
import { useState } from 'react';
import useLogin from '../../hooks/useLogin';


const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { isPending, err, login, googleLogin } = useLogin();

  const handleOnChange = (event) => {
    if (event.target.type === 'email') {
      setEmail(event.target.value)
    } else if (event.target.type === 'password') {
      setPassword(event.target.value)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(email, password)
    login(email, password)
  }

  return (
    <form className={styles.login_form} onSubmit={handleSubmit}>
      <fieldset>
        <legend>로그인</legend>

        <label htmlFor='myEmailId'>Email ID</label>
        <input type='email' id='myEmailId' onChange={handleOnChange} value={email} required />

        <label htmlFor='myPassword'>비밀번호</label>
        <input type='password' id='myPassword' onChange={handleOnChange} value={password} required />

        {!isPending && <button className={styles.btn} type='submit'>로그인</button>}
        {isPending && <strong>로그인이 진행중입니다.</strong>}
        {err && <strong>{err}</strong>}
      </fieldset>
      <div className='google_login'>
        <button className={styles.google_btn} onClick={googleLogin}>
          <span className={styles.google_icon}></span>
          구글 로그인</button>
      </div >
    </form>

  )
}

export default Login

