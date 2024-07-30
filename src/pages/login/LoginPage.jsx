//라이브러리
import React from 'react'
import { useState } from 'react';
//컴포넌트
import SignUpWithSnsModal from '../../components/Modal/SignUpWithSnsModal'
import SignUpWithEmailModal from '../../components/Modal/SignUpWithEmailModal'
//hooks
import useLogin from '../../hooks/useLogin';
//이미지
import googleIcon from '../../image/icon/g-logo.png'
import mainLogo from '../../image/logo.png'
//css
import styled from 'styled-components';
import KakaoSocialLogin from './KakaoLogin';
import EmailLogin from './EmailLogin';

//24.2.21
const LoginPage = () => {
  //1. 변수
  const { err, isPending, emailMsg, googleLogin, emailLogin } = useLogin();
  //모달
  const [isSnsModalShow, setIsSnsModalShow] = useState(false)
  const [isEmailModalShow, setIsEmailModalShow] = useState(false)

  return (
    <StyledContainer>
      <StyledSnsLoginDiv>
        <h3>생기부 쫑알이</h3>
        <StyledLogo src={mainLogo} alt="메인 로고" />
        <EmailLogin openEmailModal={setIsEmailModalShow} login={emailLogin} emailMsg={emailMsg} />
      </StyledSnsLoginDiv>
      <StyledSnsLoginDiv>
        <div className="sns_centered">
          {/* 구글 로그인 */}
          <StyledGoogleLoginBtn onClick={() => { googleLogin((open) => { setIsSnsModalShow(open) }) }}>
            <img src={googleIcon} alt="구글 로고" />구글 로그인
          </StyledGoogleLoginBtn>
          {/* 카카오 */}
          <KakaoSocialLogin openModal={setIsSnsModalShow} />
        </div>
        {isPending && <strong>로그인 중 입니다.</strong>}
        {err && <strong>{err}</strong>}
      </StyledSnsLoginDiv>
      <p>본 App은 PC 크롬에 최적화 되어 있습니다.</p>
      {/* 모달창 */}
      {isSnsModalShow && <SignUpWithSnsModal
        show={isSnsModalShow}
        backdrop="static"
        onHide={() => setIsSnsModalShow(false)}
      />}
      {isEmailModalShow && <SignUpWithEmailModal
        show={isEmailModalShow}
        backdrop="static"
        onHide={() => setIsEmailModalShow(false)}
      />}
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
  p {
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
  }
`

const StyledSnsLoginDiv = styled.div`
  position: relative;
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
      width: 183px;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 70%;
    margin-bottom: 0;
  }
  h3 {
    color: #3454d1;
    font-weight: bold;
    text-align: center;
    width: 100%;
  }
  p {
    margin-top: 12px;
    color: #3454d1;
    font-size: 14px;
  }
  @media screen and (max-width: 767px){
    width: 100%;
    margin: auto;
    border: none;
    box-shadow: none;
    .sns_centered {
      margin: 20px auto; 
    }
    h3 {
      color: #3454d1;
      font-size: 14px;
      text-align: center;
      width: 100%;
    }
  }
`

const StyledLogo = styled.img`
  position: absolute;
  width: 80px;
  top: 0;
  right: 4px;
`
const StyledGoogleLoginBtn = styled.button`
  background: white;
  color: #444;
  padding:5px;
  border: thin solid #888;
  border-radius: 5px;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
  cursor: pointer;
  img {
    width: 30px;
    height: 30px;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
  }
  @media screen and (max-width: 767px){
    display: none;
  }
`
export default LoginPage

