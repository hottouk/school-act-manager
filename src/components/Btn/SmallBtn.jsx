import React from 'react'
import styled from 'styled-components'

const SmallBtn = (props) => {
  return (
    <StyledBtn $backgroundColor={props.btnColor} onClick={props.btnOnClick}>{props.btnName}</StyledBtn>
  )
}
const StyledBtn = styled.button`
  appearance: none;
  backface-visibility: hidden;
  background-color: ${(props) => props.$backgroundColor};
  border-radius: 10px;
  border-style: none;
  box-shadow: none;
  box-sizing: border-box;
  margin: auto;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size: 10px;
  font-weight: 500;
  height: 25px;
  width: 50px;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  overflow: hidden;
  padding: 10px 20px;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;

  &:hover {
  background-color: #1366d6;
  box-shadow: rgba(0, 0, 0, .05) 0 5px 30px, rgba(0, 0, 0, .05) 0 1px 4px;
  opacity: 1;
  transform: translateY(0);
  transition-duration: .35s;
  }
  
  &:hover:after {
    opacity: .5;
  }

  &:active {
    box-shadow: rgba(0, 0, 0, .1) 0 3px 6px 0, rgba(0, 0, 0, .1) 0 0 10px 0, rgba(0, 0, 0, .1) 0 1px 4px -1px;
    transform: translateY(2px);
    transition-duration: .35s;
  }
  &:active:after {
    opacity: 1;
  }
`
export default SmallBtn