import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const StyledContainer = styled.div`
  box-sizing: border-box; 
  position: relative; 
  width: 80%;
  margin: 20px auto;
  top: 160px;
  display: flex;
  justify-content: space-between;
`
const StyledCardDiv = styled.div`
  width: 250px;
  height: 360px;
  padding: 20px;
  border: 1px solid black;
  cursor: pointer;
`
const ClassSortSelection = () => {
  //1. 변수
  const navigate = useNavigate()

  //2. 함수
  const handleCardBtnClick = (event) => {
    switch (event.target.id) {
      case "subject":
        navigate("/classrooms_setting_details", { state: "first" })
        break;
      case "homeroom":
        break;
      case "club":
        break;
      default: return;
    }
  }
  return (
    <StyledContainer>
      <StyledCardDiv id="subject" onClick={handleCardBtnClick}>
        <legend>교과반</legend>
        <p>세특 기록용</p>
      </StyledCardDiv>
      <StyledCardDiv id="homeroom" onClick={handleCardBtnClick}>
        <legend>담임반</legend>
        <p>행발, 진로, 자율활동기록용</p>
      </StyledCardDiv>
      <StyledCardDiv id="club" onClick={handleCardBtnClick}>
        <legend>동아리</legend>
        <p>동아리 활동 기록용</p>
      </StyledCardDiv>
    </StyledContainer>
  )
}

export default ClassSortSelection