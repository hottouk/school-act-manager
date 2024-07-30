import React from 'react'
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

const TwoRadios = ({ name, id, value, label, onChange, disabled }) => {
  return (
    <StyledRadioContainer>
      <RadioWrapper>
        <Form.Check onChange={onChange}
          name={name}
          inline
          type="radio"
          id={id ? id[0] : "id1"}
          label={label ? label[0] : "label1"}
          checked={value}
          disabled={disabled}
        ></Form.Check>
        <Form.Check onChange={onChange}
          name={name}
          inline
          type="radio"
          id={id ? id[1] : "id2"}
          label={label ? label[1] : "label2"}
          checked={!value}
          disabled={disabled}
        ></Form.Check>
      </RadioWrapper>
    </StyledRadioContainer>
  )
}
const StyledRadioContainer = styled.div`
  display: flex;
  height: 40px;
`
const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`
export default TwoRadios