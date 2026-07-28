import { arrayUnion } from "firebase/firestore";
import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useFireGameData from "../../../hooks/Firebase/useFireGameData";

//생성(250808)
const EVENT_DURATION = 1800;

const useBattleLogic = ({
	setMsg = () => { },
	gameId = '',
	setActionBall = () => { },
	setStance = () => { },
	setIsSkillMode = () => { },
}) => {
	const user = useSelector(({ user }) => user);
	const stanceList = ['atk', 'def', 'rest'];
	const battleActions = { "atk": ["기본 공격", "공격 스킬", "취소"], "def": ["기본 방어", "방어 스킬", "취소"], "rest": ["기본 휴식", "휴식 스킬", "취소"] };

	const [animEvent, setAnimEvent] = useState(null);
	const [isResolving, setIsResolving] = useState(false);
	const lastPlayedTurnRef = useRef(null);

	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const getBattleEvents = useCallback((result) => {
		if (Array.isArray(result?.actionSequence)) {
			return result.actionSequence.map((event, index) => ({
				...event,
				step: Number(event.step || index + 1),
				dur: EVENT_DURATION,
			}));
		}
		return [
			{ step: 1, actor: "student", action: "def", effect: "defenseToTeam", value: 0, dur: EVENT_DURATION },
			{ step: 3, actor: "student", action: "atk", effect: "damageToBoss", value: Number(result.damageToBoss || 0), dur: EVENT_DURATION },
			{ step: 5, actor: "student", action: "rest", effect: "healToTeam", value: Number(result.healToTeam || 0), dur: EVENT_DURATION },
		];
	}, []);

	const getBattleSteps = useCallback((result) => {
		const stepMap = new Map();
		getBattleEvents(result).forEach((event) => {
			const step = Number(event.step || 1);
			if (!stepMap.has(step)) stepMap.set(step, []);
			stepMap.get(step).push(event);
		});
		return [...stepMap.entries()]
			.sort(([a], [b]) => a - b)
			.map(([step, events]) => {
				const baseDur = Math.max(...events.map((event) => Number(event.dur || 900)));
				return { step, events, dur: baseDur };
			});
	}, [getBattleEvents]);

	const playBattleSequence = useCallback(async ({
		turn,
		result,
		setDisplayBossHp,
		setDisplayTeamHp,
		bossMaxHp,
		teamMaxHp,
		onDone,
	}) => {
		if (!result) return;
		if (isResolving) return;
		if (lastPlayedTurnRef.current === turn) return;
		setIsResolving(true);
		lastPlayedTurnRef.current = turn;
		try {
			const steps = getBattleSteps(result);
			setDisplayBossHp(Number(result.beforeBossHp ?? result.nextBossHp ?? 0));
			setDisplayTeamHp(Number(result.beforePetHp ?? result.nextPetHp ?? 0));
			await sleep(100);
			//순차 처리
			for (const battleStep of steps) {
				const messages = [];
				setAnimEvent(battleStep);
				for (const e of battleStep.events) {
					if (e.effect === "damageToBoss") {
						setDisplayBossHp(e.nextBossHp ?? ((prev) => Math.max(prev - e.value, 0)));
						messages.push(`학생 공격으로 보스에게 ${e.value}의 피해`);
					}
					if (e.effect === "healToBoss") {
						setDisplayBossHp(e.nextBossHp ?? ((prev) => Math.min(prev + e.value, bossMaxHp)));
						messages.push(`보스 치료로 ${e.value} 회복`);
					}
					if (e.effect === "healToTeam") {
						setDisplayTeamHp(e.nextPetHp ?? ((prev) => Math.min(prev + e.value, teamMaxHp)));
						messages.push(`학생 치료로 ${e.value} 회복`);
					}
					if (e.effect === "damageToTeam") {
						setDisplayTeamHp(e.nextPetHp ?? ((prev) => Math.max(prev - e.value, 0)));
						messages.push(`보스 공격으로 학생 팀에게 ${e.value}의 피해`);
					}
					if (e.effect === "defenseToTeam") {
						messages.push(`학생 팀이 방어 자세를 취합니다`);
					}
					if (e.effect === "defenseToBoss") {
						messages.push(`보스가 방어 자세를 취합니다`);
					}
				}
				if (messages.length > 0) setMsg(messages.join(" / "));
				await sleep(battleStep.dur);
				setAnimEvent(null);
				await sleep(200);
			}
			if (onDone) {
				setDisplayBossHp(result.nextBossHp);
				setDisplayTeamHp(result.nextPetHp);
				onDone();
			}
		} finally {
			setIsResolving(false);
		}
	}, [getBattleSteps, isResolving, setMsg]);
	//------공용------------------------------------------------
	const { updateGameroom } = useFireGameData();
	const getSkillOptions = (skillList, stance) => {
		const skills = skillList.filter((skill) => skill.type === stance).map((skill) => skill.name);
		const skillOptions = [...skills];
		while (skillOptions.length < 3) { skillOptions.push("기술 없음"); };
		skillOptions.push("취소");
		return skillOptions;
	}
	const selectStance = (index, setStance) => {
		if (index === 0) { setStance("atk"); }
		else if (index === 1) { setStance("def"); }
		else { setStance("rest"); }
	}
	const selectAction = ({ spec, stance, playerList, skill = null }) => {
		const action = { petId: user.uid, type: stance, spec, skill };
		const newPlayers = playerList.map((player) => user.uid === player.uid ? ({ ...player, isReady: true }) : player);
		updateGameroom({ gameId, info: { actions: arrayUnion(action), players: newPlayers } });
	}
	const checkActionBall = ({ stance, actionBall, cost }) => {
		if (stance === "atk") cost = 1;
		if (stance === "rest") cost = -1;
		if (actionBall - cost < 0) {
			return false;
		}
		if (stance === "atk") setActionBall(prev => Math.max(prev - cost, 0));
		if (stance === "rest") setActionBall(prev => Math.min(prev - cost, 5));
		return true;
	}
	const selectSkill = ({ index, selected, skillCooldownList, actionBall, spec, playerList }) => {
		if (index !== 3) {
			if (!selected) return false;
			const stance = selected.type;
			if (skillCooldownList?.[selected.name] > 0) {
				return false;
			}
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
	return {
		stanceList, stances: stanceList, battleActions, animEvent, isResolving,
		playBattleSequence, getSkillOptions, selectStance, selectAction, checkActionBall, selectSkill
	}
}

export default useBattleLogic
