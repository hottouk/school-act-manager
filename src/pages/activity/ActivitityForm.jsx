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
//컴포넌트
import GraphicDialogModal from "../../components/Modal/GraphicDialogModal";
import Wait3SecondsModal from "../../components/Modal/Wait3SecondsModal";
import ScoreWrapper from "../../components/ScoreWrapper"
import CircleList from "../../components/CircleList";
import QuestModal from "../../components/Modal/QuestModal";
import SubjectSelect from "../../components/SubjectSelect";
import HomeworkRadio from "../../components/Radio/HomeworkRadio";
import Homework from "../../components/Homework";
//이미지
import mon01 from "../../image/enemies/mon_01.png";
import mon02 from "../../image/enemies/mon_02.png"
import mon03 from "../../image/enemies/mon_03.png"
import mon04 from "../../image/enemies/mon_04.png"
import mon05 from "../../image/enemies/mon_05.png"
import question from "../../image/icon/question.png"
import useFireTransaction from "../../hooks/useFireTransaction";

//24.06.30 수정
const ActivityForm = () => { //진입 경로 총 4곳: 교사 3(활동관리-활동생성, 활동관리-나의활동, 활동관리-다른교사) 학생 1
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  //1.활동 기본 정보 변수
  const [title, setTitle] = useState('');
  const [_subject, setSubject] = useState('default');
  const [content, setContent] = useState('');
  const [record, setRecord] = useState('');
  const [monImg, setMonImg] = useState(null);
  const [_isHomework, setIsHomework] = useState(false)
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
  const [isHomeworkSubmit, setIsHomeworkSubmit] = useState(false)
  const [isModified, setIsModified] = useState(false)
  //4.데이터 통신 변수
  const { addActi, updateActi } = useAddUpdFireData("activities");
  const { copyActiTransaction, delCopiedActiTransaction } = useFireTransaction()
  const { takePartInThisActivity, cancelThisActivity } = useDoActivity();
  const { deleteActi } = useFireActi();
  //5.경로 이동 관련 변수
  const { state } = useLocation() //state는 활동
  const navigate = useNavigate()
  //6.ChatGPt
  const { gptAnswer, askChatGpt, gptRes } = useChatGpt()
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
      setCoin(acti.money)
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
      let uid = state.acti.uid
      if (confirm) {
        let modifiedAct = { uid, title, subject: _subject, content, record, scores, madeBy: user.name, money, monImg, isHomework: _isHomework };
        updateActi(modifiedAct, actId)
        navigate("/activities")
        setIsModified(false)
      }
    } else {
      const confirm = window.confirm('활동을 생성하시겠습니까?')
      if (confirm) {
        let newAct = { uid: user.uid, title, subject: _subject, content, record, scores, madeBy: user.name, money, monImg, isHomework: _isHomework };
        addActi(newAct)
        navigate("/activities")
      }
    }
  }

  //변화 감지
  const handleChange = (event) => {
    if (event.target.id === 'act_title') {
      setTitle(event.target.value)
    } else if (event.target.id === 'act_content') {
      setContent(event.target.value)
    } else if (event.target.id === 'act_record') {
      setRecord(event.target.value)
    } else if (event.target.id === 'act_leadership') {
      setLeadershipScore(Number(event.target.value))
    } else if (event.target.id === 'act_career') {
      setCareerScore(Number(event.target.value))
    } else if (event.target.id === 'act_sincerity') {
      setSincerityScore(Number(event.target.value))
    } else if (event.target.id === 'act_coop') {
      setCoopScore(Number(event.target.value))
    } else if (event.target.id === 'act_attitude') {
      setAttitudeScore(Number(event.target.value))
    } else if (event.target.id === 'act_coin') {
      setCoin(Number(event.target.value))
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
        if (title !== '' && _subject !== 'default') {
          try {
            askChatGpt(title, _subject, content)
            setTimerModalShow(true)
          } catch (error) {
            window.alert.log(error.message)
          }
        } else {
          window.alert('활동 제목과 과목을 채워주세요. 간단한 설명을 입력하면 더 정확한 문구를 얻을 수 있어요')
        }
        break;
      case "modi_btn":
        setIsModified(true)
        break;
      case "delete_btn":
        if (window.confirm("이 활동을 정말로 삭제하시겠습니까?")) {
          deleteActi(state.acti.id)
          navigate("/activities") //todo 삭제 후 잔상 남아있는거 해결해야함.
        }
        break;
      case "copied_delete_btn":
        if (window.confirm("이 활동을 정말로 삭제하시겠습니까?")) {
          delCopiedActiTransaction(state.acti.id)
          navigate("/activities") //todo 삭제 후 잔상 남아있는거 해결해야함.
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
    switch (event.target.id) {
      case 'homework_radio_btn':
        setIsHomework(true)
        break;
      case 'activity_radio_btn':
        setIsHomework(false)
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
            <StyledFirstDiv>
              {state ? <legend>{_subject} 활동 수정</legend> : <legend>활동 생성</legend>}
              <StyledImgPicker src={handleQuestImg(monImg)} alt="퀘스트이미지" onClick={handleImgPickerClick} />
            </StyledFirstDiv>
            <StyledFirstDiv>
              <div>
                <label htmlFor="act_title" >활동 제목</label>
                <input className="act_title" id="act_title" type="text" required onChange={handleChange} value={title} disabled={!isModified} />
              </div>
              {!state && <SubjectSelect subject={_subject} onChange={setSubject} />}
            </StyledFirstDiv>
            <label htmlFor="act_content" >활동 설명하기</label>
            <textarea id="act_content" type="text" onChange={handleChange} value={content} disabled={!isModified} />
            <label htmlFor="act_record" >생기부 문구</label>
            <textarea id="act_record" type="text" required onChange={handleChange} value={record} disabled={!isModified} />
            <ScoreWrapper handleChange={handleChange}
              leadershipScore={leadershipScore}
              careerScore={careerScore}
              coopScore={coopScore}
              sincerityScore={sincerityScore}
              attitudeScore={attitudeScore}
              coin={coin}
              disabled={!isModified} />
            {!_anyPartici &&
              < HomeworkRadio isHomework={_isHomework} onChange={handleRadioBtnClick} disabled={!isModified} />}
            {_anyPartici && <p>참여중인 학생이 있으므로 생기부 기록 전용으로는 바꿀 수 없습니다.</p>}
            {/*교사 버튼 영역 */}
            {!state ? <> {/*활동 첫 생성 */}
              <StyledBtn type="button" id="gpt_btn" onClick={handleBtnClick}>GPT로 세특 문구 작성</StyledBtn>
              <StyledBtn type="submit">저장</StyledBtn></>
              : <>
                {(state.acti.uid === user.uid) && <>
                  {isModified && <StyledBtn type="button" id="gpt_btn" onClick={handleBtnClick}>GPT로 세특 문구 작성</StyledBtn>}
                  {!isModified ? <StyledBtn type="button" id="modi_btn" onClick={handleBtnClick}>수정</StyledBtn> : <StyledBtn type="submit">저장</StyledBtn>}
                  {!state.acti.madeById ? <>
                    {/*활동 삭제하기 */}
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
            <StyledFirstDiv>
              <legend>활동 신청하기</legend>
              <StyledImgPicker src={handleQuestImg(monImg)} alt="퀘스트이미지" />
            </StyledFirstDiv>
            <StyledFirstDiv>
              <div>
                <label htmlFor="act_title" >활동 제목</label>
                <input className="act_title" id="act_title" type="text" required onChange={handleChange} value={title} disabled />
              </div>
            </StyledFirstDiv>
            <label htmlFor="act_content" >GPT 또는 학생들에게 활동 설명하기</label>
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
      {isParticipating && <Homework activity={state.acti} homeworkSubmit={(isSubmit) => { setIsHomeworkSubmit(isSubmit) }} />}
      {state && <CircleList dataList={state.acti.particiList} acti={state.acti} />}
      {/* 모달 */}
      <GraphicDialogModal
        show={graphicModalShow}
        onHide={() => setgraphicModalShow(false)}
        setMonImg={setMonImg}
      />
      <Wait3SecondsModal
        show={timerModalShow}
      />
      <QuestModal
        show={questModalShow}
        onHide={() => setQuestModalShow(false)}
      />
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
  textarea {
    display: block;
    width: 100%;
    min-width: 400px;
    min-height: 150px;
    margin-top: 5px;
    margin-bottom: 15px;
    border-radius: 7px;
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

const StyledFirstDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  select{
    height: 60%;
    margin-bottom: 15px;
  }
  input.act_title {
    margin-top: 5px;
    margin-bottom: 15px;
    max-width: 280px;
    height: 35px;
    border-radius: 7px;
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