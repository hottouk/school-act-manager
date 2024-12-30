import React from 'react'
import styled from 'styled-components'
import useGetByte from '../../hooks/useGetByte';

//2024.11.23 생성
const ByteCalculator = ({ str, handleOnChange, styles }) => {
  const { getByteLengthOfString } = useGetByte();
  //기본값
  let isTotalByteHide = styles?.isTotalByteHide || false
  let justifyContent = styles?.justifyContent || "flex-end"
  let fontSize = styles?.fontSize || "16px"
  let fontColor = styles?.fontColor || "black;"
  let width = styles?.width || "61px;"
  return (
    <Container $justifyContent={justifyContent} $fontSize={fontSize} >
      <FlexWrapper $fontSize={fontSize} $fontColor={fontColor} >
        <StyledInput $fontSize={fontSize} $width={width}
          className="act_byte" type="number" onChange={handleOnChange} value={getByteLengthOfString(str || '')} disabled />
        {!isTotalByteHide && <p style={{ display: "inline-block" }}>/1500</p>}
        <p>Byte</p>
      </FlexWrapper>
    </Container>
  )
}
const Container = styled.div`
  margin-top: -8px;
  display:flex;
  justify-content: ${(props) => props.$justifyContent};
`
const StyledInput = styled.input`
  width: ${(props) => props.$width};
  margin: 5px 5px 0px 5px;
  height: 35px;
  border-radius: 5px;
  padding-left: 13px;
  font-size: ${(props) => props.$fontSize};
  &:disabled {        /* 해당 input disabled 되었을 때 */
    color: black;      /* 글자 색을 white로 설정 */
  }
`
const FlexWrapper = styled.div`
  display: flex;
  p {
    font-size: ${(props) => props.$fontSize};
    margin: 10px 0px 0px 2px;
    color: ${(props) => props.$fontColor};
  }
`
export default ByteCalculator