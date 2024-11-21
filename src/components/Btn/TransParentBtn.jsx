import React from 'react'
import styled from 'styled-components'
//2024.11.13 생성
const TransparentBtn = ({ id, width, color, btnName, btnOnClick }) => {
  return (
    <StyledBtn
      id={id}
      onClick={btnOnClick}
      $width={width || 200}
      $color={color || "#3454d1"}
    >{btnName || "샘플"}</StyledBtn>
  )
}

const StyledBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ $width }) => $width}px;
  color: ${({ $color }) => $color};
  background-color: transparent;
  border-radius: 15px;
  border: 3px solid ${({ $color }) => $color};
  font-weight: bold;
  padding: 20px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3), 
             -5px -5px 15px rgba(255, 255, 255, 0.3); /* 입체감 */
  transition: all 0.5s ease;
  &:hover {
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.3),
                inset -5px -5px 10px rgba(255, 255, 255, 0.3); /* 눌린 느낌 */
  }
  @media screen and (max-width: 767px){
    width: 110px;
    height: 40px;
  }
`
export default TransparentBtn