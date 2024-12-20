import React, { useEffect, useState } from 'react'
//컴포넌트
import EmptyResult from '../EmptyResult'
import DataList from './DataList'
//css
import styled from 'styled-components'

//24.07.07(정렬 버튼 추가) --> 12.16(정렬 바 분리)
const CardList = ({ dataList, type, comment }) => {
  //----1.변수부--------------------------------
  useEffect(() => { setDataList(dataList) }, [dataList])
  const [_dataList, setDataList] = useState(dataList)

  //----2.함수부--------------------------------

  return (
    <Container>
      {(_dataList && _dataList.length > 0) &&
        <ListWrapper >
          <DataList dataList={_dataList} type={type} />
        </ListWrapper>}
      {/* 데이터 없음*/}
      {(!_dataList || _dataList.length === 0) && <>
        <ListWrapper>< EmptyResult comment={comment} /></ListWrapper></>}
    </Container>)
}

const Container = styled.div`
  p.title {
    display: inline-block;
    margin: 10px 10px; 
  }
`
const ListWrapper = styled.div`
  margin: 5px auto 5px;
  border-top: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;

  @media screen and (max-width: 767px) {
    border: none;
    border-top: 1px solid #3454d1;
    border-bottom: 1px solid #3454d1;
  }
`

export default CardList