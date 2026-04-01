import React from 'react'
import styled from 'styled-components'
//생성(2060119)
const ClickableIcon = (
  {
    className = "fa-solid fa-file-excel",
    onClick = () => alert("클릭"),
    title,
    styles }
) => {
  const fontSize = styles?.fontSize || "23px";
  const border = styles?.border || "none";
  const color = styles?.color || "#212529";
  const hoverColor = styles?.hoverColor || "#3454d130";
  return (
    <Icon $fontSize={fontSize} $border={border} $color={color} $hoverColor={hoverColor}
      className={className}
      onClick={onClick}
      title={title}
    />
  )
}
export default ClickableIcon;

const Icon = styled.i`
	padding: 6px;
  font-size: ${({ $fontSize }) => $fontSize};
  border: ${({ $border }) => $border};
  color: ${({ $color }) => $color};
	border-radius: 30px;
  cursor: pointer;
	&:hover {
  background-color: ${({ $hoverColor }) => $hoverColor};
	transition-duration: .35s;
  }
`
