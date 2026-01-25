import React from 'react'
import styled from 'styled-components'
//생성(251106)
const ClickableText = ({ children, onClick = () => alert("test"), styles }) => {
  const fontSize = styles?.fontSize || "14px";
  const color = styles?.color || "rgb(120, 120, 120)";
  const hoverColor = styles?.hoverColor || "#3454d1";
  return (
    <StyledText $fontSize={fontSize} $color={color} $hoverColor={hoverColor} onClick={onClick}>
      {children}
    </StyledText>
  )
}
const StyledText = styled.div`
  font-size: ${({ $fontSize }) => $fontSize};
  color: ${({ $color }) => $color};
  text-decoration: underline;
  margin-bottom: 0;
  cursor: pointer;
  &:hover { color: ${({ $hoverColor }) => $hoverColor}; };
`
export default ClickableText
