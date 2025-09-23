//라이브러리
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';
//섹션
import TitledChkBoxList from './TitledChkBoxList';
import HomeActiListGridSection from './HomeActiListGridSection';
//컴포넌트
import MainBtn from '../../components/Btn/MainBtn';
import SmallBtn from '../../components/Btn/SmallBtn';
import ArrowBtn from '../../components/Btn/ArrowBtn';
import SmallTitle from '../../components/Title/SmallTitle';
import EmptyResult from '../../components/EmptyResult';
import ByteCalculator from '../../components/Etc/ByteCalculator';
import TransparentBtn from '../../components/Btn/TransparentBtn';
import UpperTab from '../../components/UpperTab';
import SubNav from '../../components/Bar/SubNav';
import PetInfoSection from '../classroom/PetInfoSection';
//hooks
import useChatGpt from '../../hooks/useChatGpt';
import useClassAuth from '../../hooks/useClassAuth';
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
import useFetchRtPetDoc from '../../hooks/RealTimeData/useFetchRtPetData';
import useFirePetData from '../../hooks/Firebase/useFirePetData';
//css
import AnimOpacity from '../../anim/AnimOpacity';
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity';
import AnimRotation from '../../anim/AnimRotation';
//이미지
import arrows_icon from '../../image/icon/arrows_icon.png';

//생성(241016)-> 회전효과 추가(241201)-> 통신 일원화(250104)-> 진로, 자율 그리드 섹션 추가(250223)
const HomeStudentDetailPage = () => {
  //유저 인증
  const { log } = useClassAuth();
  if (log) { window.alert(log) };
  //준비
  const navigate = useNavigate();
  const { id: klassId, studentId } = useParams(); //클래스id, 학생 id
  //전역 변수(Frozen)
  const user = useSelector(({ user }) => user);
  const allStudentList = useSelector(({ allStudents }) => allStudents);
  const frozenAllActiList = useSelector(({ allActivities }) => allActivities);
  //실시간 학생 정보
  const { pet } = useFetchRtPetDoc(klassId, studentId);
  useEffect(() => { bindInitData(); }, [pet]);
  //gpt
  const { askBehavioralOp, gptAnswer, gptBytes, gptRes } = useChatGpt();
  useEffect(() => {
    setGptTempRes(gptRes)
    setGptTempAnswer(gptAnswer)
  }, [gptAnswer, gptRes, gptBytes]);
  const [gptTempAnswer, setGptTempAnswer] = useState('');
  const [gptTempRes, setGptTempRes] = useState(null);
  //행발 작성 단계 
  const [step, setStep] = useState('');
  const [desiredMajor, setDesiredMajor] = useState('');
  //★★ 행발, 자율, 진로 ★★
  const [tab, setTab] = useState(1);
  const [studentNumber, setStudentNumber] = useState('');
  const [allActiList, setAllActiList] = useState([]);
  const [_writtenName, setWrittenName] = useState('');
  const [_selectedSpec, setSelectedSpec] = useState('');        //선택된 spec { spec1: [], spec2: [], spec3:[]..}
  const [_behaviorOpinion, setBehaviorOpinion] = useState('');
  const [_selfList, setSelfList] = useState(null);
  const [_careerList, setCareerList] = useState(null);
  useEffect(() => { changeAllActisByTab(); }, [tab]);
  //편집
  const [isFreeze, setIsFreeze] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  //저장
  const { updatePetInfo } = useFirePetData();
  const { deleteStudent } = useAddUpdFireData("classRooms"); //매개변수 없으면 에러나서 억지로 넣은거임..
  //학생 이동
  const [nthStudent, setNthStudent] = useState(null);
  //에니메이션
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  //------함수부------------------------------------------------
  const bindInitData = () => {
    if (!pet) return;
    const { studentNumber, writtenName, selectedSpec, behaviorOpinion, actList } = pet || {};
    const selfListData = actList?.filter((acti) => acti.subjDetail === "자율");
    const careerListData = actList?.filter((acti) => acti.subjDetail === "진로");
    setStudentNumber(studentNumber);
    setWrittenName(writtenName || '');
    const selected = selectedSpec || '';
    if (selected) { setDesiredMajor(selectedSpec["희망진로"]?.[0] ?? '') };
    setSelectedSpec(selected);
    setSelfList(selfListData || []);
    setCareerList(careerListData || []);
    setBehaviorOpinion(behaviorOpinion || '');
    setNthStudent(allStudentList.findIndex(({ id }) => { return id === studentId }));      //전체 학생에서 몇 번째 index
    setIsVisible(true);
    setStep('');
  }
  //tab에 따른 allActi
  const changeAllActisByTab = () => {
    const newList = [...frozenAllActiList];
    const allSelfList = newList.filter((item) => { return item.subjDetail === "자율" });
    const allCareerList = newList.filter((item) => { return item.subjDetail === "진로" });
    if (tab === 2) { setAllActiList(allSelfList) }
    else if (tab === 3) { setAllActiList(allCareerList) };
  }
  //실시간 acc
  const getAccRec = (list) => { return list?.reduce((acc, cur) => acc + ' ' + cur.record, '') };
  //학생 이동 버튼 클릭(241201)
  const handleMoveOnClick = (direction) => {
    let student;
    if (direction === "next") { student = allStudentList[nthStudent + 1]; }
    else { student = allStudentList[nthStudent - 1]; };
    moveStudent(student);
  }
  //학생 이동
  const moveStudent = (student) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/homeroom/${klassId}/${student.id}`, { state: student });
      setIsAnimating(false);
    }, 500); // 애니메이션 시간과 동일하게 설정
  }
  //탭 클릭
  const handleTabOnClick = (number) => {
    setStep('');
    setTab(number);
  }
  //목록 이동
  const handleBackOnClick = () => navigate(`/homeroom/${klassId}/`);

  //gpt 생성 버튼 클릭
  const handleGptOnClick = () => {
    const check = _selectedSpec !== '';
    if (check) { askBehavioralOp(_selectedSpec) }
    else { window.alert("체크된 특성이 없습니다.") };
  }
  //수정 저장
  const handleSaveOnClick = () => {
    if (window.confirm('학생정보를 이대로 저장하시겠습니까?')) {
      const actList = [..._selfList, ..._careerList];
      const info = { writtenName: _writtenName, behaviorOpinion: _behaviorOpinion, actList };
      updatePetInfo(klassId, studentId, info);
    } else { bindInitData(); };
    setIsModifying(false);
  };
  //행발 저장
  const handleSaveBehaveOpinOnClick = () => {
    const check = _behaviorOpinion !== ''
    if (check) {
      if (window.confirm("행동의견을 저장하시겠습니까?")) {
        updatePetInfo(klassId, studentId, { behaviorOpinion: _behaviorOpinion });
        setStep('')
        window.alert("저장되었습니다.")
      }
    } else { window.alert("행동의견이 없습니다.") }
  }
  //수정 취소
  const handleCancelOnClick = () => {
    bindInitData();
    setIsModifying(false);
  }
  //현재 특성 db 저장
  const handleCurSaveOnClick = () => {
    const check = _selectedSpec !== ''
    if (check) {
      if (window.confirm("현재 상태를 저장하시겠습니까?")) {
        updatePetInfo(klassId, studentId, { selectedSpec: _selectedSpec })//서버 저장
        alert("저장되었습니다.")
      }
    } else { alert("체크된 특성이 없습니다.") }
  }
  //gpt결과 행발에 반영
  const handleJoinBtnOnClick = () => {
    let check = gptTempAnswer !== ''
    if (check) {
      setSelectedSpec('')
      setGptTempAnswer('')
      setGptTempRes(null)
      setBehaviorOpinion((prev) => { return prev + ' ' + gptTempAnswer })
      setDesiredMajor('')
    } else { window.alert("gpt 생성 결과가 없습니다.") }
  }
  //선택 초기화
  const handleInitOnClick = () => {
    setSelectedSpec('')
    setDesiredMajor('')
  }
  //마지막 다음 버튼
  const handleLastNextOnClick = () => {
    let check = Object.values(_selectedSpec)?.filter((arrItem) => { return arrItem.length > 0 }).length > 0
    if (check) { setStep("last") } else { window.alert("특성이 하나도 선택되지 않았습니다.") }
  };
  //학생 삭제
  const handleDelBtnOnClick = () => {
    if (window.confirm('학생을 삭제하시겠습니까? 삭제한 학생은 복구할 수 없습니다.')) {
      deleteStudent(klassId, studentId); //데이터 통신
      navigate(`/homeroom/${klassId}/`);
    }
  };

  return (<>
    <SubNav styles={{ padding: "10px" }}>
      <Select placeholder="학생 바로 이동"
        options={allStudentList.map((student) => { return { label: `${student.studentNumber} ${student.writtenName || '미등록'}`, value: student.id, key: student.id } })}
        onChange={(event) => { moveStudent(allStudentList.find((student) => student.id === event.value)) }}
        isDisabled={isModifying}
      />
    </SubNav>
    {/* 컨테이너 */}
    <Container $isVisible={isVisible}>
      <Row style={{ marginBottom: "25px" }}><ArrowBtn deg={225} onClick={handleBackOnClick} /></Row>
      <Row style={{ gap: "10px" }}>
        {(user.isTeacher && step === '' && !isModifying) && <ArrowWrapper>
          {nthStudent !== 0 && <ArrowBtn deg={135} onClick={() => { handleMoveOnClick("prev") }} />}
          {nthStudent === 0 && <ArrowBtn deg={135} onClick={() => { }} styles={{ borderColor: "#ddd" }} />}
        </ArrowWrapper>}
        <AnimRotation isAnimating={isAnimating}>
          <StyledBackgroundPannel>
            <TabWrapper>
              <UpperTab className="tab1" value={tab} onClick={() => { handleTabOnClick(1) }}>행동특성</UpperTab>
              <UpperTab className="tab2" value={tab} left="89px" onClick={() => { handleTabOnClick(2) }}>자율</UpperTab>
              <UpperTab className="tab3" value={tab} left="148px" onClick={() => { handleTabOnClick(3) }}>진로</UpperTab>
            </TabWrapper>
            {/* 펫 정보 */}
            {pet && <PetInfoSection pet={pet} subject={""} studentNumber={studentNumber} isModifiying={isModifying} writtenName={_writtenName} setWrittenName={setWrittenName} />}
            <StyledGrayPannel>
              {/* 개요 */}
              {(step === '') && <IntroWrapper>
                {tab === 1 && <p>행동 특성 종합 의견</p>}
                {tab === 2 && <p style={{ margin: "0" }}>자율 활동 특이사항</p>}
                {tab === 3 && <p style={{ margin: "0" }}>진로 활동 특이사항</p>}
                {/* 활동 리스트 그리드 */}
                {tab === 2 && <HomeActiListGridSection list={_selfList} type="자율" setList={setSelfList} allActiList={allActiList} isModifying={isModifying} />}
                {tab === 3 && <HomeActiListGridSection list={_careerList} type="진로" setList={setCareerList} allActiList={allActiList} isModifying={isModifying} />}
                {/* 누가 화살표 */}
                {tab !== 1 && <Row><img src={arrows_icon} alt="아래화살표" /></Row>}
                {tab === 1 && <StyledTextarea
                  value={_behaviorOpinion}
                  onChange={(event) => { setBehaviorOpinion(event.target.value) }}
                  placeholder='내용이 없습니다.'
                  disabled={!isModifying} />}
                {tab === 2 && <StyledAcc>{getAccRec(_selfList) || "활동 없음"}</StyledAcc>}
                {tab === 3 && <StyledAcc>{getAccRec(_careerList) || "활동 없음"}</StyledAcc>}
                <ByteWrapper>
                  {tab === 1 && <ByteCalculator str={_behaviorOpinion} styles={{ width: "70px" }} />}
                  {tab === 2 && <ByteCalculator str={getAccRec(_selfList)} styles={{ width: "70px" }} />}
                  {tab === 3 && <ByteCalculator str={getAccRec(_careerList)} styles={{ width: "70px", totalByte: "2100" }} />}
                </ByteWrapper>
                {tab === 1 && <Row style={{ justifyContent: "center" }}><MainBtn onClick={() => { setStep("first") }}>행동종합 의견 작성 도우미</MainBtn></Row>}
              </IntroWrapper>}
              {/* 1단계 */}
              <AnimOpacity isVisible={step === "first"} content={
                <><p>1/3단계: 학생의 학업역량에 해당되는 것에 체크해주세요.</p>
                  <TitledChkBoxList step={step} selectedSpec={_selectedSpec} setSelectedSpec={setSelectedSpec} />
                  <BtnWrapper>
                    <MainBtn onClick={() => { setStep('') }}>이전</MainBtn>
                    <MainBtn onClick={handleCurSaveOnClick}>현재 특성 저장</MainBtn>
                    <MainBtn onClick={handleInitOnClick}>선택 초기화</MainBtn>
                    <MainBtn onClick={() => { setStep("second") }}>다음</MainBtn>
                  </BtnWrapper></>} />
              {/* 2단계 */}
              <AnimOpacity isVisible={step === "second"} content={
                <><p>2/3단계: 학생의 공동체 역량에 해당되는 것에 체크해주세요.</p>
                  <TitledChkBoxList step={step} selectedSpec={_selectedSpec} setSelectedSpec={setSelectedSpec} />
                  <BtnWrapper>
                    <MainBtn onClick={() => { setStep("first") }}>이전</MainBtn>
                    <MainBtn onClick={handleCurSaveOnClick}>현재 특성 저장</MainBtn>
                    <MainBtn onClick={handleInitOnClick}>선택 초기화</MainBtn>
                    <MainBtn onClick={() => { setStep("third") }}>다음</MainBtn>
                  </BtnWrapper></>} />
              {/* 3단계 */}
              <AnimOpacity isVisible={step === "third"} content={<>
                <p>3/3단계: 학생의 진로 역량에 해당되는 것에 체크해주세요.</p>
                <TitledChkBoxList step={step} selectedSpec={_selectedSpec} setSelectedSpec={setSelectedSpec} />
                <Row style={{ gap: "10px", margin: "10px auto" }}>
                  <SmallTitle title={"희망 진로"} />
                  <input type="text" value={desiredMajor} onChange={(event) => { setDesiredMajor(event.target.value) }} style={{ borderRadius: "5px", height: "28px", flexGrow: "1" }} disabled={isFreeze} />
                  {!isFreeze && <button
                    disabled={isFreeze}
                    onClick={() => {
                      if (desiredMajor) {
                        setIsFreeze(true);
                        setSelectedSpec((prev) => { return { ...prev, "희망진로": [desiredMajor] } })
                      } else {
                        window.alert("희망 진로를 작성해 주세요.")
                      }
                    }}>저장</button>}
                  {isFreeze && <button onClick={() => { setIsFreeze(false); }}>수정</button>}
                </Row>
                <BtnWrapper>
                  <MainBtn onClick={() => { setStep("second") }}>이전</MainBtn>
                  <MainBtn onClick={handleCurSaveOnClick}>현재 특성 저장</MainBtn>
                  <MainBtn onClick={handleInitOnClick}>선택 초기화</MainBtn>
                  <MainBtn onClick={handleLastNextOnClick}>다음</MainBtn>
                </BtnWrapper>
              </>} />
              {/* 최종 생성단계 */}
              <AnimOpacity isVisible={step === "last"} content={<>
                <HeadTitle>선택된 특성</HeadTitle>
                {!_selectedSpec && <HeadTitle>반영 완료</HeadTitle>}
                {/* 중요 */}
                {_selectedSpec && <SelectedSpecWrapper>
                  {Object.entries(_selectedSpec).map((selected) => {
                    if (selected[1].length > 0) {
                      let title = selected[0]
                      let spec = selected[1]
                      return <StyledSpec key={title}>
                        <SmallTitle title={title} />
                        <span>{spec.join(', ')}</span>
                      </StyledSpec>
                    }
                    return null
                  })}
                </SelectedSpecWrapper>}
                <Row $marginTop="20px" $marginBottom="20px"><img src={arrows_icon} alt="아래 화살표" /></Row>
                <HeadTitle>GPT 생성 의견</HeadTitle>
                {gptTempRes === null && <EmptyResult comment="gpt 생성 결과가 없습니다." styles={{ border: "1px solid rgba(120,120,120,0.5);", maxWidth: "100%" }} />}
                {gptTempRes === "loading" && <Row><Spinner /></Row>}
                <AnimMaxHightOpacity isVisible={gptTempRes === "complete"} content={<StyledTextarea value={gptTempAnswer} disabled />} />
                <ByteWrapper>
                  <SmallBtn btnName="반영" btnOnClick={handleJoinBtnOnClick} />
                  <ByteCalculator str={gptTempAnswer} styles={{ width: "70px" }} />
                </ByteWrapper>
                <Row $marginTop="20px" $marginBottom="15px"><img src={arrows_icon} alt="아래 화살표" /></Row>
                <HeadTitle>최종 행동특성 및 종합 의견</HeadTitle>
                <StyledTextarea value={_behaviorOpinion} onChange={(event) => { setBehaviorOpinion(event.target.value) }} />
                <ByteCalculator str={_behaviorOpinion} styles={{ width: "70px" }} />
                <BtnWrapper>
                  <MainBtn onClick={() => { setStep("third") }}>이전 단계로</MainBtn>
                  <MainBtn onClick={handleGptOnClick}>gpt 생성</MainBtn>
                  <MainBtn onClick={handleSaveBehaveOpinOnClick}>행발 저장</MainBtn>
                </BtnWrapper>
              </>} />
            </StyledGrayPannel>
          </StyledBackgroundPannel>
        </AnimRotation>
        {(user.isTeacher && step === '' && !isModifying) && <ArrowWrapper>
          {nthStudent !== allStudentList.length - 1 && <ArrowBtn deg={315} onClick={() => { handleMoveOnClick("next") }} />}
          {nthStudent === allStudentList.length - 1 && <ArrowBtn deg={315} onClick={() => { }} styles={{ borderColor: "#ddd" }} />}
        </ArrowWrapper>}
      </Row>
      {step === '' && <BtnWrapper>
        {!isModifying && <>
          <TransparentBtn onClick={() => { setIsModifying(!isModifying) }} styles={{ width: "200px" }}>수정</TransparentBtn>
          <TransparentBtn onClick={handleDelBtnOnClick} styles={{ width: "200px" }}>삭제</TransparentBtn></>}
        {isModifying && <>
          <TransparentBtn onClick={handleSaveOnClick} styles={{ width: "200px" }}>저장</TransparentBtn>
          <TransparentBtn onClick={handleCancelOnClick} styles={{ width: "200px" }}>취소</TransparentBtn></>}
      </BtnWrapper>}
    </Container ></>
  )
}

const Container = styled.div`
  box-sizing: border-box;
  width: 85%;
  margin: 0 auto;
  margin-bottom: 50px;
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
  @media screen and (max-width: 767px){
  }
`
const Row = styled.div`
  display: flex;
  justify-content: center;
`
const StyledAcc = styled.div`
  width: 100%;
  margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 5px;
`
const BtnWrapper = styled(Row)`
  margin-top: 20px;
  justify-content: space-between;
  padding: 12px 34px;
  
`
const TabWrapper = styled.div`
  position: relative;
  top: -48px;
  left: -15px;
`
const ArrowWrapper = styled(Row)`
  align-items: center;
`
const StyledBackgroundPannel = styled.div`
  position: relative;
  padding: 15px;
  margin: 0 auto;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: royalBlue;
  border-radius: 20px;
  border-top-left-radius: 0;
  perspective: 1000px; /* 3D 효과를 위한 원근법 */
  @media screen and (max-width: 767px){
    margin-top: 0;
    border: none;
    border-radius: 0;
  }
`
const StyledGrayPannel = styled.div`
  position: relative;
  width: 100%;
  padding: 15px;
  background-color: #efefef;
  border-radius: 15px;
  @media screen and (max-width: 767px){
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }
`
const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
const HeadTitle = styled.h5`
  margin: 10px;
  text-align: center;
  font-weight: bold;
`
const SelectedSpecWrapper = styled.div`
  margin: 10px 0;
  padding: 5px;
  border: 1px solid rgba(120, 120, 120, 0.5);
  border-radius: 5px;
`
const StyledSpec = styled.div`
  display: flex;
  padding: 2px;
  justify-content: space-between;
  span { width: 74%; }
`
const StyledTextarea = styled.textarea`
  width: 100%;
  height: ${({ $height }) => $height ? $height : "160px"};
  border-radius: 5px;
`
const ByteWrapper = styled(Row)`
  justify-content: flex-end;
`
export default HomeStudentDetailPage