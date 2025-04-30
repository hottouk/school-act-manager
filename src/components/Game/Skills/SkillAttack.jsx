import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Sprite } from '@pixi/react'
import tantacle_attack from '../../../image/effect/s_attack_01.png'

//250427 생성
const SkillAttack = ({ x, y, width, height, trigger }) => {
	const skillRef = useRef();
	useEffect(() => {
		let animation
		if (!skillRef.current) return;
		animation = gsap.fromTo(skillRef.current, { alpha: 1 }, {
			alpha: 0,
			duration: 1.3
		})
		return () => { if (animation) { animation.kill(); } };// 애니메이션 종료
	}, [trigger])

	return (
		<Sprite x={x} y={y} image={tantacle_attack} width={width} height={height} anchor={{ x: 0.5, y: 0.5 }} ref={skillRef} />
	)
}

export default SkillAttack

