//라이브러리
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setAllStudents } from '../../store/allStudentsSlice';
import styled from 'styled-components';
import { setAllActivities } from '../../store/allActivitiesSlice';
//페이지
import KlassBoardSection from '../classroom/KlassBoardSection';
import MainSelectorSection from '../classroom/MainSelectorSection';
//컴포넌트
import MidBtn from '../../components/Btn/MidBtn';
import EmptyResult from '../../components/EmptyResult';
import StudentList from '../../components/List/StudentList';
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal';
import UpperTab from '../../components/UpperTab';
import MainWrapper from '../../components/Styled/MainWrapper';
import MainBtn from '../../components/Btn/MainBtn';
import MainContainer from '../../components/Styled/MainContainer';
import SubNav from '../../components/Bar/SubNav';
//hooks
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData';
import useClassAuth from '../../hooks/useClassAuth';
import useFireActiData from '../../hooks/Firebase/useFireActiData';
import useFireClassData from '../../hooks/Firebase/useFireClassData';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Badge } from 'react-bootstrap';
import { setSelectClass } from '../../store/classSelectedSlice';
//생성(241022) -> 게시판 추가(250211)
const HomeroomDetailsPage = () => {
  //준비
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const user = useSelector(({ user }) => user);
  const { id: thisKlassId } = useParams();
  //시작
  useEffect(() => { setIsVisible(true); }, []);
  //교사 인증
  const { log } = useClassAuth();
  if (log) { alert(log) };
  //교실
  const { klassRtData: klassData, klassDataListener } = useFireClassData();
  useEffect(() => { klassDataListener(thisKlassId); }, [thisKlassId]);
  useEffect(() => { bindData(); }, [klassData]);
  const { studentDataList: studentList } = useFetchRtMyStudentData("classRooms", thisKlassId, "students", "studentNumber");
  useEffect(() => { dispatcher(setAllStudents(studentList)) }, [studentList]);
  //활동
  const { fetchAllActis } = useFireActiData();
  const [actiList, setActiList] = useState([]);
  useEffect(() => {
    setSelfActiList(actiList.filter(acti => acti.subjDetail === "자율"));
    setCareerActiList(actiList.filter(acti => acti.subjDetail === "진로"));
  }, [actiList])
  const [selfActiList, setSelfActiList] = useState([]);
  const [careerActiList, setCareerActiList] = useState([]);
  //tab
  const [tab, setTab] = useState(1);
  //학생 추가 모달
  const [isAddStuModalShown, setIsAddStuModalShown] = useState(false);
  //모바일
  const isMobile = useMediaQuery("(max-width: 768px)");
  //에니메이션
  const [isVisible, setIsVisible] = useState(false);
  //------함수부------------------------------------------------
  //초기화  
  const bindData = async () => {
    if (!klassData) return;
    dispatcher(setSelectClass(klassData)) //선택한 교실 비휘발성 전역변수화
    try {
      const list = await fetchAllActis("uid", user.uid, "subject", "담임");
      setActiList(list);
      dispatcher(setAllActivities(list));
    } catch (err) { alert("담임반 활동을 불러오는데 실패했습니다. source: useFireActi_00"); console.log(err); }
  }
  return (
    <>
      <MainContainer>
        <SubNav></SubNav>
        <AnimWrapper $isVisible={isVisible}>
          <KlassBoardSection userStatus={"master"} klassInfo={klassData} studentList={studentList} />
          {/* 쫑알이 */}
          <SubWrapper>
            <MainWrapper styles={{ position: "relative" }}>
              <Row style={{ position: "absolute", top: "-35px", left: "15px" }}>
                <UpperTab className="tab1" value={tab} onClick={() => setTab(1)}>자율</UpperTab>
                <UpperTab className="tab2" value={tab} onClick={() => setTab(2)}>진로</UpperTab>
              </Row>
              <IconWrapper><Badge bg='secondary'>{tab === 1 ? "자율" : "진로"}</Badge></IconWrapper>
              <TitleText>세특 쫑알이</TitleText>
              <MainSelectorSection studentList={studentList} actiList={tab === 1 ? selfActiList : careerActiList} classId={thisKlassId} />
            </MainWrapper>
            {!isMobile && <SubMenu>
              <MainBtn onClick={() => navigate('allStudents/acti', { state: { studentList, klassId: thisKlassId } })}>활동별 보기</MainBtn>
              <MainBtn onClick={() => navigate('allStudents')}>전체 세특 보기</MainBtn>
            </SubMenu>}
          </SubWrapper>
          <MainWrapper>
            <TabWrapper>
              <UpperTab value={tab} top="-61px" >행동특성</UpperTab>
            </TabWrapper>
            <TitleText>학생 행동특성 및 종합의견 작성</TitleText>
            {(!studentList || studentList.length === 0) ?
              <>{/* 학생 목록 없을 때 */}
                <EmptyResult comment="등록된 학생이 없습니다." />
                <MidBtn onClick={() => { setIsAddStuModalShown(true) }}>학생 추가</MidBtn>
              </> : <StudentList
                petList={studentList}
                plusBtnOnClick={() => { setIsAddStuModalShown(true) }}
                klassType={"homeroom"}
              />}
          </MainWrapper>
        </AnimWrapper>
      </MainContainer>
      {/* 학생 추가 모달 */}
      {<AddNewStudentModal
        show={isAddStuModalShown}
        onHide={() => { setIsAddStuModalShown(false) }}
        classId={thisKlassId}
        type="homeroom" />}
    </>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const AnimWrapper = styled(Column)`
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transition: opacity 0.7s ease;
  gap: 10px;
`
const SubWrapper = styled(Row)`
  gap: 10px;
  width: 75%;
  margin: 0 auto;
  align-items: stretch;
  @media screen and (max-width: 767px){ width: 100%; }  
`
const SubMenu = styled(Column)`
  flex: 1;  
  gap: 10px;
  padding: 15px;
  background-color: white;
`
const TitleText = styled.h5`
  display: flex;
  justify-content: center;
  color: #3a3a3a;
  font-weight: bold;
  margin: 10px auto;
`
const TabWrapper = styled.div`
  position: relative;
`
const IconWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`
export default HomeroomDetailsPage
