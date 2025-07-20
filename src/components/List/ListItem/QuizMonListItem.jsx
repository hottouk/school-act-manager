//라이브러리
import { useEffect, useState } from 'react'
import styled from 'styled-components'
//hooks
import useFetchStorageImg from '../../../hooks/Game/useFetchStorageImg'
//이미지
import question_icon from '../../../image/icon/question.png'
//정비(250720)
const QuizMonListItem = ({ item, onClick }) => {
  useEffect(() => { fetchImgUrl(monster.path, setMonImg) }, [item])
  const { monster, content, title } = item;
  const { step } = monster;
  const { fetchImgUrl } = useFetchStorageImg();
  const [monImg, setMonImg] = useState([]);
  return (
    <Container>
      {monImg && <MonsterImg src={monImg || question_icon} onClick={() => { onClick(item) }} />}
      <TextWrapper>
        <Title>{title}</Title>
        <Row><BasicText style={{ fontSize: "17px" }}>{`${step[0].name}`}</BasicText></Row>
        <BasicText>{content}</BasicText>
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
const Row = styled.div`
  display: flex;
  justify-content: space-between;
`
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  white-space: nowrap;      /* 텍스트를 한 줄로 유지 */
  overflow: hidden;         /* 넘치는 텍스트 숨기기 */
  text-overflow: ellipsis;  /* 넘치는 텍스트를 생략(...) 처리 */
`
const Title = styled.h5`
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
const BasicText = styled.p`
  margin: 0;
`
export default QuizMonListItem
