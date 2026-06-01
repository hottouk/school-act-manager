import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

const defaultWords = [
  { word: 'apple', meaning: '사과', example: 'I ate an apple.' },
  { word: 'brave', meaning: '용감한', example: 'She is brave.' },
  { word: 'school', meaning: '학교', example: 'I go to school.' },
];

const VocabFlashCard = ({
  words = defaultWords,
  title = '영단어 카드',
  loop = false,
  onComplete,
}) => {
  const validWords = useMemo(
    () => words.filter(({ word, meaning }) => word && meaning),
    [words]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentWord = validWords[currentIndex];
  const totalCount = validWords.length;
  const progressText = totalCount ? `${currentIndex + 1} / ${totalCount}` : '0 / 0';

  const handleCardClick = () => {
    if (!totalCount || isCompleted) return;

    if (!isFlipped) {
      setIsFlipped(true);
      return;
    }

    const isLastCard = currentIndex === totalCount - 1;
    if (isLastCard && !loop) {
      setIsCompleted(true);
      onComplete?.();
      return;
    }

    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCount);
    }, 450); // 카드가 뒤집히는 애니메이션과 자연스럽게 이어지도록 약간의 딜레이를 줌
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  if (!totalCount) {
    return (
      <Wrapper>
        <Header>
          <Title>{title}</Title>
        </Header>
        <EmptyBox>표시할 단어가 없습니다.</EmptyBox>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <Title>{title}</Title>
        <Progress>{progressText}</Progress>
      </Header>

      {isCompleted ? (
        <CompleteBox>
          <CompleteTitle>학습 완료</CompleteTitle>
          <CompleteText>{totalCount}개의 단어를 모두 확인했습니다.</CompleteText>
          <RestartButton type="button" onClick={handleRestart}>
            처음부터 다시 보기
          </RestartButton>
        </CompleteBox>
      ) : (
        <>
          <CardButton
            type="button"
            aria-label={isFlipped ? '뜻 확인됨. 다음 단어로 이동' : '단어 카드. 뜻 확인'}
            onClick={handleCardClick}
          >
            <CardInner $isFlipped={isFlipped}>
              <CardFace>
                <CardLabel>WORD</CardLabel>
                <WordText>{currentWord.word}</WordText>
                {currentWord.pronunciation && (
                  <SubText>{currentWord.pronunciation}</SubText>
                )}
                {currentWord.example && <ExampleText>{currentWord.example}</ExampleText>}
              </CardFace>
              <CardFaceBack>
                <CardLabel>MEANING</CardLabel>
                <MeaningText>{currentWord.meaning}</MeaningText>
              </CardFaceBack>
            </CardInner>
          </CardButton>

          <HintText>{isFlipped ? '한 번 더 누르면 다음 단어로 이동합니다.' : '카드를 누르면 뜻이 나옵니다.'}</HintText>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: min(100%, 520px);
  margin: 0 auto;
  padding: 24px 16px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h2`
  margin: 0;
  color: #222;
  font-size: 24px;
  font-weight: 700;

  @media screen and (max-width: 480px) {
    font-size: 20px;
  }
`;

const Progress = styled.span`
  flex: 0 0 auto;
  color: #56606d;
  font-size: 15px;
  font-weight: 600;
`;

const CardButton = styled.button`
  width: 100%;
  min-height: 320px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  perspective: 1200px;
  touch-action: manipulation;

  &:focus-visible {
    outline: 3px solid #3454d1;
    outline-offset: 6px;
    border-radius: 12px;
  }

  @media screen and (max-width: 480px) {
    min-height: 260px;
  }
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  min-height: inherit;
  transform-style: preserve-3d;
  transition: transform 0.45s ease;
  transform: ${({ $isFlipped }) => ($isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
`;

const CardFace = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: inherit;
  padding: 32px 24px;
  border: 1px solid #d9e1f2;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 14px 36px rgba(25, 35, 60, 0.12);
  backface-visibility: hidden;
  box-sizing: border-box;
`;

const CardFaceBack = styled(CardFace)`
  transform: rotateY(180deg);
  background: #f8fbff;
`;

const CardLabel = styled.span`
  color: #3454d1;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
`;

const WordText = styled.strong`
  max-width: 100%;
  color: #171b24;
  font-size: 48px;
  font-weight: 800;
  line-height: 1.15;
  overflow-wrap: anywhere;

  @media screen and (max-width: 480px) {
    font-size: 36px;
  }
`;

const MeaningText = styled.strong`
  max-width: 100%;
  color: #171b24;
  font-size: 36px;
  font-weight: 800;
  line-height: 1.2;
  overflow-wrap: anywhere;

  @media screen and (max-width: 480px) {
    font-size: 30px;
  }
`;

const SubText = styled.span`
  color: #56606d;
  font-size: 18px;
  line-height: 1.4;
`;

const ExampleText = styled.p`
  max-width: 100%;
  margin: 0;
  color: #56606d;
  font-size: 17px;
  line-height: 1.5;
  text-align: center;
  overflow-wrap: anywhere;
`;

const HintText = styled.p`
  margin: 0;
  color: #56606d;
  font-size: 15px;
  text-align: center;
`;

const EmptyBox = styled.div`
  padding: 48px 20px;
  border: 1px dashed #c8d0dd;
  border-radius: 12px;
  color: #56606d;
  text-align: center;
`;

const CompleteBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 48px 24px;
  border: 1px solid #d9e1f2;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 14px 36px rgba(25, 35, 60, 0.12);
  text-align: center;
`;

const CompleteTitle = styled.h3`
  margin: 0;
  color: #171b24;
  font-size: 28px;
  font-weight: 800;
`;

const CompleteText = styled.p`
  margin: 0;
  color: #56606d;
  font-size: 16px;
`;

const RestartButton = styled.button`
  width: min(100%, 220px);
  height: 46px;
  border: 0;
  border-radius: 10px;
  background: #3454d1;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;

  &:hover {
    background: #243fba;
  }

  &:focus-visible {
    outline: 3px solid #171b24;
    outline-offset: 3px;
  }
`;

export default VocabFlashCard;
