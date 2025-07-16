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
import useClientHeight from "../../hooks/useClientHeight"
import useFetchRtMyStudentData from "../../hooks/RealTimeData/useFetchRtMyStudentListData"
//이미지
import recycleIcon from "../../image/icon/recycle_icon.png"
import useFirePetData from "../../hooks/Firebase/useFirePetData"
import MidBtn from "../../components/Btn/MidBtn"

//최근 업데이트(241027)
const ClassAllStudents = () => {
  //교사 인증
  const user = useSelector(({ user }) => user);
  useEffect(() => { setIsVisible(true) }, [])
  //준비
  const params = useParams(); //id와 param의 key-value(id:'id') 오브젝트로 반환
  const navigate = useNavigate();
  const classId = params.id
  //학생 정보 데이터 통신
  const { studentDataList } = useFetchRtMyStudentData("classRooms", classId, "students", "studentNumber");
  const [_studentList, setStudentList] = useState([]);
  const [_origin, setOrigin] = useState(null);
  useEffect(() => { setStudentList(studentDataList); }, [studentDataList]);
  //학생 속성
  const { updatePetInfo } = useFirePetData();
  const { getByteLengthOfString } = useGetByte();
  //현재 행 수정
  const [thisModifying, setThisModifying] = useState('');
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)
  //인쇄
  const printRef = useRef({});
  const handlePrint = useReactToPrint({ contentRef: printRef });
  //css
  const clientHeight = useClientHeight(document.documentElement)
  const nameFontStyle = { cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }

  //------함수부------------------------------------------------
  //실시간 acc
  const getAccRec = (list) => { return list?.reduce((acc, cur) => acc + " " + cur.record, '') }
  //수정 버튼
  const handleEditOnClick = (key) => {
    setOrigin(JSON.parse(JSON.stringify(_studentList))); //깊은 복사(배열은 메모리 참조)
    setThisModifying(key);
  }
  //추가 버튼
  const handleAddActiOnClick = (index) => {
    setStudentList((prev) => {
      const list = [...prev];
      const { actList } = list[index];
      const assignedDate = new Date().toISOString().split('T')[0];
      const newActi = { title: "임의기록", id: "random" + assignedDate, record: "", uid: user.uid, assignedDate }
      actList?.push(newActi);
      return list
    })
  }
  //취소 버튼
  const handleCacncelOnClick = () => {
    setThisModifying('');
    setStudentList(JSON.parse(JSON.stringify(_origin))); //깊은 복사
  }
  //활동 문구 변경
  const handleActiRecordOnChage = (event, index, subIndex) => {
    setStudentList((prev) => {
      const list = [...prev];
      const { actList } = list[index];
      actList[subIndex].record = event.target.value;
      return list
    })
  }
  //순서 섞기
  const shuffleOrder = (list) => {
    if (list && list.length > 1) {
      for (let i = list.length - 1; i > 0; i--) {//랜덤 섞기
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    return list
  }
  //활동 순서 섞기
  const handleShuffleBtnOnClick = (index) => {
    const { actList } = _studentList[index];
    if (actList[actList.length - 1].record === '') {
      alert("빈 칸을 채우세요");
      return
    }
    setStudentList((prev) => {
      const list = [...prev];
      const { actList } = list[index];
      shuffleOrder(actList);
      return list
    })
  }
  //저장 버튼
  const handleSaveBtn = (index) => {
    const { id: petId, actList } = _studentList[index];
    updatePetInfo(classId, petId, { accRecord: getAccRec(actList), actList });
    setThisModifying('');
  }
  //전체 활동 순서 섞기
  const handleShuffleAllBtnOnClick = () => {
    _studentList.forEach((student) => {
      const { actList, id } = student;
      shuffleOrder(actList);
      updatePetInfo(classId, id, { accRecord: getAccRec(actList), actList },);
    })
  }

  return (
    <Container $isVisible={isVisible} $clientheight={clientHeight}>
      <SubNav>
        <p>※수정은 PC에서 가능함</p>
        <BackBtn />
        {user.userStatus === "master" && <StyledShfBtn $wid="45" src={recycleIcon} alt="섞기 버튼" onClick={handleShuffleAllBtnOnClick} />}
        <ExportAsExcel allStudentList={_studentList} />
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
        {_studentList?.length > 0 && _studentList.map((student, index) => {
          const { id, studentNumber, writtenName, actList } = student;
          const key = id;
          const accRecord = getAccRec(actList);
          const isModifying = (thisModifying === key);
          const bytes = (accRecord ? getByteLengthOfString(accRecord) : 0);

          return <React.Fragment key={index + id}>
            <GridItem>{index + 1}</GridItem>     {/* 연번 */}
            <GridItem>{studentNumber}</GridItem> {/* 학번 */}
            <GridItem><p onClick={() => { navigate(`/classrooms/${classId}/${key}`) }} style={nameFontStyle}>{writtenName || "미등록"}</p></GridItem>   {/* 이름 */}
            <GridItem style={{ justifyContent: "flex-start" }}>
              {!isModifying && accRecord}
              {isModifying && <Column style={{ width: "100%", gap: "5px" }}>
                {actList?.map((acti, actiIndex) => {
                  const { record, id } = acti;
                  return <Textarea key={actiIndex + id}
                    placeholder="이 곳에 새로운 활동을 기록하세요"
                    value={record}
                    onChange={(event) => { handleActiRecordOnChage(event, index, actiIndex) }} />
                })}
                <Row style={{ justifyContent: "center" }}><MidBtn onClick={() => { handleAddActiOnClick(index) }}>추가</MidBtn></Row>
              </Column>}
            </GridItem>
            <GridItem>{bytes}</GridItem>        {/* 바이트 */}
            <GridItem>
              {(!isModifying && user.userStatus === "master") && <SmallBtn btnOnClick={() => { handleEditOnClick(key); }} btnColor="#3454d1" hoverBtnColor="blue">수정</SmallBtn>}
              {isModifying && <BtnWrapper>
                {actList && <SmallBtn btnOnClick={() => { handleSaveBtn(index); }} btnColor="#3454d1" hoverBtnColor="blue">저장</SmallBtn>}
                {actList && <SmallBtn btnOnClick={() => { handleShuffleBtnOnClick(index); }} hoverBtnColor="blue">섞기</SmallBtn>}
                <SmallBtn btnOnClick={() => { handleCacncelOnClick(); }} btnColor="#9b0c24" hoverBtnColor="red">취소</SmallBtn>
              </BtnWrapper>
              }
            </GridItem>
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
const Column = styled(Row)`
  flex-direction: column;
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
const GridItem = styled(Row)`
  display: flex;
  justify-content: center;
  color: black;
  background-color: #efefef;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
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
const Textarea = styled.textarea`
  width: 100%;
  height: 5rem;
  border-radius: 10px;
`
export default ClassAllStudents