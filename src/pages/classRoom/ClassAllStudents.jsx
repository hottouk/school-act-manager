//Hooks
import useGetByte from "../../hooks/useGetByte"
import useAddUpdFireData from "../../hooks/useAddUpdFireData"
import { useParams } from "react-router-dom"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
//Firestore
import { setModifiedStudent } from "../../store/allStudentsSlice"
//컴포넌트
import ExportAsExcel from "../../components/ExportAsExcel"
//CSS
import styled from "styled-components"
import useClientHeight from "../../hooks/useClientHeight"
//이미지

const ClassAllStudents = () => {
  //1. 변수
  //경로 이동 props
  const params = useParams(); //id와 param의 key-value(id:'id') 오브젝트로 반환
  const classId = params.id
  //전역 변수
  const allStudentList = useSelector(({ allStudents }) => { return allStudents }) //ClassRoomDetail에서 저장한 학생List 불러오기(전역)
  const dispatcher = useDispatch()
  //hooks
  const { updateStudent } = useAddUpdFireData("classRooms")
  const { getByteLengthOfString } = useGetByte()
  //특정 학생 정보 수정 판단 key 변수
  const [thisModifying, setThisModifying] = useState('')
  const [prevIndex, setPrevIndex] = useState(null)
  let writtenName = ''
  let accRecord = ''
  //객체접근
  const contentRowRef = useRef({})
  const clientHeight = useClientHeight(document.documentElement)
  //모달

  //2. 함수
  //수정버튼
  const handleModifyingBtn = (key, index) => {
    if (prevIndex) {
      contentRowRef.current[prevIndex].style = 'background-color: #efefef;'
    }
    contentRowRef.current[index].style = 'background-color: #bad1f7;'
    setThisModifying(key)
    setPrevIndex(index)
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
    <StyledContainer $clientheight={clientHeight}>
      <StyledXlDiv>
        <p>※수정은 PC에서 가능함</p>
        <ExportAsExcel />
      </StyledXlDiv>
      <StyledGirdContainer>
        <StyledTitleRow>
          <StyledSmallDiv>연번</StyledSmallDiv>
          <StyledMidlDiv>학번</StyledMidlDiv>
          <StyledMidlDiv>이름</StyledMidlDiv>
          <StyledLargeDiv>생기부</StyledLargeDiv>
          <StyledSmallLastDiv>Byte</StyledSmallLastDiv>
          <StyledSmallLastDiv>수정</StyledSmallLastDiv>
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
          return <StyledContentRow ref={(element) => { return contentRowRef.current[index] = element }} key={student.id}>
            <StyledSmallDiv>{index + 1}</StyledSmallDiv> {/* 연번 */}
            <StyledMidlDiv>{studentNumber}</StyledMidlDiv> {/* 학번 */}
            <StyledMidlDiv>
              {isModifying
                ? <StyledNameInput type="text" defaultValue={name} onChange={(event) => { writtenName = event.target.value }} />
                : name}
            </StyledMidlDiv>
            <StyledLargeDiv>
              {isModifying
                ? <StyledTextArea defaultValue={record} onChange={(event) => { accRecord = event.target.value }} />
                : record}
            </StyledLargeDiv>
            <StyledSmallLastDiv>{bytes}</StyledSmallLastDiv>
            <StyledSmallLastDiv>
              {isModifying
                ? <button id='save_btn' onClick={() => { handleSaveBtn(student.id) }}>저장</button>
                : <button id='modi_btn' onClick={() => { handleModifyingBtn(student.id, index) }}>수정</button>}
            </StyledSmallLastDiv>
          </StyledContentRow>
        })}
      </StyledGirdContainer >
      {/* 매크로 모달 */}
     
    </StyledContainer>
  )
}
const StyledContainer = styled.main`
  margin: 15px 30px;
  @media screen and (max-width: 767px){
    margin: 0;
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
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
`
const StyledTitleRow = styled.div`
  display: flex;
  background-color: #3454d1; 
  color: white;
`
const StyledContentRow = styled.div`
  display: flex;
  background-color: #efefef;
`
const StyledSmallDiv = styled.div`
  flex-basis: 60px;
  justify-content: center;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  border-left: 1px solid black;
  @media screen and (max-width: 767px){
    display: none;
  }
`
const StyledSmallLastDiv = styled.div`
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
const StyledLargeDiv = styled.div`
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
  width: 85px;
  height: 50%;
`
const StyledTextArea = styled.textarea`
  display: block;
  width: 95%;
  height: 85%;
`
const StyledMacroIcon = styled.img`
  width: 45px;
  height: 45px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 25px;
  cursor: pointer;
`
export default ClassAllStudents