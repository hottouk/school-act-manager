//라이브러리
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
//컴포넌트
import CardList from '../../components/List/CardList';
import MainBtn from '../../components/Btn/MainBtn';
//hooks
import useFetchRtMyClassData from '../../hooks/RealTimeData/useFetchRtMyClassData';
import useClientHeight from '../../hooks/useClientHeight';
//css
import styled from 'styled-components';
import SearchBar from '../../components/Bar/SearchBar';
import { setAllSubjClasses } from '../../store/allClassesSlice';
import { setSelectClass } from '../../store/classSelectedSlice';

//24.09.18(1차 수정) -> 25.01.21(학생 파트 제거)
const ClassRoomMainPage = () => {
  //준비
  const navigate = useNavigate()
  const dispatcher = useDispatch()
  //전역변수 
  const user = useSelector(({ user }) => user)
  const { classList } = useFetchRtMyClassData() //useEffect 실행 함수
  const [subjClassList, setSubjClassList] = useState(null)
  const [homeroomClassList, setHomerooomClassList] = useState(null)
  useEffect(() => { sortClassroom() }, [classList])
  //모니터 높이
  const clientHeight = useClientHeight(document.documentElement)

  //------함수부------------------------------------------------  
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

  //교과반 클릭
  const handleSubjClassOnClick = (item) => {
    dispatcher(setSelectClass(item))   //선택한 교실 비휘발성 전역변수화
    navigate(`/classrooms/${item.id}`) //url 이동
  }

  //담임반 클릭
  const handleHomeroomOnClick = (item) => {
    dispatcher(setSelectClass(item)) //선택한 교실 비휘발성 전역변수화
    navigate(`/homeroom/${item.id}`) //url 이동
  }

  return (
    <Container $clientheight={clientHeight}>
      {/* 교사 */}
      {user.isTeacher && <>
        <SearchBar title="교과 클래스 목록" type="classroom" list={subjClassList} setList={setSubjClassList} />
        <CardList dataList={subjClassList} type="classroom" onClick={handleSubjClassOnClick} />

        <SearchBar title="담임 클래스 목록" />
        <CardList dataList={homeroomClassList} type="homeroom" onClick={handleHomeroomOnClick} />
        <Row><MainBtn onClick={() => navigate('/classrooms_setting', { state: { step: "first" } })}>클래스 만들기</MainBtn></Row>
      </>}

      {/* 학생 */}
      {!user.isTeacher && <>
        <SearchBar title="가입 신청 중인 클래스" />
        <CardList dataList={[]} type="classroom" onClick={() => { }} />

        <SearchBar title="나의 클래스" />
        <CardList dataList={[]} type="classroom" onClick={() => { }} />
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
const Row = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
`
export default ClassRoomMainPage