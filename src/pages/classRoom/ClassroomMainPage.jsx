//라이브러리
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
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
import SearchBar from '../../components/Bar/SearchBar';
import { setAllSubjClasses } from '../../store/allClassesSlice';

//24.09.18(1차 수정)
const ClassRoomMainPage = () => {
  //----1.변수부--------------------------------
  //준비
  const navigate = useNavigate()
  const dispatcher = useDispatch()
  //전역변수 
  const user = useSelector(({ user }) => user)
  const { classList, searchResult, appliedClassList, errByGetClass } = useFetchRtMyClassData() //useEffect 실행 함수
  const [subjClassList, setSubjClassList] = useState(null)
  const [homeroomClassList, setHomerooomClassList] = useState(null)
  useEffect(() => { sortClassroom() }, [classList])
  //todo 학생 관련 함수 정리하기
  useEffect(() => { setAppliedClassList(appliedClassList) }, [appliedClassList, searchResult,])
  const [_teacherList, setTeacherList] = useState(null)
  const [_teacherClassList, setTeacherClassList] = useState(null)
  const [_appliedClassList, setAppliedClassList] = useState(null)
  //모니터 높이
  const clientHeight = useClientHeight(document.documentElement)   //화면 높이

  //----2.함수부--------------------------------
  //교과, 담임반 분류
  const sortClassroom = () => {
    let subjClassList = [];
    let homeroomClassList = [];
    classList.forEach(classroom => {
      if (!classroom.type || classroom.type === "subject") subjClassList.push(classroom)
      else homeroomClassList.push(classroom)
    })
    setSubjClassList(subjClassList)
    dispatcher(setAllSubjClasses(subjClassList)) //교과반 전역 변수화
    setHomerooomClassList(homeroomClassList)
  }

  return (
    <Container $clientheight={clientHeight}>
      {/* 교사 */}
      {user.isTeacher && <>
        <SearchBar title="교과반 목록" type="classroom" list={subjClassList} setList={setSubjClassList} />
        <CardList
          dataList={subjClassList}
          type="classroom"
          comment="아직 교과반이 없어요. 클래스를 생성해주세요" />
        <SearchBar title="담임반 목록" />
        <CardList
          dataList={homeroomClassList}
          type="homeroom"
          comment="아직 담임반이 없어요. 클래스를 생성해주세요" />
        <MainBtn btnOnClick={() => navigate('/classrooms_setting', { state: { step: "first" } })} btnName="클래스 만들기" />
      </>}
      {/* todo 학생 관련 정리하기 */}
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
        <CardList dataList={subjClassList} type="classroom" //학생
          title="나의 클래스"
          comment="가입한 클래스가 없어요. 클래스에 가입해주세요" />
        <CardList dataList={_appliedClassList} type="appliedClassList"
          title="승인 대기중 클래스"
          comment="가입 신청한 클래스가 없어요." />
        <TSearchInputBtn setTeacherList={setTeacherList} />
      </>}
    </Container>
  )
}

const Container = styled.div`
  box-sizing: border-box;
  margin: 2px auto;  
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
export default ClassRoomMainPage