//이미지
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
import questionMark from "../image/icon/question.png"
import styled from 'styled-components'
import { monsterWaterList } from "../data/monsterList"
import useFetchStorageImg from "../hooks/Game/useFetchStorageImg"
import { useEffect, useState } from "react"
//25.01.25 변경 중..
const PetImg = ({ subject, level, onClick, styles }) => {
  const width = styles?.width || "134px"
  const margin = styles?.margin || "0"

  useEffect(() => { getImage(); }, [subject, level])
  const { getPathList, fetchImgUrl } = useFetchStorageImg();
  const [imgSrc, setImgSrc] = useState(null);
  const imageMap = {
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
    if (level === undefined || !subject) return;
    if (subject === "영어") {
      const pathList = getPathList(monsterWaterList[0].step)
      fetchImgUrl(pathList[level], setImgSrc)
    } else {
      return setImgSrc(imageMap[subject][level] || imageMap["기본"][level]);
    }
  };

  return (
    imgSrc ? (<img src={imgSrc} alt="펫이미지" onClick={() => { onClick() }} style={{ width: width, margin: margin }} />) : <LoadingImg src={questionMark} alt="로딩중" style={{ width: width, margin: margin }} />
  )
}

const LoadingImg = styled.img`
  width: 134px;
  padding: 20px;
`

export default PetImg