import React, { useState } from 'react'
import useFireBasic from '../../hooks/Firebase/useFireBasic';
import styled from 'styled-components';
import DraggableTable from './DraggableTable';
import { useSelector } from 'react-redux';
import SubNav from '../../components/Nav/SubNav';
import BackBtn from '../../components/Btn/BackBtn';

const HomeSeatChange = () => {
  const studentList = useSelector(({ allStudents }) => { return allStudents; })
  //todo 앞에서 40명만 바꿀 수 있게 자르기
  const [positionList, setPositionList] = useState(
    studentList.map(() => ({ x: 100, y: 100 })) // table 내 초기 위치
  );
  const ObjList = ["칠판", "TV", "교탁", "앞문", "뒷문", "복도쪽", "운동장쪽"]
  const [objInfoList, setObjInfoList] = useState(ObjList.map((obj) => ({ name: obj, isShown: false })))
  const [objPositionList, setObjPositionList] = useState(
    ObjList.map(() => ({ x: 0, y: 0 })))

  const { addData, fetchData } = useFireBasic("lab")

  const handleOnClick = (event) => {
    switch (event.target.id) {
      case "save_btn":
        addData(positionList, "positionList");
        break;
      case "fetch_btn":
        fetchData().then((data) => {
          setPositionList(data[0].positionList)
        })
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