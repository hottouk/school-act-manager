import React from 'react'

//이미지
import eggBlue from "../image/myPet/water/waterEgg.png"
import water001 from "../image/myPet/water/pet_water_001.png"
import water002 from "../image/myPet/water/pet_water_002.png"
import water003 from "../image/myPet/water/pet_water_003.png"

const PetImg = (props) => {
  return (<>
    {(props.subject === "영어") && <>
      {(props.level === 0) && <img src={eggBlue} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 1) && <img src={water001} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 2) && <img src={water002} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 3) && <img src={water003} alt="펫이미지" onClick={() => { props.onClick() }} />}
    </>}
    {(props.subject === "국어") && <>
      {(props.level === 0) && <img src={eggBlue} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 1) && <img src={eggBlue} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 2) && <img src={eggBlue} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 3) && <img src={eggBlue} alt="펫이미지" onClick={() => { props.onClick() }} />}
    </>}
  </>)
}

export default PetImg