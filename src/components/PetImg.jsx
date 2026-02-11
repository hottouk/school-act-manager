//라이브러리
import { useEffect, useState } from "react"
//hooks
import useFetchStorageImg from "../hooks/Game/useFetchStorageImg"
//이미지
import normalEgg from "../image/pet/pet_normal_001_1.png"
//250212 수정
const PetImg = ({ subject = null, onClick = () => { }, path, styles }) => {
  const width = styles?.width || "134px";
  const height = styles?.height || "134px";
  const margin = styles?.margin || "0";
  const border = styles?.border || "none";
  const borderRadius = styles?.borderRadius || "none";
  const { fetchImgUrl } = useFetchStorageImg();
  useEffect(() => { getImage(); }, [path, subject]);
  const imgStyle = { width, height, margin, border, borderRadius };
  const [imgSrc, setImgSrc] = useState(null);
  const getImage = () => { if (path) fetchImgUrl(path, setImgSrc); };
  return (<img src={path ? imgSrc : normalEgg} alt="펫이미지" onClick={() => { onClick() }} style={imgStyle} />)
}
export default PetImg;