import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap';
import { Graphics } from '@pixi/react';

const BasicRest = ({ x, y, size, thick, movingPoint, trigger }) => {
  const plusRef1 = useRef();
  const plusRef2 = useRef();
  const plusRef3 = useRef();

  useEffect(() => {
    if (plusRef1.current) { 
      gsap.fromTo(plusRef1.current, { alpha: 1, y: y }, {
        y: y - movingPoint,
        alpha: 0,
        duration: 1,
        ease: 'power2.out'
      })
    }
    if (plusRef2.current) {
      gsap.fromTo(plusRef2.current, { alpha: 1, y: y }, {
        y: y - movingPoint,
        alpha: 0,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.1, // 0.5초 후 시작
      })
    }
    if (plusRef3.current) {
      gsap.fromTo(plusRef3.current, { alpha: 1, y: y }, {
        y: y - movingPoint,
        alpha: 0,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.2, // 0.5초 후 시작
      })
    }
  }, [trigger])

  const drawPlus1 = (g) => {
    g.clear();      // 기존 그래픽 초기화
    g.lineStyle(thick, 0x00ff00, 1); // 선 두께, 색상, 투명도 설정
    //수직선
    g.moveTo(x, y - size / 2); // 시작 좌표
    g.lineTo(x, y + size / 2); // 끝 좌표
    //수평선
    g.moveTo(x - size / 2, y)
    g.lineTo(x + size / 2, y)
  };
  const drawPlus2 = (g) => {
    g.clear();      // 기존 그래픽 초기화
    g.lineStyle(thick, 0x00ff00, 0.6); // 선 두께, 색상, 투명도 설정
    //수직선
    g.moveTo(x + 70, y - (size - 5) / 2 - 70); // 시작 좌표
    g.lineTo(x + 70, y + (size - 5) / 2 - 70); // 끝 좌표
    //수평선
    g.moveTo(x - (size - 5) / 2 + 70, y - 70)
    g.lineTo(x + (size - 5) / 2 + 70, y - 70)
  };
  const drawPlus3 = (g) => {
    g.clear();      // 기존 그래픽 초기화
    g.lineStyle(thick - 3, 0x00ff00, 0.6); // 선 두께, 색상, 투명도 설정
    //수직선
    g.moveTo(x - 60, y - (size - 15) / 2 - 80); // 시작 좌표
    g.lineTo(x - 60, y + (size - 15) / 2 - 80); // 끝 좌표
    //수평선
    g.moveTo(x - (size - 15) / 2 - 60, y - 80)
    g.lineTo(x + (size - 15) / 2 - 60, y - 80)
  };

  return (<>
    <Graphics draw={drawPlus1} ref={plusRef1} />
    <Graphics draw={drawPlus2} ref={plusRef2} />
    <Graphics draw={drawPlus3} ref={plusRef3} />
  </>
  )
}

export default BasicRest

