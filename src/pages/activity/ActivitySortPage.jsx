import React from 'react'
//컴포넌트
import CardSortForm from '../../components/Form/CardSortForm'
import MainBtn from '../../components/Btn/MainBtn'
//hooks
import { useNavigate } from 'react-router-dom'
import useClientHeight from '../../hooks/useClientHeight'
//css
import styled from 'styled-components'

//2024.08.08(생성)
const ActivitySortPage = () => {
  const navigate = useNavigate()
  //2. 세로 길이
  const clientHeight = useClientHeight(document.documentElement)
  const handleCardBtnClick = (event) => {
    switch (event.target.id) {
      case "subjectActi":
        navigate("/activities_setting_details?sort=subject")
        break;
      case "homeroomActi":
        navigate("/activities_setting_details?sort=homeroom")
        break;
      case "quizGameActi":
        navigate("/activities_setting_quiz")
        break;
      default:
        return;
    }
  }
  //활동 데이터
  const actiSortList = [
    { id: "subjectActi", legend: "교과용 활동", subTitle: "과세특 기록용", imgNumber: 1 },
    { id: "homeroomActi", legend: "담임반 활동", subTitle: "자율, 진로, 봉사활동", imgNumber: 2 },
    { id: "quizGameActi", legend: "게임 활동", subTitle: "단어, 퀴즈, 교과 관련", imgNumber: 3 },
  ]

  return (
    <Container $clientheight={clientHeight}>
      {/* 카드 랜더링 */}
      <CardSortForm itemList={actiSortList} handleCardBtnClick={handleCardBtnClick} />
      <BtnWrapper>
        <Row><MainBtn onClick={() => { navigate(-1) }}>뒤로가기</MainBtn></Row>
      </BtnWrapper>
    </Container>
  )
}
export default ActivitySortPage

const Container = styled.div`
  box-sizing: border-box;
  margin-top: 110px;
  @media screen and (max-width: 767px){
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    top: 0;
    gap: 20px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const Row = styled.div`
  display: flex;
  justify-content: center;
`
const BtnWrapper = styled.div`
  margin-top: 5%;
`