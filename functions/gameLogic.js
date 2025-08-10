/* eslint-disable linebreak-style */
/* eslint-disable block-spacing */
/* eslint-disable brace-style */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-spacing */
/* eslint-disable spaced-comment */
//행동 비교
export const compareActions = (actions) => {
  const fast = actions[0];
  const slow = actions[1];
  //선공 타입에 따른 분류
  if (fast.type === "atk") { return attackSequence(fast, slow); }
  else if (fast.type === "def") { return defendSequence(fast, slow); }
  else { return restSequence(fast, slow); }
};
//공격 로직
const attackSequence = (fast, slow) => {
  switch (slow.type) {
    case "atk": {
      const first = attack({ attacker: fast, defender: slow });
      const second = attack({ attacker: slow, defender: fast });
      return [first, second];
    }
    case "def": {
      const first = defend(slow);
      const second = attack({ attacker: fast, defender: slow, defense: true });
      return [first, second];
    }
    case "rest": {
      const first = rest(slow);
      const second = attack({ attacker: fast, defender: slow, resting: true });
      return [first, second];
    }
    default:
      break;
  }
};
//방어 로직
const defendSequence = (fast, slow) => {
  switch (slow.type) {
    case "atk": {
      const first = defend(fast);
      const second = attack({ attacker: slow, defender: fast, defense: true });
      return [first, second];
    }
    case "def": {
      const first = defend(fast);
      const second = defend(slow);
      return [first, second];
    }
    case "rest": {
      const first = defend(fast);
      const second = rest(slow);
      return [first, second];
    }
    default:
      break;
  }
};
//휴식 로직
const restSequence = (fast, slow) => {
  switch (slow.type) {
    case "atk": {
      const first = rest(fast);
      const second = attack({ attacker: slow, defender: fast, resting: true });
      return [first, second];
    }
    case "def": {
      const first = rest(fast);
      const second = defend(slow);
      return [first, second];
    }
    case "rest": {
      const first = rest(fast);
      const second = rest(slow);
      return [first, second];
    }
    default:
      break;
  }
};
//데미지 계산
const getDmg = (atk, def) => {
  const damage = atk - def;
  const intDmg = Math.floor(damage);
  return intDmg;
};
//스킬 데미지 계산
const getSkillDmg = (skill, spec, def) => {
  let damage = 0;
  for (const effect of skill.effects) {
    const { stat, multiplier } = effect;
    const statValue = spec[stat] || 0;
    damage += statValue * multiplier;
  }
  damage -= def;
  const intDmg = Math.floor(damage);
  return intDmg;
};
//공격
const attack = ({ attacker, defender, defense = null, resting = null }) => {
  const { spec: atkSpec, skill } = attacker;
  console.log("공격 로직 내부", attacker);
  const { spec: defSpec } = defender;
  let dmg;
  let skillEffect = null;
  let sideEffect = null;
  if (resting) { atkSpec.atk = Math.floor(atkSpec.atk *= 2); }
  if (defense) { defSpec.def === 0 ? defSpec.def += 2 : defSpec.def *= 2; }
  if (skill) {
    console.log("스킬공격", skill);
    dmg = getSkillDmg(skill, atkSpec, defSpec.def);
    console.log("스킬데미지", dmg);
    const { name, desc, cost, delay, imgPath } = skill;
    skillEffect = { name, imgPath, desc };
    sideEffect = { [name]: delay };
  } else {
    dmg = getDmg(atkSpec.atk, defSpec.def);
    console.log("일반공격", dmg);
  }
  return { petId: defender.petId, dmg, type: attacker.type, defense, resting, skillEffect, sideEffect };
};
//방어
const defend = (defender) => {
  const { spec, type, petId } = defender;
  console.log("방어", defender);
  return { petId, dmg: 0, type };
};
//휴식
const rest = (rester) => {
  const { spec, type, petId } = rester;
  console.log("휴식", rester);
  return { petId, heal: Math.floor(spec.hp / 5), type, totalHp: spec.hp };
};
//효과 펫에 전가
export const processEffect = async ({ docRef, effect, petCurStat, players, battleTurn }) => {
  const newPlayers = players.map((player) => ({ ...player, isReady: player.isReady = false })); //레디 캔슬
  let { petId: effectId, dmg = null, heal = null, type: effectType, totalHp, skillEffect = null, sideEffect = null } = effect; //행동
  console.log("스킬 사용 효과", skillEffect, sideEffect);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let isEnd = false;
  let loser = null;
  console.log("펫 현재상태 eff 적용 시작", petCurStat, "행동", effect);
  const result = petCurStat.map((pet) => {
    let curStat;
    const { petId, curHp, sideEffect: remaining } = pet;
    console.log("이펙트 타입", effectType, "데미지/힐", dmg, heal);
    if (effectId !== petId) { //시전자
      if (remaining) sideEffect = { ...remaining, ...sideEffect };
      curStat = { petId, curHp, sideEffect };
    } else { //타겟
      let newHp;
      if (effectType !== "rest") { newHp = Math.max(curHp - dmg, 0); }
      else { newHp = Math.min(curHp + heal, totalHp); }
      if (newHp <= 0) { isEnd = true; loser = petId; } //종료 설정
      curStat = { ...pet, curHp: newHp, dmg, heal, skillEffect, type: effectType };
    }
    return curStat;
  });
  console.log("이펙트 적용 통과 후 결과", result);
  if (isEnd) {
    console.log("끝");
    wirteInfo(docRef, { petCurStat: result, players: newPlayers });
    await delay(2000);
    wirteInfo(docRef, { phase: "end", actions: [], loser });
  }
  else {
    console.log("계속");
    if (!battleTurn) { //선공
      wirteInfo(docRef, { phase: "battle", petCurStat: result, players: newPlayers });
      await delay(2000);
      return result;
    } else { //후공 후 턴++, 페이즈 처리
      wirteInfo(docRef, { petCurStat: result });
      const newPhase = battleTurn % 3 === 0 ? "quiz" : "stance";
      const newTurn = battleTurn % 3 === 0 ? battleTurn : Number(battleTurn + 1);
      const newStats = result.map((pet, index) => {
        console.log("펫 정리 중", index, pet);
        const { petId, curHp, sideEffect } = pet;
        if (!sideEffect) return { petId, curHp };
        let newSideEffect = {};
        for (const [skill, time] of Object.entries(sideEffect)) {
          const newTime = time - 1;
          if (newTime > 0) newSideEffect = { ...newSideEffect, [skill]: newTime };
        }
        return { petId, curHp, sideEffect: newSideEffect };
      });
      console.log("정리 완료", newStats);
      await delay(2000);
      wirteInfo(docRef, { phase: newPhase, actions: [], battleTurn: newTurn, petCurStat: newStats });
    }
  }
};
//쓰기
export const wirteInfo = async (docRef, info) => {
  await docRef.set({ ...info }, { merge: true });
};

