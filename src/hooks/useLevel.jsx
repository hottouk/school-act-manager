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
    if (winCount <= 3) {
      return 1
    } else if (winCount <= 8) {
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
    let { hp, atk, def, spd, ...rest } = spec
    let statUp = getMonsterUpStat(level)
    return { hp: hp + statUp.hp, atk: atk + statUp.atk, def: def + statUp.def, spd: spd + statUp.spd, ...rest, level }
  }

  //경험치 획득
  const gainXp = (levelInfo, gainXp, petInfo) => {
    const { level, exp, nextLvXp, nextStepLv } = levelInfo
    const levelMultiplier = 1.5
    const updatedXp = exp + gainXp;
    // 레벨업 체크
    if (updatedXp >= nextLvXp && level < nextStepLv) {            //레벨 업
      const excessXp = updatedXp - nextLvXp;
      const newLevel = level + 1;
      const newXp = excessXp
      const newNextLvXp = Math.round(nextLvXp * levelMultiplier);
      return { level: newLevel, exp: newXp, nextLvXp: newNextLvXp, nextStepLv }
    } else if (updatedXp >= nextLvXp && level === nextStepLv) {   //진화 레벨이 되었을 때
      const submitInfo = { petId: petInfo.petId, monId: petInfo.monId, name: petInfo.name, level: petInfo.level.level, type: "evolution" }
      updateUserArrayInfo(user.uid, "onSubmitList", submitInfo)
      return { level, exp: nextLvXp, nextLvXp, nextStepLv }
    } else if (updatedXp < nextLvXp) {                            //레벨 업이 아닐 떄,
      return { level, exp: updatedXp, nextLvXp, nextStepLv }
    }
  };

  return ({ gainXp, getEnmLevel, getMonsterStat, getMonsterUpStat })
}

export default useLevel
