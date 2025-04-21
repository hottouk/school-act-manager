import React, { useRef, useState } from 'react';
import SmallBtn from '../Btn/SmallBtn';
import styled from 'styled-components';
import SearchSection from './SearchSection';
//생성(241215) -> 연도필터링(250416)
const SearchBar = ({ title, type, list, setList, isMobile }) => {
  const [keyword, setKeyword] = useState('');
  const [clicked, setClicked] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const originalListRef = useRef([]); //상태 변경에도 값을 유지하기 위해서 ref로 받음.
  // 초기 값 저장 (컴포넌트가 처음 렌더링될 때 한 번만 실행)
  if (originalListRef.current.length === 0 && list?.length > 0) {
    originalListRef.current = [...list];
  }
  //기준에 따라 정렬
  const sortDataList = (criterion) => {
    let sorted = [...list].sort((a, b) => a[criterion].localeCompare(b[criterion]));
    setList(sorted)
  };

  //기준에 따라 검색
  const searchData = (criterion, keyword) => {
    // keyword가 없으면 원래 리스트로 복구
    if (!originalListRef.current || originalListRef.current.length === 0 || keyword.trim() === '') {
      setList([...originalListRef.current]);
      return
    }
    // 키워드 검색
    let results = [...list].filter(item => item[criterion] && item[criterion].toLowerCase().includes(keyword.toLowerCase()));
    setList(results);
  }
  //해당 연도 생성반만 필터
  const showOnlythisYear = (thisYear) => {
    setOriginalList(list);
    const onlyThisYear = list.filter((klass) => {
      const timeStamp = klass.createdTime;
      const date = new Date(timeStamp.seconds * 1000);
      const year = date.getFullYear();
      return year === thisYear;
    })
    setList(onlyThisYear);
    setClicked("thisYear");
  }

  //필터링 이전
  const showAll = () => {
    setList(originalList);
    setClicked(null);
  }

  return (
    <Container>
      <p>{title}</p>
      {(type === "acti" && !isMobile) &&
        <SearchSection keyword={keyword} placeholder="제목 검색" onChange={(e) => { setKeyword(e.target.value) }} onClick={() => searchData("title", keyword)} />}
      {(type === "classroom" && !isMobile) &&
        <SearchSection keyword={keyword} placeholder="반 이름 검색" onChange={(e) => { setKeyword(e.target.value) }} onClick={() => searchData("classTitle", keyword)} />}
      {type === "school" &&
        <SearchSection keyword={keyword} placeholder="학교명 검색" onChange={(e) => { setKeyword(e.target.value) }} onClick={() => searchData("classTitle", keyword)} />}
      <BtnWrapper>
        {type === "acti" && <>
          <SmallBtn btnColor="#3454d1" btnName="과목" btnOnClick={() => { sortDataList("subject") }} />
          <SmallBtn btnColor="#3454d1" btnName="제목" btnOnClick={() => { sortDataList("title") }} />
        </>}
        {type === "allActi" && <>
          <SmallBtn btnColor="#3454d1" btnName="제목" btnOnClick={() => { sortDataList("title") }} />
          <SmallBtn btnColor="#3454d1" btnName="교사" btnOnClick={() => { sortDataList("madeBy") }} />
        </>}
        {(type === "classroom" && !isMobile) && <>
          {clicked === null && <SmallBtn btnColor="#3454d1" btnName="2025" btnOnClick={() => { showOnlythisYear(2025); }} />}
          {clicked === "thisYear" && <SmallBtn btnColor="#3454d1" btnName="전체반" btnOnClick={showAll} />}
          <SmallBtn btnColor="#3454d1" btnName="과목" btnOnClick={() => { sortDataList("subject") }} />
          <SmallBtn btnColor="#3454d1" btnName="반이름" btnOnClick={() => { sortDataList("classNumber") }} />
        </>}
      </BtnWrapper>
    </Container>)
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    display: inline-block;
    margin: 10px 10px; 
  }
`
const BtnWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  button { margin: 0 10px; }
`
export default SearchBar
