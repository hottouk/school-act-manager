import { monsterWaterList } from '../data/monsterList'
const usePet = () => {

  //첫 가입 승인(250412)
  const getInitialPet = (subject) => {
    switch (subject) {
      case "영어":
        const { step, ...rest } = monsterWaterList[0]
        const detils = step[0]
        return { ...rest, ...detils }
      default:
        break;
    }
  }

  return ({ getInitialPet })
}

export default usePet
