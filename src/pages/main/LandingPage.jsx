//라이브러리
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
//컴포넌트
import HeroSection from './HeroSection'
import IntroSection from './IntroSection'
import HorizontalMobileAd from '../../components/Ads/HorizontalMobileAd'
import NoticeModal from '../../components/Modal/NoticeModal'
import SupplementInfoModal from '../../components/Modal/SupplementInfoModal'
//hooks
import useClientHeight from '../../hooks/useClientHeight'
import useMediaQuery from '../../hooks/useMediaQuery'
import { useFloatOnScroll } from '../../hooks/useFloatOnScroll';
//정비(240720) -> 모바일감지(250213) => 리모델링(260203)
const LandingPage = () => {
  const user = useSelector(({ user }) => user);
  const { ref: ref0, isVisible: v0 } = useFloatOnScroll();
  //모달
  const [isNoticeModal, setIsNoticeModal] = useState(false); //공지사항
  const [isSupplement, setIsSupplement] = useState(false);   //무결성
  useEffect(() => { fetchNotice(); checkUserInfo(); }, []);
  const isMobile = useMediaQuery('(max-width: 768px)'); //화면 크기 감지
  const clientHeight = useClientHeight(document.documentElement)
  //------함수부------------------------------------------------
  //중요 사항 체크
  const checkUserInfo = () => {
    const { isTeacher, studentNumber } = user;
    if (!isTeacher) {
      if (studentNumber) return
      alert("학번이 없습니다. 학번을 설정해주세요.");
      setIsSupplement(true);
    }
  }
  //공지사항
  const fetchNotice = () => {
    const noticeDismissed = localStorage.getItem("noticeDismissed")
    if (!noticeDismissed) { setIsNoticeModal(true) } else {
      const now = new Date();
      const dismissedUntil = new Date(parseInt(noticeDismissed, 10));
      if (now > dismissedUntil) {
        localStorage.removeItem("noticeDismissed");
        setIsNoticeModal(true);
      }
    }
  }
  //공지사항 없애기
  const handleDismiss = () => {
    setIsNoticeModal(false)
    const now = new Date();
    const tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    localStorage.setItem("noticeDismissed", tmr.getTime());
  };

  return (<>
    {!isMobile && <Container $clHi={clientHeight}>
      <HeroSection />
      <GraySection style={{ justifyContent: "center" }}>
        <SubHeader style={{ textAlign: "center" }}>{2682}명의 선생님, {287}명의 학생이 이용중!!<br />많은 교사의 선택에는 이유가 있습니다.<br /></SubHeader>
      </GraySection>
      <BibleSection>
        <BibleText ref={ref0} $visible={v0}>주 예수를 믿으라 그리하면 너와 네 집이 구원을 얻으리라 <br />사도행전 16:31</BibleText>
      </BibleSection>
      <IntroSection />
    </Container>}
    {isMobile && <MobileContainer>
      <HeroSection />
      <GraySection>
        <SubHeader>{2682}명의 선생님, {287}명의 학생이 이용중!!</SubHeader>
      </GraySection>
      <BibleSection>
        <BibleText className='bible'>네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고 네 의를 빛 같이 나타내시며 네 공의를 정오의 빛 같이 하시리로다. 시편 37:5-6</BibleText>
      </BibleSection>
      <Row style={{ justifyContent: "center" }}>
        <HorizontalMobileAd />
      </Row>
    </MobileContainer>}
    {/* 공지사항팝업 */}
    <NoticeModal
      show={isNoticeModal}
      onHide={() => setIsNoticeModal(false)}
      onDismissed={handleDismiss}
    />
    {/* 미달 정보 채우기 */}
    <SupplementInfoModal
      show={isSupplement}
      onHide={() => setIsSupplement(false)}>
    </SupplementInfoModal>
  </>
  )
}

const Container = styled.div`
  display: grid;
  box-sizing: border-box;
  grid-template-rows: ${({ $clHi }) => $clHi}px 400px 300px ${({ $clHi }) => $clHi * 1.2}px;
`
const MobileContainer = styled.div`
  overflow-y: scroll;
`
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const GraySection = styled(Column)`
  background-color: #efefef;
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
const BibleSection = styled(Column)`
  width: 100%;
  background-color: white;
  gap: 20px;
`
const BibleText = styled.p`
  width: 400px;
  color: #black;
  margin: auto;
  text-align: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(36px)')};
  transition: opacity 1500ms ease, transform 1200ms ease;
  will-change: opacity, transform;
  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
  }
`
export default LandingPage