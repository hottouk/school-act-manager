//레벨 계산 함수
const useGetLevel = () => {
  const getAbilityScores = (actList) => {
    let abilities = { attitudeScore: 0, careerScore: 0, coopScore: 0, leadership: 0, sincerityScore: 0 }
    const scores = actList.filter(act => act.scores).map(act => act.scores)
    scores.map((atr) => {
      abilities.attitudeScore += atr.attitudeScore
      abilities.careerScore += atr.careerScore
      abilities.coopScore += atr.coopScore
      abilities.leadership += atr.leadership
      abilities.sincerityScore += atr.sincerityScore
      return null
    })
    return abilities
  }

  const getExpByActList = (actList) => {
    const scores = actList.filter(act => act.scores).map(act => act.scores) //점수 있는 활동만 체크하여 점수만 추출
    let exp = scores.map((atr) => { //각 5개의 점수 합하여 점수 합 -> 점수 합 모두 더하여 경험치
      let sum = atr.attitudeScore + atr.careerScore + atr.coopScore + atr.leadership + atr.sincerityScore
      return sum
    }).reduce((acc, cur) => acc + cur, 0)
    return exp
  }

  const getExpAndLevelByActList = (actList) => {
    let exp = 0
    let level = 0
    if(actList){
      exp = getExpByActList(actList)
    }
    if (0 < exp && exp <= 15) {
      level = 1
    } else if (15 < exp && exp <= 30) {
      level = 2
      exp -= 15
    } else if (30 < exp && exp <= 55) {
      level = 3
      exp -= 30
    } else {
      level = 0
    }
    return { exp, level }
  }

  const getMaxExpByLevel = (level) => {
    let maxExp;
    switch (level) {
      case 1:
        maxExp = 15; break;
      case 2:
        maxExp = 30; break;
      default:
        maxExp = 100
    }
    return maxExp
  }

  return { getAbilityScores, getExpAndLevelByActList, getMaxExpByLevel }
}

export default useGetLevel