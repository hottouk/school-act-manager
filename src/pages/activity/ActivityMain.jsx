//라이브러리
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
//컴포넌트
import CardList from '../../components/CardList'
//hooks
import useClientHeight from '../../hooks/useClientHeight'
import useGetActivity from '../../hooks/useGetActivity'
//CSS
import styled from 'styled-components'

//24.01.09
const ActivityMain = () => {
  //전역변수 user정보
  const user = useSelector(({ user }) => { return user })
  const navigate = useNavigate()
  //활동 정보
  const { activityList, errByGetActi } = useGetActivity() //데이터 통신
  const [_activityList, setActivityList] = useState(null)
  //CSS
  const clientHeight = useClientHeight(document.documentElement)

  //2. UseEffect
  useEffect(() => {
    setActivityList(activityList)
  }, [activityList])

  return (
    <StyledContainer  $clientheight={clientHeight}>
      {user.isTeacher && <><CardList dataList={_activityList} type="activity" //교사
        title="생성 활동 목록"
        comment="아직 활동이 없습니다. 활동을 생성해주세요" />
        <StyledBtn onClick={() => { navigate("/activities_setting") }}>활동 만들기</StyledBtn>
      </>}
      {!user.isTeacher && <><CardList dataList={_activityList} type="activity" //학생
        title="참여 활동 목록"
        comment="참가한 활동이 없습니다. 활동에 참여해주세요" />
      </>}
      {errByGetActi && <h3 style={{ color: "red" }}>{errByGetActi}</h3>}
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
const StyledBtn = styled.button`
  appearance: none;
  backface-visibility: hidden;
  background-color: #3454d1;
  border-radius: 10px;
  border-style: none;
  box-shadow: none;
  box-sizing: border-box;
  margin: 50px auto;
  color: #fff;
  cursor: pointer;
  display: block;
  font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size: 15px;
  font-weight: 500;
  height: 50px;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  overflow: hidden;
  padding: 14px 30px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;

  &:hover {
  background-color: #1366d6;
  box-shadow: rgba(0, 0, 0, .05) 0 5px 30px, rgba(0, 0, 0, .05) 0 1px 4px;
  opacity: 1;
  transform: translateY(0);
  transition-duration: .35s;
  }
  
  &:hover:after {
    opacity: .5;
  }

  &:active {
    box-shadow: rgba(0, 0, 0, .1) 0 3px 6px 0, rgba(0, 0, 0, .1) 0 0 10px 0, rgba(0, 0, 0, .1) 0 1px 4px -1px;
    transform: translateY(2px);
    transition-duration: .35s;
  }

  &:active:after {
    opacity: 1;
  }
`
export default ActivityMain