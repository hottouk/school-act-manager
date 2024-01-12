//라이브러리
import { useNavigate } from 'react-router-dom'
//컴포넌트
import DataList from '../../components/DataList';
//hooks
import useCollection from '../../hooks/useCollection'
//CSS
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

//24.01.09
const ClassRoomMain = () => {
  //1. 변수
  //전역변수 user정보
  const user = useSelector(({ user }) => { return user })
  const navigate = useNavigate()
  const { documentList, err } = useCollection('classRooms', ['uid', '==', user.uid], 'subject')
  const [_classRoomList, setClassRoomList] = useState(null)

  //2. UseEffect
  useEffect(() => {
    setClassRoomList(documentList)
  }, [documentList])

  //3. 함수
  const handleBtnClick = (event) => {
    event.preventDefault()
    navigate('/classrooms_setting')
  }

  return (
    <StyledContainer>
      {_classRoomList
        ? <DataList classRooms={_classRoomList} />
        : <h3>아직 클래스가 없어요. 클래스를 만들어주세요</h3>
      }
      {err && <strong>{err}</strong>}
      <StyledBtn onClick={handleBtnClick}>클래스 만들기</StyledBtn>
    </StyledContainer>
  )
}
const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 20px auto;
  margin-bottom: 50px;
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