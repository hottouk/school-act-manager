import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentData';
import styled from 'styled-components';
import EmptyResult from '../../components/EmptyResult';
import MidBtn from '../../components/Btn/MidBtn';
import StudentList from '../../components/List/StudentList';

const HomeroomDetailsPage = () => {
  const user = useSelector(({ user }) => { return user; })
  const thisClass = useSelector(({ classSelected }) => { return classSelected }) //반 전역변수
  const { studentList } = useFetchRtMyStudentData("classRooms", thisClass.id, "students", "studentNumber") //모든 학생 List
  const [isAddStuModalShown, setIsAddStuModalShown] = useState(false) //교사 학생 추가 모달

  return (
    <Container>
      {user.isTeacher && <MainWrapper>
        <h5>학생 행동특성 및 종합의견 작성</h5>
        {(!studentList || studentList.length === 0) ?
          <>{/* 학생 목록 없을 때 */}
            <EmptyResult comment="등록된 학생이 없습니다." />
            <MidBtn btnName="학생 추가" btnOnClick={() => { setIsAddStuModalShown(true) }} />
          </> : <StudentList petList={studentList} plusBtnOnClick={() => { setIsAddStuModalShown(true) }} />}
      </MainWrapper>}
    </Container>
  )
}

const Container = styled.main`
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
