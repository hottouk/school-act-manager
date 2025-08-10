import React from 'react'
import styled from 'styled-components'
//생성(241113) => 수정(250711)
const TransparentBtn = ({ id, children, onClick, styles, disabled }) => {
  const color = styles?.color || "#3454d1";
  const normalStyle = {
    width: styles?.width || "100%", color: styles?.color || "#3454d1",
    boxShadow: styles?.boxShadow || "5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.3)",
    cursor: styles?.cursor || "pointer",
    backgroundColor: styles?.backgroundColor || "transparent"
  };
  const disabledStyle = { width: "100%", boxShadow: "inset 5px 5px 10px rgba(0, 0, 0, 0.3),inset -5px -5px 10px rgba(255, 255, 255, 0.3)", cursor: "default", backgroundColor: "#3454d1" };
  return (
    <StyledBtn $borderColor={color}
      style={disabled ? disabledStyle : normalStyle}
      id={id}
      onClick={onClick}
      disabled={disabled}
    >{children || "샘플"}</StyledBtn>
  )
}
const StyledBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  border: 3px solid ${props => props.$borderColor};
  font-weight: bold;
  padding: 20px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3), 
             -5px -5px 15px rgba(255, 255, 255, 0.3); /* 입체감 */
  transition: all 0.5s ease;
  &:hover {
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.3),
                inset -5px -5px 10px rgba(255, 255, 255, 0.3); /* 눌린 느낌 */
  }
  @media screen and (max-width: 768px){
    height: ${window.innerHeight * 0.05}px;
  }
`
export default TransparentBtn