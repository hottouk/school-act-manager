import styled from 'styled-components'

const AnimOpacity = ({ isVisible, content, children }) => {
  return (
    <AnimationWrapper $isVisible={isVisible} >
      {isVisible && (content || children)}
    </AnimationWrapper>
  )
}

const AnimationWrapper = styled.div`
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.5s ease, height 2.5s ease;
`

export default AnimOpacity