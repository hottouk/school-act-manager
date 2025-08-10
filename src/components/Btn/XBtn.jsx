import React from 'react'
import styled from 'styled-components'
//생성(250721)
const XBtn = ({ onClick, styles }) => {
	const backgroundColor = styles?.backgroundColor || "rgba(120,120,120,0.5);";
	const color = styles?.color || "#3a3a3";
	return <StyledBtn $backgroundColor={backgroundColor} $color={color} onClick={() => { onClick(); }}>X</StyledBtn>
}
export default XBtn

const StyledBtn = styled.p`
	margin: 0;
  width: 30px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
	color:${({ $color }) => $color};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 3px;
  cursor: pointer;
`
