import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const StyledContainer = styled.div`
  box-sizing: border-box; 
  position: relative; 
  width: 80%;
  margin: 20px auto;
  top: 160px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  h3 {
    width: 100%;
    margin: 0 auto 45px;
    display: flex;
    justify-content: center;
  }
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
  const { state } = useLocation();
  const [step, setStep] = useState('')

  useEffect(() => {
    setStep(state)
  }, [state])

  //2. 함수
  const handleCardBtnClick = (event) => {
    switch (event.target.id) {
      case "subject":
        navigate("/classrooms_setting", { state: "second" })
        break;
      case "homeroom":
        break;
      case "club":
        break;
      case "with_neis":
        navigate("/classrooms_setting_details", { state: "with_neis" })
        break;
      case "with_number":
        navigate("/classrooms_setting_details", { state: "with_number" })
        break;
      case "by_hand":
        navigate("/classrooms_setting_details", { state: "by_hand" })
        break;
      default: return;
    }
  }

  return (
    <>
      {(step === "second") ? <StyledContainer>
        <h3>학생 생성 방법 선택</h3>
        <StyledCardDiv id="with_neis" onClick={handleCardBtnClick}>
          <legend>나이스 출석부</legend>
          <p>
            나이스에서 다운로드 받은 출석부가 있을 때 선택하세요.
            추가 작업이 필요 없는 원클릭 클래스 만들기
          </p>
        </StyledCardDiv>
        <StyledCardDiv id="with_number" onClick={handleCardBtnClick}>
          <legend>학번으로 만들기</legend>
          <p>학번은 자동으로 만들어지나 이름을 수기 입력해주셔야 합니다.</p>
        </StyledCardDiv>
        <StyledCardDiv id="by_hand" onClick={handleCardBtnClick}>
          <legend>수기 입력</legend>
          <p>학생 모두를 수기작업으로 등록합니다.</p>
        </StyledCardDiv>
      </StyledContainer> : <StyledContainer>
        <h3>클래스 종류 선택</h3>
        <StyledCardDiv id="subject" onClick={handleCardBtnClick}>
          <legend>교과반</legend>
          <p>과세특 기록용</p>
        </StyledCardDiv>
        <StyledCardDiv id="homeroom" onClick={handleCardBtnClick}>
          <legend>담임반</legend>
          <p>행발, 진로, 자율활동기록용</p>
        </StyledCardDiv>
        <StyledCardDiv id="club" onClick={handleCardBtnClick}>
          <legend>동아리</legend>
          <p>동아리 활동 기록용</p>
        </StyledCardDiv>
      </StyledContainer>}
    </>
  )
}

export default ClassSortSelection