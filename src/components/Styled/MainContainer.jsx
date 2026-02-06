import React from 'react'
import styled from 'styled-components'
//생성(2060119)
const MainContainer = ({ children, styles }) => {
  const paddingTop = styles?.paddingTop ?? "0";
  const gap = styles?.gap ?? 0;
  const opacity = styles?.opacity ?? 1;
  const backgroundColor = styles?.backgroundColor ?? "#efefef";
  return (
    <Container
      $gap={gap}
      $opacity={opacity}
      $backgroundColor={backgroundColor}
      $paddingTop={paddingTop}>
      {children}
    </Container>
  )
}
const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap};
  box-sizing: border-box;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  min-height: 100dvh;
  padding-top: ${({ $paddingTop }) => $paddingTop};
  padding-bottom: 20px;

  @media screen and (max-width: 767px){ 
    padding-bottom: 0;
  }  
`
export default MainContainer
