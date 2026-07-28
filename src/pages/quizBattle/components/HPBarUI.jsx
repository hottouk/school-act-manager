import { Container, Graphics } from '@pixi/react';
import { Text } from '../../../components/Game/SafePixiText';
import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';
//2025.01.06 
const HPBarUI = ({ x, y, width, height, curHp = 0, maxHp = 0 }) => {
  const hpBarRef = useRef();
  const previousRatioRef = useRef(0);
  const safeMaxHp = Math.max(Number(maxHp) || 0, 0);
  const safeCurHp = Math.max(Number(curHp) || 0, 0);
  const clampedHP = safeMaxHp > 0 ? Math.min(safeCurHp, safeMaxHp) : 0;
  const hpRatio = safeMaxHp > 0 ? clampedHP / safeMaxHp : 0;
  const radius = Math.min(height / 2, 10);
  const isLowHp = hpRatio <= 0.3;
  const fillColor = isLowHp ? 0xff4d4f : 0x34c759;
  const fillDarkColor = isLowHp ? 0xb4232a : 0x148f45;
  const textColor = isLowHp ? 0x7a1017 : 0x155f35;
  const labelFontSize = Math.max(12, Math.min(15, height + 1));

  useLayoutEffect(() => {
    if (!hpBarRef.current) return undefined;

    const animation = gsap.fromTo(
      hpBarRef.current.scale,
      { x: previousRatioRef.current },
      { x: hpRatio, duration: 0.45, ease: 'power2.out' },
    );
    previousRatioRef.current = hpRatio;

    return () => { animation.kill(); };
  }, [hpRatio]);

  const drawShell = (g) => {
    g.clear();

    g.beginFill(0x07111f, 0.24);
    g.drawRoundedRect(2, 3, width, height + 2, radius);
    g.endFill();

    g.lineStyle(2, 0x26384f, 0.95);
    g.beginFill(0xf6f9fd, 0.96);
    g.drawRoundedRect(0, 0, width, height, radius);
    g.endFill();

    g.beginFill(0xd9e4f2, 1);
    g.drawRoundedRect(3, 3, width - 6, height - 6, Math.max(radius - 3, 2));
    g.endFill();
  };

  const drawCurrentHP = (g) => {
    g.clear();

    const innerX = 3;
    const innerY = 3;
    const innerWidth = width - 6;
    const innerHeight = height - 6;
    const innerRadius = Math.max(radius - 3, 2);

    g.beginFill(fillDarkColor, 1);
    g.drawRoundedRect(innerX, innerY, innerWidth, innerHeight, innerRadius);
    g.endFill();

    g.beginFill(fillColor, 1);
    g.drawRoundedRect(innerX, innerY, innerWidth, Math.max(innerHeight * 0.62, 2), innerRadius);
    g.endFill();

    g.beginFill(0xffffff, 0.32);
    g.drawRoundedRect(innerX + 3, innerY + 2, Math.max(innerWidth - 6, 0), Math.max(innerHeight * 0.26, 1), innerRadius);
    g.endFill();
  };

  return (<Container x={x} y={y}>
    <Graphics draw={drawShell} />
    <Graphics draw={drawCurrentHP} ref={hpBarRef} />
    <Text
      text={String(`HP ${clampedHP} / ${safeMaxHp}`)}
      x={width / 2}
      y={-15}
      anchor={{ x: 0.5, y: 0.5 }}
      style={{
        fill: textColor,
        fontSize: labelFontSize,
        fontWeight: 'bold',
        stroke: 0xffffff,
        strokeThickness: 3,
      }}
    />
  </Container>
  )
}

export default HPBarUI
