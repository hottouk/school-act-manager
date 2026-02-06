import React from 'react'
import styled from 'styled-components'
//생성(260206)
const Title = ({ children }) => {
  return (
    <StyledTitle>{children}</StyledTitle>
  )
}

const StyledTitle = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`
export default Title