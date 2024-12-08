import React from 'react'
import styled from 'styled-components'
import useGetByte from '../../hooks/useGetByte';

//2024.11.23 생성
const ByteCalculator = ({ str, handleOnChange, styles }) => {
  const { getByteLengthOfString } = useGetByte();
  //기본값
  let isTotalByteHide = styles?.isTotalByteHide || false

  return (
    <Container>
      <label htmlFor="act_byte" ></label>
      <div>
        <input className="act_byte" type="number" onChange={handleOnChange} value={getByteLengthOfString(str)} disabled />
        {!isTotalByteHide && <p style={{ display: "inline-block" }}> /1500 Byte</p>}
      </div>
    </Container>
  )
}
const Container = styled.div`
  margin-top: -8px;
  display:flex;
  justify-content: flex-end;
  label {
    margin-bottom: 15px;
  }
  input {
    width: 85px;
    margin: 5px;
    max-width: 280px;
    height: 35px;
    border-radius: 7px;
    text-align: center;
    &:disabled {        /* 해당 input disabled 되었을 때 */
      color: black;      /* 글자 색을 white로 설정 */
    }
  }
`
export default ByteCalculator