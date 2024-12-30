//라이브러리
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAllStudents } from '../../store/allStudentsSlice';
import styled from 'styled-components';
//컴포넌트
import MidBtn from '../../components/Btn/MidBtn';
import MainBtn from '../../components/Btn/MainBtn';
import TransparentBtn from '../../components/Btn/TransparentBtn';
import EmptyResult from '../../components/EmptyResult';
import StudentList from '../../components/List/StudentList';
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal';
import MainPanel from '../../components/MainPanel';
import UpperTab from '../../components/UpperTab';
//hooks
import useDeleteFireData from '../../hooks/Firebase/useDeleteFireData';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData';
import useClassAuth from '../../hooks/useClassAuth';
//img
import deskIcon from '../../image/icon/desk_icon.png'
import MainSelector from '../classRoom/MainSelector';
import useFetchFireData from '../../hooks/Firebase/useFetchFireData';

//2024.10.22 생성
const HomeroomDetailsPage = () => {
  //----1.변수부--------------------------------
  //교사 인증
  const { log } = useClassAuth();
  if (log) { window.alert(log) }
  useEffect(() => {
    setIsVisible(true)
    fetchActiList("담임").then((actiList) => { setActiList(actiList) })
  }, [])
  //라이브러리
  const navigate = useNavigate();
  const dispatcher = useDispatch()
  //반 전역변수 가져오기
  const thisClass = useSelector(({ classSelected }) => { return classSelected })
  //모든 학생 List
  const { studentList } = useFetchRtMyStudentData("classRooms", thisClass.id, "students", "studentNumber")
  useEffect(() => { dispatcher(setAllStudents(studentList)) }, [studentList]) //전역변수
  const { fetchActiList } = useFetchFireData()
  //담임반 활동 List
  const [actiList, setActiList] = useState([])
  useEffect(() => {
    setSelfActiList(actiList.filter(acti => acti.subjDetail === "자율"))
    setCareerActiList(actiList.filter(acti => acti.subjDetail === "진로"))
  }, [actiList])
  const [selfActiList, setSelfActiList] = useState([])
  const [careerActiList, setCareerActiList] = useState([])
  const { deleteClassWithStudents } = useDeleteFireData()
  //tab
  const [tab, setTab] = useState(1)
  //교사 학생 추가 모달
  const [isAddStuModalShown, setIsAddStuModalShown] = useState(false)
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)

  //----2.함수부--------------------------------
  const handleAllStudentOnClick = () => { navigate(`/homeroom/${thisClass.id}/allstudents`) }

  const handleDeleteClassOnClick = () => {
    let deleteConfirm = window.prompt("클래스를 삭제하시겠습니까? 반 학생정보도 함께 삭제됩니다. 삭제하시려면 '삭제합니다'를 입력하세요.")
    if (deleteConfirm === "삭제합니다") {
      deleteClassWithStudents(thisClass.id)
      navigate("/classRooms")
    } else {
      window.alert("문구가 제대로 입력되지 않았습니다.");
      return;
    }
  }

  return (
    <>
      <Container $isVisible={isVisible}>
        <MainPanel>
          <h5>도구모음</h5>
          <IconWrapper>
            <StyledImg src={deskIcon} alt="자리바꾸기" onClick={() => { navigate(`/homeroom/${thisClass.id}/seat`) }} />
            <p>자리바꾸기(test)</p>
          </IconWrapper>
        </MainPanel>
        <MainPanel>
          <TabWrapper>
            <UpperTab className="tab1" value={tab} top="-41px" onClick={() => { setTab(1) }}>자율</UpperTab>
            <UpperTab className="tab2" value={tab} top="-41px" left="62px" onClick={() => { setTab(2) }}>진로</UpperTab>
          </TabWrapper>
          <h5>빠른 세특 쫑알이</h5>
          {tab === 1 && <MainSelector type="self" studentList={studentList} actiList={selfActiList} classId={thisClass.id} />}
          {tab === 2 && <MainSelector type="career" studentList={studentList} actiList={careerActiList} classId={thisClass.id} />}
        </MainPanel>
        <MainPanel>
          <TabWrapper>
            <UpperTab value={tab} top="-41px" >행동특성</UpperTab>
          </TabWrapper>
          <h5>학생 행동특성 및 종합의견 작성</h5>
          {(!studentList || studentList.length === 0) ?
            <>{/* 학생 목록 없을 때 */}
              <EmptyResult comment="등록된 학생이 없습니다." />
              <MidBtn onClick={() => { setIsAddStuModalShown(true) }}>학생 추가</MidBtn>
            </> : <StudentList petList={studentList} plusBtnOnClick={() => { setIsAddStuModalShown(true) }} />}
        </MainPanel>
        <MainPanel>
          <h5>한눈에 보기</h5>
          <MainBtn btnName="행발 전체 보기" btnOnClick={handleAllStudentOnClick} />
        </MainPanel>
        <BtnWrapper>
          <TransparentBtn btnName="반 목록" btnOnClick={() => { navigate("/classRooms") }} />
          <TransparentBtn btnName="반 삭제" btnOnClick={() => { handleDeleteClassOnClick() }} />
        </BtnWrapper>
      </Container>
      {/* 학생 추가 모달 */}
      {<AddNewStudentModal
        show={isAddStuModalShown}
        onHide={() => { setIsAddStuModalShown(false) }}
        classId={thisClass.id}
        type="homeroom" />}
    </>
  )
}

const Container = styled.main`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto 50px;
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
`
const TabWrapper = styled.div`
  position: relative;
`
const IconWrapper = styled.div`
  position: relative;
  padding: 0 0 12px 16px;
  p {
    position: absolute;
    bottom: 10px;
    margin: 0; 
  }
`
const StyledImg = styled.img`
  width: 100px;
  height: 100px;
  cursor: pointer;
`
const BtnWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`
export default HomeroomDetailsPage
