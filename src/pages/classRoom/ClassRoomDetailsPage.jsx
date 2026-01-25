//라이브러리
import { useEffect, useState } from 'react';
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
import StudentList from '../../components/List/StudentList.jsx';
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
//클래스 헤더 수정(240801) -> 애니메이션 추가(241113) -> 게임 추가, 가입 제거(250122) -> 학생 페이지 정비(250122) -> 디자인 변경(260119)
const ClassroomDetailsPage = () => {
  //준비
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const user = useSelector(({ user }) => user);
  const allSubjClassList = useSelector(({ allClasses }) => allClasses);
  const { id: thisKlassId } = useParams();
  //회원 검증
  const { state: studentKlassData } = useLocation();
  const [userStatus, setUserStatus] = useState(null);
  useEffect(() => { dispatcher(setUser({ userStatus: userStatus })) }, [userStatus]);
  const { updateUserInfo, } = useFireUserData();
  //교실
  const [klassInfo, setKlassInfo] = useState(null);
  const { updateKlassroom, klassRtData: klassData, klassDataListener } = useFireClassData();
  useEffect(() => { klassDataListener(thisKlassId); }, [thisKlassId]);
  //활동
  const { getSubjKlassActiList } = useFireActiData();
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
    setIsVisible(false);
    verifyUser();
    bindData();
    bindStudentData();
    setTimeout(() => setIsVisible(true), 200);
  }, [klassData, studentDataList]);
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
  //회원 검증
  const verifyUser = () => {
    if (!klassData) return;
    const isCoteacher = klassData.coTeacher?.find((item) => { return item === user.uid });
    if (user.uid === klassData.uid) { setUserStatus("master") }
    else if (isCoteacher) { setUserStatus("coTeacher") }
    else { setUserStatus("student") };
  }
  //활동 데이터 바인딩
  const bindData = async () => {
    if (!klassData) return;
    setKlassInfo(klassData);
    dispatcher(setSelectClass(klassData));
    const addedQuizIdList = klassData.addedQuizIdList || [];
    const classTeacherId = user.isTeacher ? user.uid : studentKlassData?.uid;
    try {
      const list = await getSubjKlassActiList(classTeacherId, klassData?.subject);
      dispatcher(setAllActivities(list.subjActiList));
      setActiList(list.subjActiList);
      const quizList = list.quizActiList;
      const added = quizList.filter((item) => addedQuizIdList.includes(item.id));
      setQuizList(quizList);
      setAddedQuizList(added);
    } catch (error) { alert(error, "활동 목록을 불러오지 못했습니다."); console.log(error); }
  }
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
    if (!klassData.semester) return;
    const semesters = [2, 1];
    const next = semesters[klassData.semester - 1];
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
      {(user.uid === klassInfo?.uid) && <Select options={allSubjClassList.map((item) => { return { label: item.classTitle, value: item } })} placeholder="반 바로 이동"
        onChange={moveKlass} />}
      {(user.uid === klassInfo?.coTeacher) && <Select options={user.coTeachingList.map((item) => { return { label: item.classTitle, value: item } })} placeholder="반 바로 이동"
        onChange={moveKlass} />}
    </SubNav>
    {!klassInfo && <Column style={{ alignItems: "center" }}>
      <EmptyResult comment={"Error: 반 정보를 불러올 수 없습니다."} />
      <MidBtn onClick={handleDeleteFromListOnClick}>목록에서 삭제</MidBtn>
    </Column>}
    {klassInfo && <AnimWrapper $isVisible={isVisible}>
      {/* 반 기본 정보(공용) */}
      <KlassBoardSection userStatus={userStatus} klassInfo={klassInfo} studentList={studentList} />
      {/* 쫑알이(교사)*/}
      {user.isTeacher && <SubWrapper>
        <MainWrapper styles={{ position: "relative" }}>
          {klassInfo?.semester && <IconWrapper><Badge bg='secondary'>{klassInfo?.semester}학기</Badge></IconWrapper>}
          <TitleText>세특 쫑알이</TitleText>
          <MainSelectorSection
            isMobile={isMobile}
            type="subject"
            studentList={studentList}
            actiList={actiList}
            classId={thisKlassId}
            semester={klassInfo?.semester}
          />
        </MainWrapper>
        {!isMobile && <SubMenu>
          <MainBtn onClick={() => navigate('allStudents/acti', { state: { studentList, klassId: thisKlassId } })}>활동별 보기</MainBtn>
          <MainBtn onClick={() => navigate('allStudents', { state: { semester: klassInfo?.semester } })}>전체 세특 보기</MainBtn>
          {klassInfo?.semester && <MainBtn onClick={handleSemesterOnClick}>학기 전환</MainBtn>}
        </SubMenu>}
      </SubWrapper>}
      {/* 학생 상세 보기*/}
      <MainWrapper>
        <TitleText>학생 상세히 보기</TitleText>
        {(!studentList || studentList.length === 0) && <><EmptyResult comment="등록된 학생이 없습니다." /></>}
        {studentList && <StudentList
          petList={studentList}
          klassType={"subject"}
          semester={klassInfo?.semester}
          plusBtnOnClick={setIsAddStuModal}
          setIsPetInfoModal={setIsPetInfoModal}
          setPetInfo={setPetInfo} />}
      </MainWrapper>
      {/* 퀴즈 게임부 */}
      <KlassQuizSection isMobile={isMobile} quizList={addedQuizList} klassData={klassData} onClick={handleMonsterOnClick} setIsAddQuizModal={setIsAddQuizModal} />
      {/* 퀘스트 목록(학생) */}
      {(!user.isTeacher && studentKlassData?.isApproved) && <MainPanel>
        <TitleText>퀘스트 목록</TitleText>
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
const TitleText = styled.h5`
  display: flex;
  justify-content: center;
  color: #3a3a3a;
  font-weight: bold;
  margin: 10px auto;
`
export default ClassroomDetailsPage