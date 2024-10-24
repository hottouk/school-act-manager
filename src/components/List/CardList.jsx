import React, { useEffect, useState } from 'react'
//컴포넌트
import EmptyResult from '../EmptyResult'
import DataList from './DataList'
import SmallBtn from '../Btn/SmallBtn'
//css
import styled from 'styled-components'

//24.07.07(정렬 버튼 추가)
const CardList = ({ dataList, type, title, comment, setTeacherClassList, }) => {
  //1. 변수
  useEffect(() => {
    setDataList(dataList)
  }, [dataList])
  const [_dataList, setDataList] = useState(dataList)            //정렬 위해 useState 사용
  const [sortCriterion, setSortCriterion] = useState('subject'); //정렬 기준 바뀔 때마다 리랜더링
  //2. 함수: 데이터 정렬
  const sortDataList = (criterion) => {
    let sortedList = [...dataList].sort((a, b) => a[criterion].localeCompare(b[criterion]));
    setDataList(sortedList);
    setSortCriterion(criterion);
    console.log(sortCriterion, "으로 정렬")
  };

  return (<StyledContainer>
    <TitleBarContainer>
      <p className="title" >{title}</p>
      <BtnWrapper>
        {type === "activity" && <>
          <SmallBtn btnColor="#3454d1" btnName="과목" btnOnClick={() => { sortDataList("subject") }} />
          <SmallBtn btnColor="#3454d1" btnName="제목" btnOnClick={() => { sortDataList("title") }} />
        </>}
        {type === "classroom" && <>
          <SmallBtn btnColor="#3454d1" btnName="과목" btnOnClick={() => { sortDataList("subject") }} />
          <SmallBtn btnColor="#3454d1" btnName="반이름" btnOnClick={() => { sortDataList("classNumber") }} />
        </>}
        {type === "homeroom" && <>
          <SmallBtn btnColor="#3454d1" btnName="반" btnOnClick={() => { sortDataList("classNumber") }} />
        </>}
      </BtnWrapper>
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
  p.title {
    display: inline-block;
    margin: 10px 10px; 
  }
`
const TitleBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const BtnWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  button { 
    margin: 0 10px;
  }
`
const StyledListDiv = styled.div`
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