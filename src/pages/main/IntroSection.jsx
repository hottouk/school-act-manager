import React from 'react'
import styled from 'styled-components'
//hooks
import { useFloatOnScroll } from '../../hooks/useFloatOnScroll';
//이미지
import subLanding1 from '../../image/landing/subLanding1.png'
import subLanding2 from '../../image/landing/subLanding2.png'
import subLanding3 from '../../image/landing/subLanding3.png'
//생성(260203)
const IntroSection = () => {
  const { ref: ref1, isVisible: v1 } = useFloatOnScroll();
  const { ref: ref2, isVisible: v2 } = useFloatOnScroll();
  const { ref: ref3, isVisible: v3 } = useFloatOnScroll();
  return (
    <Section style={{ padding: "20px", gap: "50px", justifyContent: "center" }}>
      <Header style={{ color: "#303030", textAlign: "left", margin: "0 auto", width: "60%" }}>What's special?</Header>
      <IntroRow ref={ref1} $visible={v1}>
        <IntroImg src={subLanding1} alt="랜딩이미지1" />
        <Column style={{ width: "100%", textAlign: "right" }}>
          <TitleText>😊과목별 세부능력 특기사항</TitleText>
          <SubHeader $textalign="right">원클릭 세특 입력기!</SubHeader>
          <Text $textalign="right">개별화 세특을 도장 찍듯이, 쾅쾅</Text>
        </Column>
      </IntroRow>
      <IntroRow ref={ref2} $visible={v2}>
        <Column style={{ width: "100%", textAlign: "left" }}>
          <TitleText>👌행동 발달 종합 의견</TitleText>
          <SubHeader>행발 작성도<br />키워드 중심으로<br />순식간에</SubHeader>
          <Text>키워드만 입력하면 <br />AI가 척척!</Text>
        </Column>
        <IntroImg src={subLanding2} alt="랜딩이미지2" $width="1000px" />
      </IntroRow>
      <IntroRow ref={ref3} $visible={v3}>
        <IntroImg src={subLanding3} alt="랜딩이미지3" $width="600px" />
        <Column style={{ width: "100%", textAlign: "right" }}>
          <TitleText>📚시험 출제</TitleText>
          <SubHeader $textalign="right" >시험 문제 초안도<br />프롬프트 고민 없이<br />한방에</SubHeader>
          <Text $textalign="right">no-prompt tool, <br />유형과 지문만 정해주세요</Text>
        </Column>
      </IntroRow>
    </Section>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const Section = styled(Column)`
  background-color: #efefef;
`
const Header = styled.p`
  margin-top: 100px;
  font-size: 45px;
  font-weight: 500;
  line-height: 1.4;
  color: #efefef;
  text-align: center;
`
const IntroRow = styled(Row)`
  width: 60%;
  margin: 0 auto 70px;
  align-items: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(36px)')};
  transition: opacity 1500ms ease, transform 1200ms ease;
  will-change: opacity, transform;
`
const IntroImg = styled.img`
  width: ${({ $width }) => $width || "400px"};
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  object-fit: cover;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 16px;
`
const TitleText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #3454d1 
`
const Text = styled.p`
  font-size: 22px;
  font-weight: 500;
  color: #787878;
`
const SubHeader = styled.h3`
  width: 100%;
  font-size: 32px;
  line-height: 1.4;
  font-weight: 500;
  @media (max-width: 767px) {
    font-size: 20px;
    top: 0;
    margin: 5px;
    text-align: center;
  }
`
export default IntroSection
