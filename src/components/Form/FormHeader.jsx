import React from 'react'
import styled from 'styled-components'

const FormHeader = ({ children }) => {
  return (
    <Container>
      {children}
    </Container>
  )
}

const Container = styled.div`
	width: 100%;
  height: 35px;  
  background-color: #3454d1;  
  position: absolute;  
  top: -35px;
  left: 0;
  padding: 5px 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  legend {
    width: 70%;  
    font-size: 1em;
    color: white;
    margin-bottom: 40px;
  }
`

export default FormHeader
