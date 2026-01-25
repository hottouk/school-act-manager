import React from 'react'
import styled from 'styled-components'
//생성(2060119)
const ClickableIcon = ({ className = "fa-solid fa-file-excel", onClick = () => alert("클릭"), styles }) => {
  const fontSize = styles?.fontSize || "23px";
  const border = styles?.border || "none";
  return (
    <Icon $fontSize={fontSize} $border={border}
      className={className}
      onClick={onClick}
    />
  )
}
export default ClickableIcon;

const Icon = styled.i`
	padding: 6px;
  font-size: ${({ $fontSize }) => $fontSize};
  border: ${({ $border }) => $border};
	border-radius: 30px;
  cursor: pointer;
	&:hover {
  background-color: #3454d130;;
	transition-duration: .35s;
  }
`
