//라이브러리리
import React, { useEffect, useState } from 'react'
import useClientHeight from '../../hooks/useClientHeight'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
//컴포넌트
import CardList from '../../components/List/CardList'
import MainBtn from '../../components/Btn/MainBtn'
//hooks
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import MainWrapper from '../../components/Styled/MainWrapper'
//생성(250104)
const QuizMainPage = () => {
  //준비
  const user = useSelector(({ user }) => { return user })
  const navigate = useNavigate()
  const clientHeight = useClientHeight(document.documentElement)
  //랜더링 데이터
  const [_quizSetList, setQuizSetList] = useState([])
  const { fetchData } = useFireBasic("quiz")
  useEffect(() => { fetchData("uid").then(quizSetList => { setQuizSetList(quizSetList) }) }, [])
  return (
    <Container $clientheight={clientHeight}>
      {user.isTeacher && <MainWrapper>
        <CardList dataList={_quizSetList} type="quiz"
          comment="아직 퀴즈 세트가 없습니다. 퀴즈 세트를 생성해주세요" />
        <MainBtn onClick={() => { navigate("/quiz_setting") }}>퀴즈 세트 만들기</MainBtn>
      </MainWrapper>}
    </Container>
  )
}

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const Container = styled(Column)`
  box-sizing: border-box;
  background-color: #efefef;
  min-height: 100dvh;
  align-items: center;
  @media screen and (max-width: 768px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
export default QuizMainPage