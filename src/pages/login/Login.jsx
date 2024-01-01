import React from 'react'
//전역 변수 관련
import styles from './Login.module.css';
import { useState } from 'react';
//hooks
import useLogin from '../../hooks/useLogin';
//css
import styled from 'styled-components';
import googleIcon from '../../image/icon/g-logo.png'

const StyledContainer = styled.div`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
`
const StyledSnsLoginDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 30px;
  align-items: center;
  margin: 0 auto;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  h2{
    text-align: center;
    width: 100%;
  }
`
const StyledGoogleLoginBtn = styled.button`
  background: white;
  color: #444;
  width: 190px;
  margin: 20px 0 auto;
  padding:5px;
  border: thin solid #888;
  border-radius: 5px;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
  cursor: pointer;
  img{
    width: 30px;
    height: 30px;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
`
const Login = () => {
  //1. 변수
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { err, isPending, loginWithEmail, googleLogin } = useLogin();

  //2. 함수
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
    loginWithEmail(email, password)
  }

  return (
    <StyledContainer>
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
      </form>
      <StyledSnsLoginDiv>
        <h2>SNS로 3초만에 로그인</h2>
        <StyledGoogleLoginBtn onClick={googleLogin}>
          <img src={googleIcon} alt='구글 로고' />구글 로그인
        </StyledGoogleLoginBtn>
      </StyledSnsLoginDiv>
    </StyledContainer>
  )
}

export default Login

