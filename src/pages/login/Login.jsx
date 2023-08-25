import React from 'react'
//로그인 관련
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode';
// import KakaoSocialLogin from './KakaoLogin';
//전역 변수 관련
// import KakaoCallback from './KakaoCallback';
import styles from './Login.module.css';
import { useState } from 'react';
import useLogin from '../../hooks/useLogin';


const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { isPending, err, login } = useLogin();


  const navigate = useNavigate()
  // KakaoCallback()

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
      <div>

        <GoogleLogin //구글 로그인 버튼
          onSuccess={(res) => {
            const loginInfo = jwtDecode(res.credential)
            navigate('/classMain/teacherGuid')
          }}
          onFailure={(err) => {
            console.log(err);
          }} />
        {/* <KakaoSocialLogin /> */}
      </div >
    </form>

  )
}

export default Login

