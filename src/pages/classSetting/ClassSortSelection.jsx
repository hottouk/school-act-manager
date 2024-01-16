import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import useClientHeight from '../../hooks/useClientHeight'

const ClassSortSelection = () => {
  //1. 변수
  const navigate = useNavigate()
  const { state } = useLocation();
  const [step, setStep] = useState('')
  //2. 세로 길이
  const clientHeight = useClientHeight(document.documentElement)

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
      {(step === "second") ? <StyledCardContainer $clientheight={clientHeight}>
        <h3>학생 생성 방법</h3>
        <StyledCardDiv $color={"#3454d1"} id="with_neis" onClick={handleCardBtnClick}>
          <legend>나이스 출석부</legend>
          <p>나이스 출석부가 있을 때</p>
          <p>학번, 이름 자동 생성</p>
          <StyledSelectBtn id="with_neis" onClick={handleCardBtnClick}>선택</StyledSelectBtn>
        </StyledCardDiv>
        <StyledCardDiv $color={"#3454d1"} id="with_number" onClick={handleCardBtnClick}>
          <legend>학번 생성</legend>
          <p>학번 자동 생성, 이름 수기 입력</p>
          <StyledSelectBtn id="with_number" onClick={handleCardBtnClick}>선택</StyledSelectBtn>
        </StyledCardDiv>
        <StyledCardDiv $color={"#3454d1"} id="by_hand" onClick={handleCardBtnClick}>
          <legend>수기 입력</legend>
          <p>학생을 수작업으로 등록</p>
          <StyledSelectBtn id="by_hand" onClick={handleCardBtnClick}>선택</StyledSelectBtn>
        </StyledCardDiv>
      </StyledCardContainer> : <StyledCardContainer $clientheight={clientHeight}>
        <h3>클래스 종류 선택</h3>
        <StyledCardDiv id="subject" $color={"#3454d1"} onClick={handleCardBtnClick}>
          <legend>교과반</legend>
          <p>과세특 기록용</p>
        </StyledCardDiv>
        <StyledCardDiv id="homeroom" onClick={handleCardBtnClick}>
          <legend>담임반</legend>
          <p>행발, 진로, 자율활동기록용, </p>
          <p className='ban'>추후 서비스</p>
        </StyledCardDiv>
        <StyledCardDiv id="club" onClick={handleCardBtnClick}>
          <legend>동아리</legend>
          <p>동아리 활동 기록용, 추후 서비스</p>
          <p className='ban'>추후 서비스</p>
        </StyledCardDiv>
      </StyledCardContainer>}
    </>
  )
}

const StyledCardContainer = styled.div`
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
  @media screen and (max-width: 767px){
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    top: 0;
    gap: 20px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
  h3 {
    margin: 0 auto 15px;
  }
`
const StyledCardDiv = styled.div`
  width: 250px;
  height: 360px;
  padding: 20px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: ${(props) => { return props.$color }} 1px 1px 7px 1px;
  legend {
    color: #3454d1;
    font-weight: bold;
    text-align: center;
  }
  p.ban {
    font-size: 22px;
    color: red;
    text-align: center;
    font-weight: 900;
  }
  p {
    diplay: inline-block;
    font-size: 14px;
    margin-bottom: 2px;
  }
  @media screen and (max-width: 767px){
    position: relative;
    height: 250px;
  }
`
const StyledSelectBtn = styled.button`
  display: none;
  @media screen and (max-width: 767px){
    display: block;
    position: absolute;
    left: 50%;
    margin-left: -100px; /* width의 50% */;
    bottom: 20px;
    width: 200px;
    align-items: center;
    background-color: #0A66C2;
    border: 0;
    border-radius: 100px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    font-family: -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    line-height: 20px;
    max-width: 480px;
    min-height: 40px;
    min-width: 0px;
    overflow: hidden;
    padding: 0px;
    padding-left: 20px;
    padding-right: 20px;
    text-align: center;
    touch-action: manipulation;
    transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
    &:hover {
        background: cornflowerblue;
        color: white;
        transition: 0.5s;
      }
    &:active {
      background: #09223b;
      color: rgb(255, 255, 255, .7);
    }
    &:disabled { 
      cursor: not-allowed;
      background: rgba(0, 0, 0, .08);
      color: rgba(0, 0, 0, .3);
    }  }
  
`
export default ClassSortSelection