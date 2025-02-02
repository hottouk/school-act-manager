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
import useFireUserData from '../../hooks/Firebase/useFireUserData';

//24.09.18(1차 수정) -> 25.01.21(학생 파트 제거)
const ClassRoomMainPage = () => {
  //준비
  const user = useSelector(({ user }) => user)
  const navigate = useNavigate()
  const dispatcher = useDispatch()

  //교사
  const { classList } = useFetchRtMyClassData();
  const [subjClassList, setSubjClassList] = useState(null);
  const [homeroomClassList, setHomerooomClassList] = useState(null);
  useEffect(() => { sortTeacherKlass() }, [classList]);

  //학생
  const { fetchUserData } = useFireUserData();
  const [appplyKlass, setApplyKlass] = useState([]);
  const [myKlass, setMyKlass] = useState([]);
  useEffect(() => { fetchMyData() }, [user])

  //모니터 높이
  const clientHeight = useClientHeight(document.documentElement)

  //------교사용------------------------------------------------  
  //교과, 담임반 분류
  const sortTeacherKlass = () => {
    let subjClassList = [];
    let homeroomClassList = [];
    classList.forEach(item => {
      if (!item.type || item.type === "subject") subjClassList.push(item)
      else homeroomClassList.push(item)
    })
    setSubjClassList(subjClassList)
    dispatcher(setAllSubjClasses(subjClassList)) //교과반 전역 변수화
    setHomerooomClassList(homeroomClassList)
  }

  //교과반 클릭(공용)
  const handleSubjClassOnClick = (item) => {
    navigate(`/classrooms/${item.id}`, { state: { ...item } }) //url 이동
  }

  //담임반 클릭
  const handleHomeroomOnClick = (item) => {
    dispatcher(setSelectClass(item)) //선택한 교실 비휘발성 전역변수화
    navigate(`/homeroom/${item.id}`) //url 이동
  }

  //------학생용------------------------------------------------  
  //클래스 데이터 가져오기
  const fetchMyData = () => {
    if (user.isTeacher) return;
    fetchUserData(user.uid).then((data) => {
      sortStudentKlass(data?.myClassList || [])
    })
  }

  //가입 신청, 승인 클래스 분류
  const sortStudentKlass = (list) => {
    const approved = []
    const applied = []
    list?.forEach((item) => {
      if (item.isApproved) approved.push(item)
      else applied.push(item)
    })
    setMyKlass(approved)
    dispatcher(setAllSubjClasses(approved)) //전역 변수화
    setApplyKlass(applied)
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
        <CardList dataList={appplyKlass} type="classroom" onClick={() => { window.alert("승인을 기다려주세요") }} />

        <SearchBar title="나의 클래스" />
        <CardList dataList={myKlass} type="classroom" onClick={handleSubjClassOnClick} />
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