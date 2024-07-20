//라이브러리
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
//hooks
import useChatGpt from "../../hooks/useChatGpt";
import useClientHeight from "../../hooks/useClientHeight";
import useAddUpdFireData from "../../hooks/useAddUpdFireData";
import useFireActi from "../../hooks/useFireActi";
import useDoActivity from "../../hooks/useDoActivity";
import useGetByte from "../../hooks/useGetByte";
//컴포넌트
import GraphicDialogModal from "../../components/Modal/GraphicDialogModal";
import Wait3SecondsModal from "../../components/Modal/Wait3SecondsModal";
import AddExtraRecModal from "../../components/Modal/AddExtraRecModal";
import ScoreWrapper from "../../components/ScoreWrapper"
import QuestModal from "../../components/Modal/QuestModal";
import SubjectSelect from "../../components/SubjectSelect";
import TwoRadios from "../../components/Radio/TwoRadios";
import SmallBtn from "../../components/Btn/SmallBtn"
import CircleList from "../../components/CircleList";
import Homework from "../../components/Homework";
//이미지
import mon01 from "../../image/enemies/mon_01.png";
import mon02 from "../../image/enemies/mon_02.png"
import mon03 from "../../image/enemies/mon_03.png"
import mon04 from "../../image/enemies/mon_04.png"
import mon05 from "../../image/enemies/mon_05.png"
import question from "../../image/icon/question.png"
import useFireTransaction from "../../hooks/useFireTransaction";

//24.07.06 수정(실시간 바이트 갱신)
const ActivityForm = () => { //진입 경로 총 4곳: 교사 3(활동관리-활동생성, 활동관리-나의활동, 활동관리-다른교사) 학생 1
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  //1.활동 기본 정보 변수
  const [title, setTitle] = useState('');
  const [_subject, setSubject] = useState('default');
  const [content, setContent] = useState('');
  const [record, setRecord] = useState('');
  const [monImg, setMonImg] = useState(null);
  const [byte, setByte] = useState(0)
  const [_isHomework, setIsHomework] = useState(false)
  const [_isPrivate, setIsPrivate] = useState(true)
  const [_anyPartici, setAnyPartici] = useState(false)
 
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
  const [extraRecModalShow, setExtraRecModalShow] = useState(false)
  const [isHomeworkSubmit, setIsHomeworkSubmit] = useState(false)
  const [isModified, setIsModified] = useState(false)
  //hooks
  //4.데이터 통신 변수
  const { addActi, updateActi } = useAddUpdFireData("activities");
  const { copyActiTransaction, delCopiedActiTransaction } = useFireTransaction()
  const { takePartInThisActivity, cancelThisActivity } = useDoActivity();
  const { deleteActi } = useFireActi();
  //5.경로 이동 관련 변수
  const { state } = useLocation() //state는 활동
  const navigate = useNavigate()
  //6. ChatGPt
  const { gptAnswer, askChatGpt, gptRes, gptBytes } = useChatGpt();
  //7. 바이트 계산
  const { getByteLengthOfString } = useGetByte();
  //7.Style
  const clientHeight = useClientHeight(document.documentElement)
  //8. 학생 전용
  const [isParticipating, setIsParticipating] = useState(false)
  useEffect(() => {
    if (state) {
      let scoresObj = state.acti.scores
      let acti = state.acti
      setTitle(acti.title)
      setContent(acti.content)
      setRecord(acti.record)
      setMonImg(acti.monImg)
      setSubject(acti.subject)
      setIsHomework(acti.isHomework)
      if (acti.isPrivate !== undefined) setIsPrivate(acti.isPrivate)
      setCoin(acti.money)
      setByte(acti.byte ? acti.byte : 0)
      if (acti.particiSIdList && acti.particiSIdList.length > 0) {
        setIsParticipating(acti.particiSIdList.find((item) => { return item === user.uid })) //학생 본인 활동 참여 중 여부
        setAnyPartici(true)
      } else {
        setAnyPartici(false)
      }
      if (scoresObj) {
        setLeadershipScore(scoresObj.leadership)
        setCareerScore(scoresObj.careerScore)
        setSincerityScore(scoresObj.sincerityScore)
        setCoopScore(scoresObj.coopScore)
        setAttitudeScore(scoresObj.attitudeScore)
      } else {
        setLeadershipScore(0)
        setCareerScore(0)
        setSincerityScore(0)
        setCoopScore(0)
        setAttitudeScore(0)
      }
    } else {
      setIsModified(true)
    }
  }, [state]);

  useEffect(() => {
    if (gptAnswer !== '') {
      setRecord(gptAnswer)
      setByte(gptBytes)
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

  //활동 저장 대화창 ==> 추후 디자인 수정 필요 (교사전용)
  const showConfirmModal = () => {
    let scores = { leadership: leadershipScore, careerScore, sincerityScore, coopScore, attitudeScore };
    let money = coin
    if (state) {
      const confirm = window.confirm("활동을 수정하시겠습니까?")
      let actId = state.acti.id
      if (confirm) {
        let modifiedActi = { title, subject: _subject, content, record, scores, money, monImg, isHomework: _isHomework, isPrivate: _isPrivate, byte, madeBy: user.name, };
        updateActi(modifiedActi, "activities", actId)
        navigate("/activities")
        setIsModified(false)
      }
    } else {
      const confirm = window.confirm('활동을 생성하시겠습니까?')
      if (confirm) {
        let newAct = {
          uid: String(user.uid),
          title,
          subject: _subject,
          content,
          record,
          scores,
          madeBy: user.name,
          money,
          monImg,
          isHomework: _isHomework,
          isPrivate: _isPrivate,
          byte
        };
        addActi(newAct)
        navigate("/activities")
      }
    }
  }
  //변화 감지
  const handleChange = (event) => {
    switch (event.target.id) {
      case "act_title":
        setTitle(event.target.value)
        break;
      case "act_content":
        setContent(event.target.value)
        break;
      case "act_record":
        setRecord(event.target.value)
        setByte(getByteLengthOfString(event.target.value))
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
      case "act_byte":
        setByte(Number(event.target.value))
        break;
      default:
        return;
    }
  }

  // 저장버튼 클릭 제출
  const handleSubmit = (event) => {
    event.preventDefault();
    if (_subject !== 'default') {
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
        if (title !== '' && _subject !== 'default' && content !== '') {
          try {
            askChatGpt(title, _subject, content, byte)
            setTimerModalShow(true)
          } catch (error) {
            window.alert.log(error.message)
          }
        } else {
          window.alert('활동 제목, 과목, 간단한 설명을 입력해주세요.')
        }
        break;
      case "modi_btn":
        setIsModified(true)
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
          navigate("/activities") //todo 삭제 후 잔상 남아있는거 해결해야함. 구독 눌러야 함.
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
      case "do_this_act_btn": //학생 전용
        if (window.confirm("이 활동을 신청하시겠습니까?")) {
          takePartInThisActivity(state.acti, state.classInfo)
          setIsParticipating(true)
        }
        break;
      case "cancel_this_act_btn":
        if (window.confirm("이 활동을 신청 취소하시겠습니까?")) {
          cancelThisActivity(state.acti)
          setIsParticipating(false)
        }
        break;
      case 'go_back_btn': //공용
        navigate(-1)
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
  return (
    <StyledContainer $clientheight={clientHeight}>
      {/* 교사 */}
      {user.isTeacher && <>
        <StyledForm onSubmit={handleSubmit}>
          <fieldset>
            <StyledDiv>
              {state ? <legend>{_subject} 활동 수정</legend> : <legend>활동 생성</legend>}
              <StyledImgPicker src={handleQuestImg(monImg)} alt="퀘스트이미지" onClick={handleImgPickerClick} />
            </StyledDiv>
            <StyledDiv>
              <div>
                <label htmlFor="act_title" >활동 제목</label>
                <input className="act_title" id="act_title" type="text" required onChange={handleChange} value={title} disabled={!isModified}
                  placeholder="ex)포도당 산화 환원 실험" />
              </div>
              {!state && <SubjectSelect subject={_subject} onChange={setSubject} />}
            </StyledDiv>
            <label htmlFor="act_content" >활동 설명하기</label>
            <textarea id="act_content" type="text" onChange={handleChange} value={content} disabled={!isModified}
              placeholder="~활동으로 끝맺기. ex)포도당 산화 환원 실험에 참여하여 원리를 모둠 보고서로 작성하는 활동" />
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <label htmlFor="act_record" >생기부 문구</label>
              {/* 문구 추가 버튼 */}
              {state && <SmallBtn id="extra_Rbtn" btnName="추가" btnColor="#9b0c24" hoverBtnColor="red" margin="0 10px" btnOnClick={() => { setExtraRecModalShow(true) }} />}
            </div>
            <textarea id="act_record" type="text" required onChange={handleChange} value={record} disabled={!isModified} />
            <StyledDiv>
              <label className="act_byte" htmlFor="act_byte" ></label>
              <div>
                <input id="act_byte" className="act_byte" type="number" max={500} onChange={handleChange} value={byte} disabled={!isModified} />
                <p style={{ display: "inline-block" }}> /1500 Byte</p>
              </div>
            </StyledDiv>
            <ScoreWrapper handleChange={handleChange}
              leadershipScore={leadershipScore}
              careerScore={careerScore}
              coopScore={coopScore}
              sincerityScore={sincerityScore}
              attitudeScore={attitudeScore}
              coin={coin}
              disabled={!isModified} />
            < TwoRadios name="isPrivate_radio"
              id={["private_radio", "public_radio"]}
              value={_isPrivate} label={["비공개 활동", "공개 활동"]}
              onChange={handleRadioBtnClick}
              disabled={!isModified} />
            {!_anyPartici &&
              < TwoRadios name="isHomework_radio"
                id={["activity_radio", "homework_radio"]}
                value={!_isHomework} label={["생기부 기록 전용", "과제 제출용"]}
                onChange={handleRadioBtnClick}
                disabled={!isModified} />}
            {_anyPartici && <p>참여중인 학생이 있으므로 생기부 기록 전용으로는 바꿀 수 없습니다.</p>}
            {/*교사 버튼 영역 */}
            {!state ? <> {/*활동 첫 생성 */}
              <StyledBtn type="button" id="gpt_btn" onClick={handleBtnClick}>GPT로 세특 문구 작성</StyledBtn>
              <StyledBtn type="submit">저장</StyledBtn></>
              : <>
                {(state.acti.uid === user.uid) && <>
                  {!state.acti.madeById ? <>
                    {/*활동 수정하기 */}
                    {isModified && <StyledBtn type="button" id="gpt_btn" onClick={handleBtnClick}>GPT로 세특 문구 작성</StyledBtn>}
                    {!isModified ? <StyledBtn type="button" id="modi_btn" onClick={handleBtnClick}>수정</StyledBtn> : <StyledBtn type="submit">저장</StyledBtn>}
                    <StyledBtn type="button" id="delete_btn" onClick={handleBtnClick}>삭제</StyledBtn></> : <>
                    {/*업어온 활동 삭제하기 */}
                    <StyledBtn type="button" id="copied_delete_btn" onClick={handleBtnClick}>삭제</StyledBtn></>}
                </>}
                {(state.acti.uid !== user.uid) && <> {/*활동 업어가기 */}
                  <StyledBtn type="button" id="copy_btn" onClick={handleBtnClick}>업어가기</StyledBtn>
                </>}
              </>}
            <StyledBtn type="button" id="go_back_btn" onClick={handleBtnClick}>목록</StyledBtn>
          </fieldset>
        </StyledForm>
      </>}
      {/* 학생 */}
      {!user.isTeacher && <>
        <StyledForm $clientheight={clientHeight} onSubmit={handleSubmit}>
          <fieldset>
            <StyledDiv>
              <legend>활동 신청하기</legend>
              <StyledImgPicker src={handleQuestImg(monImg)} alt="퀘스트이미지" />
            </StyledDiv>
            <StyledDiv>
              <div>
                <label htmlFor="act_title" >활동 제목</label>
                <input className="act_title" id="act_title" type="text" required onChange={handleChange} value={title} disabled />
              </div>
            </StyledDiv>
            <label htmlFor="act_content" >GPT에게 활동 설명하기</label>
            <textarea id="act_content" type="text" onChange={handleChange} value={content} disabled />
            <label htmlFor="act_record" >생기부 문구</label>
            <textarea id="act_record" type="text" required onChange={handleChange} value={record} disabled />
            <ScoreWrapper handleChange={handleChange}
              leadershipScore={leadershipScore}
              careerScore={careerScore}
              coopScore={coopScore}
              sincerityScore={sincerityScore}
              attitudeScore={attitudeScore}
              coin={coin}
              disabled={true}
            />
            {_isHomework &&
              (!isParticipating
                ? <StyledBtn type="button" id="do_this_act_btn" onClick={handleBtnClick}>신청</StyledBtn>
                : <><StyledBtn type="button" $color={"#3454d1"} $background={"#efefef"}>참여중</StyledBtn>
                  {!isHomeworkSubmit && <StyledBtn type="button" id="cancel_this_act_btn" onClick={handleBtnClick}>신청 취소</StyledBtn>}</>
              )
            }
            <StyledBtn type="button" id="go_back_to_class_btn" onClick={handleBtnClick}>목록</StyledBtn>
          </fieldset>
        </StyledForm>
      </>}
      {/* 추후 삭제하기 */}
      {/* {isParticipating && <Homework activity={state.acti} homeworkSubmit={(isSubmit) => { setIsHomeworkSubmit(isSubmit) }} />}
      {state && <CircleList dataList={state.acti.particiList} acti={state.acti} />} */}
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
      {(state && extraRecModalShow) && < AddExtraRecModal
        show={extraRecModalShow}
        onHide={() => setExtraRecModalShow(false)}
        acti={state.acti}
      />}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  @media screen and (max-width: 767px){
    width: 100%;
    height: ${(props) => { return props.$clientheight }}px;
    overflow-y: auto;
  }
`
const StyledForm = styled.form`
  max-width: 540px;
  margin: 60px auto 30px;
  padding: 20px;
  color: #efefef;
  background-color: #3454d1;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  fieldset {
    position: relative;
    border: none;
  }
  legend {
    width: 70%;  
    font-size: 1.5em;
    margin-bottom: 40px;
  }
  label {
    display: block;
  }
  textarea { /* 활동 설명 및 생기부 문구*/
    display: block;
    width: 100%;
    min-width: 400px;
    min-height: 150px;
    margin-top: 5px;
    margin-bottom: 15px;
    border-radius: 7px;
    &:disabled {  /* 해당 개체 disabled 되었을 때 */
      color: #efefef;
    }
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
    &:disabled {             /* 해당 input disabled 되었을 때 */
        color: #efefef;      /* 글자 색을 white로 설정 */
    }
  }
  label.act_byte {
    margin-bottom: 15px;
  }
  input.act_byte {
    width: 85px;
    margin-right: 5px;
  }
  select {
    height: 35px;
    border-radius: 7px;
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
const StyledBtn = styled.button`
  margin: 8px auto;
  margin-top: 25px;
  width: 80%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => { return props.$color ? props.$color : "#efefef" }};
  background-color: ${(props) => { return props.$background ? props.$background : "#3454d1" }};
  border-radius: 15px;
  border: 2px solid #efefef;
  padding: 25px;
  @media screen and (max-width: 767px){
    margin-top: 20px;
  }
`
export default ActivityForm