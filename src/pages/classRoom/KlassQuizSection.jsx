//라이브러리
import React from 'react'
import styled from 'styled-components'
//컴포넌트
import EmptyResult from '../../components/EmptyResult'
import QuizMonListItem from '../../components/List/ListItem/QuizMonListItem'
import ArrowBtn from '../../components/Btn/ArrowBtn'
import Container from '../../components/MainPanel'
import PetImg from '../../components/PetImg'

//로직 분리(250204) -> 모바일(250213)
const KlassQuizSection = ({ isMobile, quizList, klassData, myPetDetails, onClick }) => {
  return (
    <Container>
      <TitleText>퀴즈 게임</TitleText>
      {!isMobile && <InfoText>학생들이 얻을 수 있는 펫</InfoText>}
      {!isMobile && <PetImgWrapper>
        <PetImg subject={klassData.subject} step={0} onClick={() => { }} />
        <Row><ArrowBtn direction="right" /></Row>
        <PetImg subject={klassData.subject} step={1} onClick={() => { }} />
        <Row><ArrowBtn direction="right" /></Row>
        <PetImg subject={klassData.subject} step={2} onClick={() => { }} />
        <Row><ArrowBtn direction="right" /></Row>
        <PetImg subject={klassData.subject} step={3} onClick={() => { }} />
      </PetImgWrapper>}
      {isMobile && <PetImgWrapper><PetImg subject={klassData.subject} path={myPetDetails?.path} onClick={() => { }} /></PetImgWrapper>}
      <BoldText style={{ marginTop: "10px" }}>vs</BoldText>
      {/* 단어 게임부 */}
      <GameMonListWrapper>
        {quizList.length === 0 && < EmptyResult comment="등록단 단어 게임이 없습니다." />}
        {quizList.length !== 0 && quizList.map((item) => {
          return <QuizMonListItem key={item.id} item={item} onClick={onClick} />
        })}
      </GameMonListWrapper>
    </Container>
  )
}

const Row = styled.div` 
  display: flex;
  align-items: center;
`
const BoldText = styled.h2`
  color; #3a3a3a;
  display: flex;
  font-weight: bold;
  justify-content: center;
`
const TitleText = styled.h5`
  display: flex;
  justify-content: center;
  color: #3a3a3a;
  font-weight: bold;
  margin: 10px auto;
`
const InfoText = styled.p`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
`
const PetImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  position: relative;
  img {
    border: 1px solid rgba(120,120,120,0.5);
    border-radius: 15px;
  }
`
const GameMonListWrapper = styled.ul`
  display: flex;
  gap: 15px;
  border-top: 1px solid rgb(120, 120, 120, 0.5);
  border-bottom: 1px solid rgb(120, 120, 120, 0.5);
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`
export default KlassQuizSection
