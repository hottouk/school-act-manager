import React, { useEffect, useState } from 'react'
import useClientHeight from '../../hooks/useClientHeight'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
//컴포넌트
import CardList from '../../components/CardList'
//CSS
import styled from 'styled-components'
import MainBtn from '../../components/Btn/MainBtn'
import useFetchFireData from '../../hooks/useFetchFireData'


const WordSetMain = () => {
  //전역변수 user정보
  const user = useSelector(({ user }) => { return user })
  const navigate = useNavigate()
  const [_wordList, setWordList] = useState([])
  const { fetchWordList } = useFetchFireData()
  //CSS
  const clientHeight = useClientHeight(document.documentElement)

  useEffect(() => {
    fetchWordList().then(wordList => { setWordList(wordList); })
  }, [])

  return (
    <StyledContainer $clientheight={clientHeight}>
      {user.isTeacher && <>
        <CardList dataList={_wordList} type="word" //교사
          title="생성 단어 세트 목록"
          comment="아직 단어 세트가 없습니다. 단어 세트를 생성해주세요" />
        <MainBtn btnName="단어 세트 만들기" btnOnClick={() => { navigate("/words_setting") }} />
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

export default WordSetMain