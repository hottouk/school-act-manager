import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap';
import { Sprite } from '@pixi/react';
import basic_attack from '../../../image/effect/basic_attack.png'

const BasicAttack = ({ x, y, width, height, trigger }) => {
  const basicRef = useRef();

  useEffect(() => {
    let animation
    if (!basicRef.current) return;
    animation = gsap.fromTo(basicRef.current, { alpha: 1 }, {
      alpha: 0,
      duration: 0.3
    })
    return () => { if (animation) { animation.kill(); } };// 애니메이션 종료
  }, [trigger])

  return (
    <Sprite x={x} y={y} image={basic_attack} width={width} height={height} anchor={{ x: 0.5, y: 0.5 }} ref={basicRef} />
  )
}

export default BasicAttack

