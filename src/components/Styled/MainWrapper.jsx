import React from 'react'
import styled from 'styled-components'
//생성(251106)
const MainWrapper = ({ children, styles }) => {
  const width = styles?.width || "75%";
  return (
    <Container $width={width}>
      {children}
    </Container>
  )
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => $width};
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  @media screen and (max-width: 768px) {
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    overflow-y: scroll;
  }
`
export default MainWrapper
