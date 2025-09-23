//라이브러리
import { useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
//컴포넌트
import SmallBtn from '../../components/Btn/SmallBtn';
import ExportAsExcel from '../../components/ExportAsExcel';
import EmptyResult from '../../components/EmptyResult';
import SubNav from '../../components/Bar/SubNav';
import BackBtn from '../../components/Btn/BackBtn';
import PrintBtn from '../../components/Btn/PrintBtn';
import UpperTab from '../../components/UpperTab';
import MidBtn from '../../components/Btn/MidBtn';
//hooks
import useGetByte from '../../hooks/useGetByte';
import useClassAuth from '../../hooks/useClassAuth';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData';
import useFirePetData from '../../hooks/Firebase/useFirePetData';
//css
import styled from 'styled-components';
//생성(20241022) -> 인쇄,진로,자율 추가(241223) -> 로직 수정(250922)
const HomeClassAllStudentsPage = () => {
  //교사 인증
  const { log } = useClassAuth();
  if (log) { window.alert(log) };
  const user = useSelector(({ user }) => user);
  useEffect(() => { setIsVisible(true) }, []);
  const navigate = useNavigate();
  //반 정보
  const params = useParams(); //{ id:'id'} 반환
  const classId = params.id
  const thisClass = useSelector(({ classSelected }) => { return classSelected }) //반 전역변수
  //학생 정보 데이터 통신
  const { studentDataList } = useFetchRtMyStudentData("classRooms", thisClass.id, "students", "studentNumber") //모든 학생 List
  const { updatePetInfo } = useFirePetData();
  const [_studentList, setStudentList] = useState([]);
  const [_origin, setOrigin] = useState(null);
  useEffect(() => { setStudentList(studentDataList); }, [studentDataList]);
  //선택 탭
  const [tab, setTab] = useState(1)
  //행 수정
  const [isModifying, setisModifying] = useState('');
  //학생 속성
  const { getByteLengthOfString } = useGetByte();
  //에니메이션
  const [isVisible, setIsVisible] = useState(false);
  //인쇄
  const printRef = useRef({});
  const handlePrint = useReactToPrint({ contentRef: printRef });
  //css
  const nameFontStyle = { cursor: "pointer", fontWeight: "bold", textDecoration: "underline" };
  //------함수부------------------------------------------------
  //tab에 따라 다른 기록 반환
  const getRecord = (student) => {
    if (!student) return;
    const { actList, behaviorOpinion } = student;
    if (tab === 1) {
      return behaviorOpinion;
    } else if (tab === 2) {
      const selfList = actList?.filter((item) => item.subjDetail === "자율");
      return selfList?.reduce((acc, cur) => acc + " " + cur.record, '');
    } else if (tab === 3) {
      const carList = actList?.filter((item) => item.subjDetail === "진로")
      return carList?.reduce((acc, cur) => acc + " " + cur.record, '');
    }
  }
  //진로, 자율 활동 반환
  const getActiList = (student) => {
    if (!student) return;
    const { actList } = student;
    if (tab === 2) { return actList?.filter((item) => item.subjDetail === "자율"); }
    else if (tab === 3) { return actList?.filter((item) => item.subjDetail === "진로") }
  }
  //수정 버튼
  const handleEditOnClick = (key) => {
    setisModifying(key);
    setOrigin(JSON.parse(JSON.stringify(_studentList))); //깊은 복사(배열,객체는 메모리 참조)
  }
  //취소 버튼
  const handleCancleBtnOnClick = () => {
    setisModifying('');
    setStudentList(JSON.parse(JSON.stringify(_origin))); //깊은 복사
  }
  //활동 문구 변경
  const handleRecordOnChage = (event, index, actiIndex) => {
    setStudentList((prev) => {
      const students = [...prev];
      const student = students[index];
      if (tab === 1) { student.behaviorOpinion = event.target.value; }
      else { getActiList(student)[actiIndex].record = event.target.value; }
      return students;
    })
  }
  //진로, 자율 추가
  const handleAddActiOnClick = (index) => {
    setStudentList((prev) => {
      const subjDetail = tab === 2 ? "자율" : "진로";
      const assignedDate = new Date().toISOString().split('T')[0];
      const newActi = { title: "임의기록", id: "random" + assignedDate, record: "", uid: user.uid, assignedDate, subject: "담임", subjDetail, madeBy: user?.name || "익명" };
      const students = [...prev];
      const student = students[index];
      student.actList ??= [];
      student.actList.push(newActi);
      return students;
    })
  }
  //진로, 자율 삭제
  const handleDeleteOnClick = (i, j) => {
    setStudentList((prev) => {
      const students = [...prev];
      const student = students[i];
      const { actList } = student;
      const selfList = actList?.filter((item) => item.subjDetail === "자율");
      const carList = actList?.filter((item) => item.subjDetail === "진로")
      if (tab === 2) {
        selfList.splice(j, 1);
        student.actList = [...selfList, ...carList];
      }
      else if (tab === 3) {
        carList.splice(j, 1);
        student.actList = [...selfList, ...carList];
      }
      return students;
    })
  }
  //저장 버튼
  const handleSaveBtnOnClick = (index) => {
    const student = _studentList[index];
    let { id: petId, actList, behaviorOpinion } = student;
    actList ??= [];
    behaviorOpinion ??= '';
    updatePetInfo(classId, petId, { actList, behaviorOpinion });
    setisModifying('');
  }

  return (
    <Container $isVisible={isVisible}>
      <SubNav>
        <BackBtn />
        <ExportAsExcel type="home" />
        <PrintBtn onClick={() => { handlePrint() }} />
      </SubNav>
      <StyledGirdContainer ref={printRef}>
        <TabWrapper >
          <UpperTab className="tab1" value={tab} onClick={() => { setTab(1) }}>행동특성</UpperTab>
          <UpperTab className="tab2" value={tab} left="88px" onClick={() => { setTab(2) }}>자율</UpperTab>
          <UpperTab className="tab3" value={tab} left="147px" onClick={() => { setTab(3) }}>진로</UpperTab>
        </TabWrapper>
        <HeaderWrapper>
          <Header>연번</Header>
          <Header>학번</Header>
          <Header>이름</Header>
          <Header>행동특성 및 종합 의견</Header>
          <Header>Byte</Header>
          <Header>수정</Header>
        </HeaderWrapper>
        {!_studentList && <EmptyWrapper><EmptyResult comment="학생 목록이 텅텅 비었어요." /></EmptyWrapper>}
        {(_studentList && _studentList.length > 0) && _studentList.map((student, index) => {
          const { id, studentNumber, writtenName } = student;
          const key = id;
          const accRecord = getRecord(student);
          const thisModifying = (isModifying === key);
          const bytes = (accRecord ? getByteLengthOfString(accRecord) : 0);
          return <React.Fragment key={index + id}>
            {/* 연번 */}
            <GridItem>{index + 1}</GridItem>
            {/* 학번 */}
            <GridItem>{studentNumber}</GridItem>
            {/* 이름 */}
            <GridItem><p onClick={() => { navigate(`/homeroom/${classId}/${key}`) }} style={nameFontStyle}>{writtenName || "미등록"}</p></GridItem>
            {/* 문구 */}
            <GridItem className="left-align">
              {!thisModifying && accRecord}
              {/* 행발 수정 */}
              {(thisModifying && tab === 1) && <TextArea
                placeholder="이 곳에 새로운 활동을 기록하세요"
                value={accRecord}
                onChange={(event) => handleRecordOnChage(event, index)} />}
              {/* 자율, 진로 수정 */}
              {(thisModifying && tab !== 1) && <Column style={{ width: "100%", gap: "5px" }}>
                {getActiList(student)?.map((acti, actiIndex) => {
                  const { record, id } = acti;
                  return <Row key={actiIndex + id} style={{ position: "relative" }}>
                    <TextArea
                      placeholder="이 곳에 새로운 활동을 기록하세요"
                      value={record}
                      onChange={(event) => handleRecordOnChage(event, index, actiIndex)} />
                    <XBtn onClick={() => { handleDeleteOnClick(index, actiIndex) }}>X</XBtn>
                  </Row>
                })}
                <Row style={{ justifyContent: "center" }}><MidBtn onClick={() => { handleAddActiOnClick(index) }}>기록 추가</MidBtn></Row>
              </Column>}
            </GridItem>
            {/* 바이트 */}
            <GridItem>{bytes}</GridItem>
            <GridItem>
              {!isModifying && <SmallBtn btnOnClick={() => { handleEditOnClick(key) }} hoverBtnColor="blue">수정</SmallBtn>}
              {thisModifying &&
                <FlexColWrapper>
                  <SmallBtn btnOnClick={() => { handleSaveBtnOnClick(index) }} hoverBtnColor="blue" >저장</SmallBtn>
                  <SmallBtn btnOnClick={handleCancleBtnOnClick} btnColor="#9b0c24" hoverBtnColor="red" >취소</SmallBtn>
                </FlexColWrapper>
              }
            </GridItem>
          </React.Fragment>
        })}
      </StyledGirdContainer>
    </Container>
  )
}

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Container = styled.div`
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
`
const FlexColWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
const StyledGirdContainer = styled.div`
  margin: 50px auto;
  display: grid;
  justify-content: center;
  grid-template-columns: 70px 100px 100px 1000px 60px 100px; 
  grid-template-rows: 1fr 40px;
  @media print {
    @page { margin : 5mm; }
  }
`
const TabWrapper = styled.div`
  grid-column: 1/7;
  grid-row: 1/2;
  position: relative;
  top: -34px;
`
// lastChild의 범위를 한정하는 역할
const HeaderWrapper = styled.div` 
  display: contents;
`
const Header = styled.div`
  display: flex;
  background-color: #3454d1;
  color: white;
  padding: 10px;
  font-weight: bold;
  justify-content: center;
  &: first-child {
    border-top-left-radius: 0px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
`
const EmptyWrapper = styled.div`
  width: 100%;
  background-color: #efefef;
  grid-column-start: 1;
  grid-column-end: 7;
  border-bottom-left-radius: 5px;
  border
`
const GridItem = styled.div`
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  
  &.left-align { 
    text-align: left;
  }
`
const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`
const XBtn = styled.p`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  background-color: rgba(120,120,120,0.5);
  border-radius: 3px;
  cursor: pointer;
`
export default HomeClassAllStudentsPage