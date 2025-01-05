import { Graphics } from '@pixi/react';
import React from 'react'

const ActionBall = ({ x, y, width, height, correctAnswer }) => {
  const circleRadius = 15;  // 동그라미 반지름
  const circleSpacing = 40; // 동그라미 간격
  const totalCircles = 5;   // 동그라미 개수

  //직사각형 UI
  const drawRect = (g) => {
    g.clear();
    g.lineStyle(4, 0x000000, 1);  // 검정 테두리
    g.beginFill(0xffffff);        // 흰색 배경
    g.drawRoundedRect(0, 0, width, height, 10);
    g.endFill();
  };

  // 동그라미 그리기
  const drawCircles = (g) => {
    const startX = width / 2 - ((totalCircles - 1) * circleSpacing) / 2; // 동그라미 시작 위치 (중앙 정렬)
    const startY = height / 2;  // 직사각형 중앙 높이에 동그라미 배치
    g.clear();
    // 동그라미 반복 그리기
    for (let i = 0; i < totalCircles; i++) {
      g.lineStyle(2, 0x000000, 1);  // 테두리
      if (i < correctAnswer) {
        g.beginFill(0xffcc00);  // 정답 개수만큼 노란색으로 채우기
      } else {
        g.beginFill(0xffffff);  // 나머지는 흰색
      }
      g.drawCircle(startX + i * circleSpacing, startY, circleRadius);
      g.endFill();
    }
  };

  return (
    // 직사각형 그리기
    <>
      <Graphics draw={drawRect} x={x} y={y} />
      <Graphics draw={drawCircles} x={x} y={y} />
    </>
  )
}

export default ActionBall
