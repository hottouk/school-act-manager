//라이브러리
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents } from '../../store/allStudentsSlice.jsx';
import { setAllActivities } from '../../store/allActivitiesSlice.jsx';
import { setSelectClass } from '../../store/classSelectedSlice.jsx';
import { setUser } from '../../store/userSlice.jsx';
import Select from 'react-select';
import styled from 'styled-components';
//페이지
import MainSelectorSection from './MainSelectorSection.jsx';
import KlassQuizSection from './KlassQuizSection.jsx';
import ClassBoardSection from './ClassBoardSection.jsx';
//컴포넌트
import StudentList from '../../components/List/StudentList.jsx';
import ActivityList from '../../components/List/ActivityList.jsx';
import EmptyResult from '../../components/EmptyResult.jsx';
import SubNav from '../../components/Bar/SubNav.jsx';
import ActiInfoModal from '../../components/Modal/ActiInfoModal.jsx';
import MainPanel from '../../components/MainPanel.jsx';
import AddQuizModal from '../../components/Modal/AddQuizModal.jsx';
//모달
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal.jsx';
import PetInfoModal from '../../components/Modal/PetInfoModal.jsx';
//hooks
import useFetchRtClassroomData from '../../hooks/RealTimeData/useFetchRtClassroomData.jsx';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData.jsx';
import useFireUserData from '../../hooks/Firebase/useFireUserData.jsx';
import useFireActiData from '../../hooks/Firebase/useFireActiData.jsx';
import useClientHeight from '../../hooks/useClientHeight.jsx';
import useMediaQuery from '../../hooks/useMediaQuery.jsx';
import MidBtn from '../../components/Btn/MidBtn.jsx';
//클래스 헤더 수정(240801) -> 애니메이션 추가(241113) -> 게임 추가, 가입 제거(250122) -> 학생 페이지 정비(250122)
const ClassroomDetailsPage = () => {
  //준비
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const user = useSelector(({ user }) => user);
  const allSubjClassList = useSelector(({ allClasses }) => allClasses);
  const { id: thisKlassId } = useParams();
  //회원 검증
  const { state: studentKlassData } = useLocation();
  //hooks
  const { updateUserInfo } = useFireUserData();
  const { getSubjKlassActiList } = useFireActiData();
  //실시간 데이터
  const { klassData } = useFetchRtClassroomData(thisKlassId);                                                 //클래스 기본 data
  const { studentDataList } = useFetchRtMyStudentData("classRooms", thisKlassId, "students", "studentNumber") //학생 실시간 data
  useEffect(() => {                                                                                           //애니메이션 처리 및 데이터 바인딩
    verifyUser();
    setIsVisible(false);
    bindActiData();
    bindStudentData();
    setTimeout(() => setIsVisible(true), 200);
  }, [thisKlassId, klassData, studentDataList])
  //활동
  const [actiList, setActiList] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [addedQuizList, setAddedQuizList] = useState([]);
  //학생
  const [studentList, setStudentList] = useState([]);
  const [petInfo, setPetInfo] = useState(null);
  const [actiInfo, setActiInfo] = useState(null);
  //모달
  const [isAddStuModal, setIsAddStuModal] = useState(false)       //교사 학생 추가
  const [isPetInfoModal, setIsPetInfoModal] = useState(false);    //펫
  const [isActiInfoModal, setIsActiInfoModal] = useState(false);  //활동
  const [isAddQuizModal, setIsAddQuizModal] = useState(false);    //게임등록
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)
  //모바일
  const clientHeight = useClientHeight(document.documentElement)
  const isMobile = useMediaQuery("(max-width: 768px)")
  //회원 검증
  const [userStatus, setUserStatus] = useState(null);
  useEffect(() => { dispatcher(setUser({ userStatus: userStatus })) }, [userStatus])
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
  const bindActiData = () => {
    if (!klassData) return;
    const addedQuizIdList = klassData.addedQuizIdList || [];
    const classTeacherId = user.isTeacher ? user.uid : studentKlassData?.uid;
    getSubjKlassActiList(classTeacherId, klassData?.subject).then((list) => {
      dispatcher(setAllActivities(list.subjActiList));
      setActiList(list.subjActiList);
      const quizList = list.quizActiList;
      const added = quizList.filter((item) => addedQuizIdList.includes(item.id));
      setQuizList(quizList);
      setAddedQuizList(added);
    });
  }
  //학생 데이터 바인딩
  const bindStudentData = () => {
    if (!studentDataList) return;
    dispatcher(setAllStudents(studentDataList));
    setStudentList(studentDataList);
  }
  //클래스 이동
  const moveKlass = (event) => { navigate(`/classrooms/${event.value.id}`, { state: { ...event.value } }) }
  //몬스터 클릭
  const handleMonsterOnClick = (item) => { navigate("/game_setting", { state: { ...item, klassId: thisKlassId } }) }
  //학생: 클래스 목록에서 삭제
  const handleDeleteFromListOnClick = () => {
    const newList = user.myClassList.filter((klassInfo) => klassInfo.id !== thisKlassId);
    updateUserInfo("myClassList", newList);
    navigate(-1);
  }

  return (<>
    <SubNav styles={{ padding: "10px" }}>
      {(user.uid === klassData?.uid) && <Select options={allSubjClassList.map((item) => { return { label: item.classTitle, value: item } })} placeholder="반 바로 이동"
        onChange={moveKlass} />}
      {(user.uid === klassData?.coTeacher) && <Select options={user.coTeachingList.map((item) => { return { label: item.classTitle, value: item } })} placeholder="반 바로 이동"
        onChange={moveKlass} />}
    </SubNav>
    {!klassData && <Column style={{ alignItems: "center" }}>
      <EmptyResult comment={"Error: 반 정보를 불러올 수 없습니다."} />
      <MidBtn onClick={handleDeleteFromListOnClick}>목록에서 삭제</MidBtn>
    </Column>}
    {klassData &&
      <Container $clientheight={clientHeight} $isVisible={isVisible}>
        {/* 반 기본 정보(공용) */}
        <ClassBoardSection userStatus={userStatus} klassData={klassData} studentList={studentList} />
        {/* 쫑알이(교사)*/}
        {user.isTeacher && <MainPanel>
          <TitleText>세특 쫑알이</TitleText>
          <MainSelectorSection isMobile={isMobile} type="subject" studentList={studentList} actiList={actiList} classId={thisKlassId} />
        </MainPanel>}
        {/* 학생 상세 보기*/}
        <MainPanel>
          <TitleText>학생 상세히 보기</TitleText>
          {(!studentList || studentList.length === 0) && <><EmptyResult comment="등록된 학생이 없습니다." /></>}
          {studentList && <StudentList petList={studentList} plusBtnOnClick={setIsAddStuModal} classType={"subject"} setIsPetInfoModal={setIsPetInfoModal} setPetInfo={setPetInfo} />}
        </MainPanel>
        {/* 퀴즈 게임부 */}
        <KlassQuizSection isMobile={isMobile} quizList={addedQuizList} klassData={klassData} onClick={handleMonsterOnClick} setIsAddQuizModal={setIsAddQuizModal} />
        {/* 퀘스트 목록(학생) */}
        {(!user.isTeacher && studentKlassData?.isApproved) && <MainPanel>
          <TitleText>퀘스트 목록</TitleText>
          {(!actiList || actiList.length === 0)
            ? <EmptyResult comment="등록된 활동이 없습니다." />
            : <ActivityList actiList={actiList} setIsActiInfoModal={setIsActiInfoModal} setActiInfo={setActiInfo} />}
        </MainPanel>}
      </Container >
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
  </>)
}

const Container = styled.main`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
  @media screen and (max-width: 768px){
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    margin: 0;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const TitleText = styled.h5`
  display: flex;
  justify-content: center;
  color: #3a3a3a;
  font-weight: bold;
  margin: 10px auto;
`
export default ClassroomDetailsPage