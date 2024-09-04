//라이브러리
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents } from '../../store/allStudentsSlice.jsx';
import { setAllActivities } from '../../store/allActivitiesSlice.jsx';
import styled from 'styled-components';
//컴포넌트
import MainSelector from './MainSelector.jsx';
import StudentList from '../../components/List/StudentList.jsx';
import ActivityList from '../../components/List/ActivityList.jsx';
import EmptyResult from '../../components/EmptyResult.jsx';
import ClassMemberModal from '../../components/Modal/ClassMemberModal.jsx';
import MainBtn from '../../components/Btn/MainBtn.jsx';
import PetImg from '../../components/PetImg.jsx';
//hooks
import useEnrollClass from '../../hooks/useEnrollClass.jsx';
import useFetchFireData from '../../hooks/Firebase/useFetchFireData.jsx';
import useClientHeight from '../../hooks/useClientHeight.jsx';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentData.jsx';
//이미지
import MidBtn from '../../components/Btn/MidBtn.jsx';
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal.jsx';
import useDeleteFireData from '../../hooks/Firebase/useDeleteFireData.jsx';

//2024.08.01(클래스 헤더 수정)
const ClassRoomDetailsPage = () => {
  //1.변수
  //전역 변수
  const navigate = useNavigate()
  const dispatcher = useDispatch()
  const user = useSelector(({ user }) => { return user; })
  const thisClass = useSelector(({ classSelected }) => { return classSelected }) //반 전역변수
  //hooks
  const { cancelSignUpInClass } = useEnrollClass()
  const { deleteClassWithStudents } = useDeleteFireData()

  //개별 클래스 구별해주는 변수
  //데이터 통신 변수
  const { studentList } = useFetchRtMyStudentData("classRooms", thisClass.id, "students", "studentNumber") //모든 학생 List
  const [_actiList, setActiList] = useState([])
  const { fetchActiList } = useFetchFireData()
  //모드
  const [isApplied, setIsApplied] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [isModalShown, setIsModalShown] = useState(false)             //학생 클래스 가입 모달 
  const [isAddStuModalShown, setIsAddStuModalShown] = useState(false) //교사 학생 추가 모달
  const clientHeight = useClientHeight(document.documentElement)

  useEffect(() => {
    dispatcher(setAllStudents(studentList))       //전체 학생 전역변수화
    fetchActiList(thisClass).then((actiList) => { //전체 활동 전역변수화
      dispatcher(setAllActivities(actiList))
      setActiList(actiList)
    });
  }, [studentList])

  useEffect(() => {
    if (!user.isTeacher) { //학생
      if (thisClass.appliedStudentList && thisClass.appliedStudentList.length !== 0) { //신청 중이라면
        let isApplied = (thisClass.appliedStudentList.filter(({ uid }) => { return uid === user.uid })).length !== 0
        setIsApplied(isApplied)
      }
      if (thisClass.memberList && thisClass.memberList.length !== 0) { //가입 회원이라면
        let isMemeber = (thisClass.memberList.filter(({ uid }) => { return uid === user.uid })).length !== 0
        setIsMember(isMemeber)
      }
    }
  }, [thisClass])

  //3.함수
  const handleBtnClick = (event) => {
    switch (event.target.id) {
      case "back_btn":
        navigate("/classRooms")
        break;
      case "delete_btn":
        let deleteConfirm = window.prompt("클래스를 삭제하시겠습니까? 반 학생정보도 함께 삭제됩니다. 삭제하시려면 '삭제합니다'를 입력하세요.")
        if (deleteConfirm === "삭제합니다") {
          deleteClassWithStudents(thisClass.id)
          navigate("/classRooms")
        } else {
          window.alert("문구가 제대로 입력되지 않았습니다.");
          return;
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

  return (<>
    {!thisClass && <StyledContainer><h3>반 정보를 불러올 수 없습니다.</h3></StyledContainer>}
    {thisClass &&
      <StyledContainer $clientheight={clientHeight}>
        {/* 반 기본 정보 */}
        <StyeldHeader>
          <StyledClassTitle>{thisClass.classTitle}</StyledClassTitle>
          <p className="subjectInfo">{thisClass.subject}-{thisClass.subjDetail}</p>
          <p>{thisClass.intro}</p>
          <p>{!studentList ? 0 : studentList.length}명의 학생들이 있습니다.</p>
          <p className="petInfo">이 클래스에서 학생들이 얻을 수 있는 펫</p>
          <PetImgWrapper>
            <PetImg subject={thisClass.subject} level={0} onClick={() => { }} />
            <StyledArrowRightBtn />
            <PetImg subject={thisClass.subject} level={1} onClick={() => { }} />
            <StyledArrowRightBtn />
            <PetImg subject={thisClass.subject} level={2} onClick={() => { }} />
            <StyledArrowRightBtn />
            <PetImg subject={thisClass.subject} level={3} onClick={() => { }} />
          </PetImgWrapper>
          {/* 학생*/}
          {(!user.isTeacher && isApplied) && <div className="btn_wrapper">
            <StyledSignupBtn $backgroundcolor="gray">가입 신청 중..</StyledSignupBtn>
            <StyledSignupBtn id="cancel_btn" onClick={handleBtnClick}>신청 취소</StyledSignupBtn>
          </div>}
          {(!user.isTeacher && !isMember && !isApplied) && <StyledMoveBtn id="join_btn" onClick={handleBtnClick}>가입하기</StyledMoveBtn>}
        </StyeldHeader>
        {/* 셀렉터(교사)*/}
        <MainSelectorContainer>
          {user.isTeacher && <MainSelector studentList={studentList} activitiyList={_actiList} classId={thisClass.id} />}
        </MainSelectorContainer>
        {/* 퀘스트 목록(학생) */}
        {(!user.isTeacher && isMember) && <StyledMain>
          {(!_actiList || _actiList.length === 0)
            ? <EmptyResult comment="등록된 활동이 없습니다." />
            : <ActivityList activityList={_actiList} classInfo={thisClass} />}
        </StyledMain>
        }
        {/* 학생 상세 보기 (가입 학생, 교사)*/}
        {((!user.isTeacher && isMember) || user.isTeacher) && <StyledMain>
          {/* 학생 목록 없을 때 */}
          {(!studentList || studentList.length === 0) ?
            <>
              <EmptyResult comment="등록된 학생이 없습니다." />
              <MidBtn btnName="학생 추가" btnOnClick={() => { setIsAddStuModalShown(true) }} />
            </> : <StudentList petList={studentList} plusBtnOnClick={() => { setIsAddStuModalShown(true) }} />}
        </StyledMain>}
        {/* 반 전체보기(교사)*/}
        {user.isTeacher && <StyledMain>
          <h4>개별화하기</h4>
          <MainBtn btnName="반 전체 세특 보기" btnOnClick={() => { navigate('allStudents') }} />
        </StyledMain>
        }
        {user.isTeacher && <StyeldBtnDiv>
          <StyledBtn id="back_btn" onClick={handleBtnClick}>반 목록</StyledBtn>
          <StyledBtn id="delete_btn" onClick={handleBtnClick}>반 삭제</StyledBtn>
        </StyeldBtnDiv>}
      </StyledContainer>
    }
    {/* 모달창 */}
    {isModalShown && <ClassMemberModal
      show={isModalShown}
      onHide={() => { setIsModalShown(false) }}
      thisClass={thisClass}
    />}
    {<AddNewStudentModal
      show={isAddStuModalShown}
      onHide={() => { setIsAddStuModalShown(false) }}
      classId={thisClass.id} />}
  </>)
}

const StyledContainer = styled.main`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
  @media screen and (max-width: 767px){
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    margin: 0;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const StyledClassTitle = styled.h2`
  display: flex;
  font-weight: bold;
  justify-content: center;
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
const StyledArrowRightBtn = styled.button` //화살표
  float: right;
  margin-top: 50px;
  width: 25px;
  height: 25px;
  border: 10px solid black;
  border-left: 0;
  border-top: 0;
  transform: rotate(315deg);
  opacity: 0.8;
  @media screen and (max-width: 767px){
    display: none;
  }
`
const MainSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin-top: 50px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
`
const StyledMain = styled.main`
  padding: 5px;
  margin-top: 50px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
  h4 {
    display: flex;
    justify-content: center;
    margin: 10px auto;
  }
  @media screen and (max-width: 767px){
    margin-top: 0;
    border-left: none;
    border-top: 12px #3454d1 double;
    box-shadow: none;
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
const StyeldBtnDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
const StyledBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 250px;
  color: royalBlue;
  background-color: transparent;
  border-radius: 15px;
  border: 2px solid royalBlue;
  padding: 25px;
  @media screen and (max-width: 767px){
    width: 110px;
    height: 40px;
  }
`
export default ClassRoomDetailsPage