//라이브러리
import React from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
//컴포넌트
import HeroSection from '../main/HeroSection';
import IntroSection from '../main/IntroSection';
import BibleSection from '../main/BibleSection';
import SignUpWithSnsModal from '../../components/Modal/SignUpWithSnsModal'
import KakaoSocialLogin from './KakaoLogin';
import TestLoginSection from './TestLoginSection';
//hooks
import useLogin from '../../hooks/useLogin';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useFloatOnScroll } from '../../hooks/useFloatOnScroll';
//이미지
import googleIcon from '../../image/icon/g-logo.png'
import wordMonHeronImg from '../../image/landing/wordmonHero.png'
import wordMonHeroMobileImg from '../../image/landing/wordMobile.png'
//생성(240221) -> 리모델링(260203)
const LoginPage = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { err, isPending, googleLogin, testLogin } = useLogin();
  const { ref: ref1, isVisible: v1, } = useFloatOnScroll({ threshold: 0.75 });
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
          <KakaoSocialLogin setIsSnsModal={setIsSnsModal} />
        </Column>
        {isPending && <strong style={{ color: "white" }}>로그인 중 입니다.</strong>}
        {err && <strong>{err}</strong>}
      </HeroSection>
      <BibleSection
        text="주 예수를 믿으라 그리하면 너와 네 집이 구원을 얻으리라" from="사도행전 16:31"
        backgroundColor="#efefef" />
      <WordMonsterSection>
        <WordmonLandingWrapper ref={ref1} $visible={v1}>
          <WordmonLandingImg src={isMobile ? wordMonHeroMobileImg : wordMonHeronImg} alt="워드몬 히어로 이미지" />
          <GameBtnWrapper>
            <GameBtn to="/quiz_public">학습 하기</GameBtn>
            <GameBtn to="/quiz_game">게임 하기</GameBtn>
          </GameBtnWrapper>
        </WordmonLandingWrapper>
      </WordMonsterSection>
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
const WordMonsterSection = styled(Column)`
  width: 100%;
`
const WordmonLandingWrapper = styled.div`
  position: relative;
  width: 100%;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 2000ms ease;
  will-change: opacity;
`
const WordmonLandingImg = styled.img`
  display: block;
  width: 100%;
  filter: brightness(0.75) saturate(0.85);
  opacity: 0.85;
`
const GameBtnWrapper = styled(Column)`
  position: absolute;
  width: 15%;
  top: 75%;
  left: 50%;
  gap: 20px;
  @media(max-width: 768px) {
    top: 70%;
    gap: 10px;
    width: 30%;
  }
`
const GameBtn = styled(Link)`
  text-align: center;
  transform: translate(-50%, -50%);
  padding: 14px 28px;
  border-radius: 999px;
  background: #3454d1;
  color: white;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.24);
  transition: transform 180ms ease, background 180ms ease;
  &:hover {
    background: #243ca3;
    transform: translate(-50%, -50%) scale(1.04);
  }
  @media(max-width: 768px) {
    padding: 10px 18px;
    font-size: 15px;
  }
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
`
export default LoginPage

