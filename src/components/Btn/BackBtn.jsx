import { useNavigate } from "react-router-dom";
import back_icon from "../../image/icon/back_icon.png"
import styled from 'styled-components';

//2024.12.06 생성
const BackBtn = () => {
  const navigate = useNavigate()
  return (
    <StyledImg src={back_icon} alt="뒤로 가기" onClick={() => { navigate(-1) }} />
  )
}

const StyledImg = styled.img`
  width: 45px;
  height: 45px;
  cursor: pointer;
  &:hover {
  background-color: rgba(49, 84, 209, 0.4);
  border-radius: 5px;
  transition: background-color 0.5s ease-in-out;
`

export default BackBtn