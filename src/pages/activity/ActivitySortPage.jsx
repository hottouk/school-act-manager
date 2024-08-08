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
  //1. 변수
  const navigate = useNavigate()
  //2. 세로 길이
  const clientHeight = useClientHeight(document.documentElement)
  const handleCardBtnClick = (event) => {
    switch (event.target.id) {
      case "subjectActi":
        navigate("/activities_setting_details")
        break;
      default:
        return;
    }
  }
  //활동 데이터
  const actiSortList = [
    { id: "subjectActi", legend: "교과용 활동", subTitle: "과세특 기록용", imgNumber: 1 },
    { id: "homeroomActi", legend: "담임반 활동", subTitle: "행발, 자율, 진로, 봉사용", imgNumber: 2, ing: true },
    { id: "clubActi", legend: "동아리 활동", subTitle: "동아리 활동 기록용", imgNumber: 3, ban: true }
  ]

  return (
    <Container $clientheight={clientHeight}>
      <StyledTitle>활동 종류 선택</StyledTitle>
      {/* 카드 랜더링 */}
      <CardSortForm itemList={actiSortList} handleCardBtnClick={handleCardBtnClick} />
      <BtnWrapper>
        <MainBtn btnName="뒤로가기" btnOnClick={() => { navigate(-1) }} />
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
const StyledTitle = styled.h3`
  text-align: center;
  margin-bottom: 5%;
`

const BtnWrapper = styled.div`
  margin-top: 5%;
`