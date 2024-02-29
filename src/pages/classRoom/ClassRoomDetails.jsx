//라이브러리
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents } from '../../store/allStudentsSlice';
import { setAllActivities } from '../../store/allActivitiesSlice.jsx';
import styled from 'styled-components';
//컴포넌트
import MainSelector from './MainSelector.jsx';
import StudentList from '../../components/StudentList';
import ActivityList from '../../components/ActivityList.jsx';
import EmptyResult from '../../components/EmptyResult.jsx';
import ClassMemberModal from '../../components/Modal/ClassMemberModal.jsx';
//hooks
import useSubCollection from '../../hooks/useSubCollection';
import useGetActivity from '../../hooks/useGetActivity.jsx';
import useClientHeight from '../../hooks/useClientHeight.jsx';
import useFirestore from '../../hooks/useFirestore.jsx';

//2024.01.26
const ClassRoomDetails = () => {
  //1.변수
  //전역 변수
  const navigate = useNavigate()
  const dispatcher = useDispatch()
  const user = useSelector(({ user }) => { return user; })
  const thisClass = useSelector(({ classSelected }) => { return classSelected })
  //개별 클래스 구별해주는 변수
  //데이터 통신 변수
  const { subDocuments, subColErr } = useSubCollection("classRooms", thisClass.id, "students", "studentNumber") //모든 학생 List
  const { activityList, errByGetActi } = useGetActivity(thisClass)
  const { deleteDocument } = useFirestore("classRooms")
  //모드
  const [isApplied, setIsApplied] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [isModalShown, setIsModalShown] = useState(false)
  const clientHeight = useClientHeight(document.documentElement)

  useEffect(() => {
    dispatcher(setAllStudents(subDocuments)) //전체 학생 전역변수화
    dispatcher(setAllActivities(activityList)) //전체 활동 전역변수화
  }, [subDocuments, activityList])

  useEffect(() => {
    if (!user.isTeacher) { //학생이
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
        let deleteConfirm = window.prompt('클래스를 삭제하시겠습니까? 반 학생정보도 함께 삭제됩니다. 삭제하시려면 "삭제합니다"를 입력하세요.')
        if (deleteConfirm === '삭제합니다') {
          deleteDocument(thisClass.id)
          navigate(-1)
        } else {
          window.alert('문구가 제대로 입력되지 않았습니다.');
          return;
        }
        break;
      //학생 전용
      case "join_btn":
        setIsModalShown(true)
        break;
      default: return
    }
    return null
  }

  return (<>
    {/* todo document 정리하기 */}
    {!thisClass && <StyledContainer><h3>반 정보를 불러올 수 없습니다.</h3></StyledContainer>}
    {thisClass &&
      <StyledContainer $clientheight={clientHeight}>
        <StyeldHeader>
          <StyledClassTitle>{thisClass.classTitle}</StyledClassTitle>
          <p>{!subDocuments ? 0 : subDocuments.length}명의 학생들이 있습니다.</p>
          <p>{thisClass.intro}</p>
          {/* 학생 전용 */}
          {(!user.isTeacher && isApplied) && <StyledMoveBtn $backgroundcolor="gray">가입 신청 중..</StyledMoveBtn>}
          {(!user.isTeacher && !isMember && !isApplied) && <StyledMoveBtn id="join_btn" onClick={handleBtnClick}>가입하기</StyledMoveBtn>}
        </StyeldHeader>
        {/* 셀렉터(교사 전용)*/}
        {user.isTeacher && <StyledMain>
          <MainSelector studentList={subDocuments} activitiyList={activityList} classId={thisClass.id} />
        </StyledMain>}
        {/* 퀘스트 목록(학생 전용) */}
        {(!user.isTeacher && isMember) && <StyledMain>
          {(!activityList || activityList.length === 0)
            ? <EmptyResult comment="등록된 활동이 없습니다." />
            : <ActivityList activityList={activityList} classInfo={thisClass} />}
          {errByGetActi && <EmptyResult comment={errByGetActi} />}
        </StyledMain>}
        {/* 학생 상세 보기 */}
        {((!user.isTeacher && isMember) || user.isTeacher) && <StyledMain>
          {(!subDocuments || subDocuments.length === 0)
            ? <h3>반에 학생들이 없습니다. {subColErr}</h3>
            : <StudentList petList={subDocuments} />}
        </StyledMain>}
        {/* 반 전체보기(교사 전용)*/}
        {user.isTeacher && <StyledMain>
          <h4>개별화하기</h4>
          <StyledMoveBtn onClick={() => { navigate('allStudents', { state: subDocuments }) }}>반 전체 세특보기</StyledMoveBtn>
        </StyledMain>
        }
        {user.isTeacher && <StyeldBtnDiv>
          <StyledBtn id='back_btn' onClick={handleBtnClick}>반 목록</StyledBtn>
          <StyledBtn id='delete_btn' onClick={handleBtnClick}>반 삭제</StyledBtn>
        </StyeldBtnDiv>}
      </StyledContainer>
    }
    {isModalShown && <ClassMemberModal
      show={isModalShown}
      onHide={() => { setIsModalShown(false) }}
      thisClass={thisClass}
    />}
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
const StyeldHeader = styled.header`
  margin-top: 25px;
  padding: 25px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
  @media screen and (max-width: 767px){
    margin-top: 0;
    border-top: 12px #3454d1 double;
    border-left: none;
    box-shadow: none;
  }
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
const StyledClassTitle = styled.h2`
  display: flex;
  justify-content: center;
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
export default ClassRoomDetails