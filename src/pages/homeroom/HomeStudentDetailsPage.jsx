//라이브러리
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select';
import { Spinner } from 'react-bootstrap';
//페이지
import TitledChkBoxList from './TitledChkBoxList'
//컴포넌트
import MainBtn from '../../components/Btn/MainBtn'
import SmallBtn from '../../components/Btn/SmallBtn'
import ArrowBtn from '../../components/Btn/ArrowBtn'
import SmallTitle from '../../components/Title/SmallTitle'
import PetImg from '../../components/PetImg'
import EmptyResult from '../../components/EmptyResult';
import ByteCalculator from '../../components/Etc/ByteCalculator';
//hooks
import useChatGpt from '../../hooks/useChatGpt'
import useClassAuth from '../../hooks/useClassAuth';
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData'
//전역변수
import { setEditHomeroomStudent } from '../../store/allStudentsSlice'
//css
import styled from 'styled-components'
import AnimOpacity from '../../anim/AnimOpacity'
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity';
//이미지
import arrows_icon from '../../image/icon/arrows_icon.png';
import AnimRotation from '../../anim/AnimRotation';
import TransparentBtn from '../../components/Btn/TransparentBtn';
import UpperTab from '../../components/UpperTab';
import SubNav from '../../components/Bar/SubNav';
import useFetchRtPetDoc from '../../hooks/RealTimeData/useFetchRtPetData';

//2024.10.16 생성-> 회전효과 추가(24.12.01) -> 정보 통신 일원화(25.01.04)
const HomeStudentDetailPage = () => {
  //----1.변수부--------------------------------
  //유저 인증
  const { log } = useClassAuth();
  if (log) { window.alert(log) }
  //준비
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const { id, studentId } = useParams(); //클래스id, 학생 id
  //전역 변수(Frozen)
  const user = useSelector(({ user }) => user);
  const allStudentList = useSelector(({ allStudents }) => allStudents);
  //개별 학생 정보
  const { pet } = useFetchRtPetDoc(id, studentId) //실시간
  const { studentNumber, writtenName, behaviorOpinion, selfAccRecord, careerAccRecord, selectedSpec } = pet || {}
  //정보 랜더링
  useEffect(() => {
    let selected = selectedSpec || ''
    if (selected) { setDesiredMajor(selectedSpec["희망진로"]?.[0] ?? '') }
    setSelectedSpec(selected)
    setSelfAccRecord(selfAccRecord || '')
    setBehaviorOpinion(behaviorOpinion || '')
    setCareerAccRecord(careerAccRecord || '')
    if (tab === 1) { setRecord(behaviorOpinion || '') } else if (tab === 2) { setRecord(selfAccRecord || '') } else { setRecord(careerAccRecord || '') }
    setNthStudent(allStudentList.findIndex(({ id }) => { return id === studentId }))      //전체 학생에서 몇 번째 index
    setIsVisible(true)
    setStep('')
  }, [pet])
  const [step, setStep] = useState('') //행발 작성 단계 
  const [desiredMajor, setDesiredMajor] = useState('')
  //gpt
  const { askBehavioralOp, gptAnswer, gptBytes, gptRes } = useChatGpt() //gpt
  useEffect(() => {
    setGptTempRes(gptRes)
    setGptTempAnswer(gptAnswer)
  }, [gptAnswer, gptRes, gptBytes]);
  const [gptTempAnswer, setGptTempAnswer] = useState('')
  const [gptTempRes, setGptTempRes] = useState(null)
  //나타나는 정보
  const [_selectedSpec, setSelectedSpec] = useState(''); //선택된 spec { spec1: [], spec2: [], spec3:[]..}
  const [prevBehavOpin, setPrevBehavOpin] = useState(''); //수정 클릭시 원본 저장 변수
  const [record, setRecord] = useState('');
  //★★ 행발, 자율, 진로 ★★
  const [tab, setTab] = useState(1);
  const [_behaviorOpinion, setBehaviorOpinion] = useState('');
  const [_selfAccRecord, setSelfAccRecord] = useState('');
  const [_careerAccRecord, setCareerAccRecord] = useState('');
  useEffect(() => {
    setRecord(handleRecord());
  }, [tab])
  const [isFreeze, setIsFreeze] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  useEffect(() => { if (isEditable === true) setPrevBehavOpin(record) }, [isEditable]);
  //저장
  const { updateStudent, deleteStudent } = useAddUpdFireData("classRooms"); //매개변수 없으면 에러나서 억지로 넣은거임..
  //학생 이동
  const [nthStudent, setNthStudent] = useState(null);
  let expAndLevel = { exp: 0, level: 0 };
  //에니메이션
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  //----2.함수부--------------------------------
  //학생 이동 버튼 클릭(24.12.1)
  const handleMoveOnClick = (direction) => {
    let student
    if (direction === "next") { student = allStudentList[nthStudent + 1]; }
    else { student = allStudentList[nthStudent - 1]; }
    moveStudent(student)
  }
  //학생 이동
  const moveStudent = (student) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/homeroom/${id}/${student.id}`, { state: student })
      setIsAnimating(false);
    }, 500); // 애니메이션 시간과 동일하게 설정
  }
  //탭 클릭
  const handleTabOnClick = (number) => {
    setStep('')
    setTab(number)
  }
  //tab에 따라 다른 기록 반환
  const handleRecord = () => {
    if (tab === 1) {
      return _behaviorOpinion
    } else if (tab === 2) {
      return _selfAccRecord
    } else if (tab === 3) {
      return _careerAccRecord
    }
  }
  //목록 이동
  const handleBackOnClick = () => {
    navigate(`/homeroom/${id}/`)
  }
  //textarea 변경
  const handleTextAreaOnChange = (event) => {
    setRecord(event.target.value)
  }
  //gpt 생성 버튼 클릭
  const handleGptOnClick = () => {
    let check = _selectedSpec !== ''
    if (check) { askBehavioralOp(_selectedSpec) }
    else { window.alert("체크된 특성이 없습니다.") }
  }
  //행발 db에 저장
  const handleSaveOnClick = () => {
    let check = record !== ''
    if (check) {
      if (window.confirm("행동의견을 저장하시겠습니까?")) {
        updateStudent({ behaviorOpinion: record }, id, studentId)
        dispatch(setEditHomeroomStudent({ id: studentId, behaviorOpinion: record, selectedSpec: _selectedSpec })) //현재 학생 정보 전역 변수에 저장
        setIsEditable(false)
        setStep('')
        window.alert("저장되었습니다.")
      }
    } else { window.alert("행동의견이 없습니다.") }
  }
  //작성 취소
  const handleCancelOnClick = () => {
    setIsEditable(false)
    setRecord(prevBehavOpin)
  }
  //현재 특성 db 저장
  const handleCurSaveOnClick = () => {
    let check = _selectedSpec !== ''
    if (check) {
      if (window.confirm("현재 상태를 저장하시겠습니까?")) {
        updateStudent({ selectedSpec: _selectedSpec }, id, studentId)                                             //서버에 저장
        dispatch(setEditHomeroomStudent({ id: studentId, behaviorOpinion: record, selectedSpec: _selectedSpec })) //현재 학생 정보 전역 변수에 저장
        window.alert("저장되었습니다.")
      }
    } else { window.alert("체크된 특성이 없습니다.") }
  }
  //gpt결과 행발에 반영
  const handleJoinBtnOnClick = () => {
    let check = gptTempAnswer !== ''
    if (check) {
      setSelectedSpec('')
      setGptTempAnswer('')
      setGptTempRes(null)
      setRecord((prev) => { return prev + ' ' + gptTempAnswer })
      setDesiredMajor('')
    } else { window.alert("gpt 생성 결과가 없습니다.") }
  }
  //선택 초기화
  const handleInitBtnOnClick = () => {
    setSelectedSpec('')
    setDesiredMajor('')
  }
  const handleDelBtnOnClick = () => {
    if (window.confirm('학생을 삭제하시겠습니까? 삭제한 학생은 복구할 수 없습니다.')) {
      deleteStudent(id, studentId) //데이터 통신
      navigate(-1)
    }
  }

  return (<>
    <SubNav styles={{ padding: "10px" }}>
      <Select placeholder="학생 바로 이동"
        options={allStudentList.map((student) => { return { label: `${student.studentNumber} ${student.writtenName || '미등록'}`, value: student.id, key: student.id } })}
        onChange={(event) => { moveStudent(allStudentList.find((student) => student.id === event.value)) }}
      />
    </SubNav>
    {/* 컨테이너 */}
    <Container $isVisible={isVisible}>
      <CenterWrapper><ArrowBtn deg={225} onClick={handleBackOnClick} /></CenterWrapper>
      <FlexWrapper>
        {(user.isTeacher && nthStudent !== 0 && (step === ''))
          && <ArrowWrapper><ArrowBtn deg={135} onClick={() => { handleMoveOnClick("prev") }} /></ArrowWrapper>}
        <AnimRotation isAnimating={isAnimating}>
          <StyledBackgroundPannel>
            <TabWrapper>
              <UpperTab className="tab1" value={tab} onClick={() => { handleTabOnClick(1) }}>행동특성</UpperTab>
              <UpperTab className="tab2" value={tab} left="94px" onClick={() => { handleTabOnClick(2) }}>자율</UpperTab>
              <UpperTab className="tab3" value={tab} left="156px" onClick={() => { handleTabOnClick(3) }}>진로</UpperTab>
            </TabWrapper>
            <StyledGrayPannel>
              <FlexWrapper>
                <ImgWrapper>
                  <PetImg level={expAndLevel.level} onClick={() => { }} />
                  <p>레벨: {expAndLevel.level}</p>
                </ImgWrapper>
                <InfoWrapper>
                  <p>학번: {studentNumber}</p>
                  <p>이름: {writtenName || '미등록'}</p>
                  <p>직업: 미정</p>
                </InfoWrapper>
              </FlexWrapper>
            </StyledGrayPannel>
            <StyledGrayPannel>
              {/* 개요 */}
              {(step === '') && <IntroWrapper>
                {tab === 1 && <p>행동 특성 종합 의견</p>}
                {tab === 2 && <p>자율 활동 특이사항</p>}
                {tab === 3 && <p>진로 활동 특이사항</p>}
                <StyledTextarea
                  value={record}
                  onChange={handleTextAreaOnChange}
                  placeholder='내용이 없습니다.'
                  disabled={!isEditable} />
                <ByteWrapper>
                  <FlexWrapper $marginTop="0">
                    {isEditable && <SmallBtn btnName="저장" btnOnClick={handleSaveOnClick} />}
                    {isEditable && <SmallBtn btnName="취소" btnOnClick={handleCancelOnClick} />}
                    {!isEditable && <SmallBtn btnName="작성" btnOnClick={() => { setIsEditable(!isEditable) }} />}
                  </FlexWrapper>
                  <ByteCalculator str={record} styles={{ width: "70px" }} />
                </ByteWrapper>
                {tab === 1 && <MainBtn btnName="행동종합 의견 작성 도우미" btnOnClick={() => { setStep("first") }}></MainBtn>}
              </IntroWrapper>}
              {/* 1단계 */}
              <AnimOpacity isVisible={step === "first"} content={
                <><p>1/3단계: 학생의 학업역량에 해당되는 것에 체크해주세요.</p>
                  <TitledChkBoxList step={step} selectedSpec={_selectedSpec} setSelectedSpec={setSelectedSpec} />
                  <FlexWrapper>
                    <MainBtn btnName="이전" btnOnClick={() => { setStep('') }}></MainBtn>
                    <MainBtn btnName="현재 특성 저장" btnOnClick={() => { handleCurSaveOnClick() }}></MainBtn>
                    <MainBtn btnName="선택 초기화" btnOnClick={handleInitBtnOnClick}></MainBtn>
                    <MainBtn btnName="다음" btnOnClick={() => { setStep("second") }}></MainBtn>
                  </FlexWrapper></>} />
              {/* 2단계 */}
              <AnimOpacity isVisible={step === "second"} content={
                <><p>2/3단계: 학생의 공동체 역량에 해당되는 것에 체크해주세요.</p>
                  <TitledChkBoxList step={step} selectedSpec={_selectedSpec} setSelectedSpec={setSelectedSpec} />
                  <FlexWrapper>
                    <MainBtn btnName="이전" btnOnClick={() => { setStep("first") }}></MainBtn>
                    <MainBtn btnName="현재 특성 저장" btnOnClick={() => { handleCurSaveOnClick() }}></MainBtn>
                    <MainBtn btnName="선택 초기화" btnOnClick={handleInitBtnOnClick}></MainBtn>
                    <MainBtn btnName="다음" btnOnClick={() => { setStep("third") }}></MainBtn>
                  </FlexWrapper></>} />
              {/* 3단계 */}
              <AnimOpacity isVisible={step === "third"} content={<>
                <p>3/3단계: 학생의 진로 역량에 해당되는 것에 체크해주세요.</p>
                <TitledChkBoxList step={step} selectedSpec={_selectedSpec} setSelectedSpec={setSelectedSpec} />
                <FlexWrapper>
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
                  {isFreeze && <button
                    onClick={() => { setIsFreeze(false); }}>수정</button>}
                </FlexWrapper>
                <FlexWrapper>
                  <MainBtn btnName="이전" btnOnClick={() => { setStep("second") }}></MainBtn>
                  <MainBtn btnName="현재 특성 저장" btnOnClick={() => { handleCurSaveOnClick() }}></MainBtn>
                  <MainBtn btnName="선택 초기화" btnOnClick={handleInitBtnOnClick}></MainBtn>
                  <MainBtn
                    btnName="다음"
                    btnOnClick={() => {
                      let check = Object.values(_selectedSpec)?.filter((arrItem) => { return arrItem.length > 0 }).length > 0
                      if (check) { setStep("last") } else {
                        window.alert("특성이 하나도 선택되지 않았습니다.")
                      }
                    }}></MainBtn>
                </FlexWrapper>
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
                <FlexWrapper $marginTop="20px" $marginBottom="20px"><img src={arrows_icon} alt="아래 화살표" /></FlexWrapper>
                <HeadTitle>GPT 생성 의견</HeadTitle>
                {gptTempRes === null && <EmptyResult comment="gpt 생성 결과가 없습니다." styles={{ border: "1px solid #949192;", maxWidth: "100%" }} />}
                {gptTempRes === "loading" && <FlexWrapper><Spinner /></FlexWrapper>}
                <AnimMaxHightOpacity isVisible={gptTempRes === "complete"} content={<StyledTextarea value={gptTempAnswer} disabled />} />
                <ByteWrapper>
                  <SmallBtn btnName="반영" btnOnClick={handleJoinBtnOnClick} />
                  <ByteCalculator str={gptTempAnswer} styles={{ width: "70px" }} />
                </ByteWrapper>
                <FlexWrapper $marginTop="20px" $marginBottom="15px"><img src={arrows_icon} alt="아래 화살표" /></FlexWrapper>
                <HeadTitle>최종 행동특성 및 종합 의견</HeadTitle>
                <StyledTextarea value={record} onChange={handleTextAreaOnChange} />
                <ByteCalculator str={record} styles={{ width: "70px" }} />
                <FlexWrapper>
                  <MainBtn btnName="이전 단계로" btnOnClick={() => { setStep("third") }}></MainBtn>
                  <MainBtn btnName="gpt 생성하기" btnOnClick={handleGptOnClick}></MainBtn>
                  <MainBtn btnName="행발 저장하기" btnOnClick={handleSaveOnClick}></MainBtn>
                </FlexWrapper>
              </>} />
            </StyledGrayPannel>
          </StyledBackgroundPannel>
        </AnimRotation>
        {(user.isTeacher && nthStudent !== allStudentList.length - 1 && (step === ''))
          && <ArrowWrapper><ArrowBtn deg={315} onClick={() => { handleMoveOnClick("next") }} /></ArrowWrapper>}
      </FlexWrapper>
      <FlexWrapper><TransparentBtn id="delete_btn" btnOnClick={handleDelBtnOnClick} btnName="삭제" />
      </FlexWrapper>
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
const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
`
const FlexWrapper = styled.div`
  position: relative;
  margin-top: ${(props) => props.$marginTop || "30px"};
  margin-bottom: ${(props) => props.$marginBottom || "0"};
  display: flex;
  gap: 10px;
  justify-content: center;
`
const TabWrapper = styled.div`
  position: relative;
  top: -48px;
  left: -15px;
`
const ArrowWrapper = styled.div`
  display: flex;
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
const ImgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  img {
    display: inline-block;
    width: 120px;
    height: 120px;
    padding: 7px;
    border: 1px solid black;
    border-radius: 60px;
    background-color: white;
  }
  p { margin: 0;}
`
const InfoWrapper = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  p {
    display: flex;
    align-items: center;
  }
`
const HeadTitle = styled.h5`
  margin: 10px;
  text-align: center;
  font-weight: bold;
`
const SelectedSpecWrapper = styled.div`
  padding: 5px;
  border: 1px solid gray;
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
const ByteWrapper = styled.div`
  button { margin: 0; }
  display: flex;
  justify-content: space-between;
`
export default HomeStudentDetailPage