import React, { useRef, useState } from "react";
import styled from "styled-components";

const DraggableTable = ({ studentList, positionList, setPositionList, objInfoList, objPositionList, setObjPositionList }) => {
  const tableRef = useRef(null);
  const gridXSize = 75; // 격자 크기
  const gridYSize = 50; // 격자 크기
  //격자 정렬
  const snapToGrid = (info) => ({
    x: Math.round(info.x / gridXSize) * gridXSize,
    y: Math.round(info.y / gridYSize) * gridYSize,
  });

  //드래깅 되는 학생의 index
  const [draggingIndex, setDraggingIndex] = useState(null);
  //드래깅 obj
  const [draggingObjIndex, setDraggingObjIndex] = useState(null);

  // 마우스와 div 사이 거리 보정(커서 위치 - 자리 위치)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  //마우스를 클릭한 시점부터
  const handleMouseDown = (list, i, e, type) => {
    const { x, y } = list[i];
    if (type === "obj") { setDraggingObjIndex(i); }
    else { setDraggingIndex(i); }
    setOffset({
      x: e.clientX - x,
      y: e.clientY - y,
    });
  };
  //마우스 이동
  const handleMouseMove = (e) => {
    if (draggingObjIndex === null && draggingIndex === null) return;
    let tableRect = tableRef.current.getBoundingClientRect(); // 테이블 경계 실시간 계산해야 되는 이유는 스크롤 상태 반영. 뷰포트에서 얼마나 떨어져 있는가 반환
    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;
    let clampedX = Math.max(0, Math.min(newX, tableRect.width - gridXSize));  // X축 제한
    let clampedY = Math.max(0, Math.min(newY, tableRect.height - gridYSize)); // Y축 제한
    if (draggingObjIndex !== null) {
      let newList = [...objPositionList];
      newList[draggingObjIndex] = { x: clampedX, y: clampedY };
      setObjPositionList(newList);
    } else {
      let newList = [...positionList];
      newList[draggingIndex] = { x: clampedX, y: clampedY };
      setPositionList(newList);
    }
  };
  //마우스 클릭을 뗀 시점까지
  const handleMouseUp = (e) => {
    if (draggingObjIndex === null && draggingIndex === null) return;
    if (draggingObjIndex !== null) {
      if (draggingObjIndex === null) return;
      let newList = [...objPositionList];
      newList[draggingObjIndex] = snapToGrid(newList[draggingObjIndex]);// 드래그가 끝나면 격자에 맞춰 위치 조정
      setObjPositionList(newList);
      setDraggingObjIndex(null);
    } else {
      if (draggingIndex === null) return;
      let newList = [...positionList];
      newList[draggingIndex] = snapToGrid(newList[draggingIndex]);
      setPositionList(newList);
      setDraggingIndex(null);
    }
  };
  return (
    <Container
      ref={tableRef}
      $gridXSize={gridXSize} $gridYSize={gridYSize}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {objInfoList.map((objInfo, i) => {
        return (objInfo.isShown && <StyledObj key={i} id={objInfo.name}
          onMouseDown={(e) => { handleMouseDown(objPositionList, i, e, "obj") }}
          $backgroundColor={objInfo.backgroundColor}
          $width={objInfo.width} $height={objInfo.height}
          $left={objPositionList[i].x} $top={objPositionList[i].y} >{objInfo.name}</StyledObj>)
      })}
      {studentList.map((student, i) => {
        let name = student.writtenName
        return <StyledSeat key={i}
          $gridXSize={gridXSize} $gridYSize={gridYSize} $left={positionList[i].x} $top={positionList[i].y}
          onMouseDown={(e) => handleMouseDown(positionList, i, e)}>
          <p>{name}</p>
        </StyledSeat>
      }
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: ${(props) => props.$gridXSize * 13}px;
  height: ${(props) => props.$gridYSize * 15}px;
  background-color: #efefef;
  background-size: ${(props) => props.$gridXSize}px ${(props) => props.$gridYSize}px;
  background-image: linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px);
  overflow: hidden;
  display: flex;
  justify-content: center;
  p {
    text-align: center;
    margin: 0;
  }
`
const StyledSeat = styled.div.attrs((props) => ({
  style: {
    left: props.$left,
    top: props.$top,
    width: props.$gridXSize,
    height: props.$gridYSize,
  },
}))`
  position: absolute;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  cursor: grab;
  background-color: #3454d1;
  color: white;
  userSelect: none; // 드래그 중 텍스트 선택 방지
`
const StyledObj = styled.div.attrs((props) => ({
  style: {
    width: props.$width,
    height: props.$height,
    left: props.$left,
    top: props.$top,
    backgroundColor: props.$backgroundColor,
  },
}))`
  position: absolute;
  color: white;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  userSelect: none; // 드래그 중 텍스트 선택 방지
`
export default DraggableTable;