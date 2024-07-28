//컴포넌트
import ExportAsExcel from "../../components/ExportAsExcel"
import SmallBtn from "../../components/Btn/SmallBtn"
//hooks
import useGetByte from "../../hooks/useGetByte"
import useAddUpdFireData from "../../hooks/useAddUpdFireData"
import useClientHeight from "../../hooks/useClientHeight"
import { useParams } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
//전역변수
import { setModifiedStudent } from "../../store/allStudentsSlice"
//css
import styled from "styled-components"

//2024.07.28(css 수정)
const ClassAllStudents = () => {
  //1. 변수
  //경로 이동 props
  const params = useParams(); //id와 param의 key-value(id:'id') 오브젝트로 반환
  const classId = params.id
  //전역 변수
  const allStudentList = useSelector(({ allStudents }) => { return allStudents }) //ClassRoomDetail에서 저장한 학생List 불러오기(전역)
  const [_allStudentList, setAllStudentList] = useState([])
  useEffect(() => { setAllStudentList(allStudentList) }, [allStudentList])

  const dispatcher = useDispatch()
  //hooks
  const { updateStudent } = useAddUpdFireData("classRooms")
  const { getByteLengthOfString } = useGetByte()
  //특정 학생 정보 수정 판단 key 변수
  const [thisModifying, setThisModifying] = useState('')
  let writtenName = ''
  let accRecord = ''
  //ref
  const textAreaRef = useRef({})
  //css
  const clientHeight = useClientHeight(document.documentElement)
  //모달

  //2. 함수
  //수정버튼
  const handleModifyingBtn = (key, index) => {
    setThisModifying(key)
  }
  //저장 버튼
  const handleSaveBtn = (key) => {
    updateStudent({ accRecord, writtenName }, classId, key);         //데이터 통신
    dispatcher(setModifiedStudent({ key, accRecord, writtenName })); //전역 변수 변경
    setThisModifying('');
    writtenName = '';
    console.log(accRecord)
  }

  const handleShuffleBtnOnClick = (id) => {
    let frozenStudent = _allStudentList.find(student => student.id === id)
    let _student = { ...frozenStudent }
    let frozenActiList = _student.actList || []   //원본 변경 불가 복사
    let actiList = [...(frozenActiList || [])]    //원본 변경 불가 복사
    let newAccRec = actiList.length > 0
      ? shuffleOrder(actiList).map(acti => { return acti.record }).join(" ")
      : ''
    textAreaRef.current.value = newAccRec;
    accRecord = newAccRec;
  }

  const shuffleOrder = (list) => { //활동 순서 랜덤 섞기
    if (list && list.length > 1) {
      for (let i = list.length - 1; i > 0; i--) {     //랜덤 섞기
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      return list
    }
  }

  return (
    <StyledContainer $clientheight={clientHeight}>
      <StyledXlDiv>
        <p>※수정은 PC에서 가능함</p>
        <ExportAsExcel />
      </StyledXlDiv>
      <StyledGirdContainer>
        <TableHeaderWrapper>
          <StyledHeader>연번</StyledHeader>
          <StyledHeader>학번</StyledHeader>
          <StyledHeader>이름</StyledHeader>
          <StyledHeader>생기부</StyledHeader>
          <StyledHeader>Byte</StyledHeader>
          <StyledHeader>수정</StyledHeader>
        </TableHeaderWrapper>
        {_allStudentList.map((student, index) => {
          let isModifying = (thisModifying === student.id)
          let studentNumber = student.studentNumber
          let name = (student.writtenName ? student.writtenName : '미등록')
          let record = (student.accRecord ? student.accRecord : '기록 없음')
          let bytes = ((record !== '기록 없음') ? getByteLengthOfString(record) : 0)
          if (isModifying) {
            writtenName = name
            accRecord = record
          }
          return <React.Fragment key={student.id}>
            <StyledGridItem>{index + 1}</StyledGridItem>     {/* 연번 */}
            <StyledGridItem>{studentNumber}</StyledGridItem> {/* 학번 */}
            <StyledGridItem>
              {isModifying
                ? <StyledNameInput type="text" defaultValue={name} onChange={(event) => { writtenName = event.target.value }} />
                : name}
            </StyledGridItem>
            <StyledGridItem className="left-align">
              {isModifying
                ? <StyledTextArea defaultValue={record}
                  ref={(ele) => { return textAreaRef.current = ele }}
                  onChange={(event) => { accRecord = event.target.value }} />
                : record}
            </StyledGridItem>
            <StyledGridItem>{bytes}</StyledGridItem>
            <StyledGridItem>
              {isModifying
                ? <BtnWrapper> <SmallBtn id="save_btn" btnOnClick={() => { handleSaveBtn(student.id) }} btnName="저장" btnColor="#3454d1" />
                  <SmallBtn btnOnClick={() => { handleShuffleBtnOnClick(student.id) }} btnName="섞기" btnColor="#9b0c24" hoverBtnColor="red" />
                </BtnWrapper>
                : <SmallBtn id="modi_btn" btnOnClick={() => { handleModifyingBtn(student.id, index) }} btnName="수정" btnColor="#3454d1" hoverBtnColor="blue" />
              }
            </StyledGridItem>
          </React.Fragment>
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
  justify-content: center;
  grid-template-columns: 70px 100px 100px 1000px 60px 100px; 
  grid-template-rows: 40px;
`
const TableHeaderWrapper = styled.div`
  display: contents;
`;
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