import styled from "styled-components"
import edit_icon from "../../image/icon/edit_icon.png"

const EditIcBtn = ({ onClick }) => {
  return (
    <StyledImg src={edit_icon} alt="편집" onClick={onClick} />
  )
}

const StyledImg = styled.img`
  width: 28px;
  height: 28px;
  cursor: pointer;
`
export default EditIcBtn
