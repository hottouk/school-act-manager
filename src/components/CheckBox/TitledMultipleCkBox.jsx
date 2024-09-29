import React from 'react'
import styled from 'styled-components'

const TitledMultipleCkBox = ({ dataList }) => {
  return (
    <UlContainer>
      {dataList.map((item) => {
        let title = Object.keys(item)
        let subItemList = Object.values(item)[0]
        return <StyledLi key={Object.keys(item)[0]}>
          <StyledTitle>{title}</StyledTitle>
          {subItemList.map((spec) => {
            return <label>
              <input type="checkbox" name={spec} />
              {spec}
            </label>
          })}
        </StyledLi>
      })}

    </UlContainer>
  )
}

const UlContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 35px;
  padding: 0;
`
const StyledLi = styled.li`
  position: relative;
  border: 1px solid black;
  border-radius: 5px;
`
const StyledTitle = styled.p`
  position: absolute;
  top: -25px;
  background-color: #3454d1;
  color: white;
`
export default TitledMultipleCkBox