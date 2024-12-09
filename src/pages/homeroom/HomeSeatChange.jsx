import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import DraggableTable from './DraggableTable';
import { useSelector } from 'react-redux';
import SubNav from '../../components/Nav/SubNav';
import BackBtn from '../../components/Btn/BackBtn';
import useFireClassData from '../../hooks/Firebase/useFireClassData';
import useFetchRtClassroomData from '../../hooks/RealTimeData/useFetchRtClassroomData';
//241210 저장 기능 완성
const HomeSeatChange = () => {
  const frozenStudentList = useSelector(({ allStudents }) => { return allStudents; })
  const frozenClassInfo = useSelector(({ classSelected }) => { return classSelected })
  const [studentList, setStudentList] = useState(
    [...frozenStudentList].map(({ id, studentNumber, writtenName }) => {
      return { id: id, studentNumber: studentNumber, name: writtenName }
    })) //학생 정보 및 자리 순서
  const { addSeatMaps } = useFireClassData();
  const classroomRtInfo = useFetchRtClassroomData(frozenClassInfo.id);
  console.log(classroomRtInfo)
  useEffect(() => { if (classroomRtInfo.seatInfo) setSeatMapList(classroomRtInfo.seatInfo) }, [classroomRtInfo])
  const [seatMapsList, setSeatMapList] = useState('')

  //반 전역 변수
  //학생 자리 위치: todo 앞에서 40명만 바꿀 수 있게 자르기
  const [positionList, setPositionList] = useState(
    studentList.map((_, i) => {
      let row = Math.floor(i / 5);
      let col = i % 5;
      return { x: 150 + col * 150, y: 150 + row * 100 };
    }) // table 내 초기 위치
  );

  //todo 노션에 추가하고 공부하기
  const shuffleStudents = () => {
    const shuffledList = [...studentList];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[randomIndex]] = [shuffledList[randomIndex], shuffledList[i]];
    }
    setStudentList(shuffledList);
  };

  const ObjList = ["칠판", "TV", "교탁", "앞문", "뒷문", "복도쪽", "운동장쪽"]
  const [objInfoList, setObjInfoList] = useState(ObjList.map((obj) => ({ name: obj, isShown: false })))
  //기물 자리 위치
  const [objPositionList, setObjPositionList] = useState(
    ObjList.map(() => ({ x: 0, y: 0 })))


  const handleOnClick = (event) => {
    switch (event.target.id) {
      case "save_btn":
        addSeatMaps(frozenClassInfo.id, { seatMapsList, positionList, objPositionList, studentList })
        break;
      case "fetch_btn":
        break;
      case "shuffle_btn":
        shuffleStudents()
        break;
      default: return;
    }
  };

  const handleObjBtnOnClick = (i) => {
    setObjInfoList((prev) => {
      let newInfoList = [...prev]
      newInfoList[i].isShown = !newInfoList[i].isShown
      switch (i) {
        case 0:
          newInfoList[i] = { ...newInfoList[i], backgroundColor: "black", width: 375, height: 30 }
          break;
        case 1:
          newInfoList[i] = { ...newInfoList[i], backgroundColor: "red", width: 75, height: 50 }
          break;
        case 2:
          newInfoList[i] = { ...newInfoList[i], backgroundColor: "green", width: 75, height: 50 }
          break;
        case 3:
          newInfoList[i] = { ...newInfoList[i], backgroundColor: "blue", width: 75, height: 100 }
          break;
        case 4:
          newInfoList[i] = { ...newInfoList[i], backgroundColor: "blue", width: 75, height: 100 }
          break;
        case 5:
          newInfoList[i] = { ...newInfoList[i], backgroundColor: "gray", width: 75, height: 550 }
          break;
        case 6:
          newInfoList[i] = { ...newInfoList[i], backgroundColor: "gray", width: 75, height: 550 }
          break;
        default: return
      }
      return newInfoList
    })
  }

  return (
    <Container>
      <SubNav><BackBtn /></SubNav>
      <FlexWrapper>
        <h1>자리 바꾸기 프로그램</h1>
        <GridContainer>
          <GridItem>
            <DraggableTable studentList={studentList}
              positionList={positionList} setPositionList={setPositionList}
              objInfoList={objInfoList} objPositionList={objPositionList} setObjPositionList={setObjPositionList} />
          </GridItem>
          <Controller>
            {ObjList.map((obj, i) => {
              return <button key={obj} onClick={() => { handleObjBtnOnClick(i) }}>{obj}</button>
            })}
          </Controller>
        </GridContainer>
        <button id="save_btn" onClick={(e) => { handleOnClick(e) }}>자리 저장</button>
        <button id="shuffle_btn" onClick={(e) => { handleOnClick(e) }}>자리 섞기</button>
        <button id="fetch_btn" onClick={(e) => { handleOnClick(e) }}>자리 불러오기</button>

      </FlexWrapper>
    </Container >
  );
}

const Container = styled.div`
`
const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const GridContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 4fr 1fr;
`
const GridItem = styled.div`
  grid-column-start: 2;
  grid-column-end:: 3;
  display: flex;
  justify-content: center;
`
const Controller = styled.div`
  //grid-item
  grid-column-start: 3;
  grid-column-end:: 4;
  //flex
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #efefef;
  width: 50%;
  height: 50%;
  margin-left: 20px;
  padding: 10px;
  justify-self: start;
`
export default HomeSeatChange