//라이브러리
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents } from '../../store/allStudentsSlice.jsx';
import { setAllActivities } from '../../store/allActivitiesSlice.jsx';
import { setSelectClass } from '../../store/classSelectedSlice.jsx';
import Select from 'react-select';
import styled from 'styled-components';
//컴포넌트
import MainSelector from './MainSelector.jsx';
import StudentList from '../../components/List/StudentList.jsx';
import KlassQuizSection from './KlassQuizSection.jsx';
import ActivityList from '../../components/List/ActivityList.jsx';
import EmptyResult from '../../components/EmptyResult.jsx';
import MidBtn from '../../components/Btn/MidBtn.jsx';
import SubNav from '../../components/Bar/SubNav.jsx';
//모달
import PerfModal from '../../components/Modal/PerfModal.jsx';
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal.jsx';
import GameModal from '../../components/Modal/GameModal.jsx';
import PetInfoModal from '../../components/Modal/PetInfoModal.jsx';
//hooks
import useFetchRtClassroomData from '../../hooks/RealTimeData/useFetchRtClassroomData.jsx';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData.jsx';
import useFireActiData from '../../hooks/Firebase/useFireActiData.jsx';
import useDeleteFireData from '../../hooks/Firebase/useDeleteFireData.jsx';
import useClientHeight from '../../hooks/useClientHeight.jsx';
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData.jsx';
import useFireClassData from '../../hooks/Firebase/useFireClassData.jsx';
import ActiInfoModal from '../../components/Modal/ActiInfoModal.jsx';
import ClassBoardSection from './ClassBoardSection.jsx';
import MainPanel from '../../components/MainPanel.jsx';

//240801(클래스 헤더 수정) -> 1113(애니메이션 추가) -> 250122(게임 추가, 가입 제거) -> 0125(학생 페이지 정비)
const ClassroomDetailsPage = () => {
  //준비
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const user = useSelector(({ user }) => user)
  const allSubjClassList = useSelector(({ allClasses }) => allClasses)
  const { id: thisKlassId } = useParams();
  //학생 회원 검증
  const { state: studentKlassData } = useLocation();
  //hooks
  const { deleteClassWithStudents } = useDeleteFireData();
  const { updateClassroom } = useFireClassData();
  const { getSubjKlassActiList } = useFireActiData();
  //실시간 데이터
  const { myUserData } = useFetchRtMyUserData();
  const { klassData } = useFetchRtClassroomData(thisKlassId)                                 //클래스 기본 data
  const { studentDataList } = useFetchRtMyStudentData("classRooms", thisKlassId, "students", "studentNumber") //학생 data
  useEffect(() => {                                              //애니메이션 처리 및 데이터 바인딩
    setIsVisible(false)
    setTimeout(() => setIsVisible(true), 200)
    renderData();
    bindData();
  }, [thisKlassId, klassData, studentDataList])
  useEffect(() => { fetchPetData(); }, [myUserData, thisKlassId])//마이 펫 바인딩
  const [_title, setTitle] = useState('');
  const [_intro, setIntro] = useState('');
  const [_notice, setNotice] = useState('');
  const [noticeList, setNoticeList] = useState([]);
  const [actiList, setActiList] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [quizId, setQuizId] = useState([])
  const [petInfo, setPetInfo] = useState(null);
  const [actiInfo, setActiInfo] = useState(null);
  // 게임 구동 정보
  const [gameDetails, setGameDetails] = useState(null);
  const [myPetDetails, setMyPetDetails] = useState(null);
  //모드
  const [isModifying, setIsModifying] = useState(false);
  //모달
  const [isAddStuModal, setIsAddStuModal] = useState(false)       //교사 학생 추가
  const [isPerfModal, setIsPerfModal] = useState(false)           //수행 관리
  const [isGameModal, setIsGameModal] = useState(false)           //게임 
  const [isPetInfoModal, setIsPetInfoModal] = useState(false);    //펫
  const [isActiInfoModal, setIsActiInfoModal] = useState(false);  //활동
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)
  //모바일
  const clientHeight = useClientHeight(document.documentElement)

  //------함수부------------------------------------------------  
  //변경 가능 데이터 바인딩
  const bindData = () => {
    if (!klassData) return;
    const { classTitle, intro, notice } = klassData;
    dispatcher(setSelectClass(klassData));
    setTitle(classTitle || '정보 없음');
    setIntro(intro || '정보 없음');
    setNotice(notice || '')
    if (!notice) return;
    splitNotice(notice || []);
  }

  //공지사항 list 변환
  const splitNotice = (notice) => {
    const arr = notice.split("^").map((item) => item.trim()).slice(0, 3);
    setNoticeList(arr)
  }

  //고정 데이터 바인딩 todo 위 bind와 합쳐도 됨.
  const renderData = () => {
    if (!klassData || !studentDataList) return;
    const classTeacherId = user.isTeacher ? user.uid : studentKlassData?.uid
    getSubjKlassActiList(classTeacherId, klassData?.subject).then((list) => { //활동 data
      dispatcher(setAllActivities(list.subjActiList));
      setActiList(list.subjActiList);
      setQuizList(list.quizActiList);
    });
    dispatcher(setAllStudents(studentDataList))                              //학생 data
    setStudentList(studentDataList);
  }

  //클래스 이동
  const moveKlass = (event) => {
    navigate(`/classrooms/${event.value.id}`, { state: { ...event.value } })
  }

  //펫 정보 불러오기(학생 전용)
  const fetchPetData = () => {
    if (user.isTeacher || !myUserData) return;
    const { myPetList } = myUserData;
    const thisPet = myPetList.find(({ classId }) => classId === thisKlassId)
    setMyPetDetails(thisPet)
  }

  //몬스터 클릭
  const handleMonsterOnClick = (item) => {
    let { quizInfo, ...rest } = item
    setIsGameModal(true)
    setQuizId(quizInfo.id)
    setGameDetails(rest)
  }

  //변경 저장
  const handleSaveOnClick = () => {
    const confirm = window.confirm("이대로 클래스 정보를 변경하시겠습니까?");
    if (confirm) {
      const classInfo = { title: _title, intro: _intro, notice: _notice };
      updateClassroom(classInfo, klassData.id);
      setIsModifying(false)
    }
  }
  //변경 취소
  const handleCancelOnClick = () => {
    bindData();
    setIsModifying(false)
  }

  //삭제 클릭
  const handleDeleteOnClick = () => {
    const deleteConfirm = window.prompt("클래스를 삭제하시겠습니까? 반 학생정보도 함께 삭제됩니다. 삭제하시려면 '삭제합니다'를 입력하세요.")
    if (deleteConfirm === "삭제합니다") {
      deleteClassWithStudents(thisKlassId)
      navigate("/classRooms")
    } else {
      window.alert("문구가 제대로 입력되지 않았습니다.");
    }
  }

  return (<>
    <SubNav styles={{ padding: "10px" }}>
      <Select options={allSubjClassList.map((item) => { return { label: item.classTitle, value: item } })} placeholder="반 바로 이동"
        onChange={moveKlass} />
    </SubNav>

    {!klassData && <EmptyResult comment={"Error: 반 정보를 불러올 수 없습니다."} />}
    {klassData &&
      <Container $clientheight={clientHeight} $isVisible={isVisible}>
        {/* 반 기본 정보(공용) */}
        <ClassBoardSection isModifying={isModifying} klassData={klassData} title={_title} intro={_intro} notice={_notice} studentList={studentList} noticeList={noticeList}
          setIsModifying={setIsModifying} setTitle={setTitle} setIntro={setIntro} setNotice={setNotice} handleSaveOnClick={handleSaveOnClick} handleCancelOnClick={handleCancelOnClick} handleDeleteOnClick={handleDeleteOnClick} Row={Row} />
        {/* 쫑알이(교사)*/}
        {user.isTeacher && <MainPanel>
          <TitleText>세특 쫑알이</TitleText>
          <MainSelector type="subject" studentList={studentList} actiList={actiList} classId={thisKlassId} setIsPerfModalShow={setIsPerfModal} />
        </MainPanel>}
        {/* 퀴즈 게임부 */}
        <KlassQuizSection quizList={quizList} klassData={klassData} onClick={handleMonsterOnClick} />

        {/* 학생 상세 보기*/}
        <MainPanel>
          <TitleText>학생 상세히 보기</TitleText>
          {studentList && <StudentList petList={studentList} plusBtnOnClick={() => { setIsAddStuModal(true) }} classType={"subject"} setIsPetInfoModal={setIsPetInfoModal} setPetInfo={setPetInfo} />}
          {(!studentList || studentList.length === 0) && <>
            <EmptyResult comment="등록된 학생이 없습니다." />
            {user.isTeacher && <MidBtn onClick={() => { setIsAddStuModal(true) }}>학생 추가</MidBtn>}
          </>}
        </MainPanel>
        {/* 퀘스트 목록(학생) */}
        {(!user.isTeacher && studentKlassData?.isApproved) && <MainPanel>
          <TitleText>퀘스트 목록</TitleText>
          {(!actiList || actiList.length === 0)
            ? <EmptyResult comment="등록된 활동이 없습니다." />
            : <ActivityList actiList={actiList} setIsActiInfoModal={setIsActiInfoModal} setActiInfo={setActiInfo} />}
        </MainPanel>
        }

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
    {/* 게임 모달 */}
    {isGameModal && <GameModal
      show={isGameModal}
      onHide={() => setIsGameModal(false)}
      quizSetId={quizId}
      myPetDetails={myPetDetails}
      gameDetails={gameDetails}
    />}
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
  </>)
}

const Container = styled.main`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
  @media screen and (max-width: 767px){
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
  justify-content: center;
`
const TitleText = styled.h5`
  display: flex;
  justify-content: center;
  color: #3a3a3a;
  font-weight: bold;
  margin: 10px auto;
`
export default ClassroomDetailsPage