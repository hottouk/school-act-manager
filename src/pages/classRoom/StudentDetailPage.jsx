//라이브러리
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//섹션
import PetInfoSection from './PetInfoSection';
//컴포넌트
import MainContainer from '../../components/Styled/MainContainer';
import SubNav from '../../components/Bar/SubNav';
import UpperTab from '../../components/UpperTab';
import ByteCalculator from '../../components/Etc/ByteCalculator';
import ArrowBtn from '../../components/Btn/ArrowBtn';
import BackBtn from '../../components/Btn/BackBtn';
import ClickableIcon from '../../components/Styled/ClickableIcon';
//hooks
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
import useFirePetData from '../../hooks/Firebase/useFirePetData';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import useMediaQuery from '../../hooks/useMediaQuery';
//이미지
import arrows_icon from "../../image/icon/arrows_icon.png"
//효과
import AnimRotation from '../../anim/AnimRotation';
import ActiTableSection from './ActiTableSection';
import BehaviorOpinionSection from '../homeroom/BehaviorOpinionSection';
//코드 간소화 및 기능추가(240720)-> 펫 동기화(250207)-> 코드 정리 및 버그 수정(250223) -> 수정 요청 기능(251104) -> 담임반 통합(260120)
const StudentDetailPage = () => {
  //준비
  const { id: klassId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { petId, semester, klassType } = location.state;
  //학급
  useEffect(() => { petDataListener(klassId, petId); setSemester(semester || null); }, [location.state]);
  //유저
  const user = useSelector(({ user }) => user);
  //학생
  const allStudentList = useSelector((state) => state.allStudents);
  const { petRtData, petDataListener, updatePetInfo } = useFirePetData();
  const { fetchUserData } = useFireUserData();
  useEffect(() => {
    checkUser();
    setNthStudent(allStudentList.findIndex(({ id }) => { return id === petId })); //전체 학생에서 몇 번째인지 index 찾기
    syncPetInfo();
    fetchPetInfo();
    bindActiData();
  }, [petRtData]);
  //탭
  const [_recordType, setRecordType] = useState(1);
  const [_semester, setSemester] = useState(1);
  useEffect(() => changeActiList(recByType[klassType].value), [_semester, _recordType, petRtData,]);
  const recByType = { subject: { value: _semester, setter: setSemester }, homeroom: { value: _recordType, setter: setRecordType } };
  //편집 모드 
  const [isModifying, setIsModifying] = useState(false);
  const [isBehavioring, setIsBehavioring] = useState(false);
  const { deleteStudent, updateStudent } = useAddUpdFireData("classRooms");
  //학생 정보
  const [nthStudent, setNthStudent] = useState(null);
  const [_writtenName, setWrittenName] = useState('미등록');
  const [_actiList, setActiList] = useState(null);
  const [_behaviorRecord, setBehaviorRecord] = useState('');
  const [isMaster, setIsMaster] = useState(false);
  //모바일
  const isMobile = useMediaQuery("(max-width: 768px)");
  //에니메이션
  const [isAnimating, setIsAnimating] = useState(false);
  //------함수부------------------------------------------------  
  const bindActiData = () => {
    if (!petRtData) return;
    const { behaviorOpinion } = petRtData;
    const actList = petRtData.actList ?? [];
    let list;
    if (klassType === "subject") list = actList.filter((acti) => acti.semester !== 2) ?? [];
    else list = actList.filter(acti => acti.subjDetail === "자율");
    setBehaviorRecord(behaviorOpinion || '');
    setActiList(list);
  }
  //탭 전환
  const changeActiList = (value) => {
    if (!klassType) return;
    const { actList } = petRtData || [];
    setActiList(() => {
      if (klassType === "subject") {
        if (value === 2) return actList?.filter((acti) => acti.semester === 2);
        else return actList?.filter((acti) => acti.semester !== 2)
      }
      else if (klassType === "homeroom") {
        if (value === 1) return actList?.filter((acti) => acti.subjDetail === "자율");
        else if (value === 2) return actList?.filter((acti) => acti.subjDetail === "진로");
        else if (value === 3) return [];
      }
    });
  }
  //학생 본인 id가 아닐 경우 back
  const checkUser = () => {
    if (user.isTeacher || !petRtData) return;
    const { master } = petRtData;
    if (master?.studentId === user.uid) { setIsMaster(true); }
    else { navigate(-1); }
  }
  //펫 동기화(학생)
  const syncPetInfo = () => {
    if (user.isTeacher || !petRtData || !user) return;
    const confirm = window.confirm("펫 정보를 동기화 하시겠습니까?")
    if (confirm) {
      const myPetList = user.myPetList;
      if (!myPetList) return;
      const myPet = myPetList.find((item) => item.petId === petId);
      updatePetInfo(klassId, petId, myPet); //pet 업데이트
    }
  }
  //펫 동기화(교사)
  const fetchPetInfo = () => {
    if (!user.isTeacher) return;
    const masterId = petRtData?.master?.studentId;
    if (!masterId) return;
    fetchUserData(masterId).then((info) => {
      const petList = info.myPetList;
      if (!petList) return;
      const thisPet = petList.find((item) => item.petId === petId);
      updatePetInfo(klassId, petId, thisPet); //pet 업데이트
    })
  }
  //실시간 acc
  const getAccRec = (list) => list.reduce((acc, cur) => acc + " " + cur.record, '')
  //학생 이동(241202)
  const moveStudent = (student) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/classrooms/${klassId}/student`, { state: { semester: _semester, petId: student.id, klassType } })
      setIsAnimating(false);
    }, 500); // 애니메이션 시간과 동일하게 설정
  }
  //저장
  const handleSaveOnClick = () => {
    if (!window.confirm('학생정보를 이대로 저장하시겠습니까?')) return;
    const list = petRtData.actList ?? [];
    let rest;
    let newStudentInfo;
    if (klassType === "subject") {
      if (_semester === 2) rest = list.filter(item => item.semester !== 2) ?? [];
      else rest = list.filter(item => item.semester === 2) ?? [];
      newStudentInfo = { writtenName: _writtenName, actList: [..._actiList, ...rest] };
    } else {
      if (_recordType === 1) rest = list?.filter(item => item.subjDetail !== "자율");
      else if (_recordType === 2) rest = list.filter(item => item.subjDetail !== "진로");
      else rest = list;
      newStudentInfo = { writtenName: _writtenName, actList: [..._actiList, ...rest,], behaviorOpinion: _behaviorRecord };
    }
    updateStudent(newStudentInfo, klassId, petId);
    setIsModifying(false);
  }
  //취소
  const handleCancelOnClick = () => {
    bindActiData();
    setIsModifying(false);
  }
  //학생 삭제
  const handleStudentDeleteOnClick = () => {
    if (window.confirm('학생을 삭제하시겠습니까? 삭제한 학생은 복구할 수 없습니다.')) {
      deleteStudent(klassId, petId) //데이터 통신
      navigate(-1);
    }
  }
  //화살표 버튼
  const handleArrowBtnOnClick = (event, index) => {
    switch (event.target.id) {
      case "right_arw_btn":
        if (nthStudent === allStudentList.length - 1) { alert("마지막 학생입니다."); return; }
        const nextStudent = allStudentList[nthStudent + 1];
        moveStudent(nextStudent);
        break;
      case "left_arw_btn":
        if (nthStudent === 0) { alert("첫번째 학생입니다."); return; }
        const previousStudent = allStudentList[nthStudent - 1];
        moveStudent(previousStudent);
        break;
      case "up_arw_btn":
        if (klassType === "subject") navigate(`/classrooms/${klassId}`);
        else navigate(`/homeroom/${klassId}`);
        break;
      default: return
    }
  }
  return (<>
    <MainContainer>
      <SubNav styles={{ padding: "10px" }}>
        {user.isTeacher && <Select
          placeholder="학생 바로 이동"
          options={allStudentList.map((student) => ({ label: `${student.studentNumber} ${student.writtenName || '미등록'}`, value: student.id }))}
          onChange={(event) => { moveStudent(allStudentList.find((student) => student.id === event.value)) }}
          isDisabled={isModifying} />}
        {!user.isTeacher && <BackBtn />}
      </SubNav>
      <Row style={{ justifyContent: "center" }}><ArrowBtn id="up_arw_btn" deg={225} onClick={handleArrowBtnOnClick} /></Row>
      <AnimRotation isAnimating={isAnimating}>
        <PannelContainer>
          {/* 화살표 */}
          {(user.isTeacher && !isModifying && !isBehavioring) && <>
            <ArrowWrapper style={{ top: "50%", left: "-5%" }}><ArrowBtn id="left_arw_btn" deg={135} onClick={handleArrowBtnOnClick} /></ArrowWrapper>
            <ArrowWrapper style={{ top: "50%", right: "-5%" }}><ArrowBtn id="right_arw_btn" onClick={handleArrowBtnOnClick} /></ArrowWrapper>
          </>}
          {/* 펫 데이터 */}
          {petRtData && <PetInfoSection pet={petRtData} writtenName={_writtenName} isModifiying={isModifying} setWrittenName={setWrittenName} />}
          {(user.isTeacher || isMaster) && <GrayBotPannel>
            {(!isModifying && !isBehavioring) && <Row style={{ justifyContent: "flex-end" }}>
              <ClickableIcon className='fa-solid fa-edit' onClick={() => setIsModifying(!isModifying)}></ClickableIcon>
              <ClickableIcon className='fa-solid fa-trash' onClick={handleStudentDeleteOnClick}></ClickableIcon>
            </Row>}
            {(isModifying && !isBehavioring) && <Row style={{ justifyContent: "flex-end" }}>
              <ClickableIcon className='fa-solid fa-check' onClick={handleSaveOnClick}></ClickableIcon>
              <ClickableIcon className='fa-solid fa-x' onClick={handleCancelOnClick} ></ClickableIcon>
            </Row>}
            {/* 탭 */}
            {!isBehavioring && <Row style={{ position: "absolute", top: "27px", left: "28px" }}>
              <UpperTab className={"tab1"} value={recByType[klassType].value} onClick={() => recByType[klassType].setter(1)} disabled={isModifying}>{klassType === "subject" ? "1학기" : "자율"}</UpperTab>
              <UpperTab className={"tab2"} value={recByType[klassType].value} onClick={() => recByType[klassType].setter(2)} disabled={isModifying}>{klassType === "subject" ? "2학기" : "진로"}</UpperTab>
              {klassType === "homeroom" && <UpperTab className={"tab3"} value={recByType[klassType].value} onClick={() => recByType[klassType].setter(3)} disabled={isModifying}>행발</UpperTab>}
            </Row>}
            {/* 테이블 todo tabVlue 지우고 hadling 손보기*/}
            {_recordType !== 3 && <><ActiTableSection actiList={_actiList} setActiList={setActiList} type={klassType}
              tabValue={recByType[klassType].value}
              getAccRec={getAccRec} petRtData={petRtData}
              isModifying={isModifying} isMobile={isMobile} />
              <Row style={{ justifyContent: "center" }}><img src={arrows_icon} alt="아래화살표" /></Row>
              <AccWrapper>{_actiList?.length > 0 ? getAccRec(_actiList) : "기록 없음"}</AccWrapper>
            </>}
            {_recordType === 3 && <BehaviorOpinionSection isModifying={isModifying} setIsBehavioring={setIsBehavioring} behaviorRec={_behaviorRecord} setBehaviorRec={setBehaviorRecord} />}
          </GrayBotPannel>}
          {_actiList?.length > 0 && <ByteWrapper>
            <ByteCalculator str={getAccRec(_actiList)} styles={{ justifyContent: "center", fontSize: "22px", fontColor: "white", width: "81px" }}></ByteCalculator>
          </ByteWrapper>}
        </PannelContainer>
      </AnimRotation>
      {/* 교사전용 */}
    </MainContainer>
  </>)
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const ArrowWrapper = styled(Row)`
  position: absolute;
  align-items: center;
`
const PannelContainer = styled.div`
  position: relative;
  width: 80%;
  padding: 15px;
  margin: 15px auto 40px;
  margin-top: 35px;
  background-color: #3454d1b1;
  border-radius: 10px;
  border-bottom-right-radius: 0;
  perspective: 1000px; /* 3D 효과를 위한 원근법 */
  @media screen and (max-width: 767px){
    margin-top: 0;
    border: none;
    border-radius: 10px 10px 0 10px;
  }
`
const GrayBotPannel = styled.div`
  position: relative;
  margin-top: 15px;
  padding: 15px;
  background-color: #efefef;
  border-radius: 15px;
  display; flex;
  flex-direction: column;
  overflow-y: scroll;
  @media screen and (max-width: 767px){
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`
const AccWrapper = styled.div`
  margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 5px;
`
const ByteWrapper = styled.div`
  height: 50px;  
  position: absolute;
  right: 0;
  bottom: -60px;
  background-color: #3454d1b1;
    border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
  padding: 10px 15px 50px 10px;
`
export default StudentDetailPage
