//라이브러리
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { setAllSubjClasses } from '../../store/allClassesSlice';
import styled from 'styled-components';
//컴포넌트
import CardList from '../../components/List/CardList';
import SearchBar from '../../components/Bar/SearchBar';
import Title from '../../components/Title/Title';
import HorizontalBannerAd from '../../components/Ads/HorizontalBannerAd';
import HorizontalMobileAd from '../../components/Ads/HorizontalMobileAd';
import MainWrapper from '../../components/Styled/MainWrapper';
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity';
//hooks
import useFireClassData from '../../hooks/Firebase/useFireClassData';
import useClientHeight from '../../hooks/useClientHeight';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import useMediaQuery from '../../hooks/useMediaQuery';
import MainContainer from '../../components/Styled/MainContainer';
//수정(240918) -> 학생 파트 수정(250121) -> 코티칭(250218) -> 디자인(251108)
const ClassRoomMainPage = () => {
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const { klassListRtData, klassListDataListener } = useFireClassData();
  const { userRtData, userDataListener } = useFireUserData();
  //유저
  useEffect(() => userDataListener(), []);
  //교실
  useEffect(() => { klassListDataListener(userRtData?.uid); }, [userRtData?.uid, klassListDataListener]);
  const { isTeacher = false, coTeachingList = [] } = userRtData || {};
  const isMobile = useMediaQuery("(max-width: 767px)");
  //교사용 교실
  const { subjKlassList, homeroomKlassList, legacyList } = useMemo(() => {
    if (!klassListRtData) return { subjKlassList: [], homeroomKlassList: [], legacyList: [] };
    const subj = [];
    const homeroom = [];
    const legacy = [];
    klassListRtData.forEach(item => {
      const year = item.createdTime?.toDate?.().getFullYear();
      const isthisYear = year === 2026;
      if (item.type === "subject" && isthisYear) subj.push(item);
      else if (item.type === "homeroom" && isthisYear) homeroom.push(item);
      else if (!isthisYear) legacy.push(item);
    })
    return { subjKlassList: subj, homeroomKlassList: homeroom, legacyList: legacy };
  }, [klassListRtData]);
  useEffect(() => { dispatcher(setAllSubjClasses(subjKlassList)); }, [subjKlassList, dispatcher]);
  const [isOpen, setIsOpen] = useState(false);
  //모니터 높이
  const clientHeight = useClientHeight(document.documentElement);
  //**함수**
  //교과반 이동
  const handleSubjClassOnClick = (item) => navigate(`/classrooms/${item.id}`, { state: { ...item } });
  //담임반 이동
  const handleHomeroomOnClick = (item) => navigate(`/homeroom/${item.id}`);
  //코티칭 클릭
  const handleCoTeachingOnClick = (item) => {
    if (item.isApproved) { navigate(`/classrooms/${item.id}`, { state: { ...item } }) }
    else { alert("승인 대기중 입니다."); }
  }
  //가입 신청, 승인 클래스 분류
  return (<MainContainer>
    {/* 교사 */}
    {isTeacher && <><MainWrapper styles={{ margin: "20px 0" }}>
      <SearchBar title="교과 클래스" type="classroom" list={subjKlassList} setList={() => { }} isMobile={isMobile} />
      <CardList dataList={subjKlassList} type="classroom" onClick={handleSubjClassOnClick} />
      <SearchBar title="코티칭 클래스" />
      <CardList dataList={coTeachingList} type="classroom" onClick={handleCoTeachingOnClick} />
      {!isMobile ? <HorizontalBannerAd /> : <HorizontalMobileAd />}
      {!isMobile && <SearchBar title="담임 클래스" />}
      {!isMobile && <CardList dataList={homeroomKlassList} type="homeroom" onClick={handleHomeroomOnClick} />}
    </MainWrapper>
      <MainWrapper>
        <Row style={{ gap: "10px" }}>
          <Title>과거 클래스</Title>
          <p style={{ cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>{!isOpen ? "▼" : "▲"}</p>
        </Row>
        <AnimMaxHightOpacity isVisible={isOpen}>
          <CardList dataList={legacyList} type="classroom" onClick={handleSubjClassOnClick} />
        </AnimMaxHightOpacity>
      </MainWrapper>
    </>
    }
    {/* 학생 */}
    {!isTeacher && <MainWrapper>
      {/* <SearchBar title="가입 신청 중인 클래스" />
      <CardList dataList={appplyKlass} type="classroom" onClick={() => alert("교사 승인 대기중입니다.")} />
      <SearchBar title="나의 클래스" />
      <CardList dataList={myKlass} type="classroom" onClick={handleSubjClassOnClick} /> */}
    </MainWrapper>}
  </MainContainer>)
}
//학생용 교실
// const { myKlass, appplyKlass } = useMemo(() => {
//   if (!userRtData || !isTeacher) return { myKlass: [], appplyKlass: [] };
//   const approved = [];
//   const applied = [];
//   const sortStudentKlass = (list) => {
//     const approved = [];
//     const applied = [];
//     list?.forEach((item) => {
//       if (item.isApproved) approved.push(item)
//       else applied.push(item)
//     })
//   }
//   return { myKlass: [], appplyKlass: [] };
//   // dispatcher(setAllSubjClasses(approved)) //전역 변수화
// }, [userRtData]);
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
export default ClassRoomMainPage