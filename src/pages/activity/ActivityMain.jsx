//라이브러리
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
//컴포넌트
import CardList from '../../components/CardList'
//hooks
import useClientHeight from '../../hooks/useClientHeight'
//CSS
import styled from 'styled-components'
import MainBtn from '../../components/Btn/MainBtn'
import useFetchFireData from '../../hooks/useFetchFireData'
import TabBtn from '../../components/Btn/TabBtn'
import subjects from '../../subjects'

//24.06.30 update 
const ActivityMain = () => { //진입 경로 총 4곳: 교사 3(활동관리-나의활동, 활동관리-전체활동, 사람찾기-타교사) 학생 1
  const user = useSelector(({ user }) => { return user }) //전역변수 user정보
  const navigate = useNavigate()
  const location = useLocation();
  const { otherTrId } = location.state || {}; //state로부터 파라미터를 가져옴
  const [activeSubj, setActiveSubj] = useState(null); //활동관리 - 전체 활동 탭버튼
  const [isLoading, setIsLoading] = useState(true);
  //활동 정보
  const { fetchActiList, fetchOtrActiList, fetchAlActiiBySubjList, fetchCopiedActiList } = useFetchFireData() //데이터 통신
  const [_activityList, setActivityList] = useState(null)
  const [_copiedList, setCopiedList] = useState(null)

  //CSS
  const clientHeight = useClientHeight(document.documentElement)

  //2. UseEffect 
  useEffect(() => { //진입 경로에 따라 다른 데이터를 각각 불러온다.
    if (otherTrId) {
      fetchOtrActiList(otherTrId).then((otrActiList) => { setActivityList(otrActiList) }) //사람찾기 - 타교사 
    } else {
      if (!location.state) { //활동관리 - 나의활동
        fetchActiList().then((actiList) => setActivityList(actiList))
        fetchCopiedActiList().then((copiedList) => { setCopiedList(copiedList) })
        setIsLoading(false)
      } else {
        fetchAlActiiBySubjList(activeSubj).then((subjActiList) => { //활동관리 - 전체 활동
          setActivityList(subjActiList)
          setIsLoading(false)
        })
      }
    }
  }, [location, activeSubj, otherTrId])

  return (
    <Container $clientheight={clientHeight}>
      {(user.isTeacher && !location.state) && <>
        <CardList dataList={_activityList} type="activity" //교사: 활동관리 - 나의활동
          title="나의 생성 활동 목록"
          comment="아직 활동이 없습니다. 활동을 생성해주세요" />
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
          <TabBtn tabItems={subjects} activeTab={activeSubj} setActiveTab={setActiveSubj} />
        </TabBtnContainer>
        <CardList dataList={_activityList} type="activity" //교사: 활동관리 - 전체 활동
          title={isLoading ? "데이터를 서버에서 불러오는 중 입니다." : `서버에 총 ${_activityList.length}개의 활동이 등록되어 있습니다.`}
          comment="아직 활동이 없습니다. 활동을 생성해주세요" />
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