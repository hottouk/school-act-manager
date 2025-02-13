import React, { useState } from 'react'
import styled from 'styled-components'
//250201 생성
const ReviewSection = ({ incorrectList }) => {

  const FlipCard = ({ quiz, answer }) => {
    const [_isFlipped, setIsFlipped] = useState(false);
    return (
      <CardWrapper onClick={() => setIsFlipped(!_isFlipped)}>
        <CardItem $isFlipped={_isFlipped}>
          <CardFront>{quiz}</CardFront>
          <CardBack>{answer}</CardBack>
        </CardItem>
      </CardWrapper>
    );
  };

  return (
    <Container>
      {incorrectList.map((item) =>
        <FlipCard key={item.quiz} quiz={item.quiz} answer={item.answer} />
      )}
    </Container>
  )
}

const Container = styled.ul`
  box-sizing: border-box;
  width: 1200px;
  height: 900px;
	display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  border-left: 1px solid rgba(120,120,120,0.5);
  border-right: 1px solid rgba(120,120,120,0.5);
  background-color: white;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: ${window.innerWidth}px;
  }
`
const CardWrapper = styled.div`
  perspective: 1000px; /* 3D 효과를 위한 원근법 */
`
const CardItem = styled.li`
  width: 280px;
  height: 155px;
  margin: 10px;
  padding: 15px 25px;
  border: 1.5px solid  rgb(120, 120, 120, 0.5) ;
  border-radius: 15px;
  cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
  transform: ${({ $isFlipped }) => ($isFlipped ? "rotateY(180deg)" : "rotateY(0deg)")};
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
`
const CardFace = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 24px;
  font-weight: 500;
`;
const CardFront = styled(CardFace)`
  background-color: #4caf50;
  color: white;
`;

const CardBack = styled(CardFace)`
  background-color: #ff9800;
  color: white;
  transform: rotateY(180deg);
`;
export default ReviewSection
