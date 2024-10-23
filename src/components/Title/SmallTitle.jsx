import React from 'react'
import styled from 'styled-components'

const SmallTitle = ({ title, pointer, onClick, styles }) => {
  return (
    <StyledTitle>{title || "샘플"}</StyledTitle>
  )
}
const StyledTitle = styled.p`
  display: inline;
  margin: 0;
  padding: 5px;
  color: white;
  background-color: #3454d1;
  border-radius: 5px;
  font-size: 12px;
`
export default SmallTitle