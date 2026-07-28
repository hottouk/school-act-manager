import { Container, Graphics } from '@pixi/react';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react'

const CORRECT_COLOR = 0x34d058;
const WRONG_COLOR = 0xff4d5e;
const PARTICLE_COUNT = 10;

const MarkingUI = ({ x, y, radius, crossSize, correct }) => {
  const rootRef = useRef(null);
  const haloRef = useRef(null);
  const particleRef = useRef(null);
  const symbolRadius = radius || (crossSize ? crossSize / 2 : 75);
  const color = correct ? CORRECT_COLOR : WRONG_COLOR;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const halo = haloRef.current;
    const particles = particleRef.current;

    if (!root || !halo || !particles) return undefined;

    gsap.set(root, { alpha: 0, rotation: correct ? -0.18 : 0.18 });
    gsap.set(root.scale, { x: 0.25, y: 0.25 });
    gsap.set(particles, { alpha: 0 });
    gsap.set(particles.scale, { x: 0.35, y: 0.35 });

    const intro = gsap.timeline();
    intro
      .to(root, { alpha: 1, rotation: 0, duration: 0.2, ease: 'power2.out' }, 0)
      .to(root.scale, { x: 1.18, y: 1.18, duration: 0.28, ease: 'back.out(2.5)' }, 0)
      .to(root.scale, { x: 1, y: 1, duration: 0.2, ease: 'power2.inOut' })
      .to(particles, { alpha: 0.95, duration: 0.12, ease: 'power1.out' }, 0.1)
      .to(particles.scale, { x: 1.15, y: 1.15, duration: 0.38, ease: 'power2.out' }, 0.1)
      .to(particles, { alpha: 0, duration: 0.3, ease: 'power1.in' }, 0.38);

    const haloPulse = gsap.to(halo, {
      alpha: 0.38,
      duration: 0.9,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    return () => {
      intro.kill();
      haloPulse.kill();
    };
  }, [correct]);

  const drawBackdrop = (g) => {
    g.clear();
    g.beginFill(0x000000, 0.24);
    g.drawCircle(0, 5, symbolRadius + 25);
    g.endFill();
    g.lineStyle(3, 0xffffff, 0.5);
    g.beginFill(0x101827, 0.76);
    g.drawCircle(0, 0, symbolRadius + 25);
    g.endFill();
  };

  const drawHalo = (g) => {
    g.clear();
    g.beginFill(color, 0.36);
    g.drawCircle(0, 0, symbolRadius + 35);
    g.endFill();
  };

  const drawSymbol = (g) => {
    const halfCross = crossSize ? crossSize / 2 : symbolRadius;

    g.clear();
    if (correct) {
      g.lineStyle(23, 0xffffff, 0.95);
      g.drawCircle(0, 0, symbolRadius);
      g.lineStyle(13, color, 1);
      g.drawCircle(0, 0, symbolRadius);
      return;
    }

    const drawCrossLines = () => {
      g.moveTo(-halfCross, -halfCross);
      g.lineTo(halfCross, halfCross);
      g.moveTo(halfCross, -halfCross);
      g.lineTo(-halfCross, halfCross);
    };

    g.lineStyle(24, 0xffffff, 0.95);
    drawCrossLines();
    g.lineStyle(14, color, 1);
    drawCrossLines();
  };

  const drawParticle = (g, index) => {
    const particleSize = index % 2 === 0 ? 6 : 4;

    g.clear();
    g.beginFill(index % 3 === 0 ? 0xffffff : color, 0.95);
    if (index % 2 === 0) {
      g.drawPolygon([
        0, -particleSize,
        particleSize * 0.55, 0,
        0, particleSize,
        -particleSize * 0.55, 0,
      ]);
    } else {
      g.drawCircle(0, 0, particleSize);
    }
    g.endFill();
  };

  return (
    <Container x={x} y={y} ref={rootRef} eventMode="none">
      <Graphics draw={drawHalo} ref={haloRef} alpha={0.18} />
      <Graphics draw={drawBackdrop} />
      <Container ref={particleRef}>
        {Array.from({ length: PARTICLE_COUNT }, (_, index) => {
          const angle = (Math.PI * 2 * index) / PARTICLE_COUNT;
          const distance = symbolRadius + 44 + (index % 2) * 12;

          return (
            <Graphics
              key={index}
              x={Math.cos(angle) * distance}
              y={Math.sin(angle) * distance}
              draw={(g) => drawParticle(g, index)}
            />
          );
        })}
      </Container>
      <Graphics draw={drawSymbol} />
    </Container>
  );
};

export default MarkingUI
