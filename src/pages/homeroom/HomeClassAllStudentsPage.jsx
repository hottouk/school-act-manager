//라이브러리
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//컴포넌트
import SmallBtn from '../../components/Btn/SmallBtn';
import ExportAsExcel from '../../components/ExportAsExcel';
import EmptyResult from '../../components/EmptyResult';
//hooks
import useGetByte from '../../hooks/useGetByte';
import useClassAuth from '../../hooks/useClassAuth';
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData';
import UpperTab from '../../components/UpperTab';
//css
import styled from 'styled-components';
//이미지
import SubNav from '../../components/Bar/SubNav';
import BackBtn from '../../components/Btn/BackBtn';

//2024.10.22 생성
const HomeClassAllStudentsPage = () => {
  //----1.변수부--------------------------------
  //교사 인증
  const { log } = useClassAuth();
  if (log) { window.alert(log) }
  useEffect(() => { setIsVisible(true) }, [])
  //반 정보
  const params = useParams(); //{ id:'id'} 반환
  const classId = params.id
  const thisClass = useSelector(({ classSelected }) => { return classSelected }) //반 전역변수
  //학생 정보 데이터 통신
  const { studentList } = useFetchRtMyStudentData("classRooms", thisClass.id, "students", "studentNumber") //모든 학생 List
  //선택 탭
  const [tab, setTab] = useState(1)
  //현재 행 수정
  const [thisModifying, setThisModifying] = useState('')
  //학생 속성
  const [newName, setNewName] = useState('')
  const [newRecord, setNewRecord] = useState('')
  const { getByteLengthOfString } = useGetByte();
  const { updateStudent } = useAddUpdFireData("classRooms")
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)

  //----2.함수부--------------------------------
  //학생 개별 수정
  const handleModiBtnOnClick = (key, name, record) => {
    setThisModifying(key)
    setNewName(name)
    setNewRecord(record)
  }
  //tab에 따라 다른 기록 반환
  const handleRecord = (student) => {
    if (tab === 1) {
      return student.behaviorOpinion
    } else if (tab === 2) {
      return student.selfAccRecord
    } else if (tab === 3) {
      return student.careerAccRecord
    }
  }
  //저장 버튼
  const handleSaveBtnOnClick = (key) => {
    let student
    if (tab === 1) {
      student = { behaviorOpinion: newRecord, writtenName: newName }
    } else if (tab === 2) {
      student = { selfAccRecord: newRecord, writtenName: newName }
    } else if (tab === 3) {
      student = { behaviorOpinion: newRecord, writtenName: newName }
    }
    updateStudent(student, classId, key); //데이터 통신       
    setThisModifying('');
  }
  //취소 버튼
  const handleCancleBtnOnClick = () => {
    setThisModifying('');
    setNewName('');
    setNewRecord('');
  }

  return (
    <Container $isVisible={isVisible}>
      <SubNav>
        <BackBtn />
        <ExportAsExcel type="home" />
      </SubNav>
      <TabWrapper>
        <UpperTab className="tab1" value={tab} top="-4px" left="96px" onClick={() => { setTab(1) }}>행동특성</UpperTab>
        <UpperTab className="tab2" value={tab} top="-4px" left="190px" onClick={() => { setTab(2) }}>자율</UpperTab>
        <UpperTab className="tab3" value={tab} top="-4px" left="252px" onClick={() => { setTab(3) }}>진로</UpperTab>
      </TabWrapper>
      <StyledGirdContainer>
        <HeaderWrapper>
          <StyledHeader>연번</StyledHeader>
          <StyledHeader>학번</StyledHeader>
          <StyledHeader>이름</StyledHeader>
          <StyledHeader>행동특성 및 종합 의견</StyledHeader>
          <StyledHeader>Byte</StyledHeader>
          <StyledHeader>수정</StyledHeader>
        </HeaderWrapper>
        {!studentList && <EmptyWrapper><EmptyResult comment="학생 목록이 텅텅 비었어요." /></EmptyWrapper>}
        {(studentList && studentList.length > 0) && studentList.map((student, index) => {
          let key = student.id
          let isModifying = (thisModifying === key)                          //현재 수정 중
          let studentNumber = student.studentNumber
          let name = (student.writtenName || "미등록")
          let record = (handleRecord(student) || "기록 없음")
          let bytes = ((record !== "기록 없음") ? getByteLengthOfString(record) : 0)

          return <React.Fragment key={key}>
            <StyledGridItem>{index + 1}</StyledGridItem>                     {/* 연번 */}
            <StyledGridItem>{studentNumber}</StyledGridItem>                 {/* 학번 */}
            <StyledGridItem>                                                 {/* 이름 */}
              {!isModifying
                ? name
                : <StyledNameInput type="text" value={newName} onChange={(event) => setNewName(event.target.value)} />}
            </StyledGridItem>
            <StyledGridItem className="left-align">                          {/* 행발 */}
              {!isModifying
                ? record
                : <StyledTextArea type="text" value={newRecord} onChange={(event) => setNewRecord(event.target.value)} />}
            </StyledGridItem> {/* 기록 */}
            <StyledGridItem>{bytes}</StyledGridItem>                         {/* 바이트 */}
            <StyledGridItem>
              {!isModifying && <SmallBtn btnName="수정" btnOnClick={() => { handleModiBtnOnClick(key, name, record) }} hoverBtnColor="blue" />}
              {isModifying &&
                <FlexColWrapper>
                  <SmallBtn btnName="저장" btnOnClick={() => { handleSaveBtnOnClick(key) }} hoverBtnColor="blue" />
                  <SmallBtn btnName="취소" btnOnClick={handleCancleBtnOnClick} btnColor="#9b0c24" hoverBtnColor="red" />
                </FlexColWrapper>
              }
            </StyledGridItem>
          </React.Fragment>
        })}
      </StyledGirdContainer>
    </Container>
  )
}

const Container = styled.div`
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
  @media screen and (max-width: 767px){
  }
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
  grid-template-rows: 40px;
`
const TabWrapper = styled.div`
  position: relative;
`
// lastChild의 범위를 한정하는 역할
const HeaderWrapper = styled.div` 
  display: contents;
`
const StyledHeader = styled.div`
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
const StyledGridItem = styled.div`
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
const StyledNameInput = styled.input`
  display: block;
  width: 85px;
  height: 50%;
  border-radius: 10px;
`
const StyledTextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`
export default HomeClassAllStudentsPage