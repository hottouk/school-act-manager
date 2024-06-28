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
import NewBtn from '../../components/Btn/NewBtn'
import useFetchFireData from '../../hooks/useFetchFireData'

//24.06.27 update 
const ActivityMain = () => { //진입경로 추가: 총 2곳
  //전역변수 user정보
  const user = useSelector(({ user }) => { return user })
  const navigate = useNavigate()
  const location = useLocation();
  const { otherTrId } = location.state || {}; // 상태로부터 파라미터를 가져옴

  //활동 정보
  const { fetchActiList, fetchOtrActiList } = useFetchFireData() //데이터 통신
  const [_activityList, setActivityList] = useState(null)
  const [_otherActiList, setOtherActiList] = useState(null)
  //CSS
  const clientHeight = useClientHeight(document.documentElement)

  //2. UseEffect 
  useEffect(() => {
    if (!otherTrId) {
      fetchActiList().then((actiList) => setActivityList(actiList))
    } else {
      fetchOtrActiList(otherTrId).then((otrActiList) => setOtherActiList(otrActiList))
    }
  }, [])

  return (
    <StyledContainer $clientheight={clientHeight}>
      {(user.isTeacher && otherTrId) && <><CardList dataList={_otherActiList} type="activity" //교사
        title="다른 선생님 활동 목록"
        comment="해당 선생님은 아직 등록된 활동이 없습니다." />
        <NewBtn btnOnClick={() => { navigate("/activities_setting") }} btnName="활동 만들기" />
      </>}
      {(user.isTeacher && !otherTrId) && <><CardList dataList={_activityList} type="activity" //교사
        title="생성 활동 목록"
        comment="아직 활동이 없습니다. 활동을 생성해주세요" />
        <NewBtn btnOnClick={() => { navigate("/activities_setting") }} btnName="활동 만들기" />
      </>}
      {!user.isTeacher && <><CardList dataList={_activityList} type="activity" //학생
        title="참여 활동 목록"
        comment="참가한 활동이 없습니다. 활동에 참여해주세요" />
      </>}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 20px auto;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
export default ActivityMain