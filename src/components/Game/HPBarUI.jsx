import { Graphics, Text } from '@pixi/react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
//2025.01.06 
const HPBarUI = ({ x, y, width, height, curHp, maxHp }) => {
  const hpBarRef = useRef();
  const clampedHP = Math.min(Math.max(curHp, 0), maxHp)

  useEffect(() => {
    const hpRatio = clampedHP / maxHp
    if (!hpBarRef.current) return
    gsap.to(hpBarRef.current.scale, {
      x: hpRatio,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [curHp, maxHp]);

  let drawMaxHP = (g) => {
    g.clear();
    g.lineStyle(2, 0x000000, 1);  // 테두리 추가 (검정색)
    g.beginFill(0xff0000); // 전체 HP 바 (빨간색)
    g.drawRect(0, 0, width, height);
    g.endFill();

  }
  let drawCurHP = (g) => {
    g.beginFill(0x00ff00); // 현재 HP 바 (초록색)
    g.drawRect(0, 0, (clampedHP / maxHp) * width, height);
    g.endFill();
  }

  return (<>
    <Graphics draw={drawMaxHP} x={x} y={y} />
    <Graphics draw={drawCurHP} x={x} y={y} ref={hpBarRef} />
    <Text
      text={`${clampedHP} / ${maxHp}`}
      x={x + width / 2}
      y={y - 15}
      anchor={{ x: 0.5, y: 0.5 }}
      style={{ fill: 'black', fontSize: 15, fontWeight: 'bold' }}
    />
  </>
  )
}

export default HPBarUI
