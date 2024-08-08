import React from 'react'
import styled from 'styled-components'

const MidBtn = (props) => {
  return (
    <StyledBtn
      type="button"
      onClick={props.btnOnClick}
      id={props.id}
      $backgroundColor={props.btnColor || "#3454d1"}
      $fontColor={props.fontColor || "#fff"}
      $hoverBackgroundColor={props.hoverBtnColor || "#1366d6"}
    >{props.btnName || "샘플"}</StyledBtn>
  )
}

export default MidBtn

const StyledBtn = styled.button`
  display: block;
  margin: 10px auto;
  width: 90px;
  height: 30px;
  background-color: #3454d1;
  border: none;
  border-radius: 5px;
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