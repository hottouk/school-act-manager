//라이브러리
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents } from '../../store/allStudentsSlice.jsx';
import { setAllActivities } from '../../store/allActivitiesSlice.jsx';
import Select from 'react-select';
import styled from 'styled-components';
//컴포넌트
import MainSelector from './MainSelector.jsx';
import StudentList from '../../components/List/StudentList.jsx';
import ActivityList from '../../components/List/ActivityList.jsx';
import QuizMonListItem from '../../components/List/ListItem/QuizMonListItem.jsx';
import EmptyResult from '../../components/EmptyResult.jsx';
import MainBtn from '../../components/Btn/MainBtn.jsx';
import MidBtn from '../../components/Btn/MidBtn.jsx';
import ArrowBtn from '../../components/Btn/ArrowBtn.jsx';
import TransparentBtn from '../../components/Btn/TransparentBtn.jsx';
import MainPanel from '../../components/MainPanel.jsx';
import SubNav from '../../components/Bar/SubNav.jsx';
import PetImg from '../../components/PetImg.jsx';
//모달
import PerfModal from '../../components/Modal/PerfModal.jsx';
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal.jsx';
import GameModal from '../../components/Modal/GameModal.jsx';
//hooks
import useFetchRtClassroomData from '../../hooks/RealTimeData/useFetchRtClassroomData.jsx';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData.jsx';
import useFireActiData from '../../hooks/Firebase/useFireActiData.jsx';
import useDeleteFireData from '../../hooks/Firebase/useDeleteFireData.jsx';
import useClientHeight from '../../hooks/useClientHeight.jsx';
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData.jsx';

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
  const { getSubjKlassActiList } = useFireActiData();
  //실시간 데이터
  const { myUserData } = useFetchRtMyUserData();
  const { klassData } = useFetchRtClassroomData(thisKlassId)                                                  //클래스
  const { studentDataList } = useFetchRtMyStudentData("classRooms", thisKlassId, "students", "studentNumber") //학생
  useEffect(() => {                                              //애니메이션 처리 및 데이터 바인딩
    setIsVisible(false)
    setTimeout(() => setIsVisible(true), 200)
    renderData();
  }, [thisKlassId, klassData, studentDataList])
  useEffect(() => { fetchPetData(); }, [myUserData, thisKlassId])//마이 펫 바인딩
  const [actiList, setActiList] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [quizId, setQuizId] = useState([])
  // 게임 구동 정보
  const [gameDetails, setGameDetails] = useState(null);
  const [myPetDetails, setMyPetDetails] = useState(null)
  //모달
  const [isAddStuModal, setIsAddStuModal] = useState(false)     //교사 학생 추가
  const [isPerfModal, setIsPerfModal] = useState(false)         //수행 관리
  const [isGameModal, setIsGameModal] = useState(false)         //게임 
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)
  //모바일
  const clientHeight = useClientHeight(document.documentElement)

  //------함수부------------------------------------------------  
  //초기화
  const renderData = () => {
    if (!klassData || !studentDataList) return;
    const classTeacherId = user.isTeacher ? user.uid : studentKlassData.uid
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

  //유저 상호작용
  //몬스터 클릭
  const handleMonsterOnClick = (item) => {
    let { quizInfo, ...rest } = item
    console.log(item)
    setIsGameModal(true)
    setQuizId(quizInfo.id)
    setGameDetails(rest)
  }

  //삭제 클릭
  const handleDeleteBtnOnClick = () => {
    let deleteConfirm = window.prompt("클래스를 삭제하시겠습니까? 반 학생정보도 함께 삭제됩니다. 삭제하시려면 '삭제합니다'를 입력하세요.")
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
        <StyeldHeader>
          <StyledBoldText>{klassData.classTitle}</StyledBoldText>
          <p className="subjectInfo">{klassData.subject}-{klassData.subjDetail}</p>
          <p>{klassData.intro}</p>
          <p>{!studentList ? 0 : studentList.length}명의 학생들이 있습니다.</p>
          <p className="petInfo">이 클래스에서 학생들이 얻을 수 있는 펫</p>
          <PetImgWrapper>
            <PetImg subject={klassData.subject} level={0} onClick={() => { }} />
            <ArrowWrapper><ArrowBtn direction="right" /></ArrowWrapper>
            <PetImg subject={klassData.subject} level={1} onClick={() => { }} />
            <ArrowWrapper><ArrowBtn direction="right" /></ArrowWrapper>
            <PetImg subject={klassData.subject} level={2} onClick={() => { }} />
            <ArrowWrapper><ArrowBtn direction="right" /></ArrowWrapper>
            <PetImg subject={klassData.subject} level={3} onClick={() => { }} />
          </PetImgWrapper>
          <StyledBoldText style={{ marginTop: "10px" }}>vs</StyledBoldText>
          {/* 단어 게임부 */}
          <GameMonListWrapper>
            {quizList.length === 0 && < EmptyResult comment="등록단 단어 게임이 없습니다." />}
            {quizList.length !== 0 && quizList.map((item) => {
              return <QuizMonListItem key={item.id} item={item} onClick={handleMonsterOnClick} />
            })}
          </GameMonListWrapper>
        </StyeldHeader>

        {/* 쫑알이(교사)*/}
        {user.isTeacher && <MainPanel>
          <h5>빠른 세특 쫑알이</h5>
          <MainSelector type="subject" studentList={studentList} actiList={actiList} classId={thisKlassId} setIsPerfModalShow={setIsPerfModal} />
        </MainPanel>}


        {/* 학생 상세 보기(교사)*/}
        {(user.isTeacher) && <MainPanel>
          <h5>학생 개별 보기</h5>
          {studentList && <StudentList petList={studentList} plusBtnOnClick={() => { setIsAddStuModal(true) }} classType={"subject"} />}
          {(!studentList || studentList.length === 0) && <>
            <EmptyResult comment="등록된 학생이 없습니다." />
            <MidBtn onClick={() => { setIsAddStuModal(true) }}>학생 추가</MidBtn>
          </>}
        </MainPanel>}

        {/* 반 전체보기(교사)*/}
        {user.isTeacher && <MainPanel>
          <h5>한 눈에 보기</h5>
          <Row style={{ margin: "30px 0" }}><MainBtn onClick={() => { navigate('allStudents') }} >반 전체 세특 보기</MainBtn></Row>
        </MainPanel>}

        {/* 버튼 패널 */}
        {user.isTeacher && <BtnWrapper>
          <TransparentBtn onClick={() => { }}>반 수정</TransparentBtn>
          <TransparentBtn id="delete_btn" onClick={handleDeleteBtnOnClick}>반 삭제</TransparentBtn>
        </BtnWrapper>}

        {/* 퀘스트 목록(학생) */}
        {(!user.isTeacher && studentKlassData.isApproved) && <MainPanel>
          <h5>퀘스트 목록</h5>
          {(!actiList || actiList.length === 0)
            ? <EmptyResult comment="등록된 활동이 없습니다." />
            : <ActivityList actiList={actiList} classInfo={klassData} />}
        </MainPanel>
        }

      </Container>
    }
    {/* 모달창 */}
    {<AddNewStudentModal
      show={isAddStuModal}
      onHide={() => { setIsAddStuModal(false) }}
      classId={thisKlassId} />}
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
const StyledBoldText = styled.h2`
  display: flex;
  font-weight: bold;
  justify-content: center;
`
const GameMonListWrapper = styled.ul`
  display: flex;
  gap: 15px;
  border-top: 1px solid rgb(120, 120, 120, 0.5);
  border-bottom: 1px solid rgb(120, 120, 120, 0.5);
`
const StyeldHeader = styled.header`
  margin-top: 25px;
  padding: 25px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
  p.subjectInfo { //교과
    text-align: right;
    font-size: 20px;
    font-weight: 600;
    color: #3454d1;
  }
  p.petInfo { //펫 정보
    text-align: center;
    font-size: 15px;
    font-weight: 600;
  }
  .btn_wrapper { //학생측 버튼 
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 767px){
    margin-top: 0;
    border-top: 12px #3454d1 double;
    border-left: none;
    box-shadow: none;
  }
`
const PetImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  position: relative;
  img {
    border: 1px solid black;
    border-radius: 15px;
  }
`
const ArrowWrapper = styled.div` 
  display: flex;
  align-items: center;
}
`
const BtnWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`
export default ClassroomDetailsPage