//라이브러리
import { useEffect, useState } from "react"
import styled from 'styled-components'
//hooks
import useFetchStorageImg from "../hooks/Game/useFetchStorageImg"
//데이터
import { monsterWaterList, monsterGrassList, monsterFireList, monsterNormalList } from "../data/monsterList"
//이미지
import questionMark from "../image/icon/question.png"

//250212 수정
const PetImg = ({ subject = null, step, onClick = () => { }, path, styles }) => {
  const width = styles?.width || "134px";
  const height = styles?.height || "134px";
  const margin = styles?.margin || "0";
  const border = styles?.border || "none";
  const borderRadius = styles?.borderRadius || "none";
  const { getPathList, fetchImgUrl } = useFetchStorageImg();
  useEffect(() => { getImage(); }, [path, subject])
  const [imgSrc, setImgSrc] = useState(null);
  const getImage = () => {
    if (path) {
      fetchImgUrl(path, setImgSrc);
      return
    } else {
      if (!subject) return
      let pathList
      switch (subject) {
        case "영어":
          pathList = getPathList(monsterWaterList[0].step)
          fetchImgUrl(pathList[step || 0], setImgSrc)
          break;
        case "국어":
          pathList = getPathList(monsterGrassList[0].step)
          fetchImgUrl(pathList[step || 0], setImgSrc)
          break;
        case "수학":
          pathList = getPathList(monsterFireList[0].step)
          fetchImgUrl(pathList[step || 0], setImgSrc)
          break;
        default:
          pathList = getPathList(monsterNormalList[0].step)
          fetchImgUrl(pathList[step || 0], setImgSrc)
          break;
      }
    }
  };
  return (
    path ? (<img src={imgSrc} alt="펫이미지" onClick={() => { onClick() }} style={{ width: width, height: height, margin: margin, border: border, borderRadius: borderRadius }} />)
      : <UnknownImg src={questionMark} alt="물음표" onClick={() => { onClick() }} style={{ width: width, height: height, margin: margin, border: border, borderRadius: borderRadius }} />
  )
}

const UnknownImg = styled.img`
  width: 134px;
  padding: 20px;
`

export default PetImg