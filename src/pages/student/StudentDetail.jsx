import { useLocation } from 'react-router-dom'

//스타일
import styled from 'styled-components';

//스타일
const StyledContainer = styled.div`
  box-sizing: border-box;
  width: 80%;
  max-width: 1020px;
  height: 500px;
  background-color: blue;
  color: white;
  padding: 15px;
  margin: 45px auto;
  border: 1px solid black;
  border-radius: 20px;
`
const StyledTopPannel = styled.div`
  position: relative;
  height: 40%;
  background-color: orange;
  padding: 15px;
  border: 1px solid black;
  border-radius: 15px;
`
const StyledMonsterImg = styled.img`
  display: inline-block;
  width: 120px;
  height: 120px;
  border: 1px solid black;
`
const StyledTopRightInfo = styled.div`
  position: absolute;
  width: 75%;
  top: 0px;
  bottom: 0px;
  right: 10px;
  margin: 10px auto;
  padding: 15px;
  border: 1px solid black;
  border-radius: 10px;
`
const StyledBotPannel = styled.div`
  position: relative;
  height: 57%;
  margin-top: 15px;
  background-color: orange;
  padding: 15px;
  border: 1px solid black;
  border-radius: 15px;
`
const StyledBotLeftInfo = styled.div`
  position:absolute;
  width: 20%;
  top: 0px;
  bottom: 0px;
  left: 10px;
  margin: 10px auto;
  padding: 15px;
  border: 1px solid black;
  border-radius: 10px;
`
const StyledBotRightInfo = styled.div`
  position: absolute;
  width: 75%;
  top: 0px;
  bottom: 0px;
  right: 10px;
  margin: 10px auto;
  padding: 15px;
  border: 1px solid black;
  border-radius: 10px;
`
const StyledAccRecord = styled.p`
  display: inline;
`
const StudentDetail = () => {
  const { state } = useLocation()
  const { studentNumber, actList, scores } = state
  console.log(scores)
  return (
    <StyledContainer>
      <StyledTopPannel>
        <StyledMonsterImg src="" alt="이미지 준비" />
        <StyledTopRightInfo>
          <p>학번: {studentNumber}</p>
          <p>이름: </p>
          <p>레벨: </p>
          <p>경험치: </p>
        </StyledTopRightInfo>
      </StyledTopPannel>
      <StyledBotPannel>
        <StyledBotLeftInfo>
          {!actList ? <div>활동 제목</div> : actList.map((act) => {
            return <p>{act.title}</p>
          })}
        </StyledBotLeftInfo>
        <StyledBotRightInfo>
          {!actList ? <div>적립된 활동이 없습니다.</div> : actList.map((act) => {
            return <StyledAccRecord> {act.record}.</StyledAccRecord>
          })}
        </StyledBotRightInfo>
      </StyledBotPannel>
    </StyledContainer>
  )
}

export default StudentDetail