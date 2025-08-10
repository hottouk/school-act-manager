import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Sprite } from '@pixi/react'
import question_icon from '../../../image/icon/question.png'
//250427 생성
const SkillAttack = ({ x, y, width, height, effect, skillEffMap }) => {
	const { imgPath } = effect;
	const skillRef = useRef();
	const imgUrl = skillEffMap.get(imgPath) || question_icon;
	useEffect(() => {
		if (!effect || !skillRef.current) return;
		const fadeAnim = gsap.fromTo(skillRef.current, { alpha: 1 }, { alpha: 0, duration: 1.3 });
		return () => { if (fadeAnim) { fadeAnim.kill(); } };// 애니메이션 종료
	}, [effect])

	return <>{imgPath && <Sprite x={x} y={y} image={imgUrl} width={width} height={height} anchor={{ x: 0.5, y: 0.5 }} ref={skillRef} />}</>
}
export default SkillAttack

