import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useReactToPrint } from "react-to-print"
import { useSelector } from "react-redux"
import styled from "styled-components"
//컴포넌트
import ExportAsExcel from "../../components/ExportAsExcel"
import SmallBtn from "../../components/Btn/SmallBtn"
import SubNav from "../../components/Bar/SubNav"
import BackBtn from "../../components/Btn/BackBtn"
import PrintBtn from "../../components/Btn/PrintBtn"
//hooks
import useGetByte from "../../hooks/useGetByte"
import useAddUpdFireData from "../../hooks/Firebase/useAddUpdFireData"
import useClientHeight from "../../hooks/useClientHeight"
import useFetchRtMyStudentData from "../../hooks/RealTimeData/useFetchRtMyStudentListData"
//이미지
import recycleIcon from "../../image/icon/recycle_icon.png"

//2024.10.27(실시간 학생 데이터로 변경, writtenName, accRecord useState로 관리, transition 추가)
const ClassAllStudents = () => {
  //교사 인증
  const user = useSelector(({ user }) => user);
  useEffect(() => { setIsVisible(true) }, [])
  //준비
  const params = useParams(); //id와 param의 key-value(id:'id') 오브젝트로 반환
  const navigate = useNavigate();
  const classId = params.id
  //학생 정보 데이터 통신
  const { studentDataList } = useFetchRtMyStudentData("classRooms", classId, "students", "studentNumber")
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
  //인쇄
  const printRef = useRef({});
  const handlePrint = useReactToPrint({ contentRef: printRef });

  //------함수부------------------------------------------------  
  //수정
  const handleModifyingBtn = (key, name, record) => {
    setThisModifying(key)
    setNewName(name)
    setNewAccRecord(record)
  }
  //저장
  const handleSaveBtn = (key) => {
    updateStudent({ accRecord: newAccRecord, writtenName: newName }, classId, key); //데이터 통신       
    setThisModifying('');
    setNewName('');
    setNewAccRecord('');
  }
  //활동 순서 랜덤 섞기
  const handleShuffleBtnOnClick = (id) => {
    let _student = studentDataList.find(student => student.id === id)
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
      studentDataList.map((student) => {
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
        <BackBtn />
        {user.userStatus === "master" && <StyledShfBtn $wid="45" src={recycleIcon} alt="섞기 버튼" onClick={() => { handleShuffleAllBtnOnClick() }} />}
        <ExportAsExcel allStudentList={studentDataList} />
        <PrintBtn onClick={() => { handlePrint() }} />
      </SubNav>
      <GridContainer ref={printRef}>
        <TableHeaderWrapper>
          <Header>연번</Header>
          <Header>학번</Header>
          <Header>이름</Header>
          <Header>생기부</Header>
          <Header>Byte</Header>
          <Header>수정</Header>
        </TableHeaderWrapper>
        {(studentDataList && studentDataList.length > 0) && studentDataList.map((student, index) => {
          let key = student.id
          let isModifying = (thisModifying === key)
          let studentNumber = student.studentNumber
          let name = (student.writtenName || "미등록")
          let record = (student.accRecord || "기록 없음")
          let bytes = ((record !== '기록 없음') ? getByteLengthOfString(record) : 0)

          return <React.Fragment key={key}>
            <StyledGridItem>{index + 1}</StyledGridItem>     {/* 연번 */}
            <StyledGridItem>{studentNumber}</StyledGridItem> {/* 학번 */}
            {/* 3열 */}
            <StyledGridItem>
              <p onClick={() => { navigate(`/classrooms/${classId}/${key}`) }} style={{ cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}>{name}</p>
            </StyledGridItem>
            <StyledGridItem style={{ justifyContent: "flex-start" }}>
              {!isModifying
                ? record
                : <StyledTextArea defaultValue={record}
                  ref={(ele) => { return textAreaRef.current = ele }}
                  onChange={(event) => { setNewAccRecord(event.target.value) }} />}
            </StyledGridItem>
            <StyledGridItem>{bytes}</StyledGridItem>
            <StyledGridItem>
              {(!isModifying && user.userStatus === "master") && <SmallBtn id="modi_btn" btnOnClick={() => { handleModifyingBtn(key, name, record) }} btnName="수정" btnColor="#3454d1" hoverBtnColor="blue" />}
              {isModifying && <BtnWrapper> <SmallBtn id="save_btn" btnOnClick={() => { handleSaveBtn(key) }} btnName="저장" btnColor="#3454d1" />
                <SmallBtn btnOnClick={() => { handleShuffleBtnOnClick(key) }} btnName="섞기" btnColor="#9b0c24" hoverBtnColor="red" />
              </BtnWrapper>
              }
            </StyledGridItem>
          </React.Fragment>
        })}
      </GridContainer >
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
const Row = styled.div`
  display: flex;
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
const GridContainer = styled.div`
  margin: 50px auto;
  display: grid;
  justify-content: center;
  grid-template-columns: 70px 100px 100px 1000px 60px 100px; 
  grid-template-rows: 40px;
  @media print {
    @page {
      margin: 5mm;
    }
  } 
`
// lastChild의 범위를 명확하게 하기 위함.
const TableHeaderWrapper = styled.div` 
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
    border-top-left-radius: 5px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
`
const StyledGridItem = styled(Row)`
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.left-align { 
    text-align: left;
  }
`
const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`
const StyledTextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`
export default ClassAllStudents