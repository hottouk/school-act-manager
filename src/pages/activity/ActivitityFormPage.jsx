//라이브러리
import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
//hooks
import useChatGpt from "../../hooks/useChatGpt";
import useClientHeight from "../../hooks/useClientHeight";
import useFireActiData from "../../hooks/Firebase/useFireActiData";
import useFireTransaction from "../../hooks/useFireTransaction";
//모달
import AddMoreRecordModal from "../../components/Modal/AddMoreRecordModal";
import ChargeRiraModal from "../../components/Modal/ChargeRiraModal";
//컴포넌트
import FormHeader from "../../components/Form/FormHeader";
import ScoreWrapper from "../../components/ScoreWrapper"
import SubjectSelects from "../../components/Select/SubjectSelects";
import DotTitle from "../../components/Title/DotTitle";
import TwoRadios from "../../components/Radio/TwoRadios";
import MoreRecordListForm from "../../components/Form/MoreRecordListForm";
import ByteCalculator from "../../components/Etc/ByteCalculator";
import SubNav from "../../components/Bar/SubNav";
import BackBtn from "../../components/Btn/BackBtn";
import SmallBtn from "../../components/Btn/SmallBtn";
import MainBtn from "../../components/Btn/MainBtn";
//상수
import { GPT_RESPONSE } from "../../constants/gpt";
//애니
import AnimMaxHightOpacity from "../../anim/AnimMaxHightOpacity";
import GptIngModal from "../../components/Modal/gptModal/GptIngModal";
//실시간 바이트 갱신(240706) -> 담임반 활동(241221)
const ActivityFormPage = () => { //진입 경로 총 4곳: 교사 3(활동관리-활동생성, 활동관리-나의활동, 활동관리-다른교사) 학생 1
  useEffect(() => { setIsVisible(true) }, []);
  //경로 이동
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sort = queryParams.get("sort");
  const { state } = location; //state.acti는 활동
  useEffect(() => { if (state?.acti) bindData(); else setIsEdit(true); }, [state]);
  const navigate = useNavigate()
  //유저 정보
  const user = useSelector(({ user }) => { return user })
  //활동 기본 정보 변수
  const [isEdit, setIsEdit] = useState(false);
  const [_title, setTitle] = useState('');
  const [_subjGroup, setSubjGroup] = useState(null);
  const [_subjDetail, setSubjDetail] = useState(null);
  const [_content, setContent] = useState('');
  const [_record, setRecord] = useState('');
  const [_extraRecList, setExtraRecList] = useState([]);
  const [_perfRecList, setPerfRecList] = useState([]);
  const [_repeatInfoList, setRepeatInfoList] = useState([]);
  const recordListMap = { extra: _extraRecList, perf: _perfRecList, repeat: _repeatInfoList };
  const recordSetterMap = { extra: setExtraRecList, perf: setPerfRecList, repeat: setRepeatInfoList }
  //담임반 활동
  const [_date, setDate] = useState('')
  const [_secondDate, setSecondDate] = useState('')
  const [_hour, setHour] = useState('')
  useEffect(() => { setTimeFormat(handleTimeFormatted()) }, [_date, _secondDate, _hour])
  const [_timeFormat, setTimeFormat] = useState('')
  //공개/비공개
  const [_isPrivate, setIsPrivate] = useState(true)
  //경험치 점수 변수
  const [leadershipScore, setLeadershipScore] = useState(0);
  const [careerScore, setCareerScore] = useState(0);
  const [sincerityScore, setSincerityScore] = useState(1);
  const [coopScore, setCoopScore] = useState(0);
  const [attitudeScore, setAttitudeScore] = useState(0);
  const [coin, setCoin] = useState(0);
  //모달
  const [isAddMoreRecModal, setIsAddMoreRecModal] = useState(false);
  const [isRiraModal, setIsRiraModal] = useState(false);
  //숨은 대화창 보여주기 변수
  const [isPerfRecShown, setIsPerfRecShown] = useState(false);
  const [isExtraRecShown, setIsExtraRecShown] = useState(false);
  const [isRepeatRecShown, setIsRepeatRecShown] = useState(false);
  const [isDateShown, setIsDateShown] = useState(false);
  //hooks
  const { addActi, updateActi, deleteActi } = useFireActiData();
  const { copyActiTransaction, delCopiedActiTransaction } = useFireTransaction()
  //gpt
  const { gptAnswer, askExtraRecord, askPerfRecord, askSubjRecord, askHomeroomRecord, splitGptAnswers, gptRes, gptStatus, gptProgress } = useChatGpt();
  const [gptType, setGptType] = useState('');
  useEffect(() => { setGptType(sort); }, [sort]);
  const gptPromptMap = {
    subject: (model, rira) => askSubjRecord(_subjDetail, _content, model, rira),
    perf: (model, rira) => askPerfRecord(_subjDetail, _content, _record, model, rira),
    extra: (model, rira) => askExtraRecord(_subjDetail, _content, _record, model, rira),
    repeat: (model, rira) => askPerfRecord(_subjDetail, _content, _record, model, rira),
    homeroom: (model, rira) => askHomeroomRecord(_subjDetail, _title, _content, _timeFormat, model, rira),
  };
  const gptSetterMap = {
    subject: () => setRecord(gptAnswer),
    extra: () => { const list = splitGptAnswers(gptAnswer, "^"); setExtraRecList(list); },
    perf: () => {
      const list = splitGptAnswers(gptAnswer, "^");
      const newList = [...list, `${_title} 활동에 참여함.`]; //상,중,하는 gpt 도움 받기, 최하는 참여했다고만 기록
      setPerfRecList(newList);
    },
    repeat: () => {
      const answers = splitGptAnswers(gptAnswer, "^");
      const list = answers.map((rec, idx) => ({ times: 4 - idx, record: rec }));
      setRepeatInfoList(list);
    },
    homeroom: () => setRecord(gptAnswer),
  };
  useEffect(() => { if (gptAnswer !== '') { gptSetterMap[gptType](); } }, [gptAnswer]);
  //css 및 에니
  const clientHeight = useClientHeight(document.documentElement)
  const [isVisible, setIsVisible] = useState(false)
  //개별화 함수
  const textareaRef = useRef({});
  //------useMemo------------------------------------------------  
  const isGptLoading = useMemo(() => gptRes === GPT_RESPONSE.LOADING, [gptRes]);
  //------함수부-------------------------------------------------  
  //데이터 초기화
  const bindData = () => {
    const acti = state.acti;
    if (!acti) return;
    const scoresObj = acti.scores;
    setTitle(acti.title || '');
    setContent(acti.content || '');
    setRecord(acti.record || '');
    setPerfRecList(acti.perfRecordList || []);
    setExtraRecList(acti.extraRecordList || []);
    setRepeatInfoList(acti.repeatInfoList || []);
    setSubjGroup(acti.subject || null);
    setSubjDetail(acti.subjDetail || null);
    setIsPrivate(acti.isPrivate || false);
    setLeadershipScore(scoresObj?.leadership ?? 0);
    setCareerScore(scoresObj?.careerScore ?? 0);
    setSincerityScore(scoresObj?.sincerityScore ?? 0);
    setAttitudeScore(scoresObj?.attitudeScore ?? 0);
  }
  //변경 시
  const handleOnChange = (event) => {
    switch (event.target.id) {
      case "act_title":
        setTitle(event.target.value);
        break;
      case "act_content":
        setContent(event.target.value);
        break;
      case "acti_record":
        setRecord(event.target.value);
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
  //빈칸 확인
  const check = () => {
    if (!_content) { alert('활동을 간단히 설명해주세요'); return false; }
    if (!_subjDetail) { alert('과목을 선택하세요'); return false; }
    if (!_title) { alert('제목을 입력하세요'); return false; }
    return true;
  };
  //GPT 대화창 열기
  const handleGptOnClick = () => { if (!check()) return; setIsRiraModal(true); };
  //GPT 승인 시
  const askGptOnApprove = ({ model, leftRira }) => {
    const fn = gptPromptMap[gptType];
    if (typeof (fn) !== "function") { alert("지원하지 않는 GPT 타입입니다."); return; }
    fn(model, leftRira);
  }
  //저장
  const handleSaveOnClick = (event) => {
    event.preventDefault();
    if (!_subjDetail) { window.alert('과목을 입력해주세요'); return; }
    const confirm = window.confirm(`활동을 ${state ? "수정" : "생성"}하시겠습니까?`);
    if (!confirm) return;
    const scores = { leadership: leadershipScore, careerScore, sincerityScore, coopScore, attitudeScore };
    const acti = {
      uid: String(user.uid), title: _title, subject: _subjGroup, subjDetail: _subjDetail,
      content: _content, record: _record, isPrivate: _isPrivate, scores, money: coin, madeBy: user.name,
      perfRecordList: _perfRecList, extraRecordList: _extraRecList, repeatInfoList: _repeatInfoList,
    };
    if (state) { updateActi(acti, state.acti.id); } else { addActi(acti); };    //서버 저장
    navigate("/activities");
  };
  //삭제
  const handleDeleteOnClick = (copiedId) => {
    const confirm = window.confirm("이 활동을 정말로 삭제하시겠습니까?");
    if (!confirm) return;
    if (copiedId) { delCopiedActiTransaction(copiedId); }
    else { deleteActi(state.acti.id); }
    navigate("/activities");
  };
  //활동 업어가기
  const handleCopyOnClick = () => {
    const confirm = window.confirm("이 활동을 업어가시겠습니까?");
    if (!confirm) return;
    copyActiTransaction(state.acti);
    navigate("/activities_all", { state: "acti_all" });
  };
  //날짜 추가
  const handleAddDataOnClick = () => { setRecord((prev) => String(prev).concat(_timeFormat)); };
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
  };
  return (<>
    <Container $clientheight={clientHeight} $isVisible={isVisible}>
      <SubNav><BackBtn /></SubNav>
      {/* 교사 */}
      {user.isTeacher &&
        <ActiSection onSubmit={handleSaveOnClick}>
          <FormHeader>{state ? <legend>{_subjDetail} 활동 수정</legend> : <legend>활동 생성</legend>}</FormHeader>
          <Row style={{ margin: "13px 0" }}>
            <DotTitle title={"활동 제목"} styles={{ dotColor: "#3454d1" }} />
            <TextInput className="act_title" id="act_title" type="text"
              onChange={handleOnChange}
              value={_title} placeholder="ex)포도당 산화 환원 실험"
              disabled={!isEdit}
            />
          </Row>
          <Column style={{ marginBottom: "13px", gap: "10px" }}>
            <Row>
              <DotTitle title={"교과/과목"} styles={{ dotColor: "#3454d1" }} />
              {(!isEdit && _subjGroup) && <BasicText>{_subjGroup}과 {_subjDetail}</BasicText>}
            </Row>
            {isEdit && <SubjectSelects sort={sort}
              selectedGroup={_subjGroup} selectedDetail={_subjDetail}
              setSelectedGroup={setSubjGroup} setSelectedDetail={setSubjDetail}
            />}
          </Column>
          {/* 활동 설명 */}
          <DotTitle>활동 설명</DotTitle>
          <Textarea
            value={_content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={"ex)포도당 환원 실험에 참여하여 원리를 모둠 보고서로 작성하는 활동."}
            ref={textareaRef}
            disabled={!isEdit}
          />
          <Row style={{ justifyContent: "space-between" }}>
            <DotTitle>생기부 문구 </DotTitle>
            {isEdit && <Row style={{ alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-brain" style={{ cursor: "pointer", color: "#3454d1" }}
                onClick={handleGptOnClick} />
              <i className="fa-solid fa-tag" style={{ cursor: "pointer", color: "#3454d1" }}
                onClick={handlePersonalizeOnClick} />
            </Row>}
          </Row>
          <Textarea
            value={_record}
            onChange={(event) => { setRecord(event.target.value) }}
            placeholder={"gpt 버튼(뇌모양) 클릭 또는 직접 작성."}
            ref={textareaRef}
            disabled={!isEdit}
          />
          <Row style={{ justifyContent: "flex-end", marginTop: "5px" }}>
            <ByteCalculator handleOnConhange={handleOnChange} str={_record} styles={{ isTotalByteHide: true }} />
          </Row>
          {/* 날짜_담임반 전용 */}
          <Row style={{ marginBottom: "13px" }}>{sort === "homeroom" && <DotTitle title={"날짜 정보 ▼"} onClick={() => { setIsDateShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}</Row>
          <AnimMaxHightOpacity isVisible={isDateShown}>
            <HiddenWrapper>
              <Row style={{ margin: "0" }}><TextInput type="text" value={_timeFormat} disabled style={{ flexGrow: 1, width: "55px" }} /></Row>
              <Row style={{ margin: "10px 0", justifyContent: "space-between" }}>
                <TextInput type="date" id="first_date" onChange={handleOnChange} />부터
                <TextInput type="date" id="second_date" onChange={handleOnChange} />까지
              </Row>
              <Row style={{ margin: "5px 0", alignItems: "center", gap: "10px" }}><TextInput type="number" min={0} max={99} value={_hour} onChange={(event) => { setHour(event.target.value) }} />시간</Row>
              <Row style={{ justifyContent: "center" }}><SmallBtn onClick={handleAddDataOnClick}>추가</SmallBtn></Row>
            </HiddenWrapper>
          </AnimMaxHightOpacity>
          {/* 공개/비공개 */}
          <Row style={{ justifyContent: "space-between", marginBottom: "10px" }}>
            <DotTitle title={"공개 여부"} styles={{ dotColor: "#3454d1;" }} />
            <TwoRadios name="isPrivate_radio"
              id={["private_radio", "public_radio"]}
              value={_isPrivate} label={["비공개 활동", "공개 활동"]}
              onChange={() => setIsPrivate(!_isPrivate)}
              disabled={!isEdit}
            />
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            {(sort === "subject") &&
              <DotTitle title={"성취도별 문구 ▼"} pointer="pointer" styles={{ dotColor: "#3454d1;" }}
                onClick={() => { setIsPerfRecShown((prev) => !prev) }} />}
          </Row>
          <AnimMaxHightOpacity isVisible={isPerfRecShown}>
            <HiddenWrapper style={{ flexDirection: "row", padding: "0 15px 10px 5px" }}>
              {_perfRecList?.length > 0 && <LevelWrapper>
                <p>상</p><p>중</p><p>하</p><p>최하</p>
              </LevelWrapper>}
              <MoreRecordListForm
                moreRecList={_perfRecList}
                noListText="수행 성취도에 따라 각기 다른 문구를 설정합니다."
                isBtnShown={_record && _subjDetail && isEdit}
                btnOnClick={() => { if (!check()) return; setIsAddMoreRecModal(true); setGptType("perf"); }} />
            </HiddenWrapper>
          </AnimMaxHightOpacity>
          <Row style={{ marginBottom: "10px" }}>
            {(sort === "subject") && <DotTitle title={"돌려쓰기 문구 ▼"} onClick={() => { setIsExtraRecShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
          </Row>
          <AnimMaxHightOpacity isVisible={isExtraRecShown}>
            <HiddenWrapper style={{ padding: "0 15px 10px 5px" }}>
              <MoreRecordListForm
                moreRecList={_extraRecList}
                noListText="표현만 약간 다른 같은 내용의 돌려쓸 문구를 설정합니다."
                isBtnShown={_record && _subjDetail && isEdit}
                btnOnClick={() => { if (!check()) return; setIsAddMoreRecModal(true); setGptType("extra"); }} />
            </HiddenWrapper>
          </AnimMaxHightOpacity>
          <Row style={{ marginBottom: "10px" }}>
            {(sort === "subject") && <DotTitle title={"반복 문구 ▼"} onClick={() => { setIsRepeatRecShown((prev) => !prev) }} pointer="pointer" styles={{ dotColor: "#3454d1;" }} />}
          </Row>
          <AnimMaxHightOpacity isVisible={isRepeatRecShown}>
            <HiddenWrapper style={{ flexDirection: "row", padding: "0 15px 10px 5px" }}>
              {_repeatInfoList && <LevelWrapper>{_repeatInfoList.map((item, i) => <p key={i}>{item.times}회</p>)}</LevelWrapper>}
              <MoreRecordListForm
                moreRecList={_repeatInfoList?.map((item) => item.record)}
                noListText="반복 수행 횟수에 따라 각기 다른 문구를 설정합니다."
                isBtnShown={_record && _subjDetail && isEdit}
                btnOnClick={() => { if (!check()) return; setIsAddMoreRecModal(true); setGptType("repeat"); }} />
            </HiddenWrapper>
          </AnimMaxHightOpacity>
          {/* 교사 버튼 영역 */}
          <BtnWrapper>
            {/* 활동 생성 */}
            {!state && <MainBtn onClick={handleSaveOnClick}>생성</MainBtn>}
            {/* 활동 수정 */}
            {(state?.acti.uid === user.uid) && <>
              {!state.acti.madeById && <>
                {!isEdit
                  ? <><MainBtn type="button" onClick={() => setIsEdit(!isEdit)}>수정</MainBtn><MainBtn onClick={handleDeleteOnClick}>삭제</MainBtn></>
                  : <><MainBtn onClick={handleSaveOnClick}>저장</MainBtn><MainBtn onClick={() => { bindData(); setIsEdit(!isEdit); }}>취소</MainBtn></>
                }</>}
              {state.acti.madeById && <MainBtn onClick={(() => handleDeleteOnClick(state.acti.id))}>삭제</MainBtn>}
            </>}
            {/* 활동 업기 */}
            {(state && (state?.acti.uid !== user.uid)) && <MainBtn onClick={handleCopyOnClick}>업어가기</MainBtn>}
          </BtnWrapper>
        </ActiSection>}
    </Container >
    {/* 모달  */}
    < AddMoreRecordModal
      show={isAddMoreRecModal}
      onHide={() => setIsAddMoreRecModal(false)}
      record={_record}
      list={recordListMap[gptType]}
      setList={recordSetterMap[gptType]}
      isInnerModal={isRiraModal || isGptLoading}
      setIsRiraModal={setIsRiraModal}
      from={sort}
      type={gptType}
      setType={setGptType}
    />
    <ChargeRiraModal
      show={isRiraModal}
      onHide={() => setIsRiraModal(false)}
      onApprove={askGptOnApprove}
    />
    <GptIngModal
      show={isGptLoading}
      status={gptStatus}
      progress={gptProgress}
    />
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
const ActiSection = styled.div`
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
const Column = styled(Row)`
  flex-direction: column;
`
const BasicText = styled.p`
  margin: 0;
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
const TextInput = styled.input`
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
  flex-direction: column;
  margin: 15px auto;
  gap: 10px;
`
export default ActivityFormPage