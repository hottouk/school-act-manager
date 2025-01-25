import React, { useState } from 'react'
import { monsterWaterList } from '../data/monsterList'
const usePet = () => {

  const getInitialPet = (subject) => {
    switch (subject) {
      case "영어":
        const { step, ...rest } = monsterWaterList[0]
        const spec = step[0].spec
        const petName = step[0].name
        return { ...rest, spec, petName }
      default:
        break;
    }
  }

  return ({ getInitialPet })
}

export default usePet
