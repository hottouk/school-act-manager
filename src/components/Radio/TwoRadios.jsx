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
          id={id ? id[0] : "id1"}
          label={label ? label[0] : "label1"}
          checked={value}
          disabled={disabled}
        ></Form.Check>
      </div>
      <div className="radio_div">
        <Form.Check onChange={onChange}
          name={name}
          inline
          type="radio"
          id={id ? id[1] : "id2"}
          label={label ? label[1] : "label2"}
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