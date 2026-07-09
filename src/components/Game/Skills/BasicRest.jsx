import React, { useEffect, useState } from 'react'
import { Container, Graphics, Text } from '@pixi/react';

//수정(250731)
const BasicRest = ({ x, y, size, thick, movingPoint, trigger, setTrigger, value, durationMs = 1200 }) => {
  const [progress, setProgress] = useState(0);
  const duration = Math.max(Number(durationMs) || 1200, 600);
  const moveDistance = Math.min(Math.max(Number(movingPoint) || size * 5, size * 2.2), size * 6);
  const numericValue = Number(value);
  const hasValue = Number.isFinite(numericValue) && numericValue !== 0;
  const displayValue = hasValue ? `+${Math.abs(numericValue)}` : null;

  useEffect(() => {
    if (!trigger) return;

    let animationFrame;
    const startedAt = performance.now();

    const animate = (now) => {
      const nextProgress = Math.min((now - startedAt) / duration, 1);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      if (setTrigger) setTrigger(null);
    };

    setProgress(0);
    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration, setTrigger, trigger]);

  if (!trigger) return null;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const introProgress = clamp(progress / 0.18, 0, 1);
  const fadeProgress = clamp((progress - 0.58) / 0.42, 0, 1);
  const pulse = Math.sin(progress * Math.PI * 5) * (1 - progress) * 0.08;
  const auraScale = 0.6 + introProgress * 0.45 + pulse;
  const auraAlpha = (0.55 + pulse) * (1 - fadeProgress);
  const textIntroProgress = clamp(progress / 0.24, 0, 1);
  const textOutroProgress = clamp((progress - 0.72) / 0.28, 0, 1);
  const valueTextScale = 0.8 + textIntroProgress * 0.7 - textOutroProgress * 0.2;
  const valueTextAlpha = textIntroProgress * (1 - textOutroProgress);

  const plusList = [
    { x: 0, y: -moveDistance * progress, scale: 1.18, delay: 0, alpha: 1 },
    { x: size * 1.35, y: -size * 0.8 - moveDistance * 0.72 * progress, scale: 0.86, delay: 0.12, alpha: 0.76 },
    { x: -size * 1.2, y: -size * 1.1 - moveDistance * 0.66 * progress, scale: 0.72, delay: 0.24, alpha: 0.68 },
  ];

  const drawAura = (g) => {
    const radius = size * 1.3;

    g.clear();
    g.beginFill(0x6dff7a, 0.14);
    g.drawCircle(0, 0, radius);
    g.endFill();
    g.lineStyle(Math.max(2, thick * 0.35), 0xbaffc2, 0.75);
    g.drawCircle(0, 0, radius * 0.82);
    g.lineStyle(Math.max(2, thick * 0.22), 0x2cff5e, 0.65);
    g.drawCircle(0, 0, radius * 1.08);
  };

  const drawPlus = (g) => {
    const half = size / 2;
    const lineWidth = Math.max(3, thick);

    g.clear();
    g.lineStyle(lineWidth + 5, 0x064d17, 0.55);
    g.moveTo(0, -half);
    g.lineTo(0, half);
    g.moveTo(-half, 0);
    g.lineTo(half, 0);
    g.lineStyle(lineWidth, 0x67ff6d, 1);
    g.moveTo(0, -half);
    g.lineTo(0, half);
    g.moveTo(-half, 0);
    g.lineTo(half, 0);
    g.lineStyle(Math.max(2, lineWidth * 0.28), 0xffffff, 0.85);
    g.moveTo(0, -half * 0.62);
    g.lineTo(0, half * 0.62);
    g.moveTo(-half * 0.62, 0);
    g.lineTo(half * 0.62, 0);
  };

  return (
    <Container x={x} y={y}>
      <Graphics
        draw={drawAura}
        y={-size * 0.12}
        alpha={auraAlpha}
        scale={{ x: auraScale, y: auraScale }}
      />
      <Text
        text="REST"
        x={0}
        y={size * 1.05}
        anchor={0.5}
        alpha={(0.85 - fadeProgress * 0.85) * introProgress}
        scale={{ x: 0.92 + pulse, y: 0.92 + pulse }}
        style={{
          fontFamily: 'Arial',
          fontSize: Math.max(18, size * 0.46),
          fontWeight: '900',
          fill: ['#ffffff', '#78ff83'],
          stroke: '#0d4f1d',
          strokeThickness: Math.max(4, thick * 0.34),
          dropShadow: true,
          dropShadowColor: '#002f0d',
          dropShadowBlur: 4,
          dropShadowDistance: 2,
        }}
      />
      {hasValue && (
        <Text
          text={displayValue}
          x={0}
          y={-size * 1.35 - progress * size * 1.25}
          anchor={0.5}
          alpha={valueTextAlpha}
          scale={{ x: valueTextScale, y: valueTextScale }}
          style={{
            fontFamily: 'Arial',
            fontSize: Math.max(30, size * 0.9),
            fontWeight: '900',
            fill: ['#baffc2', '#2cff5e'],
            stroke: '#063f17',
            strokeThickness: Math.max(4, thick * 0.36),
            dropShadow: true,
            dropShadowColor: '#002f0d',
            dropShadowBlur: 8,
            dropShadowDistance: 2,
          }}
        />
      )}
      {plusList.map((plus, index) => {
        const plusProgress = clamp((progress - plus.delay) / (1 - plus.delay), 0, 1);
        const plusFade = clamp((plusProgress - 0.52) / 0.48, 0, 1);
        const plusAlpha = plus.alpha * introProgress * (1 - plusFade);
        const plusScale = plus.scale * (0.7 + plusProgress * 0.45);

        return (
          <Graphics
            key={index}
            draw={drawPlus}
            x={plus.x}
            y={plus.y}
            alpha={plusAlpha}
            rotation={index === 1 ? 0.18 : index === 2 ? -0.14 : 0}
            scale={{ x: plusScale, y: plusScale }}
          />
        );
      })}
    </Container>
  )
}

export default BasicRest
