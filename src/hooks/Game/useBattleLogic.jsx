
const useBattleLogic = () => {
	//랜덤 태세
	const getRandomStance = () => {
		const stances = ['공격', '방어', '휴식'];
		return stances[Math.floor(Math.random() * stances.length)];
	};

	//스킬 데미지 계산
	const getSkillDamge = (skill, spec) => {
		let damage = 0;
		for (const effect of skill.effects) {
			const { stat, multiplier } = effect;
			const statValue = spec[stat] || 0;  // 해당 스탯 없으면 0
			damage += statValue * multiplier;
		}
		return damage
	}
	return ({ getRandomStance, getSkillDamge })
}

export default useBattleLogic
