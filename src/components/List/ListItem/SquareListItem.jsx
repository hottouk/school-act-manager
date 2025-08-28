//라이브러리
import React from 'react'
import styled from 'styled-components'
//컴포넌트
import PetImg from '../../PetImg'
//이미지
import exclamationMark from '../../../image/icon/exclamation.png'

// 리펙토링(250126) -> 등록, 미등록자 구분(250205)
const SquareListItem = ({ item, onClick, type }) => {
  const { master, subject, title, writtenName, level, path, studentNumber } = item;
  let name = writtenName || "미등록";
  if (master) name = master.studentName;
  return (
    <Container>
      {type === "student" && <>
        <ImgWrapper>
          <PetImg subject={subject || "담임"} level={level || 0} onClick={() => { onClick(item) }} path={path} styles={{ width: "80px", height: "80px" }} />
        </ImgWrapper>
        <TextWrapper>
          {master && <p style={{ marginBottom: "0px", fontWeight: "bold", color: "#3454d1" }}>{studentNumber}</p>}
          {master && <p style={{ color: "#3454d1", fontWeight: "bold" }}>{name}</p>}
          {!master && <p style={{ marginBottom: "0px", fontWeight: "bold" }}>{studentNumber}</p>}
          {!master && <p>{name}</p>}
        </TextWrapper></>}
      {
        type === "acti" && <>
          <ImgWrapper>
            <ActiImg src={exclamationMark} onClick={() => { onClick(item) }} style={{ width: "80px", height: "80px" }} />
          </ImgWrapper>
          <TextWrapper>
            <ActiTitle >{title}</ActiTitle>
          </TextWrapper>
        </>
      }
    </Container >
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
  border: 1px rgba(120,120,120,0.5) solid;
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
const ActiTitle = styled.p`
  height: 50px;             /* 원하는 높이 */
  display: -webkit-box;     /* Flexbox와 유사한 텍스트 제한 박스 */
  -webkit-line-clamp: 2;    /* 표시할 줄 수 (2줄 제한 예시) */
  -webkit-box-orient:   vertical;
  overflow: hidden;         /* 넘치는 텍스트 숨기기 */
`
const ActiImg = styled.img`
  width: 134px;
  padding: 10px;
`
export default SquareListItem
