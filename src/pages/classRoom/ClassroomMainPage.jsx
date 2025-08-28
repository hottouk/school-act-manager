//라이브러리
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setAllSubjClasses } from '../../store/allClassesSlice';
import { setSelectClass } from '../../store/classSelectedSlice';
import styled from 'styled-components';
//컴포넌트
import CardList from '../../components/List/CardList';
import MainBtn from '../../components/Btn/MainBtn';
import SearchBar from '../../components/Bar/SearchBar';
//hooks
import useFetchRtMyClassData from '../../hooks/RealTimeData/useFetchRtMyClassData';
import useClientHeight from '../../hooks/useClientHeight';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import useMediaQuery from '../../hooks/useMediaQuery';
import BasicModal from '../../components/Modal/BasicModal';

//1차 수정(240918) -> 학생 파트 수정(250121) -> 코티칭(250218)
const ClassRoomMainPage = () => {
  //준비
  const user = useSelector(({ user }) => user)
  useEffect(() => { fetchMyData() }, [user])
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const isMobile = useMediaQuery("(max-width: 767px)")
  //교사
  const { classList } = useFetchRtMyClassData();
  const [subjKlassList, setSubjKlassList] = useState(null);
  const [homeroomKlassList, setHomerooomKlassList] = useState(null);
  const [coTeachingList, setCoTeachingList] = useState(null);
  useEffect(() => { sortTeacherKlass() }, [classList]);
  //학생
  const { fetchUserData } = useFireUserData();
  const [appplyKlass, setApplyKlass] = useState([]);
  const [myKlass, setMyKlass] = useState([]);
  //모니터 높이
  const clientHeight = useClientHeight(document.documentElement)

  //------공용-------------------------------------------------- 
  //클래스 데이터 가져오기
  const fetchMyData = () => {
    if (user.isTeacher) { fetchUserData(user.uid).then((data) => { setCoTeachingList(data?.coTeachingList || []) }) }
    else { fetchUserData(user.uid).then((data) => { sortStudentKlass(data?.myClassList || []) }) }
  }
  //교과반 클릭(공용)
  const handleSubjClassOnClick = (item) => {
    navigate(`/classrooms/${item.id}`, { state: { ...item } }) //url 이동
  }

  //------교사용------------------------------------------------  
  //교과, 담임반 분류
  const sortTeacherKlass = () => {
    let subjClassList = [];
    let homeroomClassList = [];
    classList.forEach(item => {
      if (!item.type || item.type === "subject") subjClassList.push(item)
      else homeroomClassList.push(item)
    })
    setSubjKlassList(subjClassList)
    dispatcher(setAllSubjClasses(subjClassList)) //교과반 전역 변수화
    setHomerooomKlassList(homeroomClassList)
  }
  //코티칭 클릭
  const handleCoTeachingOnClick = (item) => {
    if (item.isApproved) { navigate(`/classrooms/${item.id}`, { state: { ...item } }) }
    else { window.alert("승인 대기중 입니다.") }
  }
  //담임반 클릭
  const handleHomeroomOnClick = (item) => {
    dispatcher(setSelectClass(item)) //선택한 교실 비휘발성 전역변수화
    navigate(`/homeroom/${item.id}`) //url 이동
  }
  //------학생용------------------------------------------------  
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


  return (<>
    <Container $clientheight={clientHeight}>
      {/* 교사 */}
      {user.isTeacher && <>
        <SearchBar title="교과 클래스" type="classroom" list={subjKlassList} setList={setSubjKlassList} isMobile={isMobile} />
        <CardList dataList={subjKlassList} type="classroom" onClick={handleSubjClassOnClick} />
        <SearchBar title="코티칭 클래스" />
        <CardList dataList={coTeachingList} type="classroom" onClick={handleCoTeachingOnClick} />
        {!isMobile && <SearchBar title="담임 클래스" />}
        {!isMobile && <CardList dataList={homeroomKlassList} type="homeroom" onClick={handleHomeroomOnClick} />}
        {!isMobile && <Row><MainBtn onClick={() => navigate('/classrooms_setting', { state: { step: "first" } })}>클래스 만들기</MainBtn></Row>}
      </>}
      {/* 학생 */}
      {!user.isTeacher && <>
        <SearchBar title="가입 신청 중인 클래스" />
        <CardList dataList={appplyKlass} type="classroom" onClick={() => alert("교사 승인 대기중입니다.")} />
        <SearchBar title="나의 클래스" />
        <CardList dataList={myKlass} type="classroom" onClick={handleSubjClassOnClick} />
      </>}
    </Container>
  </>
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