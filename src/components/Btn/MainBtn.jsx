import React from 'react'
import styled from 'styled-components'

const MainBtn = ({ btnName, btnOnClick }) => {
  return (
    <StyledBtn onClick={btnOnClick}>{btnName || "샘플"} </StyledBtn>
  )
}
const StyledBtn = styled.button`
  appearance: none;
  backface-visibility: hidden;
  background-color: #3454d1;
  border-radius: 10px;
  border-style: none;
  box-shadow: none;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: block;
  font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size: 15px;
  font-weight: 500;
  height: 50px;
  letter-spacing: normal;
  line-height: 1.5;
  margin: 30px auto;
  outline: none;
  overflow: hidden;
  padding: 14px 30px;
  position: relative;
  text-align: center;
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

  &:focus {
    outline: none; /* 기본 포커스 스타일 제거 */
    box-shadow: 0 0 0 3px black; /* 검은색 테두리 추가 */
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
export default MainBtn