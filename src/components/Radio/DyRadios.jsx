import React from 'react'
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
// 작성 예시
// <Radios
//   name="cur_level_radio"
//   labelList={["상", "중", "하"]}
//   value={curRecLevel}
//   onChange={(event) => { setCurRecLevel(event.target.value) }} />
//생성(240816) => 확장(251019)
function getFormat(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString();
  }
  return String(value);
}
const DyRadios = ({ name, value, labelList, onChange, unit, disabled }) => {
  const sampleLabelList = ["sample1", "smaple2", "sample3"];
  const renderItem = (labelItem) => {
    const format = getFormat(labelItem);
    return <Form.Check key={`key_${labelItem}`}
      onChange={onChange}
      name={name}
      inline
      type="radio"
      id={`id_${labelItem}_radio`}
      label={unit ? format + unit : format}
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