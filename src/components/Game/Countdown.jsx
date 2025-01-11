import { Text } from '@pixi/react';
import React, { useEffect, useState } from 'react'

//25.01.11
const Countdown = ({ isCountdown, setIsCountdown, setPhase, x, y }) => {
  const [countdown, setCountdown] = useState(3); // 카운트다운 상태
  const textStyle = {
    fontFamily: "Arial",
    fontSize: 80,
    fill: ["#ffffff", "#00ff99"], // 그라데이션 색상
    stroke: "#000000",
    strokeThickness: 6,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    align: "center",
  };

  useEffect(() => {
    if (isCountdown) {
      const interval = setInterval(() => { //초마다 countdown 내리기
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;
          clearInterval(interval);
          return 0;
        });
      }, 1000);
      return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    } else {
      // 카운트다운 종료 후 메시지 설정
      setTimeout(() => {
        setPhase("quiz")
      }, 3000);
    }

  }, [isCountdown]);

  useEffect(() => {
    if (countdown === 0) { setIsCountdown(false); } // 카운트다운 비활성화
  }, [countdown]);

  return (<>
    {isCountdown && <Text
      text={countdown}
      x={x}
      y={y}
      anchor={0.5}
      style={textStyle}
    />}
  </>
  )
}

export default Countdown

