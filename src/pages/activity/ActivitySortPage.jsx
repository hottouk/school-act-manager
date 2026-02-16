import React from 'react'
import styled from 'styled-components'
//컴포넌트
import CardSortForm from '../../components/Form/CardSortForm'
import SubNav from '../../components/Bar/SubNav'
import BackBtn from '../../components/Btn/BackBtn'
//hooks
import { useNavigate } from 'react-router-dom'
import MainContainer from '../../components/Styled/MainContainer'
import useMediaQuery from '../../hooks/useMediaQuery'

//생성(240808)
const ActivitySortPage = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
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
    <MainContainer>
      {!isMobile && <SubNav><BackBtn /></SubNav>}
      <CardWrapper>
        <CardSortForm itemList={actiSortList} handleCardBtnClick={handleCardBtnClick} />
      </CardWrapper>
    </MainContainer>
  )
}
export default ActivitySortPage

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const CardWrapper = styled(Row)`
  height: 40dvh;
  margin: 80px auto;
  border-radius: 10px;
  align-items: center;
  justify-content: space-around;
`