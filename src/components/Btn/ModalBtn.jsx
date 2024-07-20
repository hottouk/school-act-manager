import React from 'react'
import styled from 'styled-components'

const ModalBtn = (props) => {
  return (
    <StyledBtn $btnColor={props.btnColor} $hoverColor={props.hoverColor} onClick={props.onClick}>{props.btnName}</StyledBtn>
  )
}
export default ModalBtn

const StyledBtn = styled.button`
  appearance: button;
  background-color: ${(props) => { return props.$btnColor || "#1652F0" }};
  border: 1px solid ${(props) => { return props.$btnColor || "#1652F0" }};;
  border-radius: 4px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-family: Graphik,-apple-system,system-ui,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
  font-size: 14px;
  line-height: 1.15;
  overflow: visible;
  padding: 12px 16px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: all 80ms ease-in-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  &:disalbled {
    opacity: .5;
  }
  &:focus {
    outline: 0;
  }
  &:hover {
    background-color: ${(props) => { return props.$hoverColor || "#0A46E4" }};
    border-color: ${(props) => { return props.$btnColor || "#1652F0" }};
  }
  &:active {
    background-color: #0039D7;
    border-color: #0039D7;
  }
`
