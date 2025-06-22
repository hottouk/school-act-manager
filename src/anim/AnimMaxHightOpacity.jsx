import styled from 'styled-components'

const AnimMaxHightOpacity = ({ isVisible, content, children }) => {
  return (
    <AnimationWrapper $isVisible={isVisible}>
      {isVisible && (content || children)}
    </AnimationWrapper>
  )
}

const AnimationWrapper = styled.div`
  max-height: ${({ $isVisible }) => ($isVisible ? '1500px' : '0')}; /* max-height를 동적으로 설정 */
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: max-height 0.5s ease, opacity 0.5s ease;
`

export default AnimMaxHightOpacity