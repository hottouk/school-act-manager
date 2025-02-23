//라이브러리
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAllStudents } from '../../store/allStudentsSlice';
import styled from 'styled-components';
//페이지
import ClassBoardSection from '../classroom/ClassBoardSection';
import MainSelector from '../classroom/MainSelector';
//컴포넌트
import MidBtn from '../../components/Btn/MidBtn';
import EmptyResult from '../../components/EmptyResult';
import StudentList from '../../components/List/StudentList';
import AddNewStudentModal from '../../components/Modal/AddNewStudentModal';
import MainPanel from '../../components/MainPanel';
import UpperTab from '../../components/UpperTab';
//hooks
import useDeleteFireData from '../../hooks/Firebase/useDeleteFireData';
import useFetchRtMyStudentData from '../../hooks/RealTimeData/useFetchRtMyStudentListData';
import useClassAuth from '../../hooks/useClassAuth';
import useFireActiData from '../../hooks/Firebase/useFireActiData';
import useFireClassData from '../../hooks/Firebase/useFireClassData';
import useFetchRtClassroomData from '../../hooks/RealTimeData/useFetchRtClassroomData';
//img
import deskIcon from '../../image/icon/desk_icon.png'
import { setAllActivities } from '../../store/allActivitiesSlice';

//2024.10.22 생성 -> 250211 게시판 추가
const HomeroomDetailsPage = () => {
  //교사 인증
  const { log } = useClassAuth();
  if (log) { window.alert(log) };
  const user = useSelector(({ user }) => user);
  //라이브러리
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  //시작
  useEffect(() => {
    setIsVisible(true);
    fetchAllActis("uid", user.uid, "subject", "담임").then((actiList) => {
      setActiList(actiList);
      dispatcher(setAllActivities(actiList));
    });
  }, [])
  const { updateClassroom } = useFireClassData();
  const { deleteClassWithStudents } = useDeleteFireData();
  //반 전역변수
  const thisClass = useSelector(({ classSelected }) => { return classSelected });
  const [_title, setTitle] = useState('');
  const [_intro, setIntro] = useState('');
  const [_notice, setNotice] = useState('');
  const [noticeList, setNoticeList] = useState([]);
  //실시간 data
  const { klassData } = useFetchRtClassroomData(thisClass.id);
  useEffect(() => { bindData() }, [klassData]);
  const { studentDataList: studentList } = useFetchRtMyStudentData("classRooms", thisClass.id, "students", "studentNumber");
  useEffect(() => { dispatcher(setAllStudents(studentList)) }, [studentList]);
  const { fetchAllActis } = useFireActiData();
  //담임반 활동 List
  const [actiList, setActiList] = useState([]);
  useEffect(() => {
    setSelfActiList(actiList.filter(acti => acti.subjDetail === "자율"));
    setCareerActiList(actiList.filter(acti => acti.subjDetail === "진로"));
  }, [actiList])
  const [selfActiList, setSelfActiList] = useState([]);
  const [careerActiList, setCareerActiList] = useState([]);
  //tab
  const [tab, setTab] = useState(1);
  //학생 추가 모달
  const [isAddStuModalShown, setIsAddStuModalShown] = useState(false);
  //모드
  const [isModifying, setIsModifying] = useState(false);
  //에니메이션
  const [isVisible, setIsVisible] = useState(false);

  //------함수부------------------------------------------------
  //초기화  
  const bindData = () => {
    if (!klassData) return;
    const { classTitle, intro, notice } = klassData;
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

  //저장
  const handleSaveOnClick = () => {
    const confirm = window.confirm("이대로 클래스 정보를 변경하시겠습니까?");
    if (confirm) {
      const classInfo = { title: _title, intro: _intro, notice: _notice };
      updateClassroom(classInfo, thisClass.id);
      setIsModifying(false);
    }
  };

  //취소 
  const handleCancelOnClick = () => {
    bindData();
    setIsModifying(false);
  };

  //반 삭제
  const handleDeleteOnClick = () => {
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
        <ClassBoardSection isModifying={isModifying} title={_title} intro={_intro} notice={_notice} klassData={klassData} studentList={studentList} noticeList={noticeList}
          setIsModifying={setIsModifying} setTitle={setTitle} setIntro={setIntro} setNotice={setNotice} handleSaveOnClick={handleSaveOnClick} handleCancelOnClick={handleCancelOnClick} handleDeleteOnClick={handleDeleteOnClick} Row={Row} />
        <MainPanel>
          <TitleText>도구모음</TitleText>
          <IconWrapper>
            <StyledImg src={deskIcon} alt="자리바꾸기" onClick={() => { navigate(`/homeroom/${thisClass.id}/seat`) }} />
            <p>자리바꾸기(test)</p>
          </IconWrapper>
        </MainPanel>
        <MainPanel styles={{ marginTop: "55px" }}>
          <TabWrapper>
            <UpperTab className="tab1" value={tab} top="-61px" onClick={() => { setTab(1) }}>자율</UpperTab>
            <UpperTab className="tab2" value={tab} top="-61px" left="62px" onClick={() => { setTab(2) }}>진로</UpperTab>
          </TabWrapper>
          <TitleText>빠른 세특 쫑알이</TitleText>
          {tab === 1 && <MainSelector type="self" studentList={studentList} actiList={selfActiList} classId={thisClass.id} />}
          {tab === 2 && <MainSelector type="career" studentList={studentList} actiList={careerActiList} classId={thisClass.id} />}
        </MainPanel>
        <MainPanel styles={{ marginTop: "55px" }}>
          <TabWrapper>
            <UpperTab value={tab} top="-61px" >행동특성</UpperTab>
          </TabWrapper>
          <TitleText>학생 행동특성 및 종합의견 작성</TitleText>
          {(!studentList || studentList.length === 0) ?
            <>{/* 학생 목록 없을 때 */}
              <EmptyResult comment="등록된 학생이 없습니다." />
              <MidBtn onClick={() => { setIsAddStuModalShown(true) }}>학생 추가</MidBtn>
            </> : <StudentList petList={studentList} plusBtnOnClick={() => { setIsAddStuModalShown(true) }} />}
        </MainPanel>
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
export default HomeroomDetailsPage
