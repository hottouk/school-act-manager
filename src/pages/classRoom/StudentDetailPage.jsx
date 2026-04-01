//라이브러리
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//섹션
import PetInfoSection from './PetInfoSection';
import BehaviorOpinionSection from '../homeroom/BehaviorOpinionSection';
import ActiTableSection from './ActiTableSection';
//컴포넌트
import MainContainer from '../../components/Styled/MainContainer';
import SubNav from '../../components/Bar/SubNav';
import UpperTab from '../../components/UpperTab';
import ByteCalculator from '../../components/Etc/ByteCalculator';
import ArrowBtn from '../../components/Btn/ArrowBtn';
import BackBtn from '../../components/Btn/BackBtn';
import ClickableIcon from '../../components/Styled/ClickableIcon';
//hooks
import useFirePetData from '../../hooks/Firebase/useFirePetData';
import useMediaQuery from '../../hooks/useMediaQuery';
//이미지
import arrows_icon from "../../image/icon/arrows_icon.png"
//효과
import AnimRotation from '../../anim/AnimRotation';
import { ERROR_MSG } from '../../constants/errMsg';
//코드 간소화 및 기능추가(240720)-> 펫 동기화(250207)-> 코드 정리 및 버그 수정(250223) -> 수정 요청 기능(251104) -> 담임반 통합(260120)
const StudentDetailPage = () => {
  //준비
  const { id: klassId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(({ user }) => user);
  const { petId, semester, klassType, subject } = location.state ?? {};
  //전체 학생
  const allStudentFrozenList = useSelector(({ allStudents }) => allStudents);
  //n번째 학생
  const nthStudent = useMemo(() => {
    if (!allStudentFrozenList) return null;
    return allStudentFrozenList.findIndex(({ id }) => id === petId)
  }, [allStudentFrozenList, petId])
  //실시간 펫
  const { petRtData, petDataListener, updatePetInfo, deletePet } = useFirePetData();
  useEffect(() => {
    petDataListener(klassId, petId);
    setSemester(semester || null);
  }, [klassId, petId, semester, petDataListener]);
  //펫 정보
  const bindInitData = useCallback(() => {
    if (!petRtData) return;
    const { behaviorOpinion = '', actList = [], writtenName = "미등록" } = petRtData;
    let list;
    if (klassType === "subject") list = actList.filter((acti) => acti.semester !== 2) ?? [];
    else list = actList.filter(acti => acti.subjDetail === "자율");
    setWrittenName(writtenName);
    setBehaviorRecord(behaviorOpinion);
    setActiList(list);
  }, [klassType, petRtData]);
  useEffect(() => {
    bindInitData();
    const checkMaster = () => { //학생 본인 id가 아닐 경우 back
      if (user.isTeacher || !petRtData) return;
      const { master } = petRtData;
      if (master?.studentId === user.uid) { setIsMaster(true); }
      else { navigate(-1); }
    }
    checkMaster();
  }, [petRtData, user, navigate, bindInitData]);
  //로컬 펫 정보
  const [writtenName, setWrittenName] = useState('');
  const [actiList, setActiList] = useState(null);
  const [behaviorRecord, setBehaviorRecord] = useState('');
  const [isMaster, setIsMaster] = useState(false);
  //탭
  const [recordType, setRecordType] = useState(1);
  const [_semester, setSemester] = useState(1);
  useEffect(() => {
    const changeActiList = () => {
      if (!klassType) return;
      const actList = petRtData?.actList ?? [];
      setActiList(() => {
        if (klassType === "subject") {
          if (_semester === 2) return actList?.filter((acti) => acti.semester === 2);
          else return actList?.filter((acti) => acti.semester !== 2)
        }
        else if (klassType === "homeroom") {
          if (recordType === 1) return actList?.filter((acti) => acti.subjDetail === "자율");
          else if (recordType === 2) return actList?.filter((acti) => acti.subjDetail === "진로");
          else if (recordType === 3) return [];
        }
      });
    }
    changeActiList();
  },
    [petRtData, klassType, _semester, recordType,]);
  const recByType = { subject: { value: _semester, setter: setSemester }, homeroom: { value: recordType, setter: setRecordType } };
  //편집 모드 
  const [isModifying, setIsModifying] = useState(false);
  const [isBehavioring, setIsBehavioring] = useState(false);
  //모바일
  const isMobile = useMediaQuery("(max-width: 768px)");
  //에니메이션
  const [isAnimating, setIsAnimating] = useState(false);
  //**함수**
  //실시간 acc
  const getAccRec = (list) => list.reduce((acc, cur) => acc + " " + cur.record, '')
  //학생 이동(241202)
  const moveStudent = (student) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/classrooms/${klassId}/student`, { state: { semester: _semester, petId: student.id, klassType } });
      setIsAnimating(false);
    }, 500); // 애니메이션 시간과 동일하게 설정
  }
  //저장
  const handleSaveOnClick = () => {
    if (!window.confirm('학생정보를 이대로 저장하시겠습니까?')) return;
    const list = petRtData.actList ?? [];
    let rest;
    let newPetInfo;
    if (klassType === "subject") {
      if (_semester === 2) rest = list.filter(item => item.semester !== 2) ?? [];
      else rest = list.filter(item => item.semester === 2) ?? [];
      newPetInfo = { writtenName: writtenName, actList: [...actiList, ...rest] };
    } else {
      if (recordType === 1) rest = list?.filter(item => item.subjDetail !== "자율");
      else if (recordType === 2) rest = list.filter(item => item.subjDetail !== "진로");
      else rest = list;
      newPetInfo = { writtenName: writtenName, actList: [...actiList, ...rest,], behaviorOpinion: behaviorRecord };
    }
    updatePetInfo(klassId, petId, newPetInfo);
    setIsModifying(false);
  }
  //수정 취소
  const handleCancelOnClick = () => {
    bindInitData();
    setIsModifying(false);
  }
  //화살표 버튼
  const handleArrowBtnOnClick = (event, index) => {
    switch (event.target.id) {
      case "right_arw_btn":
        if (nthStudent === allStudentFrozenList.length - 1) { alert("마지막 학생입니다."); return; }
        const nextStudent = allStudentFrozenList[nthStudent + 1];
        moveStudent(nextStudent);
        break;
      case "left_arw_btn":
        if (nthStudent === 0) { alert("첫번째 학생입니다."); return; }
        const previousStudent = allStudentFrozenList[nthStudent - 1];
        moveStudent(previousStudent);
        break;
      case "up_arw_btn":
        if (klassType === "subject") navigate(`/classrooms/${klassId}`);
        else navigate(`/homeroom/${klassId}`);
        break;
      default: return
    }
  }
  //학생 삭제
  const handlePetDeleteOnClick = async () => {
    if (!window.confirm('학생을 삭제하시겠습니까? 삭제한 학생은 복구할 수 없습니다.')) return;
    try {
      await deletePet(klassId, petId);
      navigate(-1);
    } catch (err) { alert(ERROR_MSG.deletePet, err) }
  };
  return (<>
    <MainContainer>
      {/* 도구 */}
      <SubNav styles={{ padding: "10px" }}>
        {user.isTeacher && <Select
          placeholder="학생 바로 이동"
          options={allStudentFrozenList.map((student) => ({ label: `${student.studentNumber} ${student.writtenName || '미등록'}`, value: student.id }))}
          onChange={(event) => { moveStudent(allStudentFrozenList.find((student) => student.id === event.value)) }}
          isDisabled={isModifying} />}
        {!user.isTeacher && <BackBtn />}
      </SubNav>
      <Row style={{ justifyContent: "center" }}><ArrowBtn id="up_arw_btn" deg={225} onClick={handleArrowBtnOnClick} /></Row>
      <AnimRotation isAnimating={isAnimating}>
        <PannelContainer>
          {/* 편집 및 삭제 버튼 */}
          <BtnPannel>
            {(!isModifying && !isBehavioring) && <Row style={{ gap: "10px" }}>
              {!isMobile && <ClickableIcon className='fa-solid fa-edit' styles={{ color: "white", hoverColor: "#ffffff50" }} onClick={() => setIsModifying(!isModifying)} title={"편집"} />}
              <ClickableIcon className='fa-solid fa-trash' styles={{ color: "white", hoverColor: "#ffffff50" }} onClick={handlePetDeleteOnClick} title={"삭제"} />
            </Row>}
            {(isModifying && !isBehavioring) && <Row style={{ gap: "10px" }}>
              <ClickableIcon className='fa-solid fa-check' styles={{ color: "white", hoverColor: "#ffffff50" }} onClick={handleSaveOnClick} title={"확인"} />
              <ClickableIcon className='fa-solid fa-x' styles={{ color: "white", hoverColor: "#ffffff50" }} onClick={handleCancelOnClick} title={"취소"} />
            </Row>}
          </BtnPannel>
          {/* 화살표 */}
          {(user.isTeacher && !isModifying && !isBehavioring) && <>
            <ArrowWrapper style={{ top: "50%", left: "-5%" }}><ArrowBtn id="left_arw_btn" deg={135} onClick={handleArrowBtnOnClick} /></ArrowWrapper>
            <ArrowWrapper style={{ top: "50%", right: "-5%" }}><ArrowBtn id="right_arw_btn" onClick={handleArrowBtnOnClick} /></ArrowWrapper>
          </>}
          {/* 펫 정보 */}
          {petRtData && <PetInfoSection
            pet={petRtData}
            writtenName={writtenName}
            isEdit={isModifying}
            setWrittenName={setWrittenName}
            handlePetDeleteOnClick={handlePetDeleteOnClick}
          />}
          {(user.isTeacher || isMaster) && <GrayBotPannel>
            {/* 탭 */}
            {!isBehavioring && <Row style={{ marginBottom: "-26px", marginLeft: "15px" }}>
              <UpperTab className={"tab1"} value={recByType[klassType].value} onClick={() => recByType[klassType].setter(1)} disabled={isModifying}>{klassType === "subject" ? "1학기" : "자율"}</UpperTab>
              <UpperTab className={"tab2"} value={recByType[klassType].value} onClick={() => recByType[klassType].setter(2)} disabled={isModifying}>{klassType === "subject" ? "2학기" : "진로"}</UpperTab>
              {klassType === "homeroom" && <UpperTab className={"tab3"} value={recByType[klassType].value} onClick={() => recByType[klassType].setter(3)} disabled={isModifying}>행발</UpperTab>}
            </Row>}
            {recordType !== 3 && <>
              <ActiTableSection
                type={klassType}
                subject={subject}
                tabValue={recByType[klassType].value}
                actiList={actiList}
                setActiList={setActiList}
                getAccRec={getAccRec}
                petRtData={petRtData}
                isEdit={isModifying}
                isMobile={isMobile} />
              <Row style={{ justifyContent: "center" }}><img src={arrows_icon} alt="아래화살표" /></Row>
              <AccWrapper>{actiList?.length > 0 ? getAccRec(actiList) : "기록 없음"}</AccWrapper>
            </>}
            {recordType === 3 && <BehaviorOpinionSection
              isModifying={isModifying}
              setIsBehavioring={setIsBehavioring}
              behaviorRec={behaviorRecord}
              setBehaviorRec={setBehaviorRecord} />}
          </GrayBotPannel>}
          {actiList?.length > 0 && <ByteWrapper>
            <ByteCalculator str={getAccRec(actiList)} styles={{ justifyContent: "center", fontSize: "22px", fontColor: "white", width: "81px" }}></ByteCalculator>
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
  border-radius: 10px 0 10px 10px;
  perspective: 1000px; /* 3D 효과를 위한 원근법 */
  @media screen and (max-width: 768px){
    width: 100%;
    margin-top: 0;
    border: none;
    border-radius: 10px 10px 0 10px;
  }
`
const BtnPannel = styled(Row)`
  position: absolute;
  background-color: #3454d1b1;
  padding: 5px 10px;
  border-radius: 15px 15px 0px 0px;
  top: -45px;
  right: 0px;
  gap: 10px;
`
const GrayBotPannel = styled.div`
  position: relative;
  margin-top: 15px;
  padding: 15px;
  background-color: #efefef;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 767px){
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`
const AccWrapper = styled.div`
  width: 100%;
  margin: 10px auto;
  border: 1px solid #78787880;
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