//라이브러리
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
//컴포넌트
import CardList from '../../components/CardList';
import DataList from '../../components/DataList';
import EmptyResult from '../../components/EmptyResult';
//hooks
import useGetClass from '../../hooks/useGetClass';
import useClientHeight from '../../hooks/useClientHeight';
//CSS
import styled from 'styled-components';

//24.01.23
const ClassRoomMain = () => {
  //1. 변수
  const navigate = useNavigate()
  const user = useSelector(({ user }) => { return user }) //전역변수 user정보
  const { classList, searchResult, appliedClassList, errByGetClass, getClassByTeacherId } = useGetClass()
  const [_classRoomList, setClassRoomList] = useState(null)
  const [_searchResult, setSearchResult] = useState(null)
  const [_appliedClassList, setAppliedClassList] = useState(null)
  const [_teacherId, setTeacherId] = useState("")
  const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false) //고앵이 서치
  const clientHeight = useClientHeight(document.documentElement)   //화면 높이

  //2. UseEffect
  useEffect(() => {
    setClassRoomList(classList)
    setSearchResult(searchResult)
    setAppliedClassList(appliedClassList)
  }, [classList, appliedClassList, searchResult])

  //3. 함수
  const handleBtnClick = (event) => {
    event.preventDefault()
    switch (event.target.id) {
      case "create_btn":
        navigate('/classrooms_setting')
        break;
      case "search_btn":
        if ((_teacherId !== "")) {
          getClassByTeacherId(_teacherId)
          setIsSearchBtnClicked(true)
        } else { window.alert("교사 id를 입력해주세요.") }
        break;
      default: return;
    }
  }
  const handleInputOnChange = (event) => {
    setTeacherId(event.target.value)
  }
  return (
    <StyledContainer $clientheight={clientHeight}>
      <CardList dataList={_classRoomList} type="classroom"
        title="나의 클래스"
        tComment="아직 클래스가 없어요. 클래스를 만들어주세요"
        sComment="가입된 클래스가 없어요. 클래스에 가입하세요" />
      {!user.isTeacher && <CardList dataList={_appliedClassList} type="classroom"
        title="승인 대기중 클래스"
        sComment="가입 신청한 클래스가 없어요." />}
      {(_searchResult && _searchResult.length !== 0) && <>
        <h4>선생님 클래스</h4>
        <StyledClassRoomListDiv>
          <DataList classRooms={_searchResult} />
        </StyledClassRoomListDiv></>}
      {((!_searchResult || _searchResult.length === 0) && isSearchBtnClicked) && < EmptyResult comment="찾는 클래스가 없어요" />}
      {errByGetClass && <strong>{errByGetClass}</strong>}
      {!user.isTeacher && <>
        <label htmlFor="teacherId_search_input">교사 id로 검색</label>
        <input className='teacherId_search_input' type='text' value={_teacherId} onChange={handleInputOnChange} /></>}
      {user.isTeacher
        ? <StyledBtn id='create_btn' onClick={handleBtnClick}>클래스 만들기</StyledBtn>
        : <StyledBtn id='search_btn' onClick={(event) => { handleBtnClick(event) }}>클래스 검색</StyledBtn>}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  box-sizing: border-box;
  input, label {
    display: block;
    width: 300px;
    margin: 0 auto;
  }
  h4 {
    margin: 10px 10px 0;
  }
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const StyledClassRoomListDiv = styled.div`
  margin: 4px auto 50px;
  border-radius: 15px;
  border: 4px dotted #3454d1;
  @media screen and (max-width: 767px) {
    border: none;
    border-top: 1px solid #3454d1;
    border-bottom: 1px solid #3454d1;
  }
`
const StyledBtn = styled.button`
  appearance: none;
  backface-visibility: hidden;
  background-color: #3454d1;
  border-radius: 10px;
  border-style: none;
  box-shadow: none;
  box-sizing: border-box;
  margin: 30px auto;
  color: #fff;
  cursor: pointer;
  display: block;
  font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size: 15px;
  font-weight: 500;
  height: 50px;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  overflow: hidden;
  padding: 14px 30px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;

  &:hover {
  background-color: #1366d6;
  box-shadow: rgba(0, 0, 0, .05) 0 5px 30px, rgba(0, 0, 0, .05) 0 1px 4px;
  opacity: 1;
  transform: translateY(0);
  transition-duration: .35s;
  }
  
  &:hover:after {
    opacity: .5;
  }

  &:active {
    box-shadow: rgba(0, 0, 0, .1) 0 3px 6px 0, rgba(0, 0, 0, .1) 0 0 10px 0, rgba(0, 0, 0, .1) 0 1px 4px -1px;
    transform: translateY(2px);
    transition-duration: .35s;
  }

  &:active:after {
    opacity: 1;
  }
`
export default ClassRoomMain