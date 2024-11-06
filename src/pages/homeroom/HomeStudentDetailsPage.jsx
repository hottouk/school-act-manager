//라이브러리
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap';
//페이지
import TitledChkBoxList from './TitledChkBoxList'
//컴포넌트
import MainBtn from '../../components/Btn/MainBtn'
import SmallBtn from '../../components/Btn/SmallBtn'
import ArrowBtn from '../../components/Btn/ArrowBtn'
import SmallTitle from '../../components/Title/SmallTitle'
import PetImg from '../../components/PetImg'
//hooks
import useChatGpt from '../../hooks/useChatGpt'
import useGetLevel from '../../hooks/useGetLevel'
import useGetByte from '../../hooks/useGetByte'
import useClassAuth from '../../hooks/useClassAuth';
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData'
import useFetchFireData from '../../hooks/Firebase/useFetchFireData'
//전역변수
import { setEditHomeroomStudent } from '../../store/allStudentsSlice'
//css
import styled from 'styled-components'
import AnimOpacity from '../../anim/AnimOpacity'
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity';
//이미지
import arrows_icon from '../../image/icon/arrows_icon.png';

//2024.10.16 생성
const HomeStudentDetail = () => {
  //----1.변수부--------------------------------
  const { log } = useClassAuth();
  if (log) { window.alert(log) }
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const { id, studentId } = useParams(); //클래스id, 학생 id
  const user = useSelector(({ user }) => { return user; })
  //시작
  useEffect(() => { //학생 한명 데이터 통신
    fetchSubDoc("classRooms", id, "students", studentId).then((data) => {
      let behavior = data.behaviorOpinion || ''
      let selected = data.selectedSpec || ''
      if (selected) { setDesiredMajor(data.selectedSpec["희망진로"]?.[0] ?? '') }
      setSelectedSpec(selected)
      setBehaviorOpinion(behavior)
      setIsVisible(true)
    })
  }, [studentId])
  const { state } = useLocation()
  const { studentNumber, type, writtenName } = state //개별 학생 정보
  useEffect(() => {
    setSelectedSpec(state.selectedSpec || '')
    setBehaviorOpinion(state.behaviorOpinion || '')
    setNthStudent(allStudentList.findIndex(({ id }) => { return id === studentId })) //전체 학생에서 몇 번째 index
    setStep('')
  }, [state])
  const [step, setStep] = useState('') //행발 작성 단계 
  const [desiredMajor, setDesiredMajor] = useState('')
  //gpt
  const { askBehavioralOp, gptAnswer, gptBytes, gptRes } = useChatGpt() //gpt
  useEffect(() => {
    setGptTempRes(gptRes)
    setGptTempByte(gptBytes)
    setGptTempAnswer(gptAnswer)
  }, [gptAnswer, gptRes, gptBytes]);
  const [gptTempAnswer, setGptTempAnswer] = useState('')
  const [gptTempByte, setGptTempByte] = useState(0)
  const [gptTempRes, setGptTempRes] = useState(null)
  //바이트
  const { getByteLengthOfString } = useGetByte();
  //★★ 행발 ★★
  const [selectedSpec, setSelectedSpec] = useState('')//선택된 spec { spec1: [], spec2: [], spec3:[]..}
  const [behaviorOpinion, setBehaviorOpinion] = useState('');
  const [isFreeze, setIsFreeze] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  //저장
  const { updateStudent } = useAddUpdFireData("classRooms"); //매개변수 없으면 에러나서 억지로 넣은거임..
  const { fetchSubDoc } = useFetchFireData();
  useEffect(() => {
    console.log(selectedSpec)
  }, [selectedSpec])
  //학생 이동
  const allStudentList = useSelector(({ allStudents }) => { return allStudents }) //전체 학생 전역 변수 받기
  const [nthStudent, setNthStudent] = useState(null);
  //능력치
  const { getAbilityScores, getExpAndLevelByActList } = useGetLevel()
  let expAndLevel = { exp: 0, level: 0 }
  let abilityScores = {}
  //에니메이션
  const [isVisible, setIsVisible] = useState(false)

  //----2.함수부--------------------------------
  //학생 이동
  const handleMoveOnClick = (direction) => {
    let student
    if (direction === "next") { student = allStudentList[nthStudent + 1]; }
    else { student = allStudentList[nthStudent - 1]; }
    navigate(`/homeroom/${id}/${student.id}`, { state: student })
  }
  //목록 이동
  const handleBackOnClick = () => {
    navigate(`/homeroom/${id}/`)
  }
  //textarea 변경
  const handleTextAreaOnChange = (event) => {
    setBehaviorOpinion(event.target.value)
  }
  //학생 db 저장
  const handleSaveOnClick = () => {
    let check = behaviorOpinion !== ''
    if (check) {
      if (window.confirm("행동의견을 저장하시겠습니까?")) {
        updateStudent({ behaviorOpinion }, id, studentId)
        dispatch(setEditHomeroomStudent({ id: studentId, behaviorOpinion, selectedSpec })) //현재 학생 정보 전역 변수에 저장
        setIsEditable(false)
        window.alert("저장되었습니다.")
      }
    } else { window.alert("행동의견이 없습니다.") }
  }
  //현재 특성 db 저장
  const handleCurSaveOnClick = () => {
    let check = selectedSpec !== ''
    if (check) {
      if (window.confirm("현재 상태를 저장하시겠습니까?")) {
        updateStudent({ selectedSpec }, id, studentId)                                     //서버에 저장
        dispatch(setEditHomeroomStudent({ id: studentId, behaviorOpinion, selectedSpec })) //현재 학생 정보 전역 변수에 저장
        window.alert("저장되었습니다.")
      }
    } else { window.alert("체크된 특성이 없습니다.") }
  }
  //gpt결과 행발에 반영
  const handleJoinBtnOnClick = () => {
    selectedSpec('')
    setGptTempAnswer('')
    setGptTempByte(0)
    setGptTempRes(null)
    setBehaviorOpinion((prev) => { return prev + ' ' + gptTempAnswer })
  }

  return (
    <Container $isVisible={isVisible}>
      <FlexWrapper>
        <ArrowBtn deg={225} onClick={handleBackOnClick} />
      </FlexWrapper>
      <FlexWrapper>
        {(user.isTeacher && nthStudent !== 0)
          && <ArrowWrapper><ArrowBtn deg={135} onClick={() => { handleMoveOnClick("prev") }} /></ArrowWrapper>}
        <StyledStudentPannel>
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
              <InfoWrapper>
                <p>행동특성 종합: 작성중</p>
              </InfoWrapper>
            </FlexWrapper>
          </StyledGrayPannel>
          <StyledGrayPannel>
            {/* 개요 */}
            {(step === '') && <IntroWrapper>
              <p>행동 특성 종합 의견</p>
              <StyledTextarea
                value={behaviorOpinion}
                onChange={handleTextAreaOnChange}
                placeholder='내용이 없습니다. 직접 작성하거나 도우미를 이용하세요'
                disabled={!isEditable} />
              <ByteWrapper>
                <FlexWrapper $marginTop="0">
                  {isEditable && <SmallBtn btnName="저장" btnOnClick={handleSaveOnClick} />}
                  <SmallBtn btnName={isEditable ? "취소" : "작성"} btnOnClick={() => { setIsEditable(!isEditable) }} />
                </FlexWrapper>
                <p>{getByteLengthOfString(behaviorOpinion)} Byte</p>
              </ByteWrapper>
              <MainBtn btnName="행동종합 의견 작성 도우미" btnOnClick={() => { setStep("first") }}></MainBtn>
            </IntroWrapper>}
            {/* 1단계 */}
            <AnimOpacity isVisible={step === "first"} content={
              <><p>1/3단계: 학생의 학업역량에 해당되는 것에 체크해주세요.</p>
                <TitledChkBoxList step={step} selectedSpec={selectedSpec} setSelectedSpec={setSelectedSpec} />
                <FlexWrapper>
                  <MainBtn btnName="이전" btnOnClick={() => { setStep('') }}></MainBtn>
                  <MainBtn btnName="현재 특성 저장" btnOnClick={() => { handleCurSaveOnClick() }}></MainBtn>
                  <MainBtn btnName="선택 초기화" btnOnClick={() => { }}></MainBtn>
                  <MainBtn btnName="다음" btnOnClick={() => { setStep("second") }}></MainBtn>
                </FlexWrapper></>} />
            {/* 2단계 */}
            <AnimOpacity isVisible={step === "second"} content={
              <><p>2/3단계: 학생의 공동체 역량에 해당되는 것에 체크해주세요.</p>
                <TitledChkBoxList step={step} selectedSpec={selectedSpec} setSelectedSpec={setSelectedSpec} />
                <FlexWrapper>
                  <MainBtn btnName="이전" btnOnClick={() => { setStep("first") }}></MainBtn>
                  <MainBtn btnName="현재 특성 저장" btnOnClick={() => { handleCurSaveOnClick() }}></MainBtn>
                  <MainBtn btnName="선택 초기화" btnOnClick={() => { }}></MainBtn>
                  <MainBtn btnName="다음" btnOnClick={() => { setStep("third") }}></MainBtn>
                </FlexWrapper></>} />
            {/* 3단계 */}
            <AnimOpacity isVisible={step === "third"} content={<>
              <p>3/3단계: 학생의 진로 역량에 해당되는 것에 체크해주세요.</p>
              <TitledChkBoxList step={step} selectedSpec={selectedSpec} setSelectedSpec={setSelectedSpec} />
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
                <MainBtn btnName="선택 초기화" btnOnClick={() => { }}></MainBtn>
                <MainBtn
                  btnName="다음"
                  btnOnClick={() => {
                    let check = Object.values(selectedSpec)?.filter((arrItem) => { return arrItem.length > 0 }).length > 0
                    if (check) { setStep("last") } else {
                      window.alert("특성이 하나도 선택되지 않았습니다.")
                    }
                  }}></MainBtn>
              </FlexWrapper>
            </>} />
            {/* 생성단계 */}
            <AnimOpacity isVisible={step === "last"} content={<>
              <p>이 특성을 가지고 행동특성 및 종합 의견을 작성합니다.</p>
              {/* 중요 */}
              <Wrapper>
                {Object.entries(selectedSpec).map((selected) => {
                  if (selected[1].length > 0) {
                    let title = selected[0]
                    let spec = selected[1]
                    return <StyledBox key={title}>
                      <SmallTitle title={title} />
                      <span>{spec.join(', ')}</span>
                    </StyledBox>
                  }
                  return null
                })}
              </Wrapper>
              <FlexWrapper $marginTop="20px" $marginBottom="20px"><img src={arrows_icon} alt="아래 화살표" /></FlexWrapper>
              <HeadTitle>GPT 생성 의견</HeadTitle>
              {gptTempRes === null && <StyledTextarea value={''} disabled $height={"50px"} />}
              {gptTempRes === "loading" && <FlexWrapper><Spinner /></FlexWrapper>}
              <AnimMaxHightOpacity isVisible={gptTempRes === "complete"} content={<StyledTextarea value={gptTempAnswer} disabled />} />
              <ByteWrapper>
                <SmallBtn btnName="반영" btnOnClick={handleJoinBtnOnClick} />
                <p>{gptTempByte} Byte</p>
              </ByteWrapper>
              <FlexWrapper $marginTop="20px" $marginBottom="15px"><img src={arrows_icon} alt="아래 화살표" /></FlexWrapper>
              <HeadTitle>최종 행동특성 및 종합 의견</HeadTitle>
              <StyledTextarea value={behaviorOpinion} onChange={handleTextAreaOnChange} />
              <FlexEndWrapper><p>{getByteLengthOfString(behaviorOpinion)} Byte</p></FlexEndWrapper>
              <FlexWrapper>
                <MainBtn btnName="이전 단계로" btnOnClick={() => { setStep("third") }}></MainBtn>
                <MainBtn btnName="gpt 생성하기" btnOnClick={() => { askBehavioralOp(selectedSpec) }}></MainBtn>
                <MainBtn btnName="행발 저장하기" btnOnClick={handleSaveOnClick}></MainBtn>
              </FlexWrapper>
            </>} />
          </StyledGrayPannel>
        </StyledStudentPannel>
        {(user.isTeacher && nthStudent !== allStudentList.length - 1)
          && <ArrowWrapper><ArrowBtn deg={315} onClick={() => { handleMoveOnClick("next") }} /></ArrowWrapper>}
      </FlexWrapper>
    </Container >
  )
}
const Container = styled.div`
  box-sizing: border-box;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 50px;
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
  @media screen and (max-width: 767px){
  }
`
const FlexWrapper = styled.div`
  margin-top: ${(props) => props.$marginTop || "30px"};
  margin-bottom: ${(props) => props.$marginBottom || "0"};
  display: flex;
  gap: 10px;
  justify-content: center;
`
const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
`
const StyledStudentPannel = styled.div`
  position: relative;
  width: 50%;
  padding: 15px;
  margin: 0 50px 15px 50px;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: royalBlue;
  border-radius: 20px;
  @media screen and (max-width: 767px){
    margin-top: 0;
    border: none;
    border-radius: 0;
  }
`
const StyledGrayPannel = styled.div`
  position: relative;
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
  p { margin: 0; }
`
const FlexEndWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  button { margin: 0; }
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
const StyledBox = styled.div`
  display: flex;
  padding: 2px;
  justify-content: space-between;
  span { width: 74%; }
`
const HeadTitle = styled.h5`
  margin: 10px;
  text-align: center;
  font-weight: bold;
`
const Wrapper = styled.div`
  padding: 5px;
  border: 1px solid gray;
  border-radius: 5px;
`
const StyledTextarea = styled.textarea`
  width: 100%;
  height: ${({ $height }) => $height ? $height : "160px"};
  border-radius: 5px;
`
const ByteWrapper = styled.div`
  button { margin: 0;}
  p { margin: 0;}
  display: flex;
  justify-content: space-between;
`
export default HomeStudentDetail