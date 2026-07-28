import React, { useEffect, useState } from 'react'
import { Container, Graphics, Sprite } from '@pixi/react';
import { Text } from '../SafePixiText';
import basic_attack from '../../../image/effect/basic_attack.png'
import { playBattleSound } from '../../../utils/BattleSoundUtils';
//수정(250731)
const BasicAttack = ({ x, y, width, height, trigger, value, durationMs = 650 }) => {
  const [progress, setProgress] = useState(0);
  const duration = Math.max(Number(durationMs) || 650, 300);
  const numericValue = Number(value);
  const hasValue = Number.isFinite(numericValue) && numericValue !== 0;
  const displayValue = hasValue ? (numericValue > 0 ? `-${Math.abs(numericValue)}` : `+${Math.abs(numericValue)}`) : null;

  useEffect(() => {
    if (!trigger) return;
    playBattleSound('attack');

    let animationFrame;
    const startedAt = performance.now();

    const animate = (now) => {
      const nextProgress = Math.min((now - startedAt) / duration, 1);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    setProgress(0);
    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration, trigger])

  if (!trigger) return null;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const hitProgress = clamp(progress / 0.22, 0, 1);
  const fadeProgress = clamp((progress - 0.18) / 0.82, 0, 1);
  const recoil = Math.sin(progress * Math.PI * 5) * (1 - progress) * 0.1;
  const spriteScale = 0.45 + hitProgress * 0.78 + recoil;
  const spriteAlpha = Math.max(0, 1 - fadeProgress);
  const waveScale = 0.25 + progress * 1.65;
  const waveAlpha = Math.max(0, 0.55 - progress * 0.85);
  const slashRotation = -0.35 + progress * 0.28;
  const textIntroProgress = clamp(progress / 0.24, 0, 1);
  const textOutroProgress = clamp((progress - 0.72) / 0.28, 0, 1);
  const textScale = 0.8 + textIntroProgress * 0.7 - textOutroProgress * 0.2;
  const textAlpha = textIntroProgress * (1 - textOutroProgress);

  const drawShockwave = (g) => {
    const radius = Math.max(width, height) * 0.42;

    g.clear();
    g.lineStyle(Math.max(3, radius * 0.08), 0xfff2a8, 0.7);
    g.drawCircle(0, 0, radius);
  };

  return (
    <Container x={x} y={y}>
      <Graphics
        draw={drawShockwave}
        alpha={waveAlpha}
        scale={{ x: waveScale, y: waveScale }}
      />
      <Sprite
        image={basic_attack}
        width={width}
        height={height}
        anchor={{ x: 0.5, y: 0.5 }}
        alpha={spriteAlpha}
        rotation={slashRotation}
        scale={{ x: spriteScale, y: spriteScale }}
      />
      {hasValue && (
        <Text
          text={String(displayValue ?? '')}
          x={0}
          y={-height * 0.1 - progress * height * 0.18}
          anchor={0.5}
          alpha={textAlpha}
          scale={{ x: textScale, y: textScale }}
          style={{
            fontFamily: 'Arial',
            fontSize: Math.max(30, width * 0.35),
            fontWeight: '900',
            fill: numericValue > 0 ? ['#ff6b6b', '#ff2f2f'] : ['#5fe0ff', '#1c7cff'],
            stroke: '#062236',
            strokeThickness: Math.max(4, width * 0.04),
            dropShadow: true,
            dropShadowColor: '#00131f',
            dropShadowBlur: 8,
            dropShadowDistance: 2,
          }}
        />
      )}
    </Container>
  )
}

export default BasicAttack
