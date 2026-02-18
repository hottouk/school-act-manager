import React from 'react'
import styled from 'styled-components';

const InnerLayer = ({ children }) => {
    // 이너 레이어 안에 모달과 overLay 함께 넣기
    return <StyledLayer>
        {children}
    </StyledLayer>
}
const StyledLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1056; /* 부모 모달(보통 1055)보다 크게 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default InnerLayer;
