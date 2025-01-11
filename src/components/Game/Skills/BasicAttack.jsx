import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap';
import { Graphics } from '@pixi/react';

const BasicAttack = ({ x, y, trigger }) => {
  const basicRef = useRef();

  useEffect(() => {
    if (!basicRef.current) return;
    gsap.fromTo(basicRef.current, { alpha: 1 }, {
      alpha: 0,
      duration: 0.3
    })
  }, [trigger])

  const drawPunch = (g) => {
    g.beginFill(0xff0000); // 빨간색 펀치
    g.drawCircle(0, 0, 20);  // 크기 조절 가능
    g.endFill();
  };
  // const drawPunch = (g) => {
  //   g.clear();
  //   g.beginFill(0xff0000); // 빨간색 펀치 모양
  //   g.drawCircle(x, y, 30); // 손의 원형 부분
  //   g.drawRect(x - 20, y + 30, 40, 80); // 손목 부분
  //   g.endFill();

  //   // 주먹 손가락 부분
  //   g.beginFill(0xff0000);
  //   for (let i = -2; i <= 2; i++) {
  //     g.drawCircle(x + i * 20, y - 40, 15); // 각 손가락 부분
  //   }
  //   g.endFill();
  // };


  return (
    <Graphics x={x} y={y} draw={drawPunch} ref={basicRef} />
  )
}

export default BasicAttack

