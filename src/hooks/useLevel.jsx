import { useSelector } from "react-redux";
import useFireUserData from "./Firebase/useFireUserData";

//케릭터 레벨 관련 함수 모음(250127)
const useLevel = () => {
  const user = useSelector(({ user }) => user)
  const { updateUserArrayInfo } = useFireUserData();

  //승리 횟수에 따라 몬스터 Level 조정
  const getEnmLevel = (recordList) => {
    if (recordList.length === 0) return;
    let winCount = 0;
    recordList.forEach((item) => {
      if (item.result === "Win") ++winCount
    })
    if (winCount <= 5) {
      return 1
    } else if (winCount <= 10) {
      return 2
    } else if (winCount <= 15) {
      return 3
    } else if (winCount <= 30) {
      return 4
    } else {
      return 5
    }
  }

  //몬스터 레벨 스텟 보정 수치 제공
  const getMonsterUpStat = (level) => {
    switch (level) {
      case 1:
        return { hp: 0, atk: 0, def: 0, spd: 0 }
      case 2:
        return { hp: 15, atk: 2, def: 0, spd: 0 }
      case 3:
        return { hp: 25, atk: 3, def: 1, spd: 1 }
      case 4:
        return { hp: 55, atk: 5, def: 2, spd: 1 }
      case 5:
        return { hp: 100, atk: 6, def: 3, spd: 2 }
      default:
        break;
    }
  }

  //몬스터 스펙 보정 수치 적용
  const getMonsterStat = (spec, level) => {
    if (!spec) return
    let { hp, atk, def, spd, ...rest } = spec;
    let statUp = getMonsterUpStat(level);
    return { hp: hp + statUp.hp, atk: atk + statUp.atk, def: def + statUp.def, spd: spd + statUp.spd, ...rest, level };
  }

  //경험치 획득
  const gainXp = (petInfo, gainXp) => {
    console.log(petInfo);
    const { ev, petId, monId, name, spec, lvUp } = petInfo;               //현재 pet 정보                       
    const { level, exp, nextLvXp, nextStepLv } = petInfo.level;           //현재 레벨 정보
    const { hp, atk, def, mat, mdf, spd } = spec;
    const { hpUp, atkUp, defUp, matUp, mdfUp, spdUp } = lvUp;
    const levelMultiplier = 1.5;
    const updatedXp = exp + gainXp;
    // 레벨업 체크
    if (updatedXp >= nextLvXp && level < nextStepLv) {            //레벨 업
      const excessXp = updatedXp - nextLvXp;
      const newLevel = level + 1;
      const newXp = excessXp;
      const newNextLvXp = Math.round(nextLvXp * levelMultiplier);
      const newSepc = { hp: hp + (hpUp ?? 0), atk: atk + (atkUp ?? 0), def: def + (defUp ?? 0), mat: mat + (matUp ?? 0), mdf: mdf + (mdfUp ?? 0), spd: spd + (spdUp ?? 0) };
      const msg = `체력 +${hpUp ?? 0} 공격력 +${atkUp ?? 0} 방어력 +${defUp ?? 0} 마력 +${matUp ?? 0} 지혜 +${mdfUp ?? 0} 민첩 +${spdUp ?? 0} 상승함`;
      alert(msg);
      return { level: newLevel, exp: newXp, nextLvXp: newNextLvXp, nextStepLv, spec: newSepc }
    } else if (updatedXp >= nextLvXp && level === nextStepLv) {   //진화 레벨이 되었을 때
      const submitInfo = { ev, petId, monId, name, level: petInfo.level.level, type: "evolution" };
      updateUserArrayInfo(user.uid, "onSubmitList", submitInfo);
      return { level, exp: nextLvXp, nextLvXp, nextStepLv, spec }
    } else if (updatedXp < nextLvXp) {                            //레벨 업이 아닐 떄,
      return { level, exp: updatedXp, nextLvXp, nextStepLv, spec }
    }
  };

  return ({ gainXp, getEnmLevel, getMonsterStat, getMonsterUpStat })
}

export default useLevel
