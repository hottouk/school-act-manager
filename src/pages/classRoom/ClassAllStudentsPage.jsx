import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
//컴포넌트
import ExportAsExcel from "../../components/ExportAsExcel"
import SmallBtn from "../../components/Btn/SmallBtn"
import SubNav from "../../components/Bar/SubNav"
//hooks
import useClassAuth from "../../hooks/useClassAuth"
import useGetByte from "../../hooks/useGetByte"
import useAddUpdFireData from "../../hooks/Firebase/useAddUpdFireData"
import useClientHeight from "../../hooks/useClientHeight"
import useFetchRtMyStudentData from "../../hooks/RealTimeData/useFetchRtMyStudentListData"
//css
import styled from "styled-components"
//이미지
import recycleIcon from "../../image/icon/recycle_icon.png"

//2024.10.27(실시간 학생 데이터로 변경, writtenName, accRecord useState로 관리, transition 추가)
const ClassAllStudents = () => {
  //----1.변수부--------------------------------
  //교사 인증
  const { log } = useClassAuth();
  if (log) { window.alert(log) }
  useEffect(() => { setIsVisible(true) }, [])
  //경로 이동 props
  const params = useParams(); //id와 param의 key-value(id:'id') 오브젝트로 반환
  const classId = params.id
  //학생 정보 데이터 통신
  const { studentList } = useFetchRtMyStudentData("classRooms", classId, "students", "studentNumber")
  //학생 속성
  const { updateStudent } = useAddUpdFireData("classRooms")
  const { getByteLengthOfString } = useGetByte();
  const [newName, setNewName] = useState('')
  const [newAccRecord, setNewAccRecord] = useState('')
  //현재 행 수정
  const [thisModifying, setThisModifying] = useState('')
  //ref
  const textAreaRef = useRef({})
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)
  //css
  const clientHeight = useClientHeight(document.documentElement)

  //----2.함수부--------------------------------
  //수정버튼
  const handleModifyingBtn = (key, name, record) => {
    setThisModifying(key)
    setNewName(name)
    setNewAccRecord(record)
  }
  //저장 버튼
  const handleSaveBtn = (key) => {
    updateStudent({ accRecord: newAccRecord, writtenName: newName }, classId, key); //데이터 통신       
    setThisModifying('');
    setNewName('');
    setNewAccRecord('');
  }
  //활동 순서 랜덤 섞기
  const handleShuffleBtnOnClick = (id) => {
    let _student = studentList.find(student => student.id === id)
    let _actiList = _student.actList
    let newAccRec = (_actiList && _actiList.length > 0)
      ? shuffleOrder(_actiList).map(acti => { return acti.record }).join(" ")
      : ''
    textAreaRef.current.value = newAccRec;
    setNewAccRecord(newAccRec)
  }
  const shuffleOrder = (list) => {
    if (list && list.length > 1) {
      for (let i = list.length - 1; i > 0; i--) {//랜덤 섞기
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    return list
  }
  //활동 순서 전원 섞기
  const handleShuffleAllBtnOnClick = () => {
    if (window.confirm("이 단계에서 추가로 작성한 기록은 모두 사라집니다. 진행하시겠습니까?")) {
      studentList.map((student) => {
        let _actiList = student.actList
        let accRecord = (_actiList && _actiList.length > 0)
          ? shuffleOrder(_actiList).map(acti => { return acti.record }).join(" ")
          : ''
        updateStudent({ accRecord }, classId, student.id);//데이터 통신
        return null;
      })
    }
  }

  return (
    <Container $isVisible={isVisible} $clientheight={clientHeight}>
      <SubNav>
        <p>※수정은 PC에서 가능함</p>
        <StyledShfBtn $wid="45" src={recycleIcon} alt="섞기 버튼" onClick={() => { handleShuffleAllBtnOnClick() }} />
        <ExportAsExcel />
      </SubNav>
      <StyledGirdContainer>
        <TableHeaderWrapper>
          <StyledHeader>연번</StyledHeader>
          <StyledHeader>학번</StyledHeader>
          <StyledHeader>이름</StyledHeader>
          <StyledHeader>생기부</StyledHeader>
          <StyledHeader>Byte</StyledHeader>
          <StyledHeader>수정</StyledHeader>
        </TableHeaderWrapper>
        {(studentList && studentList.length > 0) && studentList.map((student, index) => {
          let key = student.id
          let isModifying = (thisModifying === key)
          let studentNumber = student.studentNumber
          let name = (student.writtenName || "미등록")
          let record = (student.accRecord || "기록 없음")
          let bytes = ((record !== '기록 없음') ? getByteLengthOfString(record) : 0)

          return <React.Fragment key={key}>
            <StyledGridItem>{index + 1}</StyledGridItem>     {/* 연번 */}
            <StyledGridItem>{studentNumber}</StyledGridItem> {/* 학번 */}
            <StyledGridItem>
              {!isModifying
                ? name
                : <StyledNameInput type="text" value={newName} onChange={(event) => { setNewName(event.target.value) }} />}
            </StyledGridItem>
            <StyledGridItem className="left-align">
              {!isModifying
                ? record
                : <StyledTextArea defaultValue={record}
                  ref={(ele) => { return textAreaRef.current = ele }}
                  onChange={(event) => { setNewAccRecord(event.target.value) }} />}
            </StyledGridItem>
            <StyledGridItem>{bytes}</StyledGridItem>
            <StyledGridItem>
              {!isModifying
                ? <SmallBtn id="modi_btn" btnOnClick={() => { handleModifyingBtn(key, name, record) }} btnName="수정" btnColor="#3454d1" hoverBtnColor="blue" />
                : <BtnWrapper> <SmallBtn id="save_btn" btnOnClick={() => { handleSaveBtn(key) }} btnName="저장" btnColor="#3454d1" />
                  <SmallBtn btnOnClick={() => { handleShuffleBtnOnClick(key) }} btnName="섞기" btnColor="#9b0c24" hoverBtnColor="red" />
                </BtnWrapper>
              }
            </StyledGridItem>
          </React.Fragment>
        })}
      </StyledGirdContainer >
    </Container>
  )
}
const Container = styled.main`
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
  @media screen and (max-width: 767px){
    margin: 0;
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const StyledShfBtn = styled.img`
  display: flex;
  align-items: center;
  margin: 5px 0;
  width: ${(props) => props.$wid || 134}px;
  padding: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgba(49, 84, 209, 0.4);
    border: none;
    border-radius: 10px;
    transition: background-color 0.5s ease-in-out;
  }
`
const StyledGirdContainer = styled.div`
  margin: 50px auto;
  display: grid;
  justify-content: center;
  grid-template-columns: 70px 100px 100px 1000px 60px 100px; 
  grid-template-rows: 40px;
`
// lastChild의 범위를 명확하게 하기 위함.
const TableHeaderWrapper = styled.div` 
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
    border-top-left-radius: 5px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
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
const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
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
export default ClassAllStudents