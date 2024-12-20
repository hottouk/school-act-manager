//라이브러리
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { useReactToPrint } from 'react-to-print';
//컴포넌트
import SubNav from '../../components/Bar/SubNav';
import BackBtn from '../../components/Btn/BackBtn';
import MidBtn from '../../components/Btn/MidBtn';
import LongW100Btn from '../../components/Btn/LongW100Btn';
import DraggableTable from './DraggableTable';
//hooks
import useClassAuth from '../../hooks/useClassAuth';
import useFireClassData from '../../hooks/Firebase/useFireClassData';
import useFetchRtClassroomData from '../../hooks/RealTimeData/useFetchRtClassroomData';
//img
import printIcon from '../../image/icon/print_icon.png'

//24.12.14 생성
const HomeSeatChange = () => {
  //----1.변수부--------------------------------
  //교사 인증
  const { log } = useClassAuth();
  if (log) { window.alert(log) }
  //학생 전역 변수
  const frozenStudentList = useSelector(({ allStudents }) => { return allStudents; })
  const frozenClassInfo = useSelector(({ classSelected }) => { return classSelected; })
  //타일 세로 길이
  const [tileHeight, setTileHeight] = useState(15)
  //학생 정보
  const [studentList, setStudentList] = useState(
    [...frozenStudentList].slice(0, 40).map(({ id, studentNumber, writtenName }) => {
      return { id: id, studentNumber: studentNumber, name: writtenName }
    }))
  //학생 자리 위치
  const [positionList, setPositionList] = useState(
    studentList.map((_, i) => { //초기 위치
      let row = Math.floor(i / 5);
      let col = i % 5;
      return { x: 150 + col * 150, y: 100 + row * 100 };
    }));
  //기물 정보
  const ObjList = ["칠판", "TV", "교탁", "앞문", "뒷문", "복도쪽", "운동장쪽"]
  const [objInfoList, setObjInfoList] = useState(ObjList.map((obj) => ({ name: obj, isShown: false })))
  //기물 자리 위치
  const [objPositionList, setObjPositionList] = useState(
    ObjList.map(() => ({ x: 0, y: 0 })))
  //데이터 CRUD
  const { addSeatMap, deleteSeatMap } = useFireClassData();
  //실시간 데이터 가져오기
  const classroomRtInfo = useFetchRtClassroomData(frozenClassInfo.id);
  useEffect(() => { if (classroomRtInfo.seatInfo) { setSeatMapList(classroomRtInfo.seatInfo) } }, [classroomRtInfo])
  //저장된 자리 정보
  const [seatMapsList, setSeatMapList] = useState('');
  const seatMapRef = useRef({});
  const [selectedSeatMapIndex, setSelectedSeatMapIndex] = useState(null);
  useEffect(() => {
    if (selectedSeatMapIndex !== null) {
      console.log(seatMapsList[selectedSeatMapIndex])
      let { studentList, positionList, objPositionList, objInfoList } = seatMapsList[selectedSeatMapIndex]
      setStudentList(studentList);
      setPositionList(positionList);
      setObjPositionList(objPositionList)
      setObjInfoList(objInfoList)
    }
  }, [selectedSeatMapIndex])
  //선택||고정된 학생
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [fixedIndexList, setFixedIndexList] = useState([]);
  useEffect(() => {
    if (fixedIndexList.length === 0) return;
    let tempName = []
    fixedIndexList.forEach((index) => tempName.push(studentList[index].name))
    window.alert(`${tempName}학생 고정됨`)
  }, [fixedIndexList])
  //애니메이션
  const [isAnimating, setIsAnimating] = useState(false);
  //인쇄
  const contentRef = useRef({});
  const handlePrint = useReactToPrint({ contentRef });

  //----2.함수부--------------------------------
  //시험 대형 
  const formExamPosition = () => {
    setPositionList(studentList.map((_, i) => {
      let row = Math.floor(i / 5);
      let col = i % 5;
      return { x: 150 + col * 150, y: 150 + row * 100 };
    }))
  }

  //자리 섞기
  const shuffleStudents = () => {
    if (!window.confirm("자리를 랜덤으로 섞으시겠습니까?")) return;
    //1. 그룹 분류
    let fixedStudents = [];
    let shuffledList = [];
    if (fixedIndexList.length > 0) {
      studentList.forEach((student, i) => {
        if (fixedIndexList.includes(i)) { fixedStudents.push(student); }  //고정 그룹에 추가
        else { shuffledList.push(student) } //                            //섞는 그룹에 추가        
      })
    } else {
      shuffledList = [...studentList];
    }
    //2. 섞기
    for (let i = shuffledList.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[randomIndex]] = [shuffledList[randomIndex], shuffledList[i]];
    }
    //3. 그룹 합치기
    let finalList = [];
    let shuffleIndex = 0; // 섞인 배열에서 가져올 요소의 위치(원본 배열 보존, shift보다 성능 향상)
    studentList.forEach((_, i) => {
      if (fixedIndexList.includes(i)) {                     //고정 학생 추가
        finalList.push(fixedStudents.shift());
      } else {
        finalList.push(shuffledList[shuffleIndex]);         // 섞인 학생 추가
        shuffleIndex++;                                     // 다음 섞인 학생으로 이동
      }
    });
    setStudentList(finalList);
    //4. 애니메이션
    setTimeout(() => { setIsAnimating(true); }, 50);
  };

  //자리 맞교환
  const swapStudents = (firstIndex, secondIndex) => {
    if (selectedIndex === null || selectedIndex === undefined) return;
    if (firstIndex === secondIndex) {
      setSelectedIndex(null);
      return;
    }
    let shuffledList = [...studentList];
    [shuffledList[firstIndex], shuffledList[secondIndex]] = [shuffledList[secondIndex], shuffledList[firstIndex]];
    setStudentList(shuffledList);
    setSelectedIndex(null);
  }

  //자리 map 저장,삭제 버튼
  const handleSaveBtnOnClick = () => {
    if (seatMapsList.length < 5) { addSeatMap(frozenClassInfo.id, { seatMapsList, positionList, objPositionList, studentList, objInfoList }) }
    else { window.alert("최대 5개까지 저장할 수 있습니다.") }
  }
  const handleDeleteBtnOnClick = () => {
    if (selectedSeatMapIndex !== null) { deleteSeatMap(frozenClassInfo.id, seatMapsList, selectedSeatMapIndex) }
    else { window.alert("삭제할 날짜 정보를 클릭해주세요.") }
  }
  //인쇄 버튼
  const handlePrintBtnOnClick = () => {
    setIsAnimating(false);
    handlePrint();
  };
  //기물 버튼
  const handleObjBtnOnClick = (i) => {
    setObjInfoList((prev) => {
      let newInfoList = [...prev]
      newInfoList[i].isShown = !newInfoList[i].isShown
      switch (i) {
        case 0:
          newInfoList[i] = { ...newInfoList[i], background: "black", width: 525, height: 30 }
          break;
        case 1:
          newInfoList[i] = { ...newInfoList[i], background: "blue", width: 75, height: 50 }
          break;
        case 2:
          newInfoList[i] = { ...newInfoList[i], background: "rgb(95, 65, 65)", width: 75, height: 50 }
          break;
        case 3:
          newInfoList[i] = { ...newInfoList[i], background: "rgb(95, 65, 65)", width: 75, height: 100 }
          break;
        case 4:
          newInfoList[i] = { ...newInfoList[i], background: "rgb(95, 65, 65)", width: 75, height: 100 }
          break;
        case 5:
          newInfoList[i] = { ...newInfoList[i], background: "linear-gradient(to top, transparent, gray 50%, gray 50%, transparent)", width: 75, height: 550 }
          break;
        case 6:
          newInfoList[i] = { ...newInfoList[i], background: "linear-gradient(to top, transparent, gray 50%, gray 50%, transparent)", width: 75, height: 550 }
          break;
        default: return
      }
      return newInfoList
    })
  }
  //저장칸에 날짜 표시하기
  const renderDate = () => {
    return seatMapsList.map((info, i) => {
      let timestamp = info.createdTime
      let date = new Date(timestamp.seconds * 1000);
      return <StyledSeatDate key={date}
        ref={(ele) => { seatMapRef.current[i] = ele }}
        onClick={() => { setSelectedSeatMapIndex(selectedSeatMapIndex === i ? null : i) }}
        $isSelected={selectedSeatMapIndex === i}
      >{date.toLocaleString()}
      </StyledSeatDate>
    })
  }

  return (
    <GridContainer>
      <GridItem $column={"1/4"} $row={"1/2"}>
        <SubNav styles={{ gap: "0" }}>
          <BackBtn />
          <StyledImg id="print_btn" src={printIcon} alt="인쇄" onClick={() => { handlePrintBtnOnClick() }}></StyledImg>
        </SubNav>
      </GridItem>
      <GridItem className="title" $column={"1/4"} $row={"2/3"}>
        <h1>자리 바꾸기(test)</h1>
      </GridItem>
      <GridItem className="edges" $column={"1/2"} $row={"3/4"}>
        <SeatDateWrapper>
          {seatMapsList ? renderDate() : "저장된 자리 없음"}
        </SeatDateWrapper>
        <div>
          <MidBtn onClick={() => { handleSaveBtnOnClick() }}>자리 저장</MidBtn>
          <MidBtn onClick={() => { handleDeleteBtnOnClick() }}>삭제하기</MidBtn>
        </div>
      </GridItem>
      <GridItem className="center" $column={"2/3"} $row={"3/4"}>
        <div ref={contentRef}>
          <DraggableTable tileHeight={tileHeight}
            studentList={studentList} positionList={positionList} setPositionList={setPositionList}
            objInfoList={objInfoList} objPositionList={objPositionList} setObjPositionList={setObjPositionList}
            selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} swapStudents={swapStudents}
            fixedIndexList={fixedIndexList} setFixedIndexList={setFixedIndexList}
            isAnimating={isAnimating}
          />
        </div>
      </GridItem>
      <GridItem className="edges" $column={"3/4"} $row={"3/4"}>
        <Controller>
          <p>타일 세로 길이</p>
          <input type="number" value={tileHeight} min={15} max={20} onChange={(e) => { setTileHeight(e.target.value) }} />
          {ObjList.map((obj, i) => {
            return <StyledBtn key={obj} onClick={() => { handleObjBtnOnClick(i) }} $isPressed={objInfoList[i].isShown === true}>{obj}</StyledBtn>
          })}
        </Controller>
      </GridItem>
      <GridItem className="btnWrapper" $column={"2/3"} $row={"4/5"}>
        <LongW100Btn btnOnClick={() => { shuffleStudents() }} btnName="자리 섞기" />
        <LongW100Btn btnOnClick={() => { formExamPosition() }} btnName="시험 대형" />
      </GridItem>
    </GridContainer >
  );
}
const GridContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 55px 80px 8fr 1fr;
`
const StyledImg = styled.img`
  width: 45px;
  height: 45px;
  cursor: pointer;
  margin-top: 8px;
`
const SeatDateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  margin: 0 20px;
  padding: 20px 15px;
  border-radius: 15px;
  background-color: #efefef;
`
const StyledSeatDate = styled.p`
  color: ${(props) => props.$isSelected ? "white" : "black"};
  background-color: ${(props) => props.$isSelected ? "#3454d1" : "#efefef"};
  cursor: pointer;
`
const GridItem = styled.div`
  grid-column: ${(props) => props.$column};
	grid-row: ${(props) => props.$row};
  &.title {
    text-align: center;
  }
  &.edges {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &.center {
    display: flex;
    justify-content: center;
  }
  &.btnWrapper {
    display: flex;
    justify-content: center;
    width: 975px;
    margin: 20px auto;
    gap: 15px;
  }
`
const Controller = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  height: 400px;
  margin-left: 20px;
  padding: 10px;
  background-color: #efefef;
`
const StyledBtn = styled.button`
  border-radius: 5px;
  border: 1px solid gray;
  padding: 2px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2), 
             -5px -5px 15px rgba(255, 255, 255, 0.2); /* 입체감 */
  &:hover {
  box-shadow: rgba(0, 0, 0, .05) 0 5px 30px, rgba(0, 0, 0, .05) 0 1px 4px;
  opacity: 1;
  transform: translateY(4px);
  transition: all 0.5s ease;
  }
  &:hover:after {
    opacity: .5;
  }
  ${(props) => props.$isPressed && css`
    transform: translateY(4px);
    background-color: rgba(49, 84, 209, 0.4); ;
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.3),
                inset -5px -5px 10px rgba(255, 255, 255, 0.3); /* 눌린 느낌 */
    transition-duration: .35s;
  `}
`
export default HomeSeatChange