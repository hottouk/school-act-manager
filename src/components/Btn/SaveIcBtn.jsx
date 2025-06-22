import styled from "styled-components"
import save_icon from "../../image/icon/save_icon.png"

const SaveIcBtn = ({ onClick }) => {
  return (
    <StyledImg src={save_icon} alt="편집" onClick={onClick} />
  )
}

const StyledImg = styled.img`
  width: 23px;
  height: 23px;
  margin-top: 5px;
  cursor: pointer;
`
export default SaveIcBtn
