import React from 'react'
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
//2024.08.16(정리)
const TwoRadios = ({ name, id, value, label, onChange, disabled }) => {
  // 작성 예시
  // <TwoRadios name="isPrivate_radio"
  //   id={["private_radio", "public_radio"]}
  //   value={_isPrivate} label={["비공개 활동", "공개 활동"]}
  //   onChange={() => { setIsFourStep(!_isFourStep) }} />
  //   disabled={!isModified} />
  return (
    <Container>
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
    </Container>
  )
}
const Container = styled.div`
  display: flex;
`
const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`
export default TwoRadios