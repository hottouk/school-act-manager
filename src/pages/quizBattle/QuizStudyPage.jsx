import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import MainContainer from '../../components/Styled/MainContainer'
import SubNav from '../../components/Bar/SubNav'
import BackBtn from '../../components/Btn/BackBtn'
import VocabFlashCard from '../../components/VocabFlashCard'

const QuizStudyPage = () => {
  const { state: quizSetInfo } = useLocation();
  const words = useMemo(() => {
    if (!quizSetInfo?.quizList) return [];
    return quizSetInfo.quizList.map((item) => {
      const [word, meaning] = item.split("#");
      return { word, meaning };
    });
  }, [quizSetInfo]);

  return (
    <MainContainer>
      <SubNav><BackBtn /></SubNav>
      <StudyWrapper>
        <VocabFlashCard
          words={words}
          title={quizSetInfo?.title || "영단어 학습"}
          loop={false}
        />
      </StudyWrapper>
    </MainContainer>
  )
}

const StudyWrapper = styled.div`
  width: 100%;
  padding: 20px 0;
  box-sizing: border-box;
`

export default QuizStudyPage
