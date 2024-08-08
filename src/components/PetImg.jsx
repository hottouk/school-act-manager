import React from 'react'

//이미지
//물
import water001 from "../image/myPet/water/pet_water_001.png"
import water002 from "../image/myPet/water/pet_water_002.png"
import water003 from "../image/myPet/water/pet_water_003.png"
import waterEgg from "../image/myPet/water/waterEgg.png"
//불
import fire001 from "../image/myPet/fire/pet_fire_001.png"
import fire002 from "../image/myPet/fire/pet_fire_002.png"
import fire003 from "../image/myPet/fire/pet_fire_003.png"
import fireEgg from "../image/myPet/fire/fireEgg.png"
//풀
import grass001 from "../image/myPet/grass/pet_grass_001.png"
import grass002 from "../image/myPet/grass/pet_grass_002.png"
import grass003 from "../image/myPet/grass/pet_grass_003.png"
import grassEgg from "../image/myPet/grass/grassEgg.png"
//노말
import normal001 from "../image/myPet/normal/pet_normal_001.png"
import normal002 from "../image/myPet/normal/pet_normal_002.png"
import normal003 from "../image/myPet/normal/pet_normal_003.png"
import normalEgg from "../image/myPet/normal/normalEgg.png"
import styled from 'styled-components'


const PetImg = (props) => {
  const imageMap = {
    영어: {
      0: waterEgg,
      1: water001,
      2: water002,
      3: water003,
    },
    국어: {
      0: grassEgg,
      1: grass001,
      2: grass002,
      3: grass003,
    },
    수학: {
      0: fireEgg,
      1: fire001,
      2: fire002,
      3: fire003,
    },
    기본: {
      0: normalEgg,
      1: normal001,
      2: normal002,
      3: normal003,
    },
  };

  const getImage = () => {
    const subjectImages = imageMap[props.subject] || imageMap["기본"];
    return subjectImages[props.level];
  };

  const imageSrc = getImage();

  return (<>
    {imageSrc && (
      <StyledImg $wid={props.wid} src={imageSrc} alt="펫이미지" onClick={() => { props.onClick(); }}
      />
    )}
  </>)
}

const StyledImg = styled.img`
  width: ${(props) => props.$wid || 134}px
`

export default PetImg