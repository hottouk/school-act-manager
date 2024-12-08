import React from 'react'
import styled from 'styled-components'

//2024.12.1 생성
const AnimRotation = ({ children, isAnimating }) => {
  //perspective: 1000px; /* 3D 효과를 위한 원근법 */을 바로 아래 children css에 적용할 것

  return (
    <RotationContainer $isAnimating={isAnimating}>{children}</RotationContainer>
  )
}

const RotationContainer = styled.div`
  width: 100%;
  animation: ${(props) => props.$isAnimating ? "rotateYAnimation 0.5s ease forwards" : "none"};
  transform-style: preserve-3d; /* 자식 요소의 3D 효과 유지 */
  @keyframes rotateYAnimation {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
`

export default AnimRotation