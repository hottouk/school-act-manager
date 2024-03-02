//라이브러리
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
//컴포넌트
import CardList from '../../components/CardList';
//hooks
import useGetClass from '../../hooks/useGetClass';
import useClientHeight from '../../hooks/useClientHeight';
//CSS
import styled from 'styled-components';
import TSearchInputBtn from '../../components/TSearchInputBtn';

//24.01.23
const ClassRoomMain = () => {
  //1. 변수
  const navigate = useNavigate()
  //전역변수 
  const user = useSelector(({ user }) => user)
  const teacherClasses = useSelector(({ teacherClasses }) => teacherClasses)
  const { classList, searchResult, appliedClassList, errByGetClass } = useGetClass() //useEffect 실행 함수
  const [_teacherList, setTeacherList] = useState(null)
  const [_teacherClassList, setTeacherClassList] = useState(null)
  const [_classRoomList, setClassRoomList] = useState(null)
  const [_appliedClassList, setAppliedClassList] = useState(null)
  const clientHeight = useClientHeight(document.documentElement)   //화면 높이
  //2. UseEffect
  useEffect(() => {
    setClassRoomList(classList)
    setAppliedClassList(appliedClassList)
  }, [classList, appliedClassList, searchResult, teacherClasses])

  //3. 함수
  const handleBtnClick = (event) => {
    event.preventDefault()
    switch (event.target.id) {
      case "create_btn":
        navigate('/classrooms_setting')
        break;
      default: return;
    }
  }

  return (
    <StyledContainer $clientheight={clientHeight}>
      {/* 교사 */}
      {user.isTeacher && <>
        <CardList dataList={_classRoomList} type="classroom"
          title="나의 클래스"
          comment="아직 클래스가 없어요. 클래스를 만들어주세요" />
        <button id="create_btn" onClick={handleBtnClick}>클래스 만들기</button>
      </>}
      {/* 학생 */}
      {!user.isTeacher && <>
        {_teacherList && <CardList dataList={_teacherList} type="teacher"
          title="선생님"
          comment="선생님 id를 확인해주세요."
          setTeacherClassList={setTeacherClassList}
        />}
        {_teacherClassList && <CardList dataList={_teacherClassList} type="classroom"
          title="선생님이 만든 교실"
          comment="선생님이 아직 생성하신 교실이 없습니다. "
        />}
        <CardList dataList={_classRoomList} type="classroom" //학생
          title="나의 클래스"
          comment="가입한 클래스가 없어요. 클래스에 가입해주세요" />
        <CardList dataList={_appliedClassList} type="appliedClassList"
          title="승인 대기중 클래스"
          comment="가입 신청한 클래스가 없어요." />
        <TSearchInputBtn setTeacherList={setTeacherList} />
      </>}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 20px auto;
  
  button {
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
  display: flex;
  align-items: center;
  font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size: 15px;
  font-weight: 500;
  height: 40px;
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
  }

  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`

export default ClassRoomMain