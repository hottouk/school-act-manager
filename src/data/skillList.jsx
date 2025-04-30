const skillList = [
	{
		name: "촉수 찌르기",
		desc: "촉수로 강하게 찌르는 공격을 한다. 공격 1배와 마력 1.2배의 데미지를 준다.",
		effects: [
			{ stat: "atk", multiplier: 1 },
			{ stat: "mat", multiplier: 1.2 }
		],
		type: "atk",
		cost: 1,
		delay: 2,
		skillImg: "tentacle_pierce_effect.png",
	}
]

export { skillList }
