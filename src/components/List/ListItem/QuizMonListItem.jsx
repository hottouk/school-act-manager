import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useFetchStorageImg from '../../../hooks/Game/useFetchStorageImg'
import question_icon from '../../../image/icon/question.png'

const QuizMonListItem = ({ item, onClick }) => {
  useEffect(() => { fetchImgUrl(monster.path, setMonImg) }, [item])
  const { monster } = item
  const { step } = monster
  const { fetchImgUrl } = useFetchStorageImg();
  const [monImg, setMonImg] = useState([]);
  return (
    <Container>
      {monImg && <MonsterImg src={monImg || question_icon} onClick={() => { onClick(item) }} />}
      <TextWrapper>
        <StyledTitle>{item.title}</StyledTitle>
        <StyledText style={{ fontSize: "17px" }}>{`${step[0].name}`}</StyledText>
        <StyledText>{item.content}</StyledText>
      </TextWrapper>
    </Container>
  )
}

const Container = styled.li`
  display: flex;
  width: 260px;
  margin: 10px 5px;
  border: 1px solid rgb(120,120,120,0.5);
  border-radius: 15px;
  padding: 10px;
`
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  white-space: nowrap;  /* 텍스트를 한 줄로 유지 */
  overflow: hidden;     /* 넘치는 텍스트 숨기기 */
  text-overflow: ellipsis; /* 넘치는 텍스트를 생략(...) 처리 */
`
const StyledTitle = styled.h5`
  font-weight: bold;
  color: #3454d1;
`
const MonsterImg = styled.img`
  width: 100px;
  border: 1px solid rgb(120,120,120,0.5);
  border-radius: 50px;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background-color: orange;
  }
`
const StyledText = styled.p`
  margin: 0;
`
export default QuizMonListItem
