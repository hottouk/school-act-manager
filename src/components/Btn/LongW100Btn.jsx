import React from 'react'
import styled from 'styled-components'

const LongW100Btn = (props) => {
  return (
    <StyledLongW100Btn id={props.id} $backgroundColor={props.btnColor || "transparent"} onClick={props.btnOnClick}>{props.btnName||"샘플"}</StyledLongW100Btn>
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