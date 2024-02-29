import React from 'react'
import EmptyResult from './EmptyResult'
import DataList from './DataList'
import styled from 'styled-components'

const CardList = ({ dataList, type, title, comment, setTeacherClassList }) => {
  return (<StyledContainer>
    {/* 데이터 */}
    {(dataList && dataList.length > 0) && <>
      <h6 className="title">{title}</h6>
      {type === "teacher" && <StyledListDiv>
        <DataList dataList={dataList} type={type} setTeacherClassList={setTeacherClassList} />
      </StyledListDiv>}
      {type === "classroom" && <StyledListDiv>
        <DataList dataList={dataList} type={type} />
      </StyledListDiv>}
      {type === "appliedClassList" && <StyledListDiv>
        <DataList dataList={dataList} type={type} />
      </StyledListDiv>}
      {type === "activity" && <StyledListDiv>
        <DataList dataList={dataList} type={type} />
      </StyledListDiv>}
    </>}
    {/* 데이터 없음*/}
    {(!dataList || dataList.length === 0) && <>
      <h6 className="title">{title}</h6>
      <StyledListDiv>
        < EmptyResult comment={comment} />
      </StyledListDiv></>}
  </StyledContainer>)
}

const StyledContainer = styled.div`
  h6.title {
  display: inline-block;
  margin: 0 0 0 10px;
  }
`

const StyledListDiv = styled.div`
  margin: 4px auto 50px;
  border-top: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;
  
  @media screen and (max-width: 767px) {
    border: none;
    border-top: 1px solid #3454d1;
    border-bottom: 1px solid #3454d1;
  }
`

export default CardList