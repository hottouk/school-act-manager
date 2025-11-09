import React from 'react'
import styled from 'styled-components'

const ModalBtn = ({ onClick, children, styles }) => {
  const btnColor = styles?.btnColor || "#6c757d"
  const hoverColor = styles?.hoverColor || "#5c636a"
  return <StyledBtn $btnColor={btnColor} $hoverColor={hoverColor}
    onClick={onClick}>{children || "샘플"}</StyledBtn>
}
export default ModalBtn

const StyledBtn = styled.button`
  appearance: button;
  background-color: ${(props) => { return props.$btnColor || "#1652F0" }};
  border: none;
  border-radius: 6px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-family: Graphik,-apple-system,system-ui,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
  font-size: 16px;
  font-weight: 500;
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
  &:hover {
    background-color: ${(props) => { return props.$hoverColor || "#0A46E4" }};
    border-color: ${(props) => { return props.$btnColor || "#1652F0" }};
  }
`
