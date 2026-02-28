//라이브러리
import React, { useMemo } from 'react'
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
import HexagonRadarChart from '../../components/Chart/HexagonRadarChart'
import DotTitle from '../../components/Title/DotTitle'
//생성(250223) -> 수정(250820) -> 삭제버튼 이동 및 디자인(260129)
const PetInfoSection = ({ pet, isModifiying: isEdit, setWrittenName, handlePetDeleteOnClick }) => {
  const user = useSelector(({ user }) => user);
  const { subject, studentNumber, name, level, master, desc, path, id, classId, writtenName, actList } = pet || {};
  //육각형 능력치
  const { leadership, coop, study, research, attitude, career } = useMemo(() => {
    const initialScores = { leadership: 30, coop: 30, study: 30, research: 30, attitude: 30, career: 30 };
    if (!actList || actList.length === 0) return initialScores;
    return actList.reduce((acc, acti) => {
      const s = acti.scores || {};
      return {
        leadership: acc.leadership + (s.leadership || 0),
        coop: acc.coop + (s.coop || 0),
        study: acc.study + (s.study || 0),
        research: acc.research + (s.research || 0),
        attitude: acc.attitude + (s.attitude || 0),
        career: acc.career + (s.career || 0)
      };
    }, initialScores);
  }, [actList]);
  const studentName = writtenName ? writtenName : '미등록';
  const isMaster = user.uid === master?.studentId;
  const { deletePetField } = useFirePetData();
  const { exportKlassTransaction } = useFireUserData();
  //구독 해제
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
    <InfoGridSection>
      <PetInfoWrapper>
        <Row>
          <DotTitle>이름</DotTitle>
          {!isEdit && studentName}
          {isEdit && <TextInput type="text" defaultValue={studentName} onChange={(event) => { setWrittenName(event.target.value) }} />}
        </Row>
        <Row>
          <DotTitle>학번</DotTitle>
          <span>{studentNumber}</span>
        </Row>
        <Row>
          <DotTitle>가입여부</DotTitle>
          {master && <Row style={{ gap: "10px" }}>
            <span>{master.studentName}(으)로 가입</span>
            {(isMaster || user.isTeacher) && <img src={x_btn} style={{ width: "25px", height: "25px", cursor: "pointer" }} alt='탈퇴 버튼' onClick={() => handleDesubscribeOnClick()} />}
          </Row>}
          {!master && "미가입"}
        </Row>
      </PetInfoWrapper>
      <Column style={{ gap: "10px", paddingLeft: "20px" }}>
        <Row style={{ gap: "20px" }}>
          <PetImgWrapper>
            <PetImg subject={subject} onClick={() => { }} path={path} styles={{ width: "100px", height: "100px" }} />
          </PetImgWrapper>
          <Column style={{ gap: "10px" }}>
            <BasicText>펫이름: {name || "미정"}</BasicText>
            <BasicText>레벨: {level?.level || 1}</BasicText>
            {desc && <BasicText>{desc}</BasicText>}
            {!desc && <p>주인의 행동에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다.</p>}
          </Column>
        </Row>
        <GridTable>
          <HeaderWrapper>
            <TbHeader>리더십</TbHeader>
            <TbHeader>협동</TbHeader>
            <TbHeader>학업</TbHeader>
            <TbHeader>탐구</TbHeader>
            <TbHeader>태도</TbHeader>
            <TbHeader>진로</TbHeader>
          </HeaderWrapper>
          <GridItem>{leadership}</GridItem>
          <GridItem>{coop}</GridItem>
          <GridItem>{study}</GridItem>
          <GridItem>{research}</GridItem>
          <GridItem>{attitude}</GridItem>
          <GridItem>{career}</GridItem>
        </GridTable>
      </Column>
      <Column style={{ alignItems: "center" }}>
        <HexagonRadarChart
          labels={['리더십', '협동', '학업', '탐구', '태도', '진로']}
          values={[leadership, coop, study, research, attitude, career]}
          size={225}
          gridColor={"rgb(200, 200, 200)"}
        />
      </Column>
    </InfoGridSection>
  )
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const InfoGridSection = styled(Row)`
  display: grid;
  grid-template-columns: 260px 1fr 250px;
  padding: 15px;
  background-color: #efefef;
  border-radius: 15px;
  @media screen and (max-width: 768px){
    display: flex;
    flex-direction: column;
  }
`
const TextInput = styled.input`
	width: 100px;
  height: 35px;
  padding: 5px;
  border-radius: 5px;
  border: none;
`
const PetImgWrapper = styled(Row)`
  margin-bottom: 5px;
  img {
    padding: 7px;
    border: 1px solid rgba(120,120,120,0.5);
    border-radius: 70px;
    background-color: white;
  }
`
const GridTable = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 50px);
  justify-content: center;
`
const HeaderWrapper = styled.div`
  display: contents;
`
const TbHeader = styled(Row)`
  background-color: #3454d1b1;
  color: white;
  justify-content: center;
`
const GridItem = styled(Row)`
  background-color: white;
  color: black;
  justify-content: center;
`
const PetInfoWrapper = styled(Column)`
  grid-column: 1/2;
  gap: 10px;
  border-right: 1px solid #78787890;
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