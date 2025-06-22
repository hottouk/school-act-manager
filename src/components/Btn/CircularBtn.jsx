import React from 'react'
import styled from 'styled-components'

const CircularBtn = ({ children, onClick, type, styles }) => {
  const color = styles?.color;
  return (
    <StyledBtn type={type || "button"} $color={color} onClick={onClick}>
      <Text>{children}</Text>
    </StyledBtn >
  )
}
export default CircularBtn

const StyledBtn = styled.button`
  position: relative;
  height: 36px;
  width: 36px;
  border: none;
  border-radius: 18px;
  background-color: ${({ $color }) => $color ? $color : "#3454d1"};
  color: white;
  font-size: 25px;
  font-weight: 700;
`
const Text = styled.p`
  position: absolute;
  text-align: center;
  top:0;
  left: 0;
  right: 0;
  margin: 0;
`
