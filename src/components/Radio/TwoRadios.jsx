import React from 'react'
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

const TwoRadios = ({ name, id, value, label, onChange, disabled }) => {
  return (
    <StyledRadioContainer>
      <div className="radio_div">
        <Form.Check onChange={onChange}
          name={name}
          inline
          type="radio"
          id={id[0]}
          label={label[0]}
          checked={value}
          disabled={disabled}
        ></Form.Check>
      </div>
      <div className="radio_div">
        <Form.Check onChange={onChange}
          name={name}
          inline
          type="radio"
          id={id[1]}
          label={label[1]}
          checked={!value}
          disabled={disabled}
        ></Form.Check>
      </div>
    </StyledRadioContainer>
  )
}

const StyledRadioContainer = styled.div`
  display: flex;
  height: 40px;

  div.radio_div {
    width: 200px;
  }
`
export default TwoRadios