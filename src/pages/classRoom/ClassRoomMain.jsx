//라이브러리
import { useNavigate } from 'react-router-dom'
//컴포넌트
import ClassRoomList from './ClassRoomList';
//hooks
import useCollection from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext';
//CSS
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 20px auto;
  margin-bottom: 50px;
`
const StyledBtn = styled.button`
  appearance: none;
  backface-visibility: hidden;
  background-color: #2f80ed;
  border-radius: 10px;
  border-style: none;
  box-shadow: none;
  box-sizing: border-box;
  margin: 50px auto;
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
const ClassRoomMain = () => {
  //전역변수 user정보
  const user = useSelector(({ user }) => { return user })
  const { documents, err } = useCollection('classRooms', ['uid', '==', user.uid], 'subject')
  const navigate = useNavigate()
  const classroomList = documents

  const handleBtnClick = (event) => {
    event.preventDefault()
    navigate('/classrooms_setting')
  }

  return (
    <StyledContainer>
      {classroomList
        ? <ClassRoomList classRooms={classroomList} />
        : <h3>아직 클래스가 없어요. 클래스를 만들어주세요</h3>
      }
      {err && <strong>{err}</strong>}
      <StyledBtn onClick={handleBtnClick}>클래스 만들기</StyledBtn>
    </StyledContainer>
  )
}

export default ClassRoomMain