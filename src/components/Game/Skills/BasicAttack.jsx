import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap';
import { Graphics } from '@pixi/react';

const BasicAttack = ({ x, y, trigger }) => {
  const basicRef = useRef();

  useEffect(() => {
    let animation
    if (!basicRef.current) return;
    animation = gsap.fromTo(basicRef.current, { alpha: 1 }, {
      alpha: 0,
      duration: 0.3
    })
    return () => { if (animation) { animation.kill(); } };// 애니메이션 종료
  }, [trigger])

  const drawPunch = (g) => {
    g.beginFill(0xff0000); // 빨간색 펀치
    g.drawCircle(0, 0, 20);  // 크기 조절 가능
    g.endFill();
  };

  return (
    <Graphics x={x} y={y} draw={drawPunch} ref={basicRef} />
  )
}

export default BasicAttack

