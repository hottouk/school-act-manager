import React, { useEffect, useState } from 'react'
import EmptyResult from './EmptyResult'
import DataList from './DataList'
import styled from 'styled-components'
import SmallBtn from './Btn/SmallBtn'

//24.07.07(정렬 버튼 추가)
const CardList = ({ dataList, type, title, comment, setTeacherClassList, }) => {
  useEffect(() => {
    setDataList(dataList)
  }, [dataList])

  const [_dataList, setDataList] = useState(dataList)            //정렬 위해 useState 사용
  const [sortCriterion, setSortCriterion] = useState('subject'); //정렬 기준 바뀔 때마다 리랜더링

  //데이터 정렬
  const sortDataList = (criterion) => {
    const sortedList = [...dataList].sort((a, b) => a[criterion].localeCompare(b[criterion]));
    setDataList(sortedList);
    setSortCriterion(criterion);
    console.log(sortCriterion, "으로 정렬")
  };

  return (<StyledContainer>
    <TitleBarContainer>
      <h6 className="title" >{title}</h6>
      <BtnContainer>
        {type === "activity" && <>
          <SmallBtn btnColor="#3454d1" btnName="과목" btnOnClick={() => { sortDataList("subject") }} />
          <SmallBtn btnColor="#3454d1" btnName="제목" btnOnClick={() => { sortDataList("title") }} />
        </>}
        {type === "classroom" && <>
          <SmallBtn btnColor="#3454d1" btnName="과목" btnOnClick={() => { sortDataList("subject") }} />
          <SmallBtn btnColor="#3454d1" btnName="반이름" btnOnClick={() => { sortDataList("classNumber") }} />
        </>}
      </BtnContainer>
    </TitleBarContainer>
    {/* 데이터 존재*/}
    {(_dataList && _dataList.length > 0) &&
      <StyledListDiv >
        {type === "teacher" ?
          <DataList dataList={_dataList} type={type} setTeacherClassList={setTeacherClassList} />
          :
          <DataList dataList={_dataList} type={type} />
        }
      </StyledListDiv>}
    {/* 데이터 없음*/}
    {(!_dataList || _dataList.length === 0) && <>
      <StyledListDiv>
        < EmptyResult comment={comment} />
      </StyledListDiv></>}
  </StyledContainer>)
}

const StyledContainer = styled.div`
  h6.title {
  display: inline-block;
  margin: 10px 0; 
  }
`
const TitleBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const BtnContainer = styled.div`
  display: inline-flex;
  align-items: center;
  button { 
    margin: 0 10px;
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