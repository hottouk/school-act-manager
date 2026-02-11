//라이브러리
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents } from '../../store/allStudentsSlice.jsx';
import { setAllActivities } from '../../store/allActivitiesSlice.jsx';
import { setUser } from '../../store/userSlice.jsx';
import Select from 'react-select';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
//페이지
import MainSelectorSection from './MainSelectorSection.jsx';
import KlassQuizSection from './KlassQuizSection.jsx';
import KlassBoardSection from './KlassBoardSection.jsx';
//컴포넌트
import MainContainer from '../../components/Styled/MainContainer.jsx';
import MainWrapper from '../../components/Styled/MainWrapper.jsx';
import SubNav from '../../components/Bar/SubNav.jsx';
import StudentListSection from './StudentListSection.jsx';
import ActivityList from '../../components/List/ActivityList.jsx';
import EmptyResult from '../../components/EmptyResult.jsx';
import MainPanel from '../../components/MainPanel.jsx';
import MidBtn from '../../components/Btn/MidBtn.jsx';
import MainBtn from '../../components/Btn/MainBtn.jsx';
import ActiInfoModal from '../../components/Modal/ActiInfoModal.jsx';
import AddQuizModal from '../../components/Modal/AddQuizModal.jsx';
//모달
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal.jsx';
import PetInfoModal from '../../components/Modal/PetInfoModal.jsx';
//hooks
import useFireClassData from '../../hooks/Firebase/useFireClassData.jsx';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData.jsx';
import useFireUserData from '../../hooks/Firebase/useFireUserData.jsx';
import useFireActiData from '../../hooks/Firebase/useFireActiData.jsx';
import useMediaQuery from '../../hooks/useMediaQuery.jsx';
import { setSelectClass } from '../../store/classSelectedSlice.jsx';
import Title from '../../components/Title/Title.jsx';
import LongW100Btn from '../../components/Btn/LongW100Btn.jsx';
//클래스 헤더 수정(240801) -> 애니메이션 추가(241113) -> 게임 추가, 가입 제거(250122) -> 학생 페이지 정비(250122) -> 디자인 변경(260119)
const ClassroomDetailsPage = () => {
  //준비
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const user = useSelector(({ user }) => user);
  const { id: thisKlassId } = useParams();
  const allSubjClassList = useSelector(({ allClasses }) => allClasses);
  const { state: studentKlassData } = useLocation();
  const { fetchAllActis, sortActiType } = useFireActiData();
  const { updateUserInfo } = useFireUserData();
  //교실
  const { klassRtData, updateKlassroom, klassDataListener } = useFireClassData();
  useEffect(() => { klassDataListener(thisKlassId); }, [thisKlassId]);
  //회원 검증
  const userStatus = useMemo(() => {
    if (!klassRtData) return "student";
    const isCoteacher = klassRtData.coTeacher?.find((item) => { return item === user.uid });
    if (user.uid === klassRtData.uid) return "master"
    else if (isCoteacher) return "coTeacher"
    else return "student"
  }, [klassRtData, user]);
  useEffect(() => { dispatcher(setUser({ userStatus: userStatus })) }, [userStatus, dispatcher]);
  //활동
  const [actiList, setActiList] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [addedQuizList, setAddedQuizList] = useState([]);
  //학생
  const { studentDataList } = useFetchRtMyStudentData("classRooms", thisKlassId, "students", "studentNumber"); //학생 실시간 data
  const [studentList, setStudentList] = useState([]);
  const [petInfo, setPetInfo] = useState(null);
  const [actiInfo, setActiInfo] = useState(null);
  //실시간 데이터
  useEffect(() => {
    if (!klassRtData) return;
    const bindData = async () => {
      dispatcher(setSelectClass(klassRtData));
      const addedQuizIdList = klassRtData.addedQuizIdList || [];
      try {
        const list = await fetchAllActis(klassRtData.uid, klassRtData.subject);
        setActiList(list);
        const { homeActiList, subjActiList, quizActiList } = sortActiType(list);
        // dispatcher(setAllActivities(subjActiList));
        // setActiList(list.subjActiList);
        // // const quizList = list.quizActiList;
        // const added = quizList.filter((item) => addedQuizIdList.includes(item.id));
        // setQuizList(quizList);
        // setAddedQuizList(added);
      } catch (error) { alert(error, "활동 목록을 불러오지 못했습니다."); console.log(error); }
    }
    bindData();
    bindStudentData();
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 200);
  }, [klassRtData, studentDataList]);
  //모달
  const [isAddStuModal, setIsAddStuModal] = useState(false)       //교사 학생 추가
  const [isPetInfoModal, setIsPetInfoModal] = useState(false);    //펫
  const [isActiInfoModal, setIsActiInfoModal] = useState(false);  //활동
  const [isAddQuizModal, setIsAddQuizModal] = useState(false);    //게임등록
  //에니메이션
  const [isVisible, setIsVisible] = useState(false);
  //모바일
  const isMobile = useMediaQuery("(max-width: 768px)");
  //------함수부------------------------------------------------  
  //활동 데이터 바인딩
  //학생 데이터 바인딩
  const bindStudentData = () => {
    if (!studentDataList) return;
    dispatcher(setAllStudents(studentDataList));
    setStudentList(studentDataList);
  }
  //클래스 이동
  const moveKlass = (event) => { navigate(`/classrooms/${event.value.id}`, { state: { ...event.value } }) };
  //학기 전환
  const handleSemesterOnClick = () => {
    if (!klassRtData.semester) return;
    const semesters = [2, 1];
    const next = semesters[klassRtData.semester - 1];
    const confirm = window.confirm(`${next}학기로 전환하시겠습니까?`);
    if (!confirm) return;
    updateKlassroom({ semester: next }, thisKlassId);
  };
  //------함수부------------------------------------------------  
  //몬스터 클릭
  const handleMonsterOnClick = (item) => { navigate("/game_setting", { state: { ...item, klassId: thisKlassId } }) }
  //학생: 클래스 목록에서 삭제
  const handleDeleteFromListOnClick = () => {
    const newList = user.myClassList.filter((klassInfo) => klassInfo.id !== thisKlassId);
    updateUserInfo("myClassList", newList);
    navigate(-1);
  }
  return <MainContainer>
    <SubNav styles={{ padding: "10px" }}>
      {(user.uid === klassRtData?.uid) && <Select options={allSubjClassList.map((item) => { return { label: item.classTitle, value: item } })} placeholder="반 바로 이동"
        onChange={moveKlass} />}
      {(user.uid === klassRtData?.coTeacher) && <Select options={user.coTeachingList.map((item) => { return { label: item.classTitle, value: item } })} placeholder="반 바로 이동"
        onChange={moveKlass} />}
    </SubNav>
    {!klassRtData && <Column style={{ alignItems: "center" }}>
      <EmptyResult comment={"Error: 반 정보를 불러올 수 없습니다."} />
      <MidBtn onClick={handleDeleteFromListOnClick}>목록에서 삭제</MidBtn>
    </Column>}
    {klassRtData && <AnimWrapper $isVisible={isVisible}>
      {/* 반 기본 정보(공용) */}
      <KlassBoardSection userStatus={userStatus} klassInfo={klassRtData} studentList={studentList} />
      {/* 쫑알이(교사)*/}
      {user.isTeacher && <SubWrapper>
        <MainWrapper styles={{ position: "relative" }}>
          {klassRtData?.semester && <IconWrapper><Badge bg='secondary'>{klassRtData?.semester}학기</Badge></IconWrapper>}
          <Title>세특 쫑알이</Title>
          <MainSelectorSection
            isMobile={isMobile}
            type="subject"
            studentList={studentList}
            actiList={actiList}
            classId={thisKlassId}
            semester={klassRtData?.semester}
          />
        </MainWrapper>
        {!isMobile && <SubMenu>
          <LongW100Btn onClick={() => navigate('allStudents/acti', { state: { studentList, klassId: thisKlassId } })}>활동별 보기</LongW100Btn>
          <LongW100Btn onClick={() => navigate('allStudents', { state: { semester: klassRtData?.semester } })}>전체 세특 보기</LongW100Btn>
          {klassRtData?.semester && <MainBtn onClick={handleSemesterOnClick}>학기 전환</MainBtn>}
        </SubMenu>}
      </SubWrapper>}
      {/* 학생 상세 보기*/}
      <MainWrapper>
        <Center><Title>학생별 보고서</Title></Center>
        {(!studentList || studentList.length === 0) && <><EmptyResult comment="등록된 학생이 없습니다." /></>}
        {studentList && <StudentListSection
          petList={studentList}
          klassType={"subject"}
          semester={klassRtData?.semester}
          plusBtnOnClick={setIsAddStuModal}
          setIsPetInfoModal={setIsPetInfoModal}
          setPetInfo={setPetInfo} />}
      </MainWrapper>
      {/* 퀴즈 게임부 */}
      <KlassQuizSection isMobile={isMobile} quizList={addedQuizList} klassData={klassRtData} onClick={handleMonsterOnClick} setIsAddQuizModal={setIsAddQuizModal} />
      {/* 퀘스트 목록(학생) */}
      {(!user.isTeacher && studentKlassData?.isApproved) && <MainPanel>
        <Title>퀘스트 목록</Title>
        {(!actiList || actiList.length === 0)
          ? <EmptyResult comment="등록된 활동이 없습니다." />
          : <ActivityList actiList={actiList} setIsActiInfoModal={setIsActiInfoModal} setActiInfo={setActiInfo} />}
      </MainPanel>}
    </AnimWrapper>
    }
    {/* 학생 추가 */}
    <AddNewStudentModal
      show={isAddStuModal}
      onHide={() => { setIsAddStuModal(false) }}
      classId={thisKlassId} />
    {/* 학생 정보 모달 */}
    {isPetInfoModal && <PetInfoModal
      show={isPetInfoModal}
      onHide={() => setIsPetInfoModal(false)}
      pet={petInfo}
    />}
    {/* 활동 정보 모달 */}
    {isActiInfoModal && <ActiInfoModal
      show={isActiInfoModal}
      onHide={() => setIsActiInfoModal(false)}
      acti={actiInfo}
    />}
    {/* 퀴즈 등록 */}
    <AddQuizModal
      show={isAddQuizModal}
      onHide={() => setIsAddQuizModal(false)}
      klassId={thisKlassId}
      quizData={quizList}
    />
  </MainContainer>
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Center = styled(Row)`
  justify-content: center;
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
const IconWrapper = styled(Row)`
  position: absolute;
  top: 10px;
  right: 10px;
`
export default ClassroomDetailsPage