import { Sprite } from '@pixi/react'
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react'

const PetSprite = ({ src, x, y, width, height, trigger, movingPoint }) => {
  const myPetRef = useRef();

  useEffect(() => {
    let animation
    if (!myPetRef.current) return;
    animation = gsap.to(myPetRef.current, {
      x: x + movingPoint,
      y: y - movingPoint,
      duration: 0.2,
      yoyo: true, // 되돌아오기
      repeat: 1, // 왕복
      ease: 'power1.inOut', // 부드러운 움직임
    });
    return () => { if (animation) { animation.kill(); } };// 애니메이션 종료
  }, [trigger])

  return (
    <Sprite image={src} x={x} y={y} width={width} height={height} anchor={{ x: 0.5, y: 0.5 }} ref={myPetRef} />
  )
}

export default PetSprite
