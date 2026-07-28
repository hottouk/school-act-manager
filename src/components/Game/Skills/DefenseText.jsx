import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Text } from '../SafePixiText';

const DefenseText = ({ x, y, value }) => {
  const textRef = useRef();
  const defenseValue = Number(value || 0);

  useEffect(() => {
    const target = textRef.current;
    if (!target) return;

    const timeline = gsap.timeline();
    timeline.fromTo(
      target,
      { y: y + 24, alpha: 0, scale: 0.85 },
      { y, alpha: 1, scale: 1.08, duration: 0.35, ease: 'back.out(1.8)' }
    );
    timeline.to(target, { y: y - 34, alpha: 0, scale: 1, duration: 1.75, ease: 'power2.out' });

    return () => { timeline.kill(); };
  }, [value, y]);

  return (
    <Text
      ref={textRef}
      text={`방어 +${defenseValue}`}
      x={x}
      y={y}
      anchor={0.5}
      style={{
        fontSize: 42,
        fill: '#7df9ff',
        fontWeight: 'bold',
        stroke: '#0b2f4a',
        strokeThickness: 6,
        dropShadow: true,
        dropShadowColor: '#001b2f',
        dropShadowBlur: 6,
        dropShadowDistance: 2,
      }}
    />
  );
};

export default DefenseText;
