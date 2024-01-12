//Hooks
import useGetByte from "../../hooks/useGetByte"
import useFirestore from "../../hooks/useFirestore"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
//Firestore
import { setModifiedStudent } from "../../store/allStudentsSlice"
//컴포넌트
import ExportAsExcel from "../../components/ExportAsExcel"
//CSS
import styled from "styled-components"


const ClassAllStudents = () => {
  //1. 변수
  //경로 이동 props
  const params = useParams(); //id와 param의 key-value(id:'id') 오브젝트로 반환
  const classId = params.id

  //전역 변수
  const allStudentList = useSelector(({ allStudents }) => { return allStudents }) //ClassRoomDetail에서 저장한 학생List 불러오기(전역)
  const dispatcher = useDispatch()

  //hooks
  const { updateStudent } = useFirestore('classRooms')
  const { getByteLengthOfString } = useGetByte()

  //특정 학생 정보 수정 판단 key 변수
  const [thisModifying, setThisModifying] = useState('')
  let writtenName = ''
  let accRecord = ''

  //2. 함수
  //수정버튼
  const handleModifyingBtn = (key) => {
    setThisModifying(key)
  }
  //저장 버튼
  const handleSaveBtn = (key) => {
    updateStudent({ accRecord, writtenName }, classId, key); //데이터 통신
    dispatcher(setModifiedStudent({ key, accRecord, writtenName })); //전역 변수 변경
    setThisModifying('');
    writtenName = '';
    accRecord = '';
  }

  return (
    <StyledContainer>
      <StyledXlDiv>
        <p>※수정 및 다운로드는 PC에서만 가능</p>
        <ExportAsExcel />
      </StyledXlDiv>
      <StyledGirdContainer>
        <StyledTitleRow>
          <StyledIndexDiv>연번</StyledIndexDiv>
          <StyledMidlDiv>학번</StyledMidlDiv>
          <StyledMidlDiv>이름</StyledMidlDiv>
          <StyledAcclDiv>생기부</StyledAcclDiv>
          <StyledSmallDiv>Byte</StyledSmallDiv>
          <StyledSmallDiv>수정</StyledSmallDiv>
        </StyledTitleRow>
        {allStudentList.map((student, index) => {
          let isModifying = (thisModifying === student.id)
          let studentNumber = student.studentNumber
          let name = (student.writtenName ? student.writtenName : '미등록')
          let record = (student.accRecord ? student.accRecord : '기록 없음')
          let bytes = ((record !== '기록 없음') ? getByteLengthOfString(record) : 0)
          if (isModifying) {
            writtenName = name
            accRecord = record
          }
          return <StyledContentRow key={student.id}>
            <StyledIndexDiv>{index + 1}</StyledIndexDiv> {/* 연번 */}
            <StyledMidlDiv>{studentNumber}</StyledMidlDiv> {/* 학번 */}
            <StyledMidlDiv>
              {isModifying
                ? <StyledNameInput type="text" defaultValue={name} onChange={(event) => { writtenName = event.target.value }} />
                : name}
            </StyledMidlDiv>
            <StyledAcclDiv>
              {isModifying
                ? <StyledTextArea defaultValue={record} onChange={(event) => { accRecord = event.target.value }} />
                : record}
            </StyledAcclDiv>
            <StyledSmallDiv>{bytes}</StyledSmallDiv>
            <StyledSmallDiv>
              {isModifying
                ? <button id='save_btn' onClick={() => { handleSaveBtn(student.id) }}>저장</button>
                : <button id='modi_btn' onClick={() => { handleModifyingBtn(student.id) }}>수정</button>}
            </StyledSmallDiv>
          </StyledContentRow>
        })}
      </StyledGirdContainer >
    </StyledContainer>
  )
}
const StyledContainer = styled.main`
  margin: 15px 30px;
  @media screen and (max-width: 767px){
    margin: 0;
  }
`
const StyledXlDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  p {
    display: none;
    color: #3454d1;
    font-weight: bold;
    margin-right: 10px;
    margin-bottom: 5px;
    @media screen and (max-width: 767px){
      display: inline-block;
    }
  }
`
const StyledGirdContainer = styled.div`
  display: grid;
  grid-template-rows: 40px;
  grid-auto-rows: minmax(100px, auto);
  border: 1px solid black;
`
const StyledTitleRow = styled.div`
  display: flex;
  background-color: #3454d1; 
  color: white;
`
const StyledContentRow = styled.div`
  display: flex;
`
const StyledIndexDiv = styled.div`
  flex-basis: 60px;
  justify-content: center;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  @media screen and (max-width: 767px){
    display: none;
  }
`
const StyledSmallDiv = styled.div`
  flex-basis: 60px;
  justify-content: center;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  @media screen and (max-width: 767px){
    display: none;
  }
`
const StyledMidlDiv = styled.div`
  flex-basis: 100px;
  justify-content: center;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  @media screen and (max-width: 767px){
    flex-basis: 65px;
  }
`
const StyledAcclDiv = styled.div`
  flex-grow: 1;
  justify-content: center;
  padding: 0 5px;
  width: 823px;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  @media screen and (max-width: 767px){
    width: 0;
  }
`
const StyledNameInput = styled.input`
  display: block;
  width: 100px;
  height: 50%;
`

const StyledTextArea = styled.textarea`
  display: block;
  width: 95%;
  height: 85%;
`
export default ClassAllStudents