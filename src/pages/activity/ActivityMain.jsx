import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import useCollection from '../../hooks/useCollection'

//컴포넌트
import ActivityForm from './ActivitityForm'
import ActivityList from './ActivityList'

//CSS
import styled from 'styled-components'

const StyledGirdContainer = styled.main`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0 30px;
  margin: 60px auto;
`
const StyledCenteredItem = styled.div`
  grid-column-start: 2;
  grid-column-end: 5;
`
const StyledSideB = styled.div`
  float: right;
  grid-column-start: 5;
  grid-column-end: 6;
  grid-row-start: 1;
  grid-row-end: 3;
`
const StyledBtn = styled.button`
  grid-column-start: 3;
  grid-column-end: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px auto;
  margin-top: 35px;
  width: 80%;
  color: teal;
  font-weight: bold;
  background-color: transparent;
  border-radius: 15px;
  border: 2px solid teal;
  padding: 25px;
`

const ActivityMain = () => {
  //유저 정보
  const { user } = useAuthContext();
  //활동 정보
  const { documents, colErr } = useCollection('activities', ['uid', '==', user.uid], 'title')
  //활동창 토글
  const [isActOn, setIsActOn] = useState(false)
  const handleBtnClick = () => {
    setIsActOn(!isActOn);
  }

  return (
    <StyledGirdContainer>
      <StyledCenteredItem>
        <ActivityForm uid={user.uid} />
      </StyledCenteredItem>
      <StyledSideB>
        {/* 토글 상태에 따라 사이드바 보여주기 */}
        {!isActOn ? null : <div> 
          {colErr && <strong>{colErr}</strong>}
          {documents && <ActivityList activities={documents} />}
        </div>}
      </StyledSideB>
      <StyledBtn onClick={handleBtnClick}>활동 관리</StyledBtn>
    </StyledGirdContainer>
  )
}

export default ActivityMain