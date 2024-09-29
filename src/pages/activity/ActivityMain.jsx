//라이브러리
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
//컴포넌트
import HorizontalBannerAd from '../../components/Ads/HorizontalBannerAd'
import CardList from '../../components/List/CardList'
import MainBtn from '../../components/Btn/MainBtn'
import TabBtn from '../../components/Btn/TabBtn'
//hooks
import useClientHeight from '../../hooks/useClientHeight'
import useFetchFireData from '../../hooks/Firebase/useFetchFireData'
import useFetchRtMyActiData from '../../hooks/RealTimeData/useFetchRtMyStudentData'
//데이터
import subjectGroupList from '../../data/subjectGroupList'
//css
import styled from 'styled-components'

//24.09.37 subjList update 
const ActivityMain = () => { //진입 경로 총 4곳: 교사 3(활동 관리 - 나의 활동, 활동 관리 - 전체 활동, 사람 찾기 - 타교사) 학생 1
  const user = useSelector(({ user }) => { return user }) //전역변수 user정보
  const navigate = useNavigate()
  const location = useLocation();
  const { otherTrId } = location.state || {}; //state로부터 파라미터를 가져옴
  const [activeSubj, setActiveSubj] = useState(null); //활동관리 - 전체 활동 탭버튼
  const [isLoading, setIsLoading] = useState(true);
  const [subjectList, setSubjectList] = useState(null);
  useEffect(() => {
    let _subjectList = subjectGroupList.reduce((acc, curSubjObj) => {
      acc.push(...Object.keys(curSubjObj));
      return acc
    }, []);
    setSubjectList(_subjectList)
  }, [subjectGroupList])
  //활동 정보
  const { fetchOtrActiList, fetchAlActiiBySubjList, fetchCopiedActiList } = useFetchFireData() //데이터 통신
  const [_activityList, setActivityList] = useState(null)
  const realTimetActiList = useFetchRtMyActiData() //실시간 데이터 통신
  const [_copiedList, setCopiedList] = useState(null)
  //CSS
  const clientHeight = useClientHeight(document.documentElement)

  //2. UseEffect 
  useEffect(() => { //진입 경로에 따라 다른 데이터를 각각 불러온다.
    if (otherTrId) {
      fetchOtrActiList(otherTrId).then((otrActiList) => { setActivityList(otrActiList) }) //사람찾기 - 타교사 
    } else {
      if (!location.state) { //교사: 활동관리 - 나의활동
        fetchCopiedActiList().then((copiedList) => { setCopiedList(copiedList) })
        setIsLoading(false)
      } else {
        fetchAlActiiBySubjList(activeSubj).then((subjActiList) => { //교사: 활동관리 - 전체 활동
          setActivityList(subjActiList)
          setIsLoading(false)
        })
      }
    }
  }, [location, activeSubj, otherTrId])

  return (
    <Container $clientheight={clientHeight}>
      {(user.isTeacher && !location.state) && <>
        <CardList dataList={realTimetActiList} type="activity" //교사: 활동관리 - 나의활동
          title="나의 생성 활동 목록"
          comment="아직 활동이 없습니다. 활동을 생성해주세요" />
        <HorizontalBannerAd />
        <CardList dataList={_copiedList} type="copiedActi"
          title="업어온 활동 목록"
          comment="업어온 활동이 없습니다." />
        <MainBtn btnOnClick={() => { navigate("/activities_setting") }} btnName="활동 만들기" />
      </>}
      {(user.isTeacher && otherTrId) && <><CardList dataList={_activityList} type="activity" //교사: 사람찾기 - 타교사
        title="다른 선생님 활동 목록"
        comment="해당 선생님은 아직 등록된 활동이 없습니다." />
      </>}
      {(user.isTeacher && location.state === "acti_all") && <>
        <TabBtnContainer>
          {subjectList && <TabBtn tabItems={subjectList} activeTab={activeSubj} setActiveTab={setActiveSubj} />}
        </TabBtnContainer>
        <CardList dataList={_activityList} type="activity" //교사: 활동관리 - 전체 활동
          title={isLoading ? "데이터를 서버에서 불러오는 중 입니다." : `서버에 총 ${_activityList ? _activityList.length : 0}개의 활동이 등록되어 있습니다.`}
          comment="아직 활동이 없습니다. 활동을 생성해주세요" />
        <HorizontalBannerAd />
      </>}
      {!user.isTeacher && <><CardList dataList={_activityList} type="activity" //학생
        title="참여 활동 목록"
        comment="참가한 활동이 없습니다. 활동에 참여해주세요" />
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
const TabBtnContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  height: 100px;
`
export default ActivityMain