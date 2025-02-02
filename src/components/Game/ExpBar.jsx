import { Graphics, Text } from '@pixi/react';
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react'

const ExpBar = ({ x, y, width, height, curExp, maxExp }) => {
  const expBarRef = useRef();
  const clampedExp = Math.min(Math.max(curExp, 0), maxExp); // 경험치를 0 ~ maxExp로 제한

  useEffect(() => {
    const expRatio = clampedExp / maxExp;
    if (!expBarRef.current) return;

    // GSAP을 사용하여 부드러운 애니메이션 구현
    gsap.to(expBarRef.current.scale, {
      x: expRatio, // 경험치 비율만큼 바 확장
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [clampedExp, maxExp]);

  // 전체 경험치 바 배경
  const drawMaxExp = (g) => {
    g.clear();
    g.beginFill(0x555555); // 회색 배경
    g.drawRect(0, 0, width, height);
    g.endFill();
  };

  // 현재 경험치
  const drawCurExp = (g) => {
    g.clear();
    g.beginFill(0x00ff00); // 초록색 경험치 바
    g.drawRect(0, 0, width, height);
    g.endFill();
  };

  return (
    <>
      {/* 최대 경험치 바 */}
      <Graphics draw={drawMaxExp} x={x} y={y} />
      {/* 현재 경험치 바 (애니메이션 적용) */}
      <Graphics draw={drawCurExp} x={x} y={y} ref={expBarRef} />
      {/* 경험치 텍스트 */}
      <Text
        text={`EXP: ${clampedExp} / ${maxExp}`}
        x={x + width / 2}
        y={y - 20}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{ fill: 'white', fontSize: 14 }}
      />
    </>
  );
}

export default ExpBar
