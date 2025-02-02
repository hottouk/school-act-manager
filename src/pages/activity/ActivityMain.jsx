//라이브러리
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
//컴포넌트
import HorizontalBannerAd from '../../components/Ads/HorizontalBannerAd'
import CardList from '../../components/List/CardList'
import MainBtn from '../../components/Btn/MainBtn'
import TabBtn from '../../components/Btn/TabBtn'
import SearchBar from '../../components/Bar/SearchBar'
//hooks
import useTeacherAuth from '../../hooks/useTeacherAuth'
import useClientHeight from '../../hooks/useClientHeight'
import useFetchFireData from '../../hooks/Firebase/useFetchFireData'
import useFetchRtActiData from '../../hooks/RealTimeData/useFetchRtActiData'
//데이터
import { subjectGroupList } from '../../data/subjectGroupList'
//css
import styled from 'styled-components'
//todo 영어 퀴즈 활동 실시간 구독 시 초기화 안되어서 하나씩 추가됨.
//24.09.37 subjList update -> 24.12.18 코드 정리 및 담임반 섹션 추가
const ActivityMain = () => { //진입 경로 총 3곳: 교사 2(활동 관리 - 나의 활동, 활동 관리 - 전체 활동)
  //교사 인증
  const { log } = useTeacherAuth();
  if (log) { window.alert(log) }
  const user = useSelector(({ user }) => user)
  const navigate = useNavigate()
  //활동관리-전체 활동 선택된 과목
  const [selectedSubj, setSelectedSubj] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //전체 활동-교과 목록
  const [subjectList, setSubjectList] = useState(null);
  useEffect(() => { extractSubjFromData() }, [subjectGroupList])
  //모든 활동, 업어온 활동, 내 활동
  const { fetchAlActiiBySubjList, fetchCopiedActiList } = useFetchFireData();
  const [_allActiList, setAllActiList] = useState(null)
  const [_mySubjActiList, setMySubjActiList] = useState(null)
  const [_myHomeActiList, setMyHomeActiList] = useState(null)
  const [_myQuizActiList, setMyQuizActiList] = useState(null);
  const [copiedList, setCopiedList] = useState(null)
  //실시간 활동 정보
  const { subjActiList, homeActiList, quizActiList } = useFetchRtActiData(user.uid);
  useEffect(() => {
    setMySubjActiList(subjActiList)
    setMyHomeActiList(homeActiList)
    setMyQuizActiList(quizActiList)
  }, [subjActiList, homeActiList, quizActiList])
  //진입 경로
  const location = useLocation();
  useEffect(() => { fetchDataByLocation() }, [location, selectedSubj])
  //css
  const clientHeight = useClientHeight(document.documentElement)

  //----2.함수부--------------------------------
  //교과 제목 추출
  const extractSubjFromData = () => {
    let subjList = subjectGroupList.reduce((acc, curSubjObj) => {
      acc.push(...Object.keys(curSubjObj));
      return acc
    }, []);
    setSubjectList(subjList)
  }

  //진입 경로에 따라 다른 데이터 가져오기
  const fetchDataByLocation = () => {
    if (!location.state) { //활동관리-나의활동
      fetchCopiedActiList().then((copiedList) => { setCopiedList(copiedList) })
      setIsLoading(false)
    } else { //활동관리-전체 활동-과목 선택
      fetchAlActiiBySubjList(selectedSubj).then((subjActiList) => {
        setAllActiList(subjActiList)
        setIsLoading(false)
      })
    }
  }

  //활동 클릭
  const handleActiOnClick = (item) => {
    if (item.subject === "담임") { navigate(`/activities/${item.id}?sort=homeroom`, { state: { acti: item } }) }  //담임
    else if (item.monster) { navigate(`/activities_setting_quiz`, { state: { ...item } }) }                       //퀴즈
    else { navigate(`/activities/${item.id}?sort=subject`, { state: { acti: item } }) }                           //교과
  }

  return (
    <Container $clientheight={clientHeight}>
      {/* 교사: 활동관리 - 나의활동 */}
      {(user.isTeacher && !location.state) && <>
        <SearchBar title="교과 활동" type="acti" list={_mySubjActiList} setList={setMySubjActiList} />
        <CardList dataList={_mySubjActiList} type="activity" onClick={handleActiOnClick} />
        <HorizontalBannerAd />
        <SearchBar title="담임반 활동" />
        <CardList dataList={_myHomeActiList} type="activity" onClick={handleActiOnClick} />
        <SearchBar title="업어온 활동" />
        <CardList dataList={copiedList} type="copiedActi" />
        <SearchBar title="퀴즈 활동" />
        <CardList dataList={_myQuizActiList} type="quizActi" onClick={handleActiOnClick} />
        <Row><MainBtn onClick={() => { navigate("/activities_setting") }} >활동 만들기</MainBtn></Row>
      </>}
      {/* 교사: 활동관리-전체 활동 */}
      {(user.isTeacher && location.state === "acti_all") && <>
        <TabBtnContainer>
          {subjectList && <TabBtn tabItems={subjectList} activeTab={selectedSubj} setActiveTab={setSelectedSubj} />}
        </TabBtnContainer>
        <SearchBar title={isLoading ? "데이터를 서버에서 불러오는 중 입니다." : `서버에 총 ${_allActiList ? _allActiList.length : 0}개의 활동이 등록되어 있습니다.`}
          type="allActi" list={_allActiList} setList={setAllActiList} />
        <CardList dataList={_allActiList} type="activity" comment="아직 활동이 없습니다. 활동을 생성해주세요" />
        <HorizontalBannerAd />
      </>}
    </Container>
  )
}

const Container = styled.div`
  box-sizing: border-box;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
`
const TabBtnContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  height: 100px;
`
export default ActivityMain