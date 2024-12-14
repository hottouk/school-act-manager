import { keyframes } from 'styled-components';

const useAnimation = () => {
  // 사용례
  // ${(props) => props.$isAnimating && css`
  // animation: ${growAndShrink3D} 2.0s ease forwards;
  // animation-delay: ${props.$i * 0.5}s;`}

  const fallFromSky = keyframes`
  from {
    transform: translateY(-800px) rotate(-720deg); /* 위쪽에서 시작 */
    opacity: 0;
  }
  to {
    transform: translateY(0) rotate(0); /* 원래 위치로 */
    opacity: 1;
  }
`
  const growAndShrink3D = keyframes`
  0% {
    transform: scale(1) rotateX(0deg) rotateY(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(3) rotateX(360deg) rotateY(-15deg);
  }
  100% {
    transform: scale(1) rotateX(0deg) rotateY(0deg);
    opacity: 1;
  }
`;

  return ({ fallFromSky, growAndShrink3D })
}

export default useAnimation

