import styled from 'styled-components'
import plus from "../../image/icon/plus.png"

//생성(250719)
const PlusBtn = ({ onClick }) => <PlusButton src={plus} onClick={() => { onClick() }} />

const PlusButton = styled.img`
  width: 80px;
  height: 80px;
  margin-top: 10px;
  border-radius: 20px;
  cursor: pointer;
	object-fit: cover;
	opacity: 0.8;
  transition: transform 0.1s;
  &:hover {
    background-color: orange;
    transform: scale(1.3);
    z-index: 1;
  }
`
export default PlusBtn
