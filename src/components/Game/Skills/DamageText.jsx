import { useEffect, useRef } from 'react';
import { Text } from '@pixi/react';
import { gsap } from 'gsap';

const DamageText = ({ x, y, value }) => {
  const textRef = useRef();
  const stringValue = value > 0 ? -value?.toString() : "+" + -value?.toString();
  const color = value > 0 ? "red" : "blue";
  const style = { fontSize: 50, fill: color, fontWeight: "bold" };
  useEffect(() => {
    var tl = gsap.timeline();
    const target = textRef.current;
    if (!target) return;
    const anim = tl.fromTo(textRef.current,
      { y: y + 30, alpha: 1, },
      { y: y, alpha: 0, duration: 1.3 });
    return () => { if (anim) anim.kill(); }
  }, [value]);

  return (
    <Text
      ref={textRef}
      text={stringValue}
      x={x}
      y={y}
      anchor={0.5}
      style={style}
    />
  );
};

export default DamageText;