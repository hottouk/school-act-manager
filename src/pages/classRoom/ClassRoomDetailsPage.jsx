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
import MainSelector from './MainSelector.jsx';
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
import PerfModal from '../../components/Modal/PerfModal.jsx';
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal.jsx';
import PetInfoModal from '../../components/Modal/PetInfoModal.jsx';
//hooks
import useFetchRtClassroomData from '../../hooks/RealTimeData/useFetchRtClassroomData.jsx';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData.jsx';
import useFireUserData from '../../hooks/Firebase/useFireUserData.jsx';
import useFireActiData from '../../hooks/Firebase/useFireActiData.jsx';
import useFireClassData from '../../hooks/Firebase/useFireClassData.jsx';
import useDeleteFireData from '../../hooks/Firebase/useDeleteFireData.jsx';
import useClientHeight from '../../hooks/useClientHeight.jsx';
import useMediaQuery from '../../hooks/useMediaQuery.jsx';
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
  const { deleteClassWithStudents } = useDeleteFireData();
  const { updateUserInfo } = useFireUserData();
  const { updateClassroom, deleteKlassroomArrayInfo, copyKlassroom } = useFireClassData();
  const { getSubjKlassActiList } = useFireActiData();
  //실시간 데이터
  const { klassData } = useFetchRtClassroomData(thisKlassId);                                                 //클래스 기본 data
  const { studentDataList } = useFetchRtMyStudentData("classRooms", thisKlassId, "students", "studentNumber") //학생 실시간 data
  useEffect(() => {                                                                                           //애니메이션 처리 및 데이터 바인딩
    verifyUser();
    setIsVisible(false);
    bindActiData();
    bindStudentData();
    bindKlassData();
    setTimeout(() => setIsVisible(true), 200);
  }, [thisKlassId, klassData, studentDataList])
  const [_title, setTitle] = useState('');
  const [_intro, setIntro] = useState('');
  const [_notice, setNotice] = useState('');
  const [noticeList, setNoticeList] = useState([]);
  //활동
  const [actiList, setActiList] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [addedQuizList, setAddedQuizList] = useState([]);
  //학생
  const [studentList, setStudentList] = useState([]);
  const [petInfo, setPetInfo] = useState(null);
  const [actiInfo, setActiInfo] = useState(null);
  //모드
  const [isModifying, setIsModifying] = useState(false);
  //모달
  const [isAddStuModal, setIsAddStuModal] = useState(false)       //교사 학생 추가
  const [isPerfModal, setIsPerfModal] = useState(false)           //수행 관리
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
  //변경 가능 데이터 바인딩
  const bindKlassData = () => {
    if (!klassData) return;
    const { classTitle, intro, notice } = klassData;
    dispatcher(setSelectClass(klassData));
    setTitle(classTitle || '정보 없음');
    setIntro(intro || '정보 없음');
    setNotice(notice || '공지 없음');
    splitNotice(notice || []);
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
  //공지사항 list 변환
  const splitNotice = (notice) => {
    if (notice.length === 0) { setNoticeList([]); }
    else {
      const arr = notice.split("^").map((item) => item.trim()).slice(0, 3);
      setNoticeList(arr)
    }
  }
  //클래스 이동
  const moveKlass = (event) => { navigate(`/classrooms/${event.value.id}`, { state: { ...event.value } }) }
  //몬스터 클릭
  const handleMonsterOnClick = (item) => { navigate("/game_setting", { state: { ...item, klassId: thisKlassId } }) }
  //변경 저장
  const handleSaveOnClick = () => {
    const confirm = window.confirm("이대로 클래스 정보를 변경하시겠습니까?");
    if (confirm) {
      const classInfo = { title: _title, intro: _intro, notice: _notice };
      updateClassroom(classInfo, klassData.id);
      setIsModifying(false);
    }
  }
  //변경 취소
  const handleCancelOnClick = () => {
    bindKlassData();
    setIsModifying(false);
  }
  //클래스 복제
  const handleCopyOnClick = () => {
    const { classTitle } = klassData;
    const copyConfrim = window.prompt("클래스를 복제하시겠습니까? 클래스 이름을 입력하세요.", `2학기 ${classTitle} 사본`);
    if (copyConfrim === null) return;
    if (copyConfrim !== '') {
      copyKlassroom(klassData, studentDataList, copyConfrim).then(() => {
        alert("복제 되었습니다");
        navigate("/classRooms");
      })
    } else {
      alert("클래스 제목을 입력해주세요.");
    }
  }
  //클래스 삭제
  const handleDeleteOnClick = () => {
    const deleteConfirm = window.prompt("클래스를 삭제하시겠습니까? 반 학생정보도 함께 삭제됩니다. 삭제하시려면 '삭제합니다'를 입력하세요.");
    if (deleteConfirm === "삭제합니다") {
      deleteClassWithStudents(thisKlassId).then(() => {
        alert("클래스와 모든 학생 정보가 삭제 되었습니다.")
        navigate("/classRooms");
      })
    } else {
      alert("문구가 제대로 입력되지 않았습니다.");
    }
  }
  //코티칭 탈퇴
  const handleDropOutOnClick = () => {
    const confirm = window.confirm("코티칭 클래스를 탈퇴하시겠습니까?");
    if (confirm) {
      const deletedList = user.coTeachingList.filter((item) => item.id !== klassData?.id);
      updateUserInfo("coTeachingList", deletedList);                                     //유저 코티칭 list에서 삭제
      deleteKlassroomArrayInfo(klassData.id, "coTeacher", user.uid);                     //클래스 코티쳐 list에서 삭제
      navigate("/classRooms");
    }
  }
  return (<>
    <SubNav styles={{ padding: "10px" }}>
      {(user.uid === klassData?.uid) && <Select options={allSubjClassList.map((item) => { return { label: item.classTitle, value: item } })} placeholder="반 바로 이동"
        onChange={moveKlass} />}
      {(user.uid === klassData?.coTeacher) && <Select options={user.coTeachingList.map((item) => { return { label: item.classTitle, value: item } })} placeholder="반 바로 이동"
        onChange={moveKlass} />}
    </SubNav>
    {!klassData && <EmptyResult comment={"Error: 반 정보를 불러올 수 없습니다."} />}
    {klassData &&
      <Container $clientheight={clientHeight} $isVisible={isVisible}>
        {/* 반 기본 정보(공용) */}
        <ClassBoardSection userStatus={userStatus} isModifying={isModifying} klassData={klassData} title={_title} intro={_intro} notice={_notice} studentList={studentList} noticeList={noticeList}
          setIsModifying={setIsModifying} setTitle={setTitle} setIntro={setIntro} setNotice={setNotice}
          handleSaveOnClick={handleSaveOnClick} handleCancelOnClick={handleCancelOnClick} handleDeleteOnClick={handleDeleteOnClick} handleDropOutOnClick={handleDropOutOnClick} handleCopyOnClick={handleCopyOnClick} />
        {/* 쫑알이(교사)*/}
        {user.isTeacher && <MainPanel>
          <TitleText>세특 쫑알이</TitleText>
          <MainSelector isMobile={isMobile} type="subject" studentList={studentList} actiList={actiList} classId={thisKlassId} setIsPerfModalShow={setIsPerfModal} />
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
    {/* 수행 관리 모달 */}
    <PerfModal
      show={isPerfModal}
      onHide={() => setIsPerfModal(false)}
      studentList={studentList}
      classId={thisKlassId}
    />
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
const TitleText = styled.h5`
  display: flex;
  justify-content: center;
  color: #3a3a3a;
  font-weight: bold;
  margin: 10px auto;
`
export default ClassroomDetailsPage