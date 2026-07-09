import React, { useEffect, useState } from 'react'
import { Container, Graphics, Text } from '@pixi/react';
//수정(250731)
const BasicDefense = ({ x, y, radius, trigger, value, durationMs = 1800 }) => {
  const [progress, setProgress] = useState(0);
  const duration = Math.max(Number(durationMs) || 1800, 600);
  const defenseValue = Number(value);
  const hasDefenseValue = Number.isFinite(defenseValue);

  useEffect(() => {
    if (!trigger) return;

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
  }, [duration, trigger]);

  if (!trigger) return null;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const introProgress = clamp(progress / 0.22, 0, 1);
  const outroProgress = clamp((progress - 0.78) / 0.22, 0, 1);
  const pulse = Math.sin(progress * Math.PI * 6) * 0.035;
  const shieldAlpha = (0.18 + introProgress * 0.72) * (1 - outroProgress);
  const shieldScale = 0.82 + introProgress * 0.22 + pulse + outroProgress * 0.12;
  const waveAlpha = Math.max(0, 0.55 - progress * 0.9);
  const waveScale = 0.9 + progress * 0.75;
  const innerWaveAlpha = Math.max(0, 0.35 - Math.abs(progress - 0.28) * 0.9);
  const innerWaveScale = 0.72 + progress * 0.5;
  const valueIntroProgress = clamp(progress / 0.28, 0, 1);
  const valueOutroProgress = clamp((progress - 0.74) / 0.26, 0, 1);
  const valueScale = 0.55 + valueIntroProgress * 0.65 - valueOutroProgress * 0.18;
  const valueAlpha = valueIntroProgress * (1 - valueOutroProgress);

  const drawShield = (g) => {
    g.clear();
    g.beginFill(0x7df9ff, 0.18);
    g.drawCircle(0, 0, radius);
    g.endFill();
    g.lineStyle(Math.max(4, radius * 0.035), 0x5cecff, 0.95);
    g.drawCircle(0, 0, radius);
    g.lineStyle(Math.max(2, radius * 0.018), 0xffffff, 0.75);
    g.drawCircle(0, 0, radius * 0.82);
    g.lineStyle(Math.max(2, radius * 0.012), 0xb9ffff, 0.55);
    g.arc(0, 0, radius * 0.62, -0.95, 0.45);
    g.arc(0, 0, radius * 0.62, 2.15, 3.45);
  };

  const drawWave = (g) => {
    g.clear();
    g.lineStyle(Math.max(2, radius * 0.02), 0x8ffbff, 0.7);
    g.drawCircle(0, 0, radius * 0.92);
  };

  const drawInnerWave = (g) => {
    g.clear();
    g.lineStyle(Math.max(2, radius * 0.014), 0xffffff, 0.6);
    g.drawCircle(0, 0, radius * 0.62);
  };

  return (
    <Container x={x} y={y}>
      <Graphics
        draw={drawWave}
        alpha={waveAlpha}
        scale={{ x: waveScale, y: waveScale }}
      />
      <Graphics
        draw={drawInnerWave}
        alpha={innerWaveAlpha}
        scale={{ x: innerWaveScale, y: innerWaveScale }}
      />
      <Graphics
        draw={drawShield}
        alpha={shieldAlpha}
        scale={{ x: shieldScale, y: shieldScale }}
      />
      {hasDefenseValue && (
        <Text
          text={`+${defenseValue}`}
          x={0}
          y={-radius * 0.08 - progress * radius * 0.05}
          anchor={0.5}
          alpha={valueAlpha}
          scale={{ x: valueScale, y: valueScale }}
          style={{
            fontFamily: 'Arial',
            fontSize: Math.max(28, radius * 0.24),
            fontWeight: '900',
            fill: ['#ffffff', '#7df9ff'],
            stroke: '#05364a',
            strokeThickness: Math.max(5, radius * 0.025),
            dropShadow: true,
            dropShadowColor: '#001f2f',
            dropShadowBlur: 7,
            dropShadowDistance: 2,
          }}
        />
      )}
    </Container>
  )
};

export default BasicDefense
