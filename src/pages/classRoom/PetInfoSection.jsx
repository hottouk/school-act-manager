//라이브러리
import React from 'react'
import styled from 'styled-components'
//컴포넌트
import PetImg from '../../components/PetImg'
import XBtn from '../../components/Btn/XBtn'
import useFirePetData from '../../hooks/Firebase/useFirePetData'
import { useSelector } from 'react-redux'
import useFireUserData from '../../hooks/Firebase/useFireUserData'
//생성(250223)->수정(250820)
const PetInfoSection = ({ pet, isModifiying, setWrittenName }) => {
  const user = useSelector(({ user }) => user);
  const { subject, studentNumber, name, level, master, desc, path, id, classId, writtenName, } = pet;
  const isMaster = user.uid === master?.studentId;
  const { deletePetField } = useFirePetData();
  const { exportKlassTransaction } = useFireUserData();
  //구독 취소
  const handleDeSubscribeOnClick = () => {
    const confirm = window.confirm("학생의 구독 정보가 삭제되고 클래스에서 탈퇴됩니다. 계속 하시겠습니까?");
    if (confirm) {
      const studentId = master?.studentId;
      deletePetField(classId, id, "master").then(() => { alert("구독 정보가 삭제되었습니다."); });
      exportKlassTransaction(studentId, classId);
    }
  }
  return (
    <Container>
      <StudentInfoWrapper>
        <PetImgWrapper><PetImg subject={subject} onClick={() => { }} path={path} styles={{ width: "100px", height: "100px" }} /></PetImgWrapper>
        <Column style={{ padding: "12px", justifyContent: "space-evenly", gap: "5px" }}>
          <span>학번: {studentNumber}</span>
          <Row style={{ alignItems: "center" }}><span>이름:&nbsp;</span>{!isModifiying
            ? writtenName ? writtenName : '미등록'
            : <ModifyingInput type="text" defaultValue={''} onChange={(event) => { setWrittenName(event.target.value) }} />
          }</Row>
          <Row > <span>가입여부:&nbsp;</span>
            {master
              ?
              <Row style={{ gap: "10px" }}>
                <span>{master.studentName}(으)로 가입</span>
                {(isMaster || user.isTeacher) && <XBtn
                  styles={{ backgroundColor: "red", color: "white" }}
                  onClick={() => { handleDeSubscribeOnClick(); }} />}
              </Row>
              : "미가입"}
          </Row>
        </Column>
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
  grid-template-columns: 1fr 3fr; 
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
const Column = styled(Row)`
  flex-direction: column;
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
