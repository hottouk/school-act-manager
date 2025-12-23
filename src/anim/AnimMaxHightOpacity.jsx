import styled from 'styled-components'

const AnimMaxHightOpacity = ({ isVisible, content, children, styles }) => {
  const width = styles?.width || "100%";
  const margin = styles?.margin || "0";
  const gap = styles?.gap || "0";

  return (
    <AnimationWrapper $isVisible={isVisible} $width={width} $margin={margin}>
      {isVisible && (content || children)}
    </AnimationWrapper>
  )
}

const AnimationWrapper = styled.div`
  width: ${({ $width }) => $width};
  margin : ${({ $margin }) => $margin};
  max-height: ${({ $isVisible }) => ($isVisible ? '1500px' : '0')}; /* max-height를 동적으로 설정 */
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: max-height 0.5s ease, opacity 0.5s ease;
`

export default AnimMaxHightOpacity