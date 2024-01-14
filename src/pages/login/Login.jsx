import React from 'react'
//전역 변수 관련
import { useState } from 'react';
//hooks
import useLogin from '../../hooks/useLogin';
//css
import styled from 'styled-components';
import googleIcon from '../../image/icon/g-logo.png'
import SignUpWithSnsModal from '../../components/Modal/SignUpWithSnsModal';
import KakaoLogin from 'react-kakao-login';

const Login = () => {
  //1. 변수
  const { err, isPending, googleLogin, KakaoLoginOnSuccess } = useLogin();
  //모달창
  const [isSnsModalShow, setIsSnsModalShow] = useState(false)

  return (
    <StyledContainer>
      <StyledSnsLoginDiv>
        <h3>SNS로 3초만에 가입/로그인</h3>
        <div className='sns_centered'>
          <StyledGoogleLoginBtn onClick={() => { googleLogin((open) => { setIsSnsModalShow(open) }) }}>
            <img src={googleIcon} alt='구글 로고' />구글 로그인
          </StyledGoogleLoginBtn>
          <KakaoLogin
            token={process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}
            onSuccess={(data) => { KakaoLoginOnSuccess(data, (open) => { setIsSnsModalShow(open) }) }}
            onFail={(error) => { window.alert(error) }} />
        </div>
      </StyledSnsLoginDiv>
      {isPending && <strong>로그인이 진행중입니다.</strong>}
      {err && <strong>{err}</strong>}
      <SignUpWithSnsModal
        show={isSnsModalShow}
        onHide={() => setIsSnsModalShow(false)}
      />
    </StyledContainer >
  )
}
const StyledContainer = styled.div`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
  @media screen and (max-width: 767px){
    width: 100%;
    margin: auto;
  }
`
const StyledSnsLoginDiv = styled.div`
  max-width: 540px;
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 30px;
  align-items: center;
  margin: 20px auto;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  .sns_centered {
    button {
      width: 222px;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 70%;
  }
  h3 {
    color: #3454d1;
    font-weight: bold;
    text-align: center;
    width: 100%;
  }
  @media screen and (max-width: 767px){
    width: 100%;
    height: 320px;
    margin: auto;
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
export default Login

