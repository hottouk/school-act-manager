//라이브러리
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
//컴포넌트
import NoticeModal from '../../components/Modal/NoticeModal'
import InfluencerList from '../../components/List/InfluencerList'
import HorizontalBannerAd from '../../components/Ads/HorizontalBannerAd'
//hooks
import useFetchRtAllUserData from '../../hooks/RealTimeData/useFetchRtAllUserData'
import useClientHeight from '../../hooks/useClientHeight'
//이미지
import main from '../../image/main.png'
import useMediaQuery from '../../hooks/useMediaQuery'

//24.07.20 -> 모바일감지(250213)
const ClassMain = () => {
  const { teacherList, studentList, useFetchRtUserErr, sortByLikedCount } = useFetchRtAllUserData() //실시간 구독
  const [influList, setInfluList] = useState([]);
  useEffect(() => {
    setInfluList(sortByLikedCount())
    if (useFetchRtUserErr) console.log(useFetchRtUserErr)
  }, [teacherList])
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

  return (
    <Container $clientheight={clientHeight}>
      <LandingBackground>
        <StyledWrapper>
          <h1>App For the Teacher, by the Teacher, of the Teacher</h1>
          <p>체계적 세특 관리를 돕는 툴입니다.</p>
          <img className='landing_img' src={main} alt="랜딩이미지" />
        </StyledWrapper>
      </LandingBackground>
      <StyledWhiteBackground>
        {!isMobile && <InfluencerList dataList={influList || []} />}
        <StyledWrapper>
          <h3>{teacherList.length}명의 선생님, {studentList.length}명의 학생이 이용중!!</h3>
          <span>GPT로 세특쓰기, 이제는 나도 할 수 있다!!! 절찬리 판매중!!</span>
        </StyledWrapper>
      </StyledWhiteBackground>
      <StyledBlueBackground>
        <StyledWrapper>
          <p className='bible'>네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고 네 의를 빛 같이 나타내시며 네 공의를 정오의 빛 같이 하시리로다. 시편 37:5-6</p>
        </StyledWrapper>
      </StyledBlueBackground>
      <Row><HorizontalBannerAd /></Row>
      {/* 공지사항팝업 */}
      <NoticeModal
        show={isShownNotice}
        onHide={() => setIsShownNotice(false)}
        onDismissed={handleDismiss}
      />
    </Container>
  )
}

const Container = styled.div`
  box-sizing: border-box;
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    marign: 0;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const StyledWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  @media (max-width: 767px) {
    width: 100%;
  }
`
const Row = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
  }
`
const LandingBackground = styled.div`
  width: 100%;
  height: 550px;
  padding: 20px;
  color: #efefef;
  background-image: linear-gradient(to top, #499add, #3454d1);
  h1 {
    display: inline-block;
  }
  .landing_img {
    float: right;
    width: 400px;
    position: relative;
    right: 20px;
    bottom: -12px;
  }
  @media screen and (max-width: 768px) {
    position: relative;
    p { display: none; }
    .landing_img{
      position: absolute;
      width: 300px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
  }
`
const StyledWhiteBackground = styled.div`
  background-color: #efefef;
  height: 360px;
  h3, span {
    position: relative;
    top: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 767px) {
    height: 130px;
    display: flex;
    align-items: center;
    span {
      display: none;
    }
    h3 {
      font-size: 20px;
      top: 0;
      display: block;
      margin: 3px;
      text-align: center;
    }
  }
`
const StyledBlueBackground = styled.div`
  height: 100px;
  background-color: #499add;
  color: #efefef;
  padding: 20px;
  p.bible {
    width: 400px;
    margin: auto;
    text-align: center;
  }
  h3{
    width: 800px;
    margin: 10px auto;
    text-align: center;
  }
  p {
    margin-top: 10px;
  }
  
  @media screen and (max-width: 767px) {
    p.bible{
      width: 100%;
      font-size: 14px;
    }
    h3 {
      width: 100%;
    }
  }
`
export default ClassMain