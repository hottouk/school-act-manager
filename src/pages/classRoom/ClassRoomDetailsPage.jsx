//라이브러리
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents } from '../../store/allStudentsSlice.jsx';
import { setAllActivities } from '../../store/allActivitiesSlice.jsx';
import Select from 'react-select';
import styled from 'styled-components';
//컴포넌트
import MainSelector from './MainSelector.jsx';
import StudentList from '../../components/List/StudentList.jsx';
import ActivityList from '../../components/List/ActivityList.jsx';
import EmptyResult from '../../components/EmptyResult.jsx';
import MainBtn from '../../components/Btn/MainBtn.jsx';
import MidBtn from '../../components/Btn/MidBtn.jsx';
import ArrowBtn from '../../components/Btn/ArrowBtn.jsx';
import TransparentBtn from '../../components/Btn/TransparentBtn.jsx';
import MainPanel from '../../components/MainPanel.jsx';
import SubNav from '../../components/Bar/SubNav.jsx';
import QuizMonListItem from '../../components/List/ListItem/QuizMonListItem.jsx';
//모달
import PerfModal from '../../components/Modal/PerfModal.jsx';
import ClassMemberModal from '../../components/Modal/ClassMemberModal.jsx';
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal.jsx';
import GameModal from '../../components/Modal/GameModal.jsx';
//hooks
import useEnrollClass from '../../hooks/useEnrollClass.jsx';
import useFetchFireData from '../../hooks/Firebase/useFetchFireData.jsx';
import useClientHeight from '../../hooks/useClientHeight.jsx';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData.jsx';
import useFetchRtMyActiData from '../../hooks/RealTimeData/useFetchRtMyActiData.jsx'
import useDeleteFireData from '../../hooks/Firebase/useDeleteFireData.jsx';
//이미지
import PetImg from '../../components/PetImg.jsx';
//todo 활동 중복으로 받음
//todo 학생과 교사 로직 분리
//2024.08.01(클래스 헤더 수정) -> 11.13(애니메이션 추가) -> 25.01.18(게임 추가)
const ClassroomDetailsPage = () => {
  //준비
  const navigate = useNavigate()
  const dispatcher = useDispatch()
  const { id: klassId } = useParams()
  useEffect(() => { //화면 이동
    setIsVisible(false)
    setTimeout(() => setIsVisible(true), 200)
  }, [klassId])
  const user = useSelector(({ user }) => user)
  const allSubjClassList = useSelector(({ allClasses }) => allClasses)
  const thisClass = allSubjClassList.find((klass) => klass.id === klassId)
  //hooks
  const { cancelSignUpInClass } = useEnrollClass()
  const { deleteClassWithStudents } = useDeleteFireData()
  //데이터 통신 변수
  const { studentList } = useFetchRtMyStudentData("classRooms", klassId, "students", "studentNumber") //학생 List
  const { quizActiList } = useFetchRtMyActiData();                                                    //퀴즈 List
  const { fetchActiList } = useFetchFireData();           //todo 활동 중복으로 받고 있음.
  useEffect(() => {
    setQuizList(quizActiList)
  }, [quizActiList])
  useEffect(() => {
    dispatcher(setAllStudents(studentList))               //전체 학생 전역변수화
    fetchActiList(thisClass.subject).then((actiList) => { //전체 활동 전역변수화
      dispatcher(setAllActivities(actiList))
      setActiList(actiList)
    });
  }, [studentList])
  const [actiList, setActiList] = useState([])
  const [quizList, setQuizList] = useState([])
  const [quizId, setQuizId] = useState([])
  const [monsterDetails, setMonsterDetails] = useState()
  //모드
  const [isApplied, setIsApplied] = useState(false)
  const [isMember, setIsMember] = useState(false)
  //모달
  const [isModalShown, setIsModalShown] = useState(false)     //학생 클래스 가입
  const [isAddStuModal, setIsAddStuModal] = useState(false)   //교사 학생 추가
  const [isPerfModal, setIsPerfModal] = useState(false)       //수행 관리
  const [isGameModal, setIsGameModal] = useState(false)       //게임 
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)
  //모바일
  const clientHeight = useClientHeight(document.documentElement)

  //------함수부------------------------------------------------  
  //클래스 이동
  const moveKlass = (event) => { navigate(`/classrooms/${event.value}`) }

  const handleOnClick = (event) => {
    switch (event.target.id) {
      case "back_btn":
        navigate("/classRooms")
        break;
      case "delete_btn":
        let deleteConfirm = window.prompt("클래스를 삭제하시겠습니까? 반 학생정보도 함께 삭제됩니다. 삭제하시려면 '삭제합니다'를 입력하세요.")
        if (deleteConfirm === "삭제합니다") {
          deleteClassWithStudents(klassId)
          navigate("/classRooms")
        } else {
          window.alert("문구가 제대로 입력되지 않았습니다.");
          return
        }
        break;
      //학생 전용
      case "join_btn":
        setIsModalShown(true)
        break;
      case "cancel_btn":
        if (window.confirm("클래스 가입 신청을 취소하겠습니까?")) {
          cancelSignUpInClass(thisClass)
          setIsApplied(false)
        }
        break;
      default: return
    }
    return null
  }
  //몬스터 클릭
  const handleMonsterOnClick = (item) => {
    let { monster, quizInfo } = item
    setIsGameModal(true)
    setQuizId(quizInfo.id)
    setMonsterDetails({ ...monster.step[0], level: item.level })
  }

  return (<>
    <SubNav styles={{ padding: "10px" }}>
      <Select options={allSubjClassList.map((klass) => { return { label: klass.classTitle, value: klass.id } })} placeholder="반 바로 이동"
        onChange={moveKlass} />
    </SubNav>
    {!thisClass && <Container><h3>반 정보를 불러올 수 없습니다.</h3></Container>}
    {thisClass &&
      <Container $clientheight={clientHeight} $isVisible={isVisible}>
        {/* 반 기본 정보 */}
        <StyeldHeader>
          <StyledBoldText>{thisClass.classTitle}</StyledBoldText>
          <p className="subjectInfo">{thisClass.subject}-{thisClass.subjDetail}</p>
          <p>{thisClass.intro}</p>
          <p>{!studentList ? 0 : studentList.length}명의 학생들이 있습니다.</p>
          <p className="petInfo">이 클래스에서 학생들이 얻을 수 있는 펫</p>
          <PetImgWrapper>
            <PetImg subject={thisClass.subject} level={0} onClick={() => { }} />
            <ArrowWrapper><ArrowBtn direction="right" /></ArrowWrapper>
            <PetImg subject={thisClass.subject} level={1} onClick={() => { }} />
            <ArrowWrapper><ArrowBtn direction="right" /></ArrowWrapper>
            <PetImg subject={thisClass.subject} level={2} onClick={() => { }} />
            <ArrowWrapper><ArrowBtn direction="right" /></ArrowWrapper>
            <PetImg subject={thisClass.subject} level={3} onClick={() => { }} />
          </PetImgWrapper>
          <StyledBoldText style={{ marginTop: "10px" }}>vs</StyledBoldText>

          {/* 단어 게임부 */}
          <GameMonListWrapper>
            {quizList.length === 0 && < EmptyResult comment="등록단 단어 게임이 없습니다." />}
            {quizList.length !== 0 && quizList.map((item) => {
              return <QuizMonListItem key={item.id} item={item} onClick={handleMonsterOnClick} />
            })}
          </GameMonListWrapper>
          {/* 학생*/}
          {(!user.isTeacher && isApplied) && <div className="btn_wrapper">
            <StyledSignupBtn $backgroundcolor="gray">가입 신청 중..</StyledSignupBtn>
            <StyledSignupBtn id="cancel_btn" onClick={handleOnClick}>신청 취소</StyledSignupBtn>
          </div>}
          {(!user.isTeacher && !isMember && !isApplied) && <StyledMoveBtn id="join_btn" onClick={handleOnClick}>가입하기</StyledMoveBtn>}
        </StyeldHeader>
        {/* 셀렉터(교사)*/}
        <MainPanel>
          <h5>빠른 세특 쫑알이</h5>
          {user.isTeacher && <MainSelector type="subject" studentList={studentList} actiList={actiList} classId={klassId} setIsPerfModalShow={setIsPerfModal} />}
        </MainPanel>
        {/* 퀘스트 목록(학생) */}
        {(!user.isTeacher && isMember) && <MainPanel>
          {(!actiList || actiList.length === 0)
            ? <EmptyResult comment="등록된 활동이 없습니다." />
            : <ActivityList activityList={actiList} classInfo={thisClass} />}
        </MainPanel>
        }
        {/* 학생 상세 보기 (가입 학생, 교사)*/}
        {((!user.isTeacher && isMember) || user.isTeacher) && <MainPanel>
          <h5>학생 개별 보기</h5>
          {/* 학생 목록 없을 때 */}
          {(!studentList || studentList.length === 0) ?
            <>
              <EmptyResult comment="등록된 학생이 없습니다." />
              <MidBtn onClick={() => { setIsAddStuModal(true) }}>학생 추가</MidBtn>
            </> : <StudentList petList={studentList} plusBtnOnClick={() => { setIsAddStuModal(true) }} classType={"subject"} />}
        </MainPanel>}
        {/* 반 전체보기(교사)*/}
        {user.isTeacher && <MainPanel>
          <h5>한 눈에 보기</h5>
          <Row style={{ margin: "30px 0" }}><MainBtn onClick={() => { navigate('allStudents') }} >반 전체 세특 보기</MainBtn></Row>
        </MainPanel>
        }
        {user.isTeacher && <BtnWrapper>
          <TransparentBtn id="back_btn" onClick={handleOnClick}>반 수정</TransparentBtn>
          <TransparentBtn id="delete_btn" onClick={handleOnClick}>반 삭제</TransparentBtn>
        </BtnWrapper>}
      </Container>
    }
    {/* 모달창 */}
    {isModalShown && <ClassMemberModal
      show={isModalShown}
      onHide={() => { setIsModalShown(false) }}
      thisClass={thisClass}
    />}
    {<AddNewStudentModal
      show={isAddStuModal}
      onHide={() => { setIsAddStuModal(false) }}
      classId={klassId} />}
    {/* 수행 관리 모달 */}
    <PerfModal
      show={isPerfModal}
      onHide={() => setIsPerfModal(false)}
      studentList={studentList}
      classId={klassId}
    />
    {/* 게임 모달 */}
    {isGameModal && <GameModal
      show={isGameModal}
      onHide={() => setIsGameModal(false)}
      quizSetId={quizId}
      monsterDetails={monsterDetails}
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
const StyledSignupBtn = styled.button`
  display: block;
  width: 200px;
  height: 50px;
  margin: 50px 20px;
  background-color: ${(props) => props.$backgroundcolor ? props.$backgroundcolor : "#3454d1"};
  border: none;
  border-radius: 5px;
  color: white;
  padding: 0.25em 1em;
`
const StyledMoveBtn = styled.button`
  display: block;
  margin: 50px auto;
  width: 240px;
  height: 50px;
  background-color: ${(props) => props.$backgroundcolor ? props.$backgroundcolor : "#3454d1"};
  border: none;
  border-radius: 5px;
  color: white;
  padding: 0.25em 1em;
`
const BtnWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`
export default ClassroomDetailsPage