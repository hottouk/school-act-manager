//라이브러리
import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
//hooks
import useAnimation from "../../hooks/useAnimation";

//24.12.14 생성
const DraggableTable = ({ tileHeight, studentList, positionList, setPositionList, objInfoList, objPositionList, setObjPositionList,
  selectedIndex, setSelectedIndex, swapStudents, fixedIndexList, setFixedIndexList, isAnimating }) => {
  //----1.변수부--------------------------------
  const tableRef = useRef(null);
  const gridXSize = 75; // 격자 크기
  const gridYSize = 50; // 격자 크기
  //드래깅 되는 학생의 index
  const [draggingIndex, setDraggingIndex] = useState(null);
  //드래깅 obj
  const [draggingObjIndex, setDraggingObjIndex] = useState(null);
  //마우스와 div 사이 거리 보정(커서 위치 - 자리 위치)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  //애니매이션
  const { growAndShrink3D } = useAnimation();

  //----2.함수부--------------------------------
  //격자 정렬
  const snapToGrid = (info) => ({
    x: Math.round(info.x / gridXSize) * gridXSize,
    y: Math.round(info.y / gridYSize) * gridYSize,
  });

  //이동 위치 격자에 맞추기
  const updatePosition = (list, index) => {
    let newList = [...list];
    newList[index] = snapToGrid(newList[index]);
    return newList;
  };

  //마우스로 학생 클릭
  const handleMouseDown = (list, i, e, type) => {
    if (type === "obj") { setDraggingObjIndex(i); }
    else {
      if (e.ctrlKey) {
        if (selectedIndex !== null && selectedIndex !== undefined) { swapStudents(selectedIndex, i) }
        else { setSelectedIndex(i) }
      }
      else if (e.altKey) {
        if (fixedIndexList.includes(i)) {
          setFixedIndexList((prev) => prev.filter((ele) => ele !== i))
        } else {
          setFixedIndexList((prev) => [...prev, i])
        }
      } else { setDraggingIndex(i) }
    }
    let { x, y } = list[i];
    setOffset({
      x: e.clientX - x,
      y: e.clientY - y,
    });
    console.log(x, y)
  };

  //마우스 판 위에서 이동
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

  //마우스 클릭을 뗀 시점
  const handleMouseUp = () => {
    if (draggingObjIndex === null && draggingIndex === null) return;
    if (draggingObjIndex !== null) {
      if (draggingObjIndex === null) return;
      let newList = updatePosition(objPositionList, draggingObjIndex)
      setObjPositionList(newList);
      setDraggingObjIndex(null);
    } else {
      if (draggingIndex === null) return;
      let newList = updatePosition(positionList, draggingIndex);
      setPositionList(newList);
      setDraggingIndex(null);
    }
  };

  return (
    <Container
      ref={tableRef}
      $tileHeight={tileHeight}
      $gridXSize={gridXSize} $gridYSize={gridYSize}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {objInfoList.map((objInfo, i) => {
        return (objInfo.isShown && <StyledObj key={i} id={objInfo.name}
          onMouseDown={(e) => { handleMouseDown(objPositionList, i, e, "obj") }}
          $background={objInfo.background}
          $width={objInfo.width} $height={objInfo.height}
          $borderRadius={objInfo.borderRadius}
          $left={objPositionList[i].x} $top={objPositionList[i].y} >{objInfo.name}</StyledObj>)
      })}
      {studentList.map((student, i) => {
        return <StyledSeat key={i}
          $i={i}
          $gridXSize={gridXSize}
          $gridYSize={gridYSize}
          $left={positionList[i].x}
          $top={positionList[i].y}
          $isSelected={i === selectedIndex}
          $isAnimating={isAnimating}
          $animation={growAndShrink3D}
          onMouseDown={(e) => handleMouseDown(positionList, i, e)}>
          <p>{student.name}</p>
        </StyledSeat>
      }
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: ${(props) => props.$gridXSize * 13}px;
  height: ${(props) => props.$gridYSize * props.$tileHeight}px;
  border-radius: 10px;
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
  @media print {
    @page {
      margin: 15mm;
    }
  * {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
  }
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
  border: ${(props) => props.$isSelected ? "3px solid black" : "1px solid black"};
  border-radius: 5px;
  cursor: grab;
  background-color: #3454d1;
  color: white;
  user-select: none; // 드래그 중 텍스트 선택 방지
  perspective: 1000px; /* 3D 효과의 깊이 설정 */
  ${(props) => props.$isAnimating && css`
    opacity: 0;
    animation: ${props.$animation} 2.0s ease forwards;
    animation-delay: ${props.$i * 0.5}s; /* 학생 index대로 딜레이 */
  `}
 `
const StyledObj = styled.div.attrs((props) => ({
  style: {
    width: props.$width,
    height: props.$height,
    left: props.$left,
    top: props.$top,
    background: props.$background,
  },
}))`
  position: absolute;
  color: white;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  userSelect: none; // 드래그 중 텍스트 선택 방지
`
export default DraggableTable;