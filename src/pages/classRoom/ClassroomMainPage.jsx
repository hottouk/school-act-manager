//라이브러리
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { setAllSubjClasses } from '../../store/allClassesSlice';
import styled from 'styled-components';
//컴포넌트
import MainContainer from '../../components/Styled/MainContainer';
import MainWrapper from '../../components/Styled/MainWrapper';
import CardList from '../../components/List/CardList';
import SearchBar from '../../components/Bar/SearchBar';
import Title from '../../components/Title/Title';
import HorizontalBannerAd from '../../components/Ads/HorizontalBannerAd';
import HorizontalMobileAd from '../../components/Ads/HorizontalMobileAd';
import MainBtn from '../../components/Btn/MainBtn';
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity';
//hooks
import useFireClassData from '../../hooks/Firebase/useFireClassData';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import useMediaQuery from '../../hooks/useMediaQuery';
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
  const [subjKlassList, setSubjKlassList] = useState([]);
  const { homeroomKlassList, legacySubjList, legacyHomeList } = useMemo(() => {
    if (!klassListRtData) return { homeroomKlassList: [], legacySubjList: [], legacyHomeList: [] };
    const subj = [];
    const homeroom = [];
    const legacySubj = [];
    const legacyHome = [];
    klassListRtData.forEach(item => {
      const year = item.createdTime?.toDate?.().getFullYear();
      const isthisYear = year === 2026;
      if (item.type === "subject" && isthisYear) subj.push(item);
      else if (item.type === "homeroom" && isthisYear) homeroom.push(item);
      else if (item.type === "subject" && !isthisYear) legacySubj.push(item);
      else if (item.type === "homeroom" && !isthisYear) legacyHome.push(item);
    })
    setSubjKlassList(subj);
    return { homeroomKlassList: homeroom, legacySubjList: legacySubj, legacyHomeList: legacyHome };
  }, [klassListRtData]);
  useEffect(() => { dispatcher(setAllSubjClasses(subjKlassList)); }, [subjKlassList, dispatcher]);
  const [isOpen, setIsOpen] = useState(false);
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
  return (<MainContainer styles={{ gap: "10px" }}>
    {/* 교사 */}
    {isTeacher && <><MainWrapper >
      <SearchBar title="교과 클래스" type="classTitle" list={subjKlassList} setList={setSubjKlassList} isMobile={isMobile} />
      <CardList dataList={subjKlassList} type="subjKlass" onClick={handleSubjClassOnClick} />
      <SearchBar title="코티칭 클래스" />
      <CardList dataList={coTeachingList} type="subjKlass" onClick={handleCoTeachingOnClick} />
      {!isMobile ? <HorizontalBannerAd /> : <HorizontalMobileAd />}
      <SearchBar title="담임 클래스" />
      <CardList dataList={homeroomKlassList} type="homeroom" onClick={handleHomeroomOnClick} />
    </MainWrapper>
      {isMobile && <MainBtn onClick={() => navigate("/classrooms_setting", { state: { step: "first" } })}>클래스 생성하기</MainBtn>}
      <MainWrapper>
        <Row style={{ gap: "10px" }}>
          <Title>과거 클래스</Title>
          <p style={{ cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>{!isOpen ? "▼" : "▲"}</p>
        </Row>
        <AnimMaxHightOpacity isVisible={isOpen}>
          <SearchBar title="교과 클래스" />
          <CardList dataList={legacySubjList} type="subjKlass" onClick={handleSubjClassOnClick} />
          <SearchBar title="담임반 클래스" />
          <CardList dataList={legacyHomeList} type="homeroom" onClick={handleHomeroomOnClick} />
        </AnimMaxHightOpacity>
      </MainWrapper>
    </>
    }
  </MainContainer>)
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
export default ClassRoomMainPage