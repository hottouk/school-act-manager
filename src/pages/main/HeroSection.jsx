import React from 'react'
import styled from 'styled-components'
//이미지
import landingImg from '../../image/landing/landingMain.png'
//생성(260203)
const HeroSection = ({ children }) => {
  return (
    <Section>
      <Header>교직의 즐거움,<br /> 쫑알이에서 시작됩니다</Header>
      {children}
      <LandingImg src={landingImg} alt="랜딩이미지" $children={children} />
    </Section >
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const Section = styled(Column)`
  height: 100dvh;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
  background-image: linear-gradient(to top, #499add, #3454d1);
`
const LandingImg = styled.img`
  width: 100%;
  margin-top: ${({ $children }) => $children ? "60px" : "130px"};
  @media(max-width: 768px) {
    width: 140%;
    margin-left: -40%;
    margin-bottom: 10%;
  }
`
const Header = styled.p`
  margin-top: 100px;
  font-size: 45px;
  font-weight: 500;
  line-height: 1.4;
  color: #efefef;
  text-align: center;
  @media(max-width: 768px) {
    font-size: 33px;
  }
`
export default HeroSection