import React from 'react'
import styled from 'styled-components'

const SubNav = ({ children, styles }) => {
  let gap = styles?.gap || "20px";
  return (
    <Container $gap={gap}>{children}</Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  gap: ${(props) => props.$gap};
  background-color: #efefef;
  p {
    display: none;
    color: #3454d1;
    font-weight: bold;
    margin-right: 10px;
    margin-bottom: 5px;
    @media screen and (max-width: 767px){
      display: inline-block;
    }
  }
`
export default SubNav