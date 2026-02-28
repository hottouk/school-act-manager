import { useNavigate } from "react-router-dom";
import back_icon from "../../image/icon/back_icon.png"
import styled from 'styled-components';

//생성(241206)
const BackBtn = () => {
  const navigate = useNavigate();
  return <BackIcon
    className="fa-solid fa-circle-arrow-left"
    src={back_icon}
    onClick={() => navigate(-1)}
    title={"뒤로"}
  />

}
const BackIcon = styled.i`
  font-size: 23px;
  cursor: pointer;
  padding: 6px;
  border-radius: 30px;
  &:hover {
  background-color: #3454d130;;
	transition-duration: .35s;
  }
`

export default BackBtn