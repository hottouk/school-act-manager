//라이브러리
import { useEffect, useState } from 'react'
import styled from 'styled-components'
//컴포넌트
import NoticeModal from '../../components/Modal/NoticeModal'
import HorizontalBannerAd from '../../components/Ads/HorizontalBannerAd'
//hooks
import useClientHeight from '../../hooks/useClientHeight'
import useMediaQuery from '../../hooks/useMediaQuery'
//이미지
import main from '../../image/main.png'
//24.07.20 -> 모바일감지(250213)
const ClassMain = () => {
  const [isShownNotice, setIsShownNotice] = useState(false) //공지사항
  useEffect(() => { fetchNotice(); }, [])
  const isMobile = useMediaQuery('(max-width: 768px)'); //화면 크기 감지
  const clientHeight = useClientHeight(document.documentElement)

  //------함수부------------------------------------------------  
  //공지사항
  const fetchNotice = () => {
    const noticeDismissed = localStorage.getItem("noticeDismissed")
    if (!noticeDismissed) { setIsShownNotice(true) } else {
      const now = new Date();
      const dismissedUntil = new Date(parseInt(noticeDismissed, 10));
      if (now > dismissedUntil) {
        localStorage.removeItem("noticeDismissed");
        setIsShownNotice(true);
      }
    }
  }

  //공지사항 없애기
  const handleDismiss = () => {
    setIsShownNotice(false)
    const now = new Date();
    const tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    localStorage.setItem("noticeDismissed", tmr.getTime());
  };

  return (<>
    {!isMobile && <Container $clientheight={clientHeight}>
      <LandingBg>
        <Wrapper>
          <h1>App For the Teacher, by the Teacher, of the Teacher</h1>
          <p>체계적 세특 관리, 쫑알이로 시작하자!</p>
          <LandingImage className='landing_img' src={main} alt="랜딩이미지" />
        </Wrapper>
      </LandingBg>
      <WhiteBg>
        <SubTitleText>{2407}명의 선생님, {234}명의 학생이 이용중!!</SubTitleText>
      </WhiteBg>
      <Row style={{ justifyContent: "center" }}>
        <HorizontalBannerAd />
      </Row>
      <BottomBg>
        <BibleText className='bible'>네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고 네 의를 빛 같이 나타내시며 네 공의를 정오의 빛 같이 하시리로다. 시편 37:5-6</BibleText>
      </BottomBg>
      <Row style={{ gridColumn: "2/3", justifyContent: "space-between", paddingTop: "10px" }}>
        <p style={{ color: "rgb(120,120,120)", margin: "0" }}>
          Copyright © 생기부쫑아리 All Rights Reserved. <br />
          사업자등록번호 등록중 | 통신판매신고 진행중 | 대표: 강건<br />
          과천시 과천대로 12가길 | 고객센터: 010-6554-4161
        </p>
        <Row style={{ gap: "20px", height: "fitContent" }}>
          <CopyRightText onClick={() => { alert("준비중 입니다.") }}>이용 약관</CopyRightText>
          <p> | </p>
          <CopyRightText onClick={() => { alert("준비중 입니다.") }}>개인정보 처리방침</CopyRightText>
        </Row>
      </Row>
    </Container>}
    {isMobile && <MobileContainer>
      <LandingBg $clientheight={clientHeight}>
        <h1>생기부쫑알이</h1>
        <LandingImage className='landing_img' src={main} alt="랜딩이미지" />
      </LandingBg>
      <WhiteBg>
        <SubTitleText>{2277}명의 선생님, {231}명의 학생이 이용중!!</SubTitleText>
      </WhiteBg>
      <Row style={{ justifyContent: "center" }}>
        <HorizontalBannerAd />
      </Row>
      <BottomBg>
        <BibleText className='bible'>네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고 네 의를 빛 같이 나타내시며 네 공의를 정오의 빛 같이 하시리로다. 시편 37:5-6</BibleText>
      </BottomBg>
      <Row style={{ flexDirection: "column", paddingTop: "10px" }}>
        <p style={{ color: "rgb(120,120,120)", margin: "0", textAlign: "center" }}>
          Copyright © 생기부쫑아리 All Rights Reserved. <br />
          사업자등록번호 등록중 | 통신판매신고 진행중 | 대표: 강건<br />
          과천시 과천대로 12가길 | 고객센터: 010-6554-4161
        </p>
        <Row style={{ gap: "20px", height: "fitContent", justifyContent: "center" }}>
          <CopyRightText onClick={() => { alert("준비중 입니다.") }}>이용 약관</CopyRightText>
          <p> | </p>
          <CopyRightText onClick={() => { alert("준비중 입니다.") }}>개인정보 처리방침</CopyRightText>
        </Row>
      </Row>
    </MobileContainer>}
    {/* 공지사항팝업 */}
    <NoticeModal
      show={isShownNotice}
      onHide={() => setIsShownNotice(false)}
      onDismissed={handleDismiss}
    />
  </>
  )
}

const Container = styled.div`
  display: grid;
  box-sizing: border-box;
  grid-template-columns:20% 60% 20%;
  grid-template-rows: 548px 120px 90px 1fr 1fr;
`
const MobileContainer = styled.div`
  overflow-y: scroll;
`
const Row = styled.div`
  display: flex;
  grid-column: 1/4;
`
const Wrapper = styled.div`
  margin: 0 auto;
`
const LandingBg = styled(Row)`
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #efefef;
  background-image: linear-gradient(to top, #499add, #3454d1);
  justify-content: center;
  @media(max-width: 768px) {
    position: relative;
    height: ${({ $clientheight }) => $clientheight / 100 * 55}px;
    justify-content: space-between;  
  }
`
const LandingImage = styled.img`
  float: right;
  width: 400px;
  position: relative;
  right: 20px;
  bottom: -12px;
  @media(max-width: 768px) {
    position: absolute;
    width: 300px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
`
const WhiteBg = styled(Row)`
  background-color: #efefef;
  padding-top: 10px;
  align-items: center;
`
const BottomBg = styled(Row)`
  background-color: #499add;
  color: #efefef;
  padding: 20px;
`
const SubTitleText = styled.h3`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  @media (max-width: 767px) {
    font-size: 20px;
    top: 0;
    margin: 5px;
    text-align: center;
  }
`
const BibleText = styled.p`
  width: 400px;
  margin: auto;
  text-align: center;
  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
  }
`
const CopyRightText = styled.p`
  color: rgb(120, 120, 120);
  margin: 0;
  cursor: pointer;
  text-decoration: underline;
`
export default ClassMain