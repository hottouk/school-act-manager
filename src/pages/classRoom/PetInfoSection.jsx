//라이브러리
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
//컴포넌트
import PetImg from '../../components/PetImg'
import DotTitle from '../../components/Title/DotTitle'
import HexagonRadarChart from '../../components/Chart/HexagonRadarChart'
//hooks
import useFirePetData from '../../hooks/Firebase/useFirePetData'
import useFireUserData from '../../hooks/Firebase/useFireUserData'
import useMediaQuery from '../../hooks/useMediaQuery'
//상수
import { ERROR_MSG } from '../../constants/errMsg'
//이미지
import x_btn from "../../image/icon/x_btn.png"
//생성(250223) -> 수정(250820) -> 삭제버튼 이동 및 디자인(260129)
const PetInfoSection = ({ pet, isEdit, setWrittenName, handlePetDeleteOnClick }) => {
  const user = useSelector(({ user }) => user);
  const isMobile = useMediaQuery('(max-width: 768px)');
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
          {isEdit && <TextInput type="text" defaultValue={studentName} onChange={(event) => setWrittenName(event.target.value)} />}
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
        {/* 모바일 UI */}
        {isMobile && <>
          <div style={{ position: "absolute", top: "2%", right: "2%" }}>
            <PetImgWrapper>
              <PetImg subject={subject} onClick={() => { }} path={path} styles={{ width: "100px", height: "100px" }} />
            </PetImgWrapper>
          </div>
          <Row>
            <DotTitle>펫 이름</DotTitle>
            <BasicText>{name || "미정"}</BasicText>
          </Row>
          <Row>
            <DotTitle>펫 레벨</DotTitle>
            <BasicText>{level?.level || 1}</BasicText>
          </Row>
        </>}
      </PetInfoWrapper>
      <HexagonRadarChartWrapper>
        <HexagonRadarChart
          labels={['리더십', '협동', '학업', '탐구', '태도', '진로']}
          values={[leadership, coop, study, research, attitude, career]}
          size={225}
          gridColor={"rgb(200, 200, 200)"}
        />
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
      </HexagonRadarChartWrapper>
      {!isMobile && <Column style={{ gap: "10px" }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Column style={{ gap: "10px", marginLeft: "10px" }}>
            <Row>
              <DotTitle>펫 이름</DotTitle>
              <BasicText>{name || "미정"}</BasicText>
            </Row>
            <Row>
              <DotTitle>펫 레벨</DotTitle>
              <BasicText>{level?.level || 1}</BasicText>
            </Row>
          </Column>
          <PetImgWrapper>
            <PetImg subject={subject} onClick={() => { }} path={path} styles={{ width: "100px", height: "100px" }} />
          </PetImgWrapper>
        </Row>
        <Column style={{ gap: "10px", borderTop: "1px solid #78787890", paddingTop: "10px" }}>
          {desc && <BasicText>{desc}</BasicText>}
          {!desc && <p>주인의 행동에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다.</p>}
        </Column>
      </Column>}
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
  grid-template-columns: 250px 350px 1fr;
  padding: 15px;
  background-color: #efefef;
  border-radius: 15px;
  @media (max-width: 768px){
    display: flex;
    flex-direction: column;
    gap: 15px;
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
  border-bottom: 1px solid #78787890;
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
   @media screen and (max-width: 767px){
    position: relative;
    width: 100%;
    height: 64%;
    border: none;
    border-radius: 0;
    p { margin-bottom: 8px; }
    p input { width: 25%; }
  }
`
const HexagonRadarChartWrapper = styled(Column)`
  grid-column: 2/3;
  align-items: center; 
  border-right: 1px solid #78787890;
  border-left: 1px solid #78787890;
  margin-right: 15px;
  padding: 0 15px;
  @media screen and (max-width: 767px){
    width: 100%;  
    height: 36%;
    top: 159px;   
    bottom: 0;
    right: 0;
    border: none;
    border-radius: 0;
    padding: 0;
  }
`
const BasicText = styled.p`
  margin: 0;
`
export default PetInfoSection