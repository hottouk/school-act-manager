//라이브러리
import styled from 'styled-components'
//컴포넌트
import EmptyResult from '../../components/EmptyResult'
import QuizMonListItem from '../../components/List/ListItem/QuizMonListItem'
import ArrowBtn from '../../components/Btn/ArrowBtn'
import Container from '../../components/MainPanel'
import PetImg from '../../components/PetImg'
import MidBtn from '../../components/Btn/MidBtn'
import PlusBtn from '../../components/Btn/PlusBtn'

//로직 분리(250204) -> 모바일(250213)
const KlassQuizSection = ({ isMobile, quizList, klassData, onClick, setIsAddQuizModal }) => {
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
      {!isMobile && <BoldText style={{ marginTop: "10px" }}>vs</BoldText>}
      {/* 단어 게임부 */}
      <GameMonListWrapper>
        {quizList.length === 0 && <Column style={{ margin: "20px auto" }}><EmptyResult comment="등록된 단어 게임이 없습니다." /><MidBtn onClick={() => { setIsAddQuizModal(true); }}>추가</MidBtn></Column>}
        {quizList.length !== 0 && <Row style={{ gap: "10px" }}>
          {quizList.map((item) => <QuizMonListItem key={item.id} item={item} onClick={onClick} />)}
          <PlusBtn onClick={() => { setIsAddQuizModal(true); }} /></Row>
        }
      </GameMonListWrapper>
    </Container>
  )
}

const Row = styled.div` 
  display: flex;
  align-items: center;
`
const Column = styled(Row)`
  flex-direction: column;
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
  align-items: center;
  gap: 15px;
  border-top: 1px solid rgb(120, 120, 120, 0.5);
  border-bottom: 1px solid rgb(120, 120, 120, 0.5);
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`
export default KlassQuizSection
