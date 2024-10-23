//라이브러리
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAllStudents } from '../../store/allStudentsSlice';
//컴포넌트
import MidBtn from '../../components/Btn/MidBtn';
import MainBtn from '../../components/Btn/MainBtn';
import EmptyResult from '../../components/EmptyResult';
import StudentList from '../../components/List/StudentList';
//hooks
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData';
//css
import styled from 'styled-components';
import useClassAuth from '../../hooks/useClassAuth';
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal';

//2024.10.22 생성
const HomeroomDetailsPage = () => {
  //----1.변수부--------------------------------
  //교사 인증
  const { log } = useClassAuth();
  if (log) { window.alert(log) }
  useEffect(() => { setIsVisible(true) }, [])
  //라이브러리
  const navigate = useNavigate();
  const dispatcher = useDispatch()
  //반 전역변수 가져오기
  const thisClass = useSelector(({ classSelected }) => { return classSelected })
  //모든 학생 List
  const { studentList } = useFetchRtMyStudentData("classRooms", thisClass.id, "students", "studentNumber")
  useEffect(() => { dispatcher(setAllStudents(studentList)) }, [studentList]) //전역변수
  //교사 학생 추가 모달
  const [isAddStuModalShown, setIsAddStuModalShown] = useState(false)
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)

  //----2.함수부--------------------------------
  const handleAllStudentOnClick = () => {
    navigate(`/homeroom/${thisClass.id}/allStudents`)
  }

  return (
    <Container $isVisible={isVisible}>
      <MainWrapper>
        <h5>학생 행동특성 및 종합의견 작성</h5>
        {(!studentList || studentList.length === 0) ?
          <>{/* 학생 목록 없을 때 */}
            <EmptyResult comment="등록된 학생이 없습니다." />
            <MidBtn btnName="학생 추가" btnOnClick={() => { setIsAddStuModalShown(true) }} />
          </> : <StudentList petList={studentList} plusBtnOnClick={() => { setIsAddStuModalShown(true) }} />}
      </MainWrapper>
      <MainBtn btnName="행발 전체 보기" btnOnClick={handleAllStudentOnClick} />

      {/* 학생 추가 모달 */}
      {<AddNewStudentModal
        show={isAddStuModalShown}
        onHide={() => { setIsAddStuModalShown(false) }}
        classId={thisClass.id}
        type="homeroom" />}
    </Container>
  )
}

const Container = styled.main`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
`
const MainWrapper = styled.div`
  padding: 5px;
  margin-top: 50px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
  h5 {
    display: flex;
    justify-content: center;
    font-weight: bold;
    margin: 10px auto;
  }
  @media screen and (max-width: 767px){
    margin-top: 0;
    border-left: none;
    border-top: 12px #3454d1 double;
    box-shadow: none;
  }
`
export default HomeroomDetailsPage
