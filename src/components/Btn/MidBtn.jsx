import React from 'react'
import styled from 'styled-components'

const MidBtn = (props) => {
  return (
    <StyledBtn
      id={props.id}
      onClick={props.onClick}
      $backgroundColor={props.btnColor || "#3454d1"}
      $fontColor={props.fontColor || "#fff"}
      $hoverBackgroundColor={props.hoverBtnColor || "#1366d6"}
    >{props.children || "샘플"}</StyledBtn>
  )
}

export default MidBtn

const StyledBtn = styled.button`
  display: block;
  width: 150px;
  height: 35px;
  background-color: #3454d1;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  &:hover {
  background-color: ${(props) => props.$hoverBackgroundColor};
  box-shadow: rgba(0, 0, 0, .05) 0 5px 30px, rgba(0, 0, 0, .05) 0 1px 4px;
  opacity: 1;
  transform: translateY(0);
  transition-duration: .35s;
  }
`