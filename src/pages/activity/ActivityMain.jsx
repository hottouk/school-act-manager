//라이브러리
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
//컴포넌트
import MainContainer from '../../components/Styled/MainContainer'
import MainWrapper from '../../components/Styled/MainWrapper'
import SearchBar from '../../components/Bar/SearchBar'
import HorizontalBannerAd from '../../components/Ads/HorizontalBannerAd'
import HorizontalMobileAd from '../../components/Ads/HorizontalMobileAd'
import CardList from '../../components/List/CardList'
import Pagenation from '../../components/Pagenation'
//hooks
import useTeacherAuth from '../../hooks/useTeacherAuth'
import useFetchRtActiData from '../../hooks/RealTimeData/useFetchRtActiData'
import useFireUserData from '../../hooks/Firebase/useFireUserData'
import useMediaQuery from '../../hooks/useMediaQuery'
import MainBtn from '../../components/Btn/MainBtn'
//과목 업데이트(240937) -> 코드 정리 및 담임반 섹션 추가(241218) -> 디자인 수정(251106) -> 코드 분화(260212)
const ActivityMain = () => { //진입 경로 총 2곳: 교사/학생
  //교사 인증
  const { log } = useTeacherAuth();
  if (log) { window.alert(log) }
  const user = useSelector(({ user }) => user);
  const navigate = useNavigate();
  //내 활동, 업어온 활동
  const { fetchCopiesData } = useFireUserData();
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCopiesData();
      setCopiedList(data);
    }
    fetchData();
  }, [fetchCopiesData]);
  //실시간 활동 정보
  const { subjActiList, homeActiList, quizActiList } = useFetchRtActiData(user?.uid);
  const [mySubjActiList, setMySubjActiList] = useState([]);
  const [myHomeActiList, setMyHomeActiList] = useState([]);
  const [copiedList, setCopiedList] = useState([]);
  useEffect(() => {
    setMySubjActiList(subjActiList);
    setMyHomeActiList(homeActiList);
  }, [subjActiList, homeActiList, quizActiList]);
  //페이지네이션
  const itemsPerPage = 30;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState(mySubjActiList?.slice(0, itemsPerPage));
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    setPageData(mySubjActiList?.slice(start, end));
  }, [currentPage, mySubjActiList]);
  //모바일
  const isMobile = useMediaQuery('(max-width: 768px)');
  //**함수부**
  //활동 클릭
  const handleActiOnClick = (item) => {
    if (item.subject === "담임") { navigate(`/activities/${item.id}?sort=homeroom`, { state: { acti: item } }) }  //담임
    else if (item.monster) { navigate(`/activities_setting_quiz`, { state: { ...item } }) }                       //퀴즈
    else { navigate(`/activities/${item.id}?sort=subject`, { state: { acti: item } }) }                           //교과
  }
  return (
    <MainContainer>
      {/* 교사: 활동관리 - 나의활동 */}
      {user.isTeacher && <MainWrapper>
        <SearchBar title="교과 활동" type="title" list={mySubjActiList} setList={setMySubjActiList} isMobile={isMobile} />
        <CardList dataList={mySubjActiList} type="activity" onClick={handleActiOnClick} />
        <SearchBar title="담임반 활동" />
        <CardList dataList={myHomeActiList} type="activity" onClick={handleActiOnClick} />
        <SearchBar title="업어온 활동" />
        <CardList dataList={copiedList} type="copiedActi" onClick={(item) => { navigate(`/activities/${item.id}`, { state: { acti: item } }) }} />
        {!isMobile ? <HorizontalBannerAd /> : <HorizontalMobileAd />}
      </MainWrapper>}
      {isMobile && <MainBtn styles={{ margin: "10px 0 0 0" }} onClick={() => navigate("/activities_setting")}>활동 생성</MainBtn>}
    </MainContainer>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
export default ActivityMain