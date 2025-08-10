import { Text } from '@pixi/react';
import React, { useEffect, useState } from 'react'
//생성(250111) -> 확장(250722)
const Countdown = ({ isCountdown, count, endCountCallback, x, y }) => {
  const [_count, setCount] = useState(count);         //카운트다운 상태
  const textStyle = {
    fontFamily: "Arial",
    fontSize: 80,
    fill: ["#ffffff", "#00ff99"],           //그라데이션 색상
    stroke: "#000000",
    strokeThickness: 6,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    align: "center",
  };
  //카운트다운 
  useEffect(() => {
    if (isCountdown) {
      const interval = setInterval(() => {                //초마다 countdown 내리기
        setCount((prev) => {
          if (prev > 1) return prev - 1;
          clearInterval(interval);
          return 0;
        });
      }, 1000);
      return () => clearInterval(interval);               // 컴포넌트 언마운트 시 정리
    }
  }, [isCountdown]);
  //카운트다운 비활성화
  useEffect(() => { if (_count === 0) { endCountCallback(); } }, [_count]);

  return (<>{isCountdown && <Text
    text={_count}
    x={x}
    y={y}
    anchor={0.5}
    style={textStyle} />}</>)
}

export default Countdown

