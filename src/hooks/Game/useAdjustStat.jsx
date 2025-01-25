//250126 생성
const useAdjustStat = () => {
  //몬스터 레벨 스텟 보정 수치 제공
  const getStatUp = (level) => {
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
  const getLevelStatus = (monsterDetails) => {
    if (!monsterDetails) return
    let { hp, atk, def, spd, level, ...rest } = monsterDetails
    let statUp = getStatUp(level)
    return { hp: hp + statUp.hp, atk: atk + statUp.atk, def: def + statUp.def, spd: spd + statUp.spd, ...rest, level }
  }

  return ({ getStatUp, getLevelStatus })
}

export default useAdjustStat
