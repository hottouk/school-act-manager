//라이브러리
import React from 'react'
import { useState } from 'react';
import styled from 'styled-components';
//컴포넌트
import HeroSection from '../main/HeroSection';
import IntroSection from '../main/IntroSection';
import SignUpWithSnsModal from '../../components/Modal/SignUpWithSnsModal'
import KakaoSocialLogin from './KakaoLogin';
import TestLoginSection from './TestLoginSection';
//hooks
import useLogin from '../../hooks/useLogin';
//이미지
import googleIcon from '../../image/icon/g-logo.png'
import useMediaQuery from '../../hooks/useMediaQuery';
//생성(240221) -> 리모델링(260203)
const LoginPage = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { err, isPending, googleLogin, testLogin } = useLogin();
  //모달
  const [isSnsModal, setIsSnsModal] = useState(false);
  return (
    <Container>
      <HeroSection>
        {!isMobile && <TestLoginSection login={testLogin} />}
        <Column style={{ gap: "20px" }}>
          {/* 구글 로그인 */}
          <GoogleLoginBtn onClick={() => { googleLogin((open) => { setIsSnsModal(open) }) }}>
            <img src={googleIcon} alt="구글 로고" />구글 로그인
          </GoogleLoginBtn>
          {/* 카카오 */}
          <KakaoSocialLogin openModal={setIsSnsModal} />
        </Column>
        {isPending && <strong style={{ color: "white" }}>로그인 중 입니다.</strong>}
        {err && <strong>{err}</strong>}
      </HeroSection>
      <IntroSection isMobile={isMobile} />
      {/* 모달 */}
      {isSnsModal && <SignUpWithSnsModal
        show={isSnsModal}
        backdrop="static"
        onHide={() => setIsSnsModal(false)}
      />}
    </Container >
  )
}
const Container = styled.div`
  box-sizing: border-box;
  @media screen and (max-width: 767px){
    width: 100%;
    margin: auto;
  }
`
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const GoogleLoginBtn = styled.button`
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
  @media screen and (max-width: 767px){ display: none; }
`
export default LoginPage

