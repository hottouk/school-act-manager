import React from 'react'
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
//2024.08.16(생성)
const DyRadios = ({ name, value, labelList, onChange, disabled }) => {
  // 작성 예시
  // <Radios
  //   name="cur_level_radio"
  //   labelList={["상", "중", "하"]}
  //   value={curRecLevel}
  //   onChange={(event) => { setCurRecLevel(event.target.value) }} />
  const sampleLabelList = ["sample1", "smaple2", "sample3"]
  const renderItem = (labelItem) => {
    return <Form.Check key={`key_${labelItem}`}
      onChange={onChange}
      name={name}
      inline
      type="radio"
      id={`id_${labelItem}_radio`}
      label={labelItem}
      value={labelItem}
      checked={value === labelItem}
      disabled={disabled}
    ></Form.Check>
  }
  return (
    <Container>
      {(labelList && labelList.length > 0)
        ? labelList.map(renderItem)
        : sampleLabelList.map(renderItem)
      }
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`
export default DyRadios