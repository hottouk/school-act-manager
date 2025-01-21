import { Graphics } from '@pixi/react';
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react'

const BasicDefense = ({ x, y, radius, trigger }) => {
  const defenseRef = useRef()

  useEffect(() => {
    let animation
    if (!defenseRef.current) return;
    animation = gsap.fromTo(defenseRef.current, { alpha: 0 }, {
      alpha: 0.5,
      duration: 0.5,
      yoyo: true,
      repeat: 1
    })
    return () => { if (animation) { animation.kill(); } };// 애니메이션 종료
  }, [trigger])

  const drawCircle = (g) => {
    g.clear();
    g.beginFill(0xc0f8ff);       // 파랑 실드
    g.drawCircle(0, 0, radius);  // 크기 조절 가능
    g.endFill();
  };
  return <Graphics x={x} y={y} draw={drawCircle} ref={defenseRef} />

};

export default BasicDefense
