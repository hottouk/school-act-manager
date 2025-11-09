import React from 'react'
import styled from 'styled-components'
import useGetByte from '../../hooks/useGetByte';
//생성(241113)
const ByteCalculator = ({ str, handleOnChange, styles }) => {
  const { getByteLengthOfString } = useGetByte();
  const isTotalByteHide = styles?.isTotalByteHide || false;
  const totalByte = styles?.totalByte || "1500";
  const justifyContent = styles?.justifyContent || "flex-end";
  const fontSize = styles?.fontSize || "16px";
  const fontColor = styles?.fontColor || "black";
  const width = styles?.width || "61px";
  return (
    <Container $justifyContent={justifyContent} $fontSize={fontSize} >
      <FlexWrapper $fontSize={fontSize} $fontColor={fontColor} >
        <StyledInput $fontSize={fontSize} $width={width}
          className="act_byte" type="number" onChange={handleOnChange} value={getByteLengthOfString(str || '')} disabled />
        {!isTotalByteHide && <p style={{ display: "inline-block" }}>/{totalByte}</p>}
        <p> Byte</p>
      </FlexWrapper>
    </Container>
  )
}
const Container = styled.div`
  margin-top: -8px;
  display: flex;
  justify-content: ${(props) => props.$justifyContent};
`
const StyledInput = styled.input`
  width: ${(props) => props.$width};
  margin: 5px 5px 0px 5px;
  height: 35px;
  border-radius: 5px;
  padding-left: 13px;
  font-size: ${(props) => props.$fontSize};
  &:disabled {
   color: black;
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