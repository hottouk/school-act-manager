//라이브러리리
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
//컴포넌트
import MainWrapper from '../../components/Styled/MainWrapper'
import MainContainer from '../../components/Styled/MainContainer'
import SearchBar from '../../components/Bar/SearchBar'
import CardList from '../../components/List/CardList'
import MainBtn from '../../components/Btn/MainBtn'
//hooks
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import useMediaQuery from '../../hooks/useMediaQuery'
//생성(250104)
const QuizMainPage = () => {
  //준비
  const user = useSelector(({ user }) => { return user });
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const { fetchData } = useFireBasic("quiz");
  //데이터
  const [quizSetList, setQuizSetList] = useState([]);
  useEffect(() => {
    const bindQuizData = async () => {
      const qiozData = await fetchData("uid") || [];
      setQuizSetList(qiozData);
    }
    bindQuizData();
  }, [fetchData]);
  return (
    <MainContainer>
      {user.isTeacher && <MainWrapper>
        <SearchBar title={"나의 단어장"} />
        <CardList dataList={quizSetList} type="quiz" />
      </MainWrapper>}
      {isMobile &&
        <MainBtn
          onClick={() => { navigate("/quiz_setting") }}
          styles={{ margin: "10px 0 0 0" }}>새 단어장 만들기
        </MainBtn>}
    </MainContainer>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
export default QuizMainPage