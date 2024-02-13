import React from 'react'
import EmptyResult from './EmptyResult'
import DataList from './DataList'
import styled from 'styled-components'

const CardList = ({ dataList, type, title, comment }) => {
  return (<>
    {(dataList && dataList.length > 0) && <>
      <h4>{title}</h4>
      {type === "classroom" && <StyledListDiv>
        <DataList classRooms={dataList} />
      </StyledListDiv>}
      {type === "activity" && <StyledListDiv>
        <DataList activities={dataList} />
      </StyledListDiv>}
    </>}
    {(!dataList || dataList.length === 0) && <>
      <h4>{title}</h4>
      <StyledListDiv>
        < EmptyResult comment={comment} />
      </StyledListDiv></>}
  </>)
}

const StyledListDiv = styled.div`
  margin: 4px auto 50px;
  border-radius: 15px;
  border: 4px dotted #3454d1;
  @media screen and (max-width: 767px) {
    border: none;
    border-top: 1px solid #3454d1;
    border-bottom: 1px solid #3454d1;
  }
`

export default CardList