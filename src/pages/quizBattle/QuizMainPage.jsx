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
//25.01.14
const WordMain = () => {
  //준비
  const user = useSelector(({ user }) => { return user })
  const navigate = useNavigate()
  const clientHeight = useClientHeight(document.documentElement)
  //랜더링 데이터
  const [_quizSetList, setQuizSetList] = useState([])
  const { fetchData } = useFireBasic("quiz")
  useEffect(() => { fetchData("uid").then(quizSetList => { setQuizSetList(quizSetList) }) }, [])
  return (
    <StyledContainer $clientheight={clientHeight}>
      {user.isTeacher && <>
        <CardList dataList={_quizSetList} type="quiz" //교사
          comment="아직 퀴즈 세트가 없습니다. 퀴즈 세트를 생성해주세요" />
        <Row><MainBtn onClick={() => { navigate("/quiz_setting") }}>퀴즈 세트 만들기</MainBtn></Row>
      </>}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 20px auto;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0; 
`

export default WordMain