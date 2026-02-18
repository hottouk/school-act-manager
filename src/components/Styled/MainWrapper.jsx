import React from 'react'
import styled from 'styled-components'
//생성(251106)
const MainWrapper = ({ children, styles }) => {
  const position = styles?.position || null;
  const width = styles?.width || "75%";
  const height = styles?.height || null;
  const margin = styles?.margin || "0";
  const gap = styles?.gap || "0";
  return (
    <Container $position={position} $width={width} $height={height} $margin={margin} $gap={gap}>
      {children}
    </Container>
  )
}
const Container = styled.div`
  position:${({ $position }) => $position};
  display: flex;
  flex-direction: column;
  align-self: center;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  margin : ${({ $margin }) => $margin};
  gap:${({ $gap }) => $gap};
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`
export default MainWrapper
