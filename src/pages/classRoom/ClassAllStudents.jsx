//Hooks
import useGetByte from "../../hooks/useGetByte"
import useAddUpdFireData from "../../hooks/useAddUpdFireData"
import useClientHeight from "../../hooks/useClientHeight"
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
//Firestore
import { setModifiedStudent } from "../../store/allStudentsSlice"
//컴포넌트
import ExportAsExcel from "../../components/ExportAsExcel"
import SmallBtn from "../../components/Btn/SmallBtn"
//CSS
import styled from "styled-components"

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
  const [prevIndex, setPrevIndex] = useState(null)
  let writtenName = ''
  let accRecord = ''
  //ref
  const contentRowRef = useRef({})
  const textAreaRef = useRef({})
  //css
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
    updateStudent({ accRecord, writtenName }, classId, key);         //데이터 통신
    dispatcher(setModifiedStudent({ key, accRecord, writtenName })); //전역 변수 변경
    setThisModifying('');
    writtenName = '';
    // accRecord = '';
    console.log(accRecord)
  }

  const handleShuffleBtnOnClick = (id) => {
    let frozenStudent = _allStudentList.find(student => student.id === id)
    let _student = { ...frozenStudent }
    let frozenActiList = _student.actList     //원본 변경 불가 복사
    let actiList = [...frozenActiList]        //원본 변경 불가 복사
    let newAccRec = shuffleOrder(actiList).map(acti => { return acti.record }).join(" ")
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
        <StyledTitleRow>
          <StyledSmallDiv>연번</StyledSmallDiv>
          <StyledMidlDiv>학번</StyledMidlDiv>
          <StyledMidlDiv>이름</StyledMidlDiv>
          <StyledLargeDiv>생기부</StyledLargeDiv>
          <StyledSmallLastDiv>Byte</StyledSmallLastDiv>
          <StyledSmallLastDiv>수정</StyledSmallLastDiv>
        </StyledTitleRow>
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
          return <StyledContentRow key={student.id} ref={(element) => { return contentRowRef.current[index] = element }} >
            <StyledSmallDiv>{index + 1}</StyledSmallDiv> {/* 연번 */}
            <StyledMidlDiv>{studentNumber}</StyledMidlDiv> {/* 학번 */}
            <StyledMidlDiv>
              {isModifying
                ? <StyledNameInput type="text" defaultValue={name} onChange={(event) => { writtenName = event.target.value }} />
                : name}
            </StyledMidlDiv>
            <StyledLargeDiv>
              {isModifying
                ? <StyledTextArea defaultValue={record}
                  ref={(ele) => { return textAreaRef.current = ele }}
                  onChange={(event) => { accRecord = event.target.value }} />
                : record}
            </StyledLargeDiv>
            <StyledSmallLastDiv>{bytes}</StyledSmallLastDiv>
            <StyledSmallLastDiv>
              {isModifying
                ? <> <SmallBtn id="save_btn" btnOnClick={() => { handleSaveBtn(student.id) }} btnName="저장" btnColor="#3454d1" />
                  <SmallBtn btnOnClick={() => { handleShuffleBtnOnClick(student.id) }} btnName="섞기" btnColor="#9b0c24" hoverBtnColor="red" />
                </>
                : <SmallBtn id="modi_btn" btnOnClick={() => { handleModifyingBtn(student.id, index) }} btnName="수정" btnColor="#3454d1" hoverBtnColor="blue" />
              }
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
  display: flex;
  flex-basis: 60px;
  flex-direction: column;
  justify-content: center;
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
  border-radius: 10px;
`
const StyledTextArea = styled.textarea`
  display: block;
  width: 95%;
  height: 85%;
  border-radius: 10px;
`
export default ClassAllStudents