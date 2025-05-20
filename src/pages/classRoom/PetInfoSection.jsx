//라이브러리
import React from 'react'
import styled from 'styled-components'
//컴포넌트
import PetImg from '../../components/PetImg'

//생성(250223)
const PetInfoSection = ({ pet, isModifiying, setWrittenName, writtenName }) => {
  const { subject, studentNumber, name, level, master, desc, path } = pet;
  return (
    <Container>
      <StudentInfoWrapper>
        <PetImgWrapper><PetImg subject={subject} onClick={() => { }} path={path} styles={{ width: "100px", height: "100px" }} /></PetImgWrapper>
        <Row style={{ flexDirection: "column", padding: "12px", justifyContent: "space-evenly" }}>
          <p>학번: {studentNumber}</p>
          <p>이름: {!isModifiying
            ? writtenName ? writtenName : '미등록'
            : <ModifyingInput type="text" defaultValue={writtenName} onChange={(event) => { setWrittenName(event.target.value) }} />
          }</p>
          <p style={{ margin: "0" }}> 가입여부: {master ? "O" : "X"}</p>
        </Row>
      </StudentInfoWrapper>
      <Row style={{ flexDirection: "column", padding: "12px", marginTop: "12px", justifyContent: "space-evenly" }}>
        <p>펫이름: {name || "미정"}</p>
        <p>레벨: {level?.level || 1}</p>
        {desc && <p>{desc}</p>}
        {!desc && <p>주인의 행동에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다.</p>}
      </Row>
    </Container>
  )
}

const Container = styled.div`
	display: grid;
  grid-template-columns: 250px 1fr; 
  background-color: #efefef;
  border-radius: 15px;
  @media screen and (max-width: 768px){
    display: flex;
    flex-direction: column;
  }
`
const Row = styled.div`
	display: flex;
`
const ModifyingInput = styled.input`
	width: 130px;
  height: 35px;
  padding: 5px;
  border-radius: 5px;
  border: none;
`
const PetImgWrapper = styled(Row)`
  align-items: center;
  img {
    padding: 7px;
    border: 1px solid rgba(120,120,120,0.5);
    border-radius: 70px;
    background-color: white;
  }
`
const StudentInfoWrapper = styled(Row)`
  grid-column: 1/2;
  padding: 15px;
  border-right: 1px solid rgba(120,120,120,0.5);
   @media screen and (max-width: 767px){
    width: 100%;
    height: 64%;
    top: 95px;
    bottom: 0;
    right: 0;
    border: none;
    border-radius: 0;
    p { margin-bottom: 8px; }
    p input { width: 25%; }
  }
`

export default PetInfoSection
