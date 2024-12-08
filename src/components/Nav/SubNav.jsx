import React from 'react'
import styled from 'styled-components'

const SubNav = ({ children }) => {
  return (
    <Container>{children}</Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  gap: 20px;
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