//라이브러리
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
//hooks
import useChatGpt from "../../hooks/useChatGpt";
import useClientHeight from "../../hooks/useClientHeight";
import useAddUpdFireData from "../../hooks/Firebase/useAddUpdFireData";
import useFireActi from "../../hooks/Firebase/useFireActi";
//컴포넌트
import GraphicDialogModal from "../../components/Modal/GraphicDialogModal";
import Wait3SecondsModal from "../../components/Modal/Wait3SecondsModal";
import AddExtraRecModal from "../../components/Modal/AddExtraRecModal";
import ScoreWrapper from "../../components/ScoreWrapper"
import SubjectSelects from "../../components/Select/SubjectSelects";
import DotTitle from "../../components/Title/DotTitle";
import TwoRadios from "../../components/Radio/TwoRadios";
import QuestModal from "../../components/Modal/QuestModal";
import CommonTextArea from "../../components/CommonTextArea";
import MoreRecordListForm from "../../components/Form/MoreRecordListForm";
import LongW100Btn from "../../components/Btn/LongW100Btn";
import ByteCalculator from "../../components/Etc/ByteCalculator";
import SubNav from "../../components/Bar/SubNav";
import BackBtn from "../../components/Btn/BackBtn";
//이미지
import mon01 from "../../image/enemies/mon_01.png";
import mon02 from "../../image/enemies/mon_02.png"
import mon03 from "../../image/enemies/mon_03.png"
import mon04 from "../../image/enemies/mon_04.png"
import mon05 from "../../image/enemies/mon_05.png"
import question from "../../image/icon/question.png"
import useFireTransaction from "../../hooks/useFireTransaction";
import AddPerfRecModal from "../../components/Modal/AddPerfRecModal";
import AnimMaxHightOpacity from "../../anim/AnimMaxHightOpacity";
//css
import styled from "styled-components";

//24.07.06 수정(실시간 바이트 갱신) -> 24.12.21(담임반 활동)
const ActivityForm = () => { //진입 경로 총 4곳: 교사 3(활동관리-활동생성, 활동관리-나의활동, 활동관리-다른교사) 학생 1
  //----1.변수부--------------------------------
  useEffect(() => { setIsVisible(true) }, [])
  const user = useSelector(({ user }) => { return user })
  //1.활동 기본 정보 변수
  const [title, setTitle] = useState('');
  const [_selectedSubjGroup, setSelectedSubjGroup] = useState('default');
  const [_selectedSubjDetail, setSelectedSubjDetail] = useState('default');
  const [content, setContent] = useState('');
  const [record, setRecord] = useState('');
  const [_extraRecList, setExtraRecList] = useState(null);
  const [_perfRecList, setPerfRecList] = useState(null);
  //담임반 활동
  const [_date, setDate] = useState('')
  const [_secondDate, setSecondDate] = useState('')
  const [_hour, setHour] = useState('')
  useEffect(() => { setTimeFormat(handleTimeFormatted()) }, [_date, _secondDate, _hour])
  const [_timeFormat, setTimeFormat] = useState('')
  //동기부여
  const [monImg, setMonImg] = useState(null);
  //공개/비공개
  const [_isHomework, setIsHomework] = useState(false)
  const [_isPrivate, setIsPrivate] = useState(true)
  //gpt 요청 바이트
  const [_myByte, setMyByte] = useState(0);
  //2.경험치 점수 변수
  const [leadershipScore, setLeadershipScore] = useState(0);
  const [careerScore, setCareerScore] = useState(0);
  const [sincerityScore, setSincerityScore] = useState(1);
  const [coopScore, setCoopScore] = useState(0);
  const [attitudeScore, setAttitudeScore] = useState(0);
  const [coin, setCoin] = useState(0);
  //3.대화창 보여주기 변수
  const [graphicModalShow, setgraphicModalShow] = useState(false)
  const [timerModalShow, setTimerModalShow] = useState(false)
  const [questModalShow, setQuestModalShow] = useState(false)
  const [isExtraRecModalShown, setIsExtraRecModalShown] = useState(false)
  const [isPerfRecModalShown, setIsPerfRecModalShown] = useState(false)
  const [isModified, setIsModified] = useState(false)
  const [isExtraRecShown, setIsExtraRecShown] = useState(false)
  const [isDateShown, setIsDateShown] = useState(false)
  const [isGptDetailShown, setIsGptDetailShown] = useState(false)
  const [isPerfRecShown, setIsPerfRecShown] = useState(false)
  //hooks
  //4.데이터 통신 변수
  const { addActi, updateActi } = useAddUpdFireData("activities");
  const { copyActiTransaction, delCopiedActiTransaction } = useFireTransaction()
  const { deleteActi } = useFireActi();
  //5.경로 이동 관련 변수
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sort = queryParams.get("sort")
  const { state } = location //state.acti는 활동

  useEffect(() => { if (state?.acti) { initData() } else { setIsModified(true) } }, [state]);
  const navigate = useNavigate()
  //6. ChatGPt
  const { gptAnswer, askSubjRecord, askHomeroomReccord, gptRes } = useChatGpt();
  useEffect(() => {
    if (gptAnswer !== '') {
      setRecord(gptAnswer)
    }
    switch (gptRes) {
      case 'loading':
        setTimerModalShow(true)
        break;
      case 'complete':
        setTimerModalShow(false)
        break;
      default: return;
    }
  }, [gptRes, gptAnswer])
  //8. css 및 에니
  const clientHeight = useClientHeight(document.documentElement)
  const [isVisible, setIsVisible] = useState(false)

  //----2.함수부--------------------------------
  //데이터 초기화
  const initData = () => {
    let acti = state.acti
    let scoresObj = acti.scores
    setTitle(acti.title)
    setContent(acti.content)
    setRecord(acti.record)
    setExtraRecList(acti.extraRecordList)
    setPerfRecList(acti.perfRecordList)
    setMonImg(acti.monImg)
    setSelectedSubjDetail(acti.subject)
    setIsHomework(acti.isHomework)
    setIsPrivate(acti.isPrivate || false)
    setLeadershipScore(scoresObj?.leadership ?? 0)
    setCareerScore(scoresObj?.careerScore ?? 0)
    setSincerityScore(scoresObj?.sincerityScore ?? 0)
    setAttitudeScore(scoresObj?.attitudeScore ?? 0)
  }

  //활동 저장 대화창 ==> 추후 디자인 수정 필요 (교사전용)
  const showConfirmModal = () => {
    let scores = { leadership: leadershipScore, careerScore, sincerityScore, coopScore, attitudeScore };
    let money = coin
    if (state) {
      const confirm = window.confirm("활동을 수정하시겠습니까?")
      let actId = state.acti.id
      if (confirm) {
        let modifiedActi = { title, content, record, scores, money, monImg, isHomework: _isHomework, isPrivate: _isPrivate };
        updateActi(modifiedActi, "activities", actId)
        navigate("/activities")
        setIsModified(false)
      }
    } else {
      const confirm = window.confirm('활동을 생성하시겠습니까?')
      if (confirm) {
        let newAct = {
          uid: String(user.uid), title, subject: _selectedSubjGroup, subjDetail: _selectedSubjDetail,
          content, record, scores, madeBy: user.name, money, monImg, isHomework: _isHomework,
          isPrivate: _isPrivate
        };
        addActi(newAct)
        navigate("/activities")
      }
    }
  }
  //변경 시
  const handleOnChange = (event) => {
    switch (event.target.id) {
      case "act_title":
        setTitle(event.target.value)
        break;
      case "act_content":
        setContent(event.target.value)
        break;
      case "act_record":
        setRecord(event.target.value)
        break;
      case "act_leadership":
        setLeadershipScore(Number(event.target.value))
        break;
      case "act_career":
        setCareerScore(Number(event.target.value))
        break;
      case "act_sincerity":
        setSincerityScore(Number(event.target.value))
        break;
      case "act_coop":
        setCoopScore(Number(event.target.value))
        break;
      case "act_attitude":
        setAttitudeScore(Number(event.target.value))
        break;
      case "act_coin":
        setCoin(Number(event.target.value))
        break;
      case "first_date":
        setDate(event.target.value.replace(/-/g, "."))
        break;
      case "second_date":
        setSecondDate(event.target.value.replace(/-/g, "."))
        break;
      default:
        return;
    }
  }
  //저장버튼 클릭 제출
  const handleSubmit = (event) => {
    event.preventDefault();
    if (_selectedSubjDetail !== 'default') {
      showConfirmModal();
    } else {
      window.alert('과목을 입력해주세요')
    }
  }
  //버튼 클릭
  const handleBtnClick = (event) => {
    event.preventDefault();
    switch (event.target.id) {
      case "gpt_btn": //교사 전용
        if (title !== '' && _selectedSubjDetail !== 'default' && content !== '') {
          try {
            if (sort === "homeroom") { askHomeroomReccord(title, _selectedSubjDetail, content, _timeFormat, _myByte) } else { askSubjRecord(title, _selectedSubjDetail, content) }
            setTimerModalShow(true)
          } catch (error) {
            window.alert.log(error.message)
          }
        } else {
          window.alert('활동 제목, 과목, 간단한 설명을 입력해주세요.')
        }
        break;
      case "modi_btn":
        setIsModified((prev) => !prev)
        break;
      case "cancel_modi_btn":
        initData()
        setIsModified((prev) => !prev)
        break;
      case "delete_btn":
        if (window.confirm("이 활동을 정말로 삭제하시겠습니까?")) {
          deleteActi(state.acti.id)
          navigate("/activities")
        }
        break;
      case "copied_delete_btn":
        if (window.confirm("이 활동을 정말로 삭제하시겠습니까?")) {
          delCopiedActiTransaction(state.acti.id)
          navigate("/activities")
        }
        break;
      case "go_back_to_class_btn":
        navigate(-1)
        break;
      case "copy_btn":
        if (window.confirm("이 활동을 업어가시겠습니까?")) {
          copyActiTransaction(state.acti)
          navigate("/activities_all", { state: "acti_all" })
        }
        break;
      case 'go_back_btn': //공용
        navigate("/activities")
        break;
      default: return
    }
  }
  //퀘스트 이미지 선택
  const handleImgPickerClick = () => {
    if (isModified) {
      setgraphicModalShow(true)
    }
  }

  const handleQuestImg = (monImg) => {
    let img = question
    switch (monImg) {
      case "mon_01":
        img = mon01
        break;
      case "mon_02":
        img = mon02
        break;
      case "mon_03":
        img = mon03
        break;
      case "mon_04":
        img = mon04
        break;
      case "mon_05":
        img = mon05
        break;
      default: img = question;
    }
    return img
  }
  //공개, 비공개
  const handleRadioBtnClick = (event) => {
    switch (event.target.name) {
      case "isHomework_radio":
        setIsHomework(!_isHomework)
        break;
      case "isPrivate_radio":
        setIsPrivate(!_isPrivate)
        break;
      default: return
    }
  }
  //날짜, 시간, 생기부 포맷으로
  const handleTimeFormatted = () => {
    let result = ''
    if (_date && _secondDate && _hour) result = `(${_date}-${_secondDate}/${_hour}시간)`
    if (_date && _secondDate && !_hour) result = `(${_date}-${_secondDate})`
    if (_date && !_secondDate && _hour) result = `(${_date}/${_hour}시간)`
    if (_date && !_secondDate && !_hour) result = `(${_date})`
    if (!_date && !_secondDate && _hour) result = `(${_hour}시간)`
    if (!_date && !_secondDate && !_hour) result = ''
    return result
  }

  return (<>
    <Container $clientheight={clientHeight} $isVisible={isVisible}>
      <SubNav><BackBtn /></SubNav>
      {/* 교사 */}
      {user.isTeacher &&
        <StyledForm onSubmit={handleSubmit}>
          <StyledHeader>
            {state ? <legend>{_selectedSubjDetail} 활동 수정</legend> : <legend>활동 생성</legend>}
          </StyledHeader>
          <fieldset>
            <StyledDiv>
              <StyledImgPicker src={handleQuestImg(monImg)} alt="퀘스트이미지" onClick={handleImgPickerClick} />
            </StyledDiv>
            <InputWrapper>
              <DotTitle title={"활동 제목"} styles={{ dotColor: "#3454d1;" }} />
              <input className="act_title" id="act_title" type="text" required onChange={handleOnChange} value={title} disabled={!isModified} placeholder="ex)포도당 산화 환원 실험" />
            </InputWrapper>
            {!state &&
              <InputWrapper>
                <DotTitle title={"교과/과목"} styles={{ dotColor: "#3454d1;" }} />
                <SubjectSelects sort={sort}
                  selectedGroup={_selectedSubjGroup} selectedDetail={_selectedSubjDetail}
                  setSelectedGroup={setSelectedSubjGroup} setSelectedDetail={setSelectedSubjDetail}
                />
              </InputWrapper>}
            {/* 활동 설명 */}
            <CommonTextArea id="act_content" title="활동 설명" onChange={handleOnChange} value={content} disabled={!isModified}
              placeholder={"ex)포도당 환원 실험에 참여하여 원리를 모둠 보고서로 작성하는 활동."} />
            <CommonTextArea id="act_record" title="생기부 문구" onChange={handleOnChange} value={record} disabled={!isModified} required
              placeholder={"직접 쓰지 마시고 gpt 버튼 클릭! 직접 작성도 가능함."} />
            <ByteCalculator handleOnConhange={handleOnChange} str={record} />
            {/* 날짜_담임반 전용 */}
            {sort === "homeroom" && <DotTitle title={"날짜 정보 ▼"} onClick={() => { setIsDateShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
            <AnimMaxHightOpacity isVisible={isDateShown}>
              <HiddenWrapper>
                <InputWrapper $margin="0" $maxWidth="100%"><input type="text" value={_timeFormat} disabled style={{ width: "100%" }} /></InputWrapper>
                <InputWrapper $margin="10px 0">
                  <input type="date" id="first_date" onChange={handleOnChange} />부터
                  <input type="date" id="second_date" onChange={handleOnChange} />까지
                </InputWrapper>
                <InputWrapper $margin="10px 0"><input type="number" min={0} max={99} value={_hour} onChange={(event) => { setHour(event.target.value) }} />시간</InputWrapper>
              </HiddenWrapper>
            </AnimMaxHightOpacity>
            {/* GPT 세부 설정 */}
            {sort === "homeroom" && <DotTitle title={"GPT 설정 ▼"} onClick={() => { setIsGptDetailShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
            <AnimMaxHightOpacity isVisible={isGptDetailShown}>
              <HiddenWrapper>
                <InputWrapper $margin="0"> 요청 바이트<input type="number" min={200} max={1200} value={_myByte} onChange={(e) => { setMyByte(e.target.value) }} /></InputWrapper>
              </HiddenWrapper>
            </AnimMaxHightOpacity>
            {/* 공개/비공개 */}
            <RadioWrapper>
              <DotTitle title={"공개 여부"} styles={{ dotColor: "#3454d1;" }} />
              <TwoRadios name="isPrivate_radio"
                id={["private_radio", "public_radio"]}
                value={_isPrivate} label={["비공개 활동", "공개 활동"]}
                onChange={handleRadioBtnClick}
                disabled={!isModified} />
            </RadioWrapper>
            {(state && sort === "subject") && <DotTitle title={"수행 문구 ▼"} onClick={() => { setIsPerfRecShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
            <AnimMaxHightOpacity isVisible={isPerfRecShown}>
              <PerfWrapper>
                {_perfRecList && <LevelWrapper>
                  <p>상</p><p>중</p><p>하</p><p>최하</p>
                </LevelWrapper>}
                <MoreRecordListForm
                  moreRecList={_perfRecList}
                  noListText="등록된 수행평가 문구가 없습니다."
                  isBtnShown={state?.acti?.uid === user.uid && !state?.acti?.madeById}
                  btnOnClick={() => { setIsPerfRecModalShown(true) }} />
              </PerfWrapper>
            </AnimMaxHightOpacity>
            {(state && sort === "subject") && <DotTitle title={"돌려 쓰기 ▼"} onClick={() => { setIsExtraRecShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
            <AnimMaxHightOpacity isVisible={isExtraRecShown}>
              <MoreRecordListForm
                moreRecList={_extraRecList}
                noListText="돌려 쓰기 문구가 없습니다."
                isBtnShown={state?.acti?.uid === user.uid && !state?.acti?.madeById}
                btnOnClick={() => { setIsExtraRecModalShown(true) }} />
            </AnimMaxHightOpacity>
            <ScoreWrapper handleChange={handleOnChange}
              leadershipScore={leadershipScore}
              careerScore={careerScore}
              coopScore={coopScore}
              sincerityScore={sincerityScore}
              attitudeScore={attitudeScore}
              coin={coin}
              disabled={!isModified} />
            {/*교사 버튼 영역 */}
            <ButtonWrapper>
              {!state ? <> {/*활동 첫 생성 */}
                <LongW100Btn id="gpt_btn" btnName="GPT로 세특 문구 작성" btnOnClick={handleBtnClick} />
                <LongW100Btn type="submit" btnName="생성" /></>
                : <>
                  {(state.acti.uid === user.uid) && <>
                    {!state.acti.madeById
                      ? <>{/*업어오지 않고 내가 생성한 활동 수정하기 */}
                        {!isModified && <>
                          <LongW100Btn id="modi_btn" btnName="수정" btnOnClick={handleBtnClick} />
                          <LongW100Btn id="delete_btn" btnName="삭제" btnOnClick={handleBtnClick} /></>
                        }
                        {isModified && <>
                          <LongW100Btn id="gpt_btn" btnName="GPT로 세특 문구 작성" btnOnClick={handleBtnClick} />
                          <LongW100Btn type="submit" btnName="저장" />
                          <LongW100Btn id="cancel_modi_btn" btnName="취소" btnOnClick={handleBtnClick} /></>}</>
                      : <>{/*업어온 활동 삭제하기 */}
                        <LongW100Btn id="copied_delete_btn" btnName="삭제" btnOnClick={handleBtnClick} /></>}
                  </>}
                  {(state.acti.uid !== user.uid) && <> {/*활동 업어가기 */}
                    <LongW100Btn id="copy_btn" btnName="업어가기" btnOnClick={handleBtnClick} />
                  </>}
                </>}
            </ButtonWrapper>
          </fieldset>
        </StyledForm>}
    </Container>
    {/* 모달 */}
    <GraphicDialogModal
      show={graphicModalShow}
      onHide={() => setgraphicModalShow(false)}
      setMonImg={setMonImg} />
    <Wait3SecondsModal
      show={timerModalShow} />
    <QuestModal
      show={questModalShow}
      onHide={() => setQuestModalShow(false)} />
    {(state && isExtraRecModalShown) &&
      < AddExtraRecModal
        show={isExtraRecModalShown}
        onHide={() => setIsExtraRecModalShown(false)}
        acti={state.acti}
        setExtraRecList={setExtraRecList} //부모 컴포넌트에 변경 data 반영
      />}
    {(state && isPerfRecModalShown) &&
      < AddPerfRecModal
        show={isPerfRecModalShown}
        onHide={() => setIsPerfRecModalShown(false)}
        acti={state.acti}
        setPerfRecList={setPerfRecList}
      />}
  </>
  )
}

const Container = styled.div`
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
  @media screen and (max-width: 767px){
    width: 100%;
    height: ${(props) => { return props.$clientheight }}px;
    overflow-y: auto;
  }
`
const StyledHeader = styled.div`
  width: 100%;
  height: 35px;  
  background-color: #3454d1;  
  position: absolute;  
  top: -35px;
  left: 0;
  padding: 5px 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  legend {
    width: 70%;  
    font-size: 1em;
    color: white;
    margin-bottom: 40px;
  }
`
const StyledForm = styled.form`
  position: relative;
  width: 35%;
  max-width: 600px;
  margin: 80px auto 30px;
  padding: 20px;
  color: black;
  background-color: #efefef;
  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: rgba(52, 94, 209, 0.2) 0px 8px 24px, rgba(52, 84, 209, 0.2) 0px 16px 56px, rgba(52, 84, 209, 0.2) 0px 24px 80px;
  fieldset {
    position: relative;
    border: none;
  }
  label {
    display: block;
  }
  @media screen and (max-width: 767px){
    padding-bottom: 20px;
    max-width: 100%;
    margin: 0;
    padding: 15px;
    color: #efefef;
    background-color: #3454d1;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
  fieldset {
    padding: 2px;
  }
  textarea {
    width: 80%;
    min-width: 100%;
    min-height: 75px;
  }
`
const HiddenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #919294;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 5px;
`
const RadioWrapper = styled.div`
  display: flex;
`
const LevelWrapper = styled.div`
  margin-top: 15px;
  width: 40px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  p { 
    height: 35px;
    margin: 0;
    padding: 4px;
    text-align:center;
  }
`
const PerfWrapper = styled.div`
  display: flex;
  gap: 5px;
`
const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  select{
    height: 60%;
    margin-bottom: 15px;
  }
  input {
    margin-top: 5px;
    margin-bottom: 15px;
    max-width: 280px;
    height: 35px;
    border-radius: 7px;
    padding-left: 5px;
    &:disabled {        /* 해당 input disabled 되었을 때 */
      color: gray;      /* 글자 색을 white로 설정 */
    }
  }
  select {
    height: 35px;
    border-radius: 7px;
  }
`
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${(props) => props.$margin || "20px 0"};
  input {
    max-width: ${(props) => props.$maxWidth || "280px"};
    height: 35px;
    border-radius: 7px;
    padding-left: 5px;
    &:disabled {             /* 해당 input disabled 되었을 때 */
      color: gray;           /* 글자 색을 white로 설정 */
    }
  }
`
const StyledImgPicker = styled.img`
  position: relative;
  float: right;
  width: 100px;
  height: 100px;
  padding: 3px;
  border-radius: 20px;
  border: 1px solid black;
  background-color: #efefef;
  cursor: pointer;
`
const ButtonWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`
export default ActivityForm