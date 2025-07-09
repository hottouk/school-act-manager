//라이브러리
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
//hooks
import useChatGpt from "../../hooks/useChatGpt";
import useClientHeight from "../../hooks/useClientHeight";
import useFireActiData from "../../hooks/Firebase/useFireActiData";
import useFireTransaction from "../../hooks/useFireTransaction";
//모달
import AddExtraRecModal from "../../components/Modal/AddExtraRecModal";
import AddPerfRecModal from "../../components/Modal/AddPerfRecModal";
//컴포넌트
import FormHeader from "../../components/Form/FormHeader";
import ScoreWrapper from "../../components/ScoreWrapper"
import SubjectSelects from "../../components/Select/SubjectSelects";
import DotTitle from "../../components/Title/DotTitle";
import TwoRadios from "../../components/Radio/TwoRadios";
import CommonTextArea from "../../components/CommonTextArea";
import MoreRecordListForm from "../../components/Form/MoreRecordListForm";
import LongW100Btn from "../../components/Btn/LongW100Btn";
import ByteCalculator from "../../components/Etc/ByteCalculator";
import SubNav from "../../components/Bar/SubNav";
import BackBtn from "../../components/Btn/BackBtn";
//애니
import AnimMaxHightOpacity from "../../anim/AnimMaxHightOpacity";
import { Spinner } from "react-bootstrap";
import SmallBtn from "../../components/Btn/SmallBtn";
import AddRepeatRecModal from "../../components/Modal/AddRepeatRecModal";

//24.07.06 수정(실시간 바이트 갱신) -> 24.12.21(담임반 활동)
const ActivityFormPage = () => { //진입 경로 총 4곳: 교사 3(활동관리-활동생성, 활동관리-나의활동, 활동관리-다른교사) 학생 1
  useEffect(() => { setIsVisible(true) }, [])
  const user = useSelector(({ user }) => { return user })
  //활동 기본 정보 변수
  const [_title, setTitle] = useState('');
  const [_selectedSubjGroup, setSelectedSubjGroup] = useState('default');
  const [_selectedSubjDetail, setSelectedSubjDetail] = useState('default');
  const [_content, setContent] = useState('');
  const [_record, setRecord] = useState('');
  const [_extraRecList, setExtraRecList] = useState(null);
  const [_perfRecList, setPerfRecList] = useState(null);
  const [_repeatInfoList, setRepeatInfoList] = useState(null);
  //담임반 활동
  const [_date, setDate] = useState('')
  const [_secondDate, setSecondDate] = useState('')
  const [_hour, setHour] = useState('')
  useEffect(() => { setTimeFormat(handleTimeFormatted()) }, [_date, _secondDate, _hour])
  const [_timeFormat, setTimeFormat] = useState('')
  //공개/비공개
  const [_isPrivate, setIsPrivate] = useState(true)
  //gpt 요청 바이트
  const [_myByte, setMyByte] = useState(0);
  //경험치 점수 변수
  const [leadershipScore, setLeadershipScore] = useState(0);
  const [careerScore, setCareerScore] = useState(0);
  const [sincerityScore, setSincerityScore] = useState(1);
  const [coopScore, setCoopScore] = useState(0);
  const [attitudeScore, setAttitudeScore] = useState(0);
  const [coin, setCoin] = useState(0);
  //모달
  const [isExtraRecModalShown, setIsExtraRecModalShown] = useState(false);
  const [isPerfRecModalShown, setIsPerfRecModalShown] = useState(false);
  const [isRepeatRecModalShown, setIsRepeatRecModalShown] = useState(false);
  //숨은 대화창 보여주기 변수
  const [isModified, setIsModified] = useState(false);
  const [isPerfRecShown, setIsPerfRecShown] = useState(false);
  const [isExtraRecShown, setIsExtraRecShown] = useState(false);
  const [isRepeatRecShown, setIsRepeatRecShown] = useState(false);
  const [isDateShown, setIsDateShown] = useState(false);
  const [isGptDetailShown, setIsGptDetailShown] = useState(false);
  //hooks
  const { addActi, updateActi, deleteActi } = useFireActiData();
  const { copyActiTransaction, delCopiedActiTransaction } = useFireTransaction()
  //경로 이동 관련 변수
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sort = queryParams.get("sort")
  const { state } = location //state.acti는 활동
  useEffect(() => { if (state?.acti) { initData(); } else { setIsModified(true); } }, [state]);
  const navigate = useNavigate()
  //ChatGPt
  const { gptAnswer, askSubjRecord, askHomeroomReccord, gptRes } = useChatGpt();
  useEffect(() => { if (gptAnswer !== '') { setRecord(gptAnswer) } }, [gptAnswer])
  //css 및 에니
  const clientHeight = useClientHeight(document.documentElement)
  const [isVisible, setIsVisible] = useState(false)
  //개별화 함수
  const textareaRef = useRef({});

  //------함수부------------------------------------------------  
  //데이터 초기화
  const initData = () => {
    const acti = state.acti;
    const scoresObj = acti.scores;
    setTitle(acti.title);
    setContent(acti.content);
    setRecord(acti.record);
    setPerfRecList(acti.perfRecordList);
    setExtraRecList(acti.extraRecordList);
    setRepeatInfoList(acti.repeatInfoList)
    setSelectedSubjDetail(acti.subject);
    setIsPrivate(acti.isPrivate || false);
    setLeadershipScore(scoresObj?.leadership ?? 0);
    setCareerScore(scoresObj?.careerScore ?? 0);
    setSincerityScore(scoresObj?.sincerityScore ?? 0);
    setAttitudeScore(scoresObj?.attitudeScore ?? 0);
    setIsModified(true);
  }

  //활동 저장 대화창 ==> 추후 디자인 수정 필요 (교사전용)
  const showConfirmModal = () => {
    const scores = { leadership: leadershipScore, careerScore, sincerityScore, coopScore, attitudeScore };
    const money = coin;
    if (state) {
      const confirm = window.confirm("활동을 수정하시겠습니까?")
      const actId = state.acti.id;
      if (confirm) {
        const modifiedActi = { title: _title, content: _content, record: _record, scores, money, isPrivate: _isPrivate };
        updateActi(modifiedActi, actId);
        navigate("/activities");
        setIsModified(false);
      }
    } else {
      const confirm = window.confirm('활동을 생성하시겠습니까?')
      if (confirm) {
        let newAct = {
          uid: String(user.uid), title: _title, subject: _selectedSubjGroup, subjDetail: _selectedSubjDetail,
          content: _content, record: _record, isPrivate: _isPrivate, scores, money, madeBy: user.name,
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
      case "acti_record":
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
        setDate(event.target.value.replace(/-/g, "."));
        break;
      case "second_date":
        setSecondDate(event.target.value.replace(/-/g, "."));
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
  //개별화 틀 클릭
  const handlePersonalizeOnClick = (index) => {
    const template = '{/*개별 변경 사항을 입력하세요*/}';
    const textarea = textareaRef.current
    // 현재 커서 위치 가져오기
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    // 템플릿 추가
    let textBefore = textarea.value.substring(0, start); //0부터 커서 전까지 텍스트 추출
    let textAfter = textarea.value.substring(end);       //커서 뒤부터 끝까지 텍스트 추출
    textarea.value = textBefore + template + textAfter;
    // 템플릿 내 커서를 '...' 위치로 이동
    let cursorPosition = start + 3; // '{/* ... */}'에서 '...'의 시작 위치
    textarea.setSelectionRange(cursorPosition, cursorPosition + 15);
    textarea.focus();
  }
  //버튼 클릭
  const handleBtnClick = (event) => {
    event.preventDefault();
    switch (event.target.id) {
      case "gpt_btn": //교사 전용
        if (_title !== '' && _selectedSubjDetail !== 'default' && _content !== '') {
          if (sort === "homeroom") { askHomeroomReccord(_title, _selectedSubjDetail, _content, _myByte) } else { askSubjRecord(_title, _selectedSubjDetail, _content) }
        } else {
          window.alert('활동 제목, 과목, 간단한 설명을 입력해주세요.')
        }
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
      default: return
    }
  }

  //활동 업어가기
  const handleCopyOnClick = () => {
    if (window.confirm("이 활동을 업어가시겠습니까?")) {
      copyActiTransaction(state.acti);
      navigate("/activities_all", { state: "acti_all" });
    }
  }
  //공개, 비공개
  const handleRadioBtnClick = () => { setIsPrivate(!_isPrivate) }
  //날짜 추가
  const handleAddDataOnClick = () => { setRecord((prev) => String(prev).concat(_timeFormat)); }
  //날짜, 시간, 생기부 포맷으로
  const handleTimeFormatted = () => {
    let result = ''
    if (_date && _secondDate && _hour) result = `(${_date}.-${_secondDate}./${_hour}시간)`
    if (_date && _secondDate && !_hour) result = `(${_date}.-${_secondDate}.)`
    if (_date && !_secondDate && _hour) result = `(${_date}./${_hour}시간)`
    if (_date && !_secondDate && !_hour) result = `(${_date}.)`
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
          <FormHeader>{state ? <legend>{_selectedSubjDetail} 활동 수정</legend> : <legend>활동 생성</legend>}</FormHeader>
          <fieldset style={{ padding: "2px" }}>
            <Row style={{ justifyContent: "space-between", margin: "13px 0" }}>
              <DotTitle title={"활동 제목"} styles={{ dotColor: "#3454d1" }} />
              <StyledInput className="act_title" id="act_title" type="text" required onChange={handleOnChange} value={_title} disabled={!isModified} placeholder="ex)포도당 산화 환원 실험" />
            </Row>
            <Row style={{ marginBottom: "13px" }}>
              <DotTitle title={"교과/과목"} styles={{ dotColor: "#3454d1" }} />
              <SubjectSelects sort={sort}
                selectedGroup={_selectedSubjGroup} selectedDetail={_selectedSubjDetail}
                setSelectedGroup={setSelectedSubjGroup} setSelectedDetail={setSelectedSubjDetail}
                disabled={!isModified} />
            </Row>
            {/* 활동 설명 */}
            <CommonTextArea id="act_content" title="활동 설명" onChange={handleOnChange} value={_content} disabled={!isModified}
              placeholder={"ex)포도당 환원 실험에 참여하여 원리를 모둠 보고서로 작성하는 활동."} />
            <Text>생기부 문구 </Text>
            <Textarea
              value={_record}
              onChange={(event) => { setRecord(event.target.value) }}
              placeholder={"직접 쓰지 마시고 gpt 버튼 클릭! 직접 작성도 가능함."}
              ref={textareaRef}
              required
              disabled={!isModified}
            />
            <Row style={{ justifyContent: "space-between" }}>
              <ClickableText onClick={() => { handlePersonalizeOnClick() }}>개별화 틀 삽입</ClickableText>
              <ByteCalculator handleOnConhange={handleOnChange} str={_record} />
            </Row>
            {/* 날짜_담임반 전용 */}
            <Row style={{ marginBottom: "13px" }}>{sort === "homeroom" && <DotTitle title={"날짜 정보 ▼"} onClick={() => { setIsDateShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}</Row>
            <AnimMaxHightOpacity isVisible={isDateShown}>
              <HiddenWrapper>
                <Row style={{ margin: "0" }}><StyledInput type="text" value={_timeFormat} disabled style={{ flexGrow: 1, width: "55px" }} /></Row>
                <Row style={{ margin: "10px 0", justifyContent: "space-between" }}>
                  <StyledInput type="date" id="first_date" onChange={handleOnChange} />부터
                  <StyledInput type="date" id="second_date" onChange={handleOnChange} />까지
                </Row>
                <Row style={{ margin: "5px 0", alignItems: "center", gap: "10px" }}><StyledInput type="number" min={0} max={99} value={_hour} onChange={(event) => { setHour(event.target.value) }} />시간</Row>
                <Row style={{ justifyContent: "center" }}><SmallBtn onClick={handleAddDataOnClick}>추가</SmallBtn></Row>
              </HiddenWrapper>
            </AnimMaxHightOpacity>
            {/* GPT 세부 설정 */}
            <Row style={{ marginBottom: "13px" }}>
              {sort === "homeroom" && <DotTitle title={"GPT 설정 ▼"} onClick={() => { setIsGptDetailShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
            </Row>
            <AnimMaxHightOpacity isVisible={isGptDetailShown}>
              <HiddenWrapper>
                <Row style={{ alignItems: "center", justifyContent: "space-between" }}> 요청 바이트<StyledInput type="number" min={200} max={1200} value={_myByte} onChange={(e) => { setMyByte(e.target.value) }} /></Row>
              </HiddenWrapper>
            </AnimMaxHightOpacity>
            {/* 공개/비공개 */}
            <Row style={{ justifyContent: "space-between", marginBottom: "10px" }}>
              <DotTitle title={"공개 여부"} styles={{ dotColor: "#3454d1;" }} />
              <TwoRadios name="isPrivate_radio"
                id={["private_radio", "public_radio"]}
                value={_isPrivate} label={["비공개 활동", "공개 활동"]}
                onChange={handleRadioBtnClick}
                disabled={!isModified} />
            </Row>
            <Row style={{ marginBottom: "10px" }}>
              {(state && sort === "subject") && <DotTitle title={"성취도별 문구 ▼"} onClick={() => { setIsPerfRecShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
            </Row>
            <AnimMaxHightOpacity isVisible={isPerfRecShown}>
              <HiddenWrapper style={{ flexDirection: "row", padding: "0 15px 10px 5px" }}>
                {_perfRecList && <LevelWrapper>
                  <p>상</p><p>중</p><p>하</p><p>최하</p>
                </LevelWrapper>}
                <MoreRecordListForm
                  moreRecList={_perfRecList}
                  noListText="수행 성취도에 따라 각기 다른 문구를 설정합니다."
                  isBtnShown={state?.acti?.uid === user.uid && !state?.acti?.madeById}
                  btnOnClick={() => { setIsPerfRecModalShown(true); }} />
              </HiddenWrapper>
            </AnimMaxHightOpacity>
            <Row style={{ marginBottom: "10px" }}>
              {(state && sort === "subject") && <DotTitle title={"돌려쓰기 문구 ▼"} onClick={() => { setIsExtraRecShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
            </Row>
            <AnimMaxHightOpacity isVisible={isExtraRecShown}>
              <HiddenWrapper style={{ padding: "0 15px 10px 5px" }}>
                <MoreRecordListForm
                  moreRecList={_extraRecList}
                  noListText="표현만 약간 다른 같은 내용의 돌려쓸 문구를 설정합니다."
                  isBtnShown={state?.acti?.uid === user.uid && !state?.acti?.madeById}
                  btnOnClick={() => { setIsExtraRecModalShown(true); }} />
              </HiddenWrapper>
            </AnimMaxHightOpacity>
            <Row style={{ marginBottom: "10px" }}>
              {(state && sort === "subject") && <DotTitle title={"반복 문구 ▼"} onClick={() => { setIsRepeatRecShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
            </Row>
            <AnimMaxHightOpacity isVisible={isRepeatRecShown}>
              <HiddenWrapper style={{ flexDirection: "row", padding: "0 15px 10px 5px" }}>
                {_repeatInfoList && <LevelWrapper>{_repeatInfoList.map((item, i) => <p key={i}>{item.times}회</p>)}</LevelWrapper>}
                <MoreRecordListForm
                  moreRecList={_repeatInfoList?.map((item) => item.record)}
                  noListText="반복 수행 횟수에 따라 각기 다른 문구를 설정합니다."
                  isBtnShown={state?.acti?.uid === user.uid && !state?.acti?.madeById}
                  btnOnClick={() => { setIsRepeatRecModalShown(true); }} />
              </HiddenWrapper>
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
            {gptRes !== "loading" ? <BtnWrapper>
              {!state ? <> {/*활동 첫 생성 */}
                <LongW100Btn id="gpt_btn" btnName="GPT로 세특 문구 작성" btnOnClick={handleBtnClick} />
                <LongW100Btn type="submit" btnName="생성" /></>
                : <>
                  {(state.acti.uid === user.uid) && <>
                    {!state.acti.madeById
                      ? <>{/*업어오지 않고 내가 생성한 활동 수정하기 */}
                        <LongW100Btn id="gpt_btn" btnName="GPT로 세특 문구 작성" btnOnClick={handleBtnClick} />
                        <LongW100Btn type="submit" btnName="저장" />
                        <LongW100Btn id="delete_btn" btnName="삭제" btnOnClick={handleBtnClick} />
                      </>
                      : <>{/*업어온 활동 삭제하기 */}
                        <LongW100Btn id="copied_delete_btn" btnName="삭제" btnOnClick={handleBtnClick} /></>}
                  </>}
                  {(state.acti.uid !== user.uid) && <LongW100Btn btnOnClick={handleCopyOnClick}>업어가기</LongW100Btn>}
                </>}
            </BtnWrapper> : <Row style={{ justifyContent: "center" }}><Spinner /></Row>}
          </fieldset>
        </StyledForm>}
    </Container>

    {/* 모달  */}
    {state &&
      < AddExtraRecModal
        show={isExtraRecModalShown}
        onHide={() => setIsExtraRecModalShown(false)}
        acti={state.acti}
        setList={setExtraRecList} //부모 컴포넌트에 변경 data 반영
      />}
    {state &&
      < AddPerfRecModal
        show={isPerfRecModalShown}
        onHide={() => setIsPerfRecModalShown(false)}
        acti={state.acti}
        setPerfRecList={setPerfRecList}
      />}
    {state &&
      < AddRepeatRecModal
        show={isRepeatRecModalShown}
        onHide={() => setIsRepeatRecModalShown(false)}
        acti={state.acti}
        setList={setRepeatInfoList}
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
`
const Row = styled.div`
  display: flex;
`
const Text = styled.p`
  margin: 0;
`
const ClickableText = styled.p`
  cursor: pointer;
  color:rgba(58, 58, 58, 0.8);
  font-weight: bold;
  text-decoration: underline;
  &: hover { color: #3454d1; }
`
const Textarea = styled.textarea`
  width: 100%;
  height: 75px;
  padding: 5px;
  margin-top: 5px;
  border: none;
  border-radius: 10px;
  overflow-y: scroll;
`
const StyledInput = styled.input`
  height: 35px;
  border: 1px solid rgba(120, 120, 120, 0.5);
  border-radius: 7px;
  padding-left: 5px;
  &:disabled { color: gray; } /* 해당 input disabled 되었을 때 */
`
const HiddenWrapper = styled(Row)`
  flex-direction: column;
  border: 2px solid rgba(120, 120, 120, 0.5);
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 5px;
`
const LevelWrapper = styled(Row)`
  flex-direction: column;
  margin-top: 15px;
  width: 40px;
  gap: 5px;
  p { 
    height: 35px;
    margin: 0;
    padding: 4px;
    text-align: center;
  }
`
const BtnWrapper = styled(Row)`
  width: 90%;
  flex-direction: column;
  margin: 15px auto;
  align-items: center;
  gap: 20px;
`
export default ActivityFormPage