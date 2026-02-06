import React from 'react'
import styled from 'styled-components';

const InnerOverlay = () => {
  return <StyledOverlay />
}
const StyledOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
`;
export default InnerOverlay
