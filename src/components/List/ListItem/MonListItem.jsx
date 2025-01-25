//라이브러리
import React from 'react'
import styled from 'styled-components'
//컴포넌트
import PetImg from '../../PetImg'
//hooks
import useGetLevel from '../../../hooks/useGetLevel'

//250126(리펙토링)
const MonListItem = ({ item, onClick, type }) => {
  const { getExpAndLevelByActList } = useGetLevel();
  const actList = item.actList
  const expAndLevel = actList ? getExpAndLevelByActList(actList) : { exp: 0, level: 0 };
  return (
    <Container>
      {type === "student" && <>
        <ImgWrapper>
          <PetImg subject={item.subject} level={expAndLevel.level} onClick={() => { onClick(item) }} styles={{ width: "80px" }} />
        </ImgWrapper>
        <TextWrapper>
          <p style={{ marginBottom: "0px", fontWeight: "bold" }}>{item.studentNumber}</p>
          <p>{item.writtenName || '미등록'}</p>
        </TextWrapper></>}
      {type === "acti" && <>
        <ImgWrapper>
          <PetImg onClick={() => { onClick(item) }} styles={{ width: "80px" }} />
        </ImgWrapper>
        <TextWrapper>
          <StyledActiTitle >{item.title}</StyledActiTitle>
        </TextWrapper>
      </>}
    </Container>
  )
}

const Container = styled.li`
  display: flex;
  flex-direction: column;
  margin: 10px;
  @media screen and (max-width: 767px){
    margin: 8px;
    img {
      width: 70px;
      height: 70px;
    }
  }
`
const ImgWrapper = styled.div`
  transition: transform 0.1s;
  border: 1px rgba(120,120,120,0.8) solid;
  border-radius: 15px;
  box-sizing: border-box;
  object-fit: cover;
  cursor: pointer;  
  &:hover {
    background-color: orange;
    transform: scale(1.3);
    z-index: 1;
  }
`
const TextWrapper = styled.div`
  width: 80px;
  height: 50px;
  text-align: center;
`

const StyledActiTitle = styled.p`
  height: 50px; /* 원하는 높이 */
  display: -webkit-box; /* Flexbox와 유사한 텍스트 제한 박스 */
  -webkit-line-clamp: 2; /* 표시할 줄 수 (2줄 제한 예시) */
  -webkit-box-orient: vertical;
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
`
export default MonListItem
