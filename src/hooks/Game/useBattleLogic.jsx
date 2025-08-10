import { useSelector } from "react-redux";
import useFireGameData from "../Firebase/useFireGameData";
import { arrayUnion, deleteField } from "firebase/firestore";
//생성(250808)
const useBattleLogic = ({ gameId, setMessageList, setMyCurHP, setEnemyCurHP, setActionBall, setEnmSkillEff, setStance, setIsSkillMode, setMyActionEff, setEnmActionEff, setMyDmg, setEnmDmg }) => {
	const user = useSelector(({ user }) => user);
	const { updateGameroom } = useFireGameData();
	const stances = ['공격', '방어', '휴식'];
	const battleActions = { "atk": ["기본 공격", "공격 스킬", "취소"], "def": ["기본 방어", "방어 스킬", "취소"], "rest": ["기본 휴식", "휴식 스킬", "취소"] };
	//------공용------------------------------------------------
	const getSkillOptions = (skillList, stance) => {
		const skills = skillList.filter((skill) => skill.type === stance).map((skill) => skill.name);
		const skillOptions = [...skills];
		while (skillOptions.length < 3) { skillOptions.push("기술 없음"); };
		skillOptions.push("취소");
		return skillOptions;
	}
	//------싱글------------------------------------------------
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
	//랜덤 태세
	const getRandomStance = () => { return stances[Math.floor(Math.random() * stances.length)]; };
	//공격 결과 계산
	const attackSequence = async ({ enemyStance, mySpec, enmSpec, skill }) => {
		let damge = 0;
		if (skill) {
			setEnmSkillEff(skill);
			damge = getSkillDamge(skill, mySpec);
		}
		else { damge = mySpec.atk; }
		setActionBall((prev) => Math.max(0, prev - 1));
		setEnmActionEff("atk");
		let enmDamage
		switch (enemyStance) {
			case "공격":
				const myDamage = Math.max(Math.floor(enmSpec.atk - mySpec.def), 1);
				setMyDmg(myDamage)
				enmDamage = Math.max(Math.floor(damge - enmSpec.def), 1);
				setMessageList((prev) => [...prev, "서로 공격해 피해를 입혔다."]);
				setEnemyCurHP((prev) => prev - enmDamage);
				setMyCurHP((prev) => prev - myDamage);
				setMyActionEff("atk");
				break;
			case "방어":
				enmDamage = Math.max(Math.floor(damge * 0.9 - (enmSpec.def * 2)), 1)
				setMessageList((prev) => [...prev, "상대는 효과적으로 방어했다. 상대 다음턴 공격력 증가!!"]);
				setEnemyCurHP((prev) => prev - enmDamage);
				setEnmActionEff("def");
				break;
			case "휴식":
				enmDamage = Math.floor(damge * 2)
				setMessageList((prev) => [...prev, "상대의 휴식 중에 공격하여 휴식을 방해했다"]);
				setEnemyCurHP((prev) => prev - enmDamage);
				break;
			default:
				break;
		}
		setEnmDmg(enmDamage);
	}
	//방어 시퀀스
	const defenseSequence = async ({ enemyStance, mySpec, enmSpec, skill }) => {
		setMyActionEff("def");
		switch (enemyStance) {
			case "공격":
				const myDamage = Math.max(Math.floor(enmSpec.atk * 0.9 - (mySpec.def * 2)), 1);
				setMyDmg(myDamage);
				setMessageList(([prev]) => [...prev, "상대의 공격을 효과적으로 막아냈다. 전투 의욕이 상승한다"]);
				setMyCurHP((prev) => prev - myDamage);
				setActionBall(prev => Math.min(prev + 1, 5));
				break;
			case "방어":
				setMessageList((prev) => [...prev, "서로 방어했다. 아무일도 일어나지 않았다"]);
				setEnmActionEff("def");
				break;
			case "휴식":
				const enmDamage = -Math.floor(enmSpec.hp / 5);
				setEnmDmg(enmDamage);
				setMessageList((prev) => [...prev, "상대는 방어하는 나를 비웃으며 휴식을 취했다"]);
				setEnemyCurHP((prev) => Math.min(prev - enmDamage, enmSpec.hp));
				setEnmActionEff("rest");
				break;
			default:
				break;
		}
	}
	//휴식 시퀀스
	const restSequence = async ({ enemyStance, mySpec, enmSpec, skill }) => {
		setMyActionEff("rest");
		let myDamage
		switch (enemyStance) {
			case "공격":
				myDamage = Math.floor(enmSpec.atk * 2)
				setMessageList((prev) => [...prev, "휴식 중에 공격당해 제대로 방비하지 못했다"]);
				setMyCurHP((prev) => prev - myDamage);
				setMyActionEff("atk");
				break;
			case "방어":
				myDamage = -Math.floor(mySpec.hp / 5);
				setMessageList((prev) => [...prev, "상대는 무의미한 방어를 했다."]);
				setMyCurHP((prev) => prev - myDamage);
				setActionBall(prev => Math.min(prev + 1, 5));
				setEnmActionEff("def");
				break;
			case "휴식":
				myDamage = -Math.floor(mySpec.hp / 5);
				const enmDamage = -Math.floor(enmSpec.hp / 5);
				setEnmDmg(enmDamage);
				setMessageList((prev) => [...prev, "서로 휴식을 취했다."]);
				setEnemyCurHP((prev) => Math.min(prev - enmDamage, enmSpec.hp));
				setMyCurHP((prev) => Math.min(prev - myDamage, mySpec.hp));
				setActionBall(prev => Math.min(prev + 1, 5));
				setEnmActionEff("rest");
				break;
			default:
				break;
		}
		setMyDmg(myDamage);
	}
	//------멀티플------------------------------------------------
	//태세 선택하기
	const selectStance = (index, setStance) => {
		if (index === 0) { setStance("atk"); }
		else if (index === 1) { setStance("def"); }
		else { setStance("rest"); }
	}
	//행동 선택하기
	const selectAction = ({ spec, stance, playerList, skill = null }) => {
		console.log("스킬", skill);
		const action = { petId: user.uid, type: stance, spec, skill };
		const newPlayers = playerList.map((player) => user.uid === player.uid ? ({ ...player, isReady: true }) : player);
		updateGameroom({ gameId, info: { actions: arrayUnion(action), players: newPlayers } });
	}
	//액션 볼
	const checkActionBall = ({ stance, actionBall, cost }) => {
		if (stance === "atk") cost = 1;
		if (stance === "rest") cost = -1;
		if (actionBall - cost < 0) {
			setMessageList((prev) => [...prev, "기력이 부족합니다, 방어나 휴식을 선택하세요"]);
			return false;
		}
		if (stance === "atk") setActionBall(prev => Math.max(prev - cost, 0));
		if (stance === "rest") setActionBall(prev => Math.min(prev - cost, 5));
		return true;
	}
	//기술 사용
	const selectSkill = ({ index, selected, skillCooldownList, actionBall, spec, playerList }) => {
		if (index !== 3) {
			if (!selected) { setMessageList((prev) => [...prev, "스킬이 없습니다."]); return; }
			const stance = selected.type;
			if (skillCooldownList[selected.name] > 0) { //쿨타임 
				setMessageList((prev => [...prev, `${selected.name}을(를) 사용하려면 아직 ${skillCooldownList[selected.name]}턴 남았습니다.`])); return;
			}
			//시전
			setMessageList((prev) => [...prev, `${selected.name}을(를) 시전하였습니다.`]);
			if (checkActionBall({ stance, actionBall, cost: selected.cost })) {
				selectAction({ spec, stance, playerList, skill: selected });
				return true;
			} return false;
		}
		else { //취소
			setStance(null);
			setIsSkillMode(false);
		}
	}
	return { stances, battleActions, getSkillOptions, getRandomStance, getSkillDamge, selectStance, selectAction, checkActionBall, attackSequence, defenseSequence, restSequence, selectSkill }
}

export default useBattleLogic
