import React from 'react'

//이미지
import eggBlue from "../image/myPet/egg_b.png"
import eggGreen from "../image/myPet/egg_g.png"
import eggYellow from "../image/myPet/egg_y.png"
import water01 from "../image/myPet/water/pet_water_01.png"
import water02 from "../image/myPet/water/pet_water_02.png"
import water03 from "../image/myPet/water/pet_water_03.png"

const PetImg = (props) => {
  return (<>
    {(props.subject === "영어") && <>
      {(props.level === 0) && <img src={eggBlue} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 1) && <img src={water01} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 2) && <img src={water02} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 3) && <img src={water03} alt="펫이미지" onClick={() => { props.onClick() }} />}
    </>}
    {(props.subject === "국어") && <>
      {(props.level === 0) && <img src={eggGreen} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 1) && <img src={eggGreen} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 2) && <img src={eggGreen} alt="펫이미지" onClick={() => { props.onClick() }} />}
      {(props.level === 3) && <img src={eggGreen} alt="펫이미지" onClick={() => { props.onClick() }} />}
    </>}
  </>)
}

export default PetImg