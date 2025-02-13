import React from 'react'
import styled from 'styled-components'

const FormFrame = ({ children }) => {
  return (
    <FormContainer>
      <fieldset>
        {children}
      </fieldset>
    </FormContainer>
  )
}

const FormContainer = styled.form`
  position: relative;
  width: 35%;
  max-width: 600px;
  margin: 80px auto 30px;
  padding: 20px;
  color: black;
  background-color: #efefef;
  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: rgba(52, 94, 209, 0.2) 0px 8px 24px, rgba(52, 84, 209, 0.2) 0px 16px 56px, rgba(52, 84, 209, 0.2) 0px 24px 80px;
  fieldset {
    padding: 2px;
  }
`

export default FormFrame
