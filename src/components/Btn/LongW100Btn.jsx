import React from 'react'
import styled from 'styled-components'

const LongW100Btn = ({ id, btnColor, btnOnClick, btnName, type }) => {
  return (
    <StyledLongW100Btn id={id} $backgroundColor={btnColor || "transparent"} type={type || "button"} onClick={btnOnClick}>{btnName || "샘플"}</StyledLongW100Btn>
  )
}

const StyledLongW100Btn = styled.button`
  display: inline;
  width: 100%;
  padding: 10px 15px;
  border-radius: 15px;
  border: 2px solid #efefef;
  background-color: ${(props) => props.$backgroundColor};
  color: whitesmoke;
`
export default LongW100Btn