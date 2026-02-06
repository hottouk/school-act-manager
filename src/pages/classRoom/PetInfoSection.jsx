//라이브러리
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
//컴포넌트
import PetImg from '../../components/PetImg'
import ClickableIcon from '../../components/Styled/ClickableIcon'
//hooks
import useFirePetData from '../../hooks/Firebase/useFirePetData'
import useFireUserData from '../../hooks/Firebase/useFireUserData'
//상수
import { ERROR_MSG } from '../../constants/errMsg'
//이미지
import x_btn from "../../image/icon/x_btn.png"
//생성(250223) -> 수정(250820) -> 삭제버튼 이동(260129)
const PetInfoSection = ({ pet, isModifiying, setWrittenName, handlePetDeleteOnClick }) => {
  const user = useSelector(({ user }) => user);
  const { subject, studentNumber, name, level, master, desc, path, id, classId, writtenName, } = pet;
  const studentName = writtenName ? writtenName : '미등록';
  const isMaster = user.uid === master?.studentId;
  const { deletePetField } = useFirePetData();
  const { exportKlassTransaction } = useFireUserData();
  //구독 해지
  const handleDesubscribeOnClick = async () => {
    const confirm = window.confirm("학생의 구독 정보가 삭제되고 클래스에서 탈퇴됩니다. 계속 하시겠습니까?");
    if (!confirm) return;
    const studentId = master?.studentId;
    try {
      await deletePetField(classId, id, "master");
      await exportKlassTransaction(studentId, classId);
      alert("구독 정보가 삭제되었습니다.");
    } catch (err) { alert(ERROR_MSG.desubscribe, err); }
  }
  return (
    <InfoSection>
      <Row>
        <StudentInfoWrapper>
          <PetImgWrapper><PetImg subject={subject} onClick={() => { }} path={path} styles={{ width: "100px", height: "100px" }} /></PetImgWrapper>
          <Column style={{ justifyContent: "space-evenly", gap: "10px" }}>
            <span>학번: {studentNumber}</span>
            <Row style={{ alignItems: "center" }}><span>이름:&nbsp;</span>
              {!isModifiying
                ? studentName
                : <ModifyingInput type="text" defaultValue={studentName} onChange={(event) => { setWrittenName(event.target.value) }} />
              }</Row>
            <Row> <span>가입여부:&nbsp;</span>
              {master
                ? <Row style={{ gap: "10px" }}>
                  <span>{master.studentName}(으)로 가입</span>
                  {(isMaster || user.isTeacher) && <img src={x_btn} style={{ width: "25px", height: "25px", cursor: "pointer" }} alt='탈퇴 버튼' onClick={() => handleDesubscribeOnClick()} />}
                </Row>
                : "미가입"}
            </Row>
          </Column>
        </StudentInfoWrapper>
        <Column style={{ padding: "10px", justifyContent: "space-evenly", gap: "10px" }}>
          <BasicText>펫이름: {name || "미정"}</BasicText>
          <BasicText>레벨: {level?.level || 1}</BasicText>
          {desc && <BasicText>{desc}</BasicText>}
          {!desc && <p>주인의 행동에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다.</p>}
        </Column>
      </Row>
      <Row style={{ justifyContent: "flex-end", alignItems: "flex-start" }}>
        <ClickableIcon className='fa-solid fa-trash' onClick={handlePetDeleteOnClick} />
      </Row>
    </InfoSection>
  )
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const InfoSection = styled(Row)`
  padding: 15px;
  justify-content: space-between;
  background-color: #efefef;
  border-radius: 15px;
  @media screen and (max-width: 768px){
    display: flex;
    flex-direction: column;
  }
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
  gap: 20px;
  padding: 10px;  
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
const BasicText = styled.p`
  margin: 0;
`
export default PetInfoSection