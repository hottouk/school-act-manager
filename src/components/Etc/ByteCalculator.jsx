import React from 'react'
import styled from 'styled-components'
import useGetByte from '../../hooks/useGetByte';

//2024.11.23 생성
const ByteCalculator = ({ str, handleOnChange }) => {
  const { getByteLengthOfString } = useGetByte();

  return (
    <Container>
      <label htmlFor="act_byte" ></label>
      <div>
        <input className="act_byte" type="number" onChange={handleOnChange} value={getByteLengthOfString(str)} disabled />
        <p style={{ display: "inline-block" }}> /1500 Byte</p>
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
    margin-top: 5px;
    margin-bottom: 15px;
    margin-right: 5px;
    max-width: 280px;
    height: 35px;
    border-radius: 7px;
    padding-left: 5px;
    &:disabled {        /* 해당 input disabled 되었을 때 */
      color: gray;      /* 글자 색을 white로 설정 */
    }
  }
`
export default ByteCalculator