import React from 'react'
import styled from 'styled-components'

const FormHeader = ({ children, styles }) => {
  const top = styles?.top || "-35px";

  return (
    <StyledHeader $top={top}>
      {children}
    </StyledHeader>
  )
}

const StyledHeader = styled.div`
	width: 100%;
  height: 35px;  
  background-color: #3454d1b1;  
  position: absolute;  
  top: ${({ $top }) => $top};
  left: 0;
  padding: 5px 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: white;
  legend {
    width: 70%;  
    font-size: 1em;
    color: white;
    margin-bottom: 40px;
  }
`

export default FormHeader
