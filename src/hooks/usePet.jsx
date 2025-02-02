import { monsterWaterList } from '../data/monsterList'
const usePet = () => {

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
