//라이브러리
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
//컴포넌트
import CardList from '../../components/List/CardList';
import TSearchInputBtn from '../../components/Form/TSearchInputBtn';
import MainBtn from '../../components/Btn/MainBtn';
//hooks
import useFetchRtMyClassData from '../../hooks/RealTimeData/useFetchRtMyClassData';
import useClientHeight from '../../hooks/useClientHeight';
//css
import styled from 'styled-components';

//24.09.18(1차 수정)
const ClassRoomMain = () => {
  //1. 변수
  const navigate = useNavigate()
  //전역변수 
  const user = useSelector(({ user }) => user)
  const { classList, searchResult, appliedClassList, errByGetClass } = useFetchRtMyClassData() //useEffect 실행 함수
  const [subjKlassList, setSubjKlassList] = useState(null)
  const [homeroomKlassList, setHomerooomKlassList] = useState(null)
  useEffect(() => {
    let subjKlassList = [];
    let homeroomKlassList = [];
    classList.map(klass => {
      if (!klass.type || klass.type === 'subject') subjKlassList.push(klass)
      else homeroomKlassList.push(klass)
      return null;
    })
    setSubjKlassList(subjKlassList)
    setHomerooomKlassList(homeroomKlassList)
  }, [classList])
  useEffect(() => {
    setAppliedClassList(appliedClassList)
  }, [appliedClassList, searchResult,])
  const [_teacherList, setTeacherList] = useState(null)
  const [_teacherClassList, setTeacherClassList] = useState(null)
  const [_appliedClassList, setAppliedClassList] = useState(null)
  //css
  const clientHeight = useClientHeight(document.documentElement)   //화면 높이

  //3. 함수
  const handleBtnClick = (event) => {
    event.preventDefault()
    navigate('/classrooms_setting', { state: { step: "first" } })
  }

  return (
    <StyledContainer $clientheight={clientHeight}>
      {/* 교사 */}
      {user.isTeacher && <>
        <CardList dataList={subjKlassList} type="classroom"
          title="교과반 목록"
          comment="아직 교과반이 없어요. 클래스를 생성해주세요" />
        <CardList dataList={homeroomKlassList} type="homeroom"
          title="담임반 목록"
          comment="아직 담임반이 없어요. 클래스를 생성해주세요" />
        <MainBtn btnOnClick={handleBtnClick} btnName="클래스 만들기" />
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
        <CardList dataList={subjKlassList} type="classroom" //학생
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
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
export default ClassRoomMain