//라이브러리
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
//섹션
import BehaviorChkBox from './BehaviorChkBox';
//컴포넌트
import EmptyResult from '../../components/EmptyResult';
import ByteCalculator from '../../components/Etc/ByteCalculator';
import LongW100Btn from '../../components/Btn/LongW100Btn';
import MidBtn from '../../components/Btn/MidBtn';
import DotTitle from '../../components/Title/DotTitle';
import SmallTitle from '../../components/Title/SmallTitle';
import ChargeRiraModal from '../../components/Modal/ChargeRiraModal';
import GptIngModal from '../../components/Modal/gptModal/GptIngModal';
import ImgModal from '../../components/Modal/ImgModal';
//hooks
import useChatGpt from '../../hooks/useChatGpt';
import useFirePetData from '../../hooks/Firebase/useFirePetData';
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
//css
import AnimOpacity from '../../anim/AnimOpacity';
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity';
//이미지
import arrows_icon from '../../image/icon/arrows_icon.png';
//상수
import { GUIDE_IMG_PATH } from '../../constants/path'
//생성(241016)-> 회전효과 추가(241201)-> 통신 일원화(250104)-> legacy(250223) -> 기능 축소 분화(261221)
const BehaviorOpinionSection = ({ behaviorRec, setBehaviorRec, isModifying, setIsBehavioring }) => {
  //준비
  const { id: klassId } = useParams(); //클래스id, 학생 id
  const location = useLocation();
  const { petId: studentId } = location.state;
  //실시간 학생
  useEffect(() => { petDataListener(klassId, studentId); }, [studentId, klassId])
  //gpt
  const { askBehavioralOp, gptAnswer, gptStatus, gptRes, gptProgress } = useChatGpt();
  useEffect(() => { setGptTempAnswer(gptAnswer); setLoadingMsg(gptStatus); }, [gptAnswer, gptStatus]);
  useEffect(() => setIsLoading(gptRes === "loading"), [gptRes]);
  const [gptTempAnswer, setGptTempAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  //행발 작성 단계 
  const [step, setStep] = useState(0);
  const titleByStep = ["행동 특성 종합 의견", "1/3단계: 학업 선택", "2/3단계: 공동체 특성 선택", "3/3 단계: 진로 특성 선택", "생성 전 확인"];
  //★★ 행발★★
  const [_selectedSpec, setSelectedSpec] = useState('');        //선택된 spec { spec1: [], spec2: [], spec3:[]..}
  const [desiredMajor, setDesiredMajor] = useState('');
  //편집
  const [isFreeze, setIsFreeze] = useState(false);
  //저장
  const { petRtData, petDataListener, updatePetInfo } = useFirePetData();
  useEffect(() => bindInitData(petRtData), [petRtData]);
  //이미지
  const { imgList, fetchImgUrlList } = useFetchStorageImg();
  useEffect(() => { fetchImgUrlList(Object.values(GUIDE_IMG_PATH)); }, []);
  const [selectedIdx, setSelectedIdx] = useState(0);
  //모달
  const [isImgModal, setIsImgModal] = useState(false);
  const [isRiraModal, setIsRiraModal] = useState(false);
  //------함수부------------------------------------------------
  const bindInitData = (data) => {
    if (!data) return;
    const { selectedSpec } = data || {};
    const selected = selectedSpec || '';
    if (selected) { setDesiredMajor(selectedSpec["희망진로"]?.[0] ?? '') };
    setSelectedSpec(selected);
    setStep(0);
  }
  //gpt 생성 버튼 클릭
  const handleGptOnClick = () => {
    const check = _selectedSpec !== '';
    if (!check) { alert("선택된 특성이 없습니다."); return; }
    setIsRiraModal(true);
  }
  //행발 저장
  const handleSaveBehaveOpinOnClick = async () => {
    if (!behaviorRec) { alert("행동의견이 없습니다."); return; }
    if (!window.confirm("행동의견을 저장하시겠습니까?")) return;
    try {
      await updatePetInfo(klassId, studentId, { behaviorOpinion: behaviorRec })
      alert("저장되었습니다.");
    } catch (error) { alert(`오류가 발생했습니다. source: useFirePetData_03 ${error}`); }
    setStep(0);
    setIsBehavioring(false);
  }
  //현재 특성 db 저장
  const handleCurSaveOnClick = async () => {
    const check = _selectedSpec !== ''
    if (!check) { alert("체크된 특성이 없습니다."); return; }
    if (!window.confirm("현재 상태를 저장하시겠습니까?")) return;
    try {
      await updatePetInfo(klassId, studentId, { selectedSpec: _selectedSpec });
      alert("저장되었습니다.");
    } catch (error) { alert(`오류가 발생했습니다. source: useFirePetData_03 ${error}`); }
  }
  //희망
  const handleCareerSaveOnClick = () => {
    if (!desiredMajor) { alert("희망 진로를 작성해 주세요."); return; }
    setIsFreeze(true);
    setSelectedSpec((prev) => ({ ...prev, "희망진로": [desiredMajor] }));
  }
  //gpt결과 행발에 반영
  const handleJoinBtnOnClick = () => {
    let check = gptTempAnswer !== ''
    if (!check) { alert("gpt 생성 결과가 없습니다."); return; }
    setSelectedSpec('');
    setGptTempAnswer('');
    setBehaviorRec((prev) => prev + ' ' + gptTempAnswer);
    setDesiredMajor('');
  }
  //선택 초기화
  const handleInitOnClick = () => {
    setSelectedSpec('');
    setDesiredMajor('');
  }
  //마지막 다음 버튼
  const handleLastNextOnClick = () => {
    const check = Object.values(_selectedSpec)?.filter((arrItem) => { return arrItem.length > 0 }).length > 0
    if (check) { setStep(4) } else { window.alert("특성이 하나도 선택되지 않았습니다.") }
  };
  return (
    <>
      <Section>
        <Header>{titleByStep[step]}</Header>
        {step === 0 && <IntroWrapper>
          <Textarea
            value={behaviorRec}
            onChange={(event) => { setBehaviorRec(event.target.value) }}
            placeholder='내용이 없습니다.'
            disabled={!isModifying}
          />
          <Row style={{ justifyContent: "flex-end" }}><ByteCalculator str={behaviorRec} styles={{ width: "70px" }} /></Row>
          <LongW100Btn onClick={() => {
            setIsBehavioring(true);
            setStep(1)
          }} disabled={isModifying}>행발 작성 도우미</LongW100Btn>
        </IntroWrapper>}
        {/* 1단계 */}
        <AnimOpacity isVisible={step === 1}>
          <StepWrapper>
            <DotTitle pointer={"pointer"} styles={{ decoration: "underline" }} onClick={() => { setIsImgModal(true); setSelectedIdx(0); }}>학업 역량이란?</DotTitle>
            <BehaviorChkBox step={step} selectedSpec={_selectedSpec} setSelectedSpec={setSelectedSpec} />
            <BtnWrapper>
              <MidBtn onClick={() => {
                setStep(0);
                setIsBehavioring(false);
              }}>이전</MidBtn>
              <MidBtn onClick={handleCurSaveOnClick}>현재 특성 저장</MidBtn>
              <MidBtn onClick={handleInitOnClick}>선택 초기화</MidBtn>
              <MidBtn onClick={() => { setStep(2) }}>다음</MidBtn>
            </BtnWrapper>
          </StepWrapper>
        </AnimOpacity>
        {/* 2단계 */}
        <AnimOpacity isVisible={step === 2} >
          <StepWrapper>
            <DotTitle pointer={"pointer"} styles={{ decoration: "underline" }} onClick={() => { setIsImgModal(true); setSelectedIdx(2); }}>공동체 역량이란?</DotTitle>
            <BehaviorChkBox step={step} selectedSpec={_selectedSpec} setSelectedSpec={setSelectedSpec} />
            <BtnWrapper>
              <MidBtn onClick={() => { setStep(1) }}>이전</MidBtn>
              <MidBtn onClick={handleCurSaveOnClick}>현재 특성 저장</MidBtn>
              <MidBtn onClick={handleInitOnClick}>선택 초기화</MidBtn>
              <MidBtn onClick={() => { setStep(3) }}>다음</MidBtn>
            </BtnWrapper>
          </StepWrapper>
        </AnimOpacity>
        {/* 3단계 */}
        <AnimOpacity isVisible={step === 3} >
          <StepWrapper>
            <DotTitle pointer={"pointer"} styles={{ decoration: "underline" }} onClick={() => { setIsImgModal(true); setSelectedIdx(1); }}>진로 역량이란?</DotTitle>
            <BehaviorChkBox step={step} selectedSpec={_selectedSpec} setSelectedSpec={setSelectedSpec} />
            <Row style={{ gap: "10px", margin: "10px auto" }}>
              <SmallTitle title={"희망 진로"} />
              <TextInput type="text"
                value={desiredMajor}
                onChange={(event) => { setDesiredMajor(event.target.value) }}
                disabled={isFreeze}
              />
              {!isFreeze && <button
                disabled={isFreeze}
                onClick={handleCareerSaveOnClick}>저장</button>}
              {isFreeze && <button onClick={() => { setIsFreeze(false); }}>수정</button>}
            </Row>
            <BtnWrapper>
              <MidBtn onClick={() => { setStep(2) }}>이전</MidBtn>
              <MidBtn onClick={handleCurSaveOnClick}>현재 특성 저장</MidBtn>
              <MidBtn onClick={handleInitOnClick}>선택 초기화</MidBtn>
              <MidBtn onClick={handleLastNextOnClick}>다음</MidBtn>
            </BtnWrapper>
          </StepWrapper>
        </AnimOpacity>
        {/* 최종 생성단계 */}
        <AnimOpacity isVisible={step === 4}>
          <StepWrapper>
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
            <Center><MidBtn onClick={handleGptOnClick}>gpt 생성</MidBtn></Center>
            <Center><img src={arrows_icon} alt="아래 화살표" /></Center>
            <HeadTitle>GPT 생성 의견</HeadTitle>
            {gptRes === null && <EmptyResult comment="gpt 생성 결과가 없습니다." styles={{ border: "1px solid #787878", maxWidth: "100%" }} />}
            <AnimMaxHightOpacity isVisible={gptRes === "complete"}>
              <Textarea value={gptTempAnswer} disabled />
            </AnimMaxHightOpacity>
            <Row style={{ justifyContent: "flex-end" }}><ByteCalculator str={gptTempAnswer} styles={{ width: "70px" }} /></Row>
            <Center><MidBtn onClick={handleJoinBtnOnClick}>반영</MidBtn></Center>
            <Center><img src={arrows_icon} alt="아래 화살표" /></Center>
            <HeadTitle>최종 행동특성 및 종합 의견</HeadTitle>
            <Textarea style={{ borderRadius: "5px" }} value={behaviorRec} onChange={(event) => { setBehaviorRec(event.target.value) }} />
            <ByteCalculator str={behaviorRec} styles={{ width: "70px" }} />
            <BtnWrapper>
              <MidBtn onClick={() => { setStep(3) }}>이전 단계로</MidBtn>
              <MidBtn onClick={handleSaveBehaveOpinOnClick}>행발 저장</MidBtn>
            </BtnWrapper>
          </StepWrapper>
        </AnimOpacity>
      </Section>
      <ImgModal
        show={isImgModal}
        onHide={() => setIsImgModal(false)}
        imgUrl={imgList[selectedIdx]}
      />
      <ChargeRiraModal
        show={isRiraModal}
        onHide={() => setIsRiraModal(false)}
        onApprove={({ model, leftRira }) => askBehavioralOp(_selectedSpec, model, leftRira)}
      />
      <GptIngModal
        show={isLoading}
        onHide={() => setIsLoading(false)}
        status={loadingMsg}
        progress={gptProgress} />
    </>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Center = styled(Row)`
  justify-content: center;
`
const Section = styled.section`
  width: 100%;
  margin: 10px auto;
  @media screen and (max-width: 767px){
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }
`
const Header = styled(Center)`
  height: 40px; 
  padding: 10px;
  background-color: #3454d1b1; 
  color: white;
  border-radius: 5px 5px 0 0;
  font-weight: bold;
`
const StepWrapper = styled(Column)`
  gap: 10px;
  padding: 5px;
  border-radius: 0 0 5px 5px;
  border: 1px solid #919294;
`
const BtnWrapper = styled(Row)`
  margin-top: 20px;
  justify-content: space-between;
  padding: 12px 34px;
`
const IntroWrapper = styled(Column)`
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
  border: 1px solid #787878;
  border-radius: 5px;
`
const StyledSpec = styled.div`
  display: flex;
  padding: 2px;
  justify-content: space-between;
  span { width: 74%; }
`
const Textarea = styled.textarea`
  width: 100%;
  height: 15dvh;
  padding: 5px;
  border-radius: 0 0 5px 5px;
`
const TextInput = styled.input`
  border-radius: 5px;
  hegiht: 4dvh;
  border-radius: 5px;
`
export default BehaviorOpinionSection