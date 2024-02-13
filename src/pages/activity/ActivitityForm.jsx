//라이브러리
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Form from 'react-bootstrap/Form';
import styled from "styled-components";
//hooks
import useChatGpt from "../../hooks/useChatGpt";
import useClientHeight from "../../hooks/useClientHeight";
import useFirestore from "../../hooks/useFirestore";
//컴포넌트
import GraphicDialogModal from "../../components/Modal/GraphicDialogModal";
import Wait3SecondsModal from "../../components/Modal/Wait3SecondsModal";
import ScoreWrapper from "../../components/ScoreWrapper"
//이미지
import mon01 from "../../image/enemies/mon_01.png";
import mon02 from "../../image/enemies/mon_02.png"
import mon03 from "../../image/enemies/mon_03.png"
import question from "../../image/icon/question.png"
import useDoActivity from "../../hooks/useDoActivity";
import Homework from "../../components/Homework";
import CircleList from "../../components/CircleList";

//24.01.28 수정
const ActivityForm = () => {
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  //1.활동 기본 정보 변수
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('default');
  const [content, setContent] = useState('');
  const [record, setRecord] = useState('');
  const [monImg, setMonImg] = useState(null);
  const [isHomework, setIsHomework] = useState(false)
  //2.경험치 점수 변수
  const [leadershipScore, setLeadershipScore] = useState(0);
  const [careerScore, setCareerScore] = useState(0);
  const [sincerityScore, setSincerityScore] = useState(0);
  const [coopScore, setCoopScore] = useState(0);
  const [attitudeScore, setAttitudeScore] = useState(0);
  const [coin, setCoin] = useState(0);
  //3.대화창 보여주기 변수
  const [modalShow, setModalShow] = useState(false)
  const [timerModalShow, setTimerModalShow] = useState(false)
  //4.데이터 통신 변수
  const { addDocument, updateAct, deleteDocument } = useFirestore('activities');
  const { takePartInThisActivity, cancelThisActivity } = useDoActivity()
  //5.경로 이동 관련 변수
  const { state } = useLocation()
  const navigate = useNavigate()
  //6.ChatGPt
  const { gptAnswer, askChatGpt, gptRes } = useChatGpt()
  //7.Style
  const clientHeight = useClientHeight(document.documentElement)
  //8. 학생 전용
  const [isParticipating, setIsParticipating] = useState(false)

  useEffect(() => {
    if (user.myActList && state) {
      let thisAct = user.myActList.find((item) => { return item.id === state.acti.id })
      if (thisAct) {
        setIsParticipating(true)
      } else {
        setIsParticipating(false)
      }
    }
  }, [user])

  useEffect(() => {
    if (state) {
      console.log(state.acti)
      let scoresObj = state.acti.scores
      let acti = state.acti
      setTitle(acti.title)
      setContent(acti.content)
      setRecord(acti.record)
      setMonImg(acti.monImg)
      setSubject(acti.subject)
      setIsHomework(acti.isHomework)
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
      const confirm = window.confirm('활동을 수정하시겠습니까?')
      let actId = state.acti.id
      let uid = state.acti.uid
      if (confirm) {
        let modifiedAct = { uid, title, subject, content, record, scores, money, monImg, isHomework };
        updateAct(modifiedAct, actId)
        navigate(`/activities`)
      }
    } else {
      const confirm = window.confirm('활동을 생성하시겠습니까?')
      if (confirm) {
        let newAct = { uid: user.uid, title, subject, content, record, scores, money, monImg, isHomework };
        addDocument(newAct)
        navigate(`/activities`)
      }
    }
  }

  //변화 감지 변수 수정
  const handleChange = (event) => {
    if (event.target.id === 'act_title') {
      setTitle(event.target.value)
    } else if (event.target.id === 'act_subject') {
      setSubject(event.target.value)
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
    } else if (event.target.id === 'act_attitudes') {
      setAttitudeScore(Number(event.target.value))
    } else if (event.target.id === 'act_coin') {
      setCoin(Number(event.target.value))
    }
  }

  // 저장/수정버튼 클릭 제출
  const handleSubmit = (event) => {
    event.preventDefault();
    if (subject !== 'default') {
      showConfirmModal();
    } else {
      window.alert('과목을 입력해주세요')
    }
  }

  //버튼 클릭
  const handleBtnClick = (event) => {
    event.preventDefault();
    switch (event.target.id) {
      case 'gpt_btn': //교사 전용
        if (title !== '' && subject !== 'default') {
          try {
            askChatGpt(title, subject, content)
            setTimerModalShow(true)
          } catch (error) {
            window.alert.log(error.message)
          }
        } else {
          window.alert('활동 제목과 과목을 채워주세요. 간단한 설명을 입력하면 더 정확한 문구를 얻을 수 있어요')
        }
        break;

      case 'delete_btn':
        if (window.confirm('활동을 삭제하시겠습니까?')) {
          deleteDocument(state.acti.id)
          navigate(`/activities`)
        }
        break;
      case "go_back_to_class_btn":
        navigate(-1)
        break;
      case "do_this_act_btn": //학생 전용
        if (window.confirm("이 활동을 신청하시겠습니까?")) {
          takePartInThisActivity(state.acti, state.classInfo)
        }
        break;
      case "cancel_this_act_btn":
        if (window.confirm("이 활동을 신청 취소하시겠습니까?")) {
          cancelThisActivity(state.acti)
        }
        break;
      case 'go_back_btn': //공용
        navigate(`/activities`)
        break;
      default: return
    }
  }

  //퀘스트 이미지 선택
  const handleImgPickerClick = () => {
    setModalShow(true)
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
      default:
        img = question;
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
    <>
      <StyledForm $clientheight={clientHeight} onSubmit={handleSubmit}>
        <fieldset>
          <StyledFirstDiv>
            {user.isTeacher && (state ? <legend>활동 수정하기</legend> : <legend>활동 작성하기</legend>)}
            {!user.isTeacher && <legend>활동 신청하기</legend>}
            {user.isTeacher
              ? <StyledImgPicker src={handleQuestImg(monImg)} alt="퀘스트이미지" onClick={handleImgPickerClick} />
              : <StyledImgPicker src={handleQuestImg(monImg)} alt="퀘스트이미지" />
            }
          </StyledFirstDiv>
          <StyledFirstDiv>
            <div>
              <label htmlFor="act_title" >활동 제목</label>
              {user.isTeacher && <input className="act_title" id="act_title" type="text" required onChange={handleChange} value={title} />}
              {!user.isTeacher && <input className="act_title" id="act_title" type="text" required onChange={handleChange} value={title} disabled />}
            </div>
            {user.isTeacher && <select id='act_subject' required value={subject} onChange={handleChange}>
              <option value="default" disabled >과목을 선택하세요</option>
              <option value="국어">국어과</option>
              <option value="영어">영어과</option>
              <option value="수학">수학과</option>
              <option value="사회">사회과</option>
              <option value="과학">과학과</option>
              <option value="예체능">음,미,체</option>
              <option value="제2외국어">제2외국어과</option>
              <option value="정보">정보</option>
            </select>}
          </StyledFirstDiv>
          <label htmlFor="act_content" >GPT 또는 학생들에게 활동 설명하기</label>
          {user.isTeacher && <textarea id="act_content" type="text" onChange={handleChange} value={content} />}
          {!user.isTeacher && <textarea id="act_content" type="text" onChange={handleChange} value={content} disabled />}
          <label htmlFor="act_record" >생기부 문구</label>
          {user.isTeacher && <textarea id="act_record" type="text" required onChange={handleChange} value={record} />}
          {!user.isTeacher && <textarea id="act_record" type="text" required onChange={handleChange} value={record} disabled />}

          <ScoreWrapper handleChange={handleChange}
            leadershipScore={leadershipScore}
            careerScore={careerScore}
            coopScore={coopScore}
            sincerityScore={sincerityScore}
            attitudeScore={attitudeScore}
            coin={coin}
          />
          {/* 활동구분 */}
          {user.isTeacher &&
            <div className='radio_div'>
              <div>활동구분</div>
              <Form.Check onChange={handleRadioBtnClick}
                inline
                type='radio'
                id={'activity_radio_btn'}
                name='isHomework_radio'
                label={'생기부 기록 전용'}
                // value={isHomework}
                checked
              ></Form.Check>
              <Form.Check onChange={handleRadioBtnClick}
                inline
                type='radio'
                id={'homework_radio_btn'}
                name='isHomework_radio'
                label={'과제 제출도 가능'}
              // value={isHomework}
              ></Form.Check>
            </div>}
          {/* 교사용 버튼 모음: 아이템List를 클릭하여 이동했을시 다른 폼 보여주기 */}
          {user.isTeacher && <>
            <StyledBtn type="button" id="gpt_btn" onClick={handleBtnClick}>GPT로 세특 문구 작성하기</StyledBtn>
            {state ? <StyledBtn type="submit">수정하기</StyledBtn> : <StyledBtn type="submit">저장하기</StyledBtn>}
            {state && <StyledBtn type="button" id="delete_btn" onClick={handleBtnClick}>삭제하기</StyledBtn>}
            <StyledBtn type="button" id="go_back_btn" onClick={handleBtnClick}>돌아가기</StyledBtn>
          </>}
          {/* 학생용 버튼 모음*/}
          {!user.isTeacher && <>
            {isHomework &&
              (!isParticipating
                ? <StyledBtn type="button" id="do_this_act_btn" onClick={handleBtnClick}>신청하기</StyledBtn>
                : <><StyledBtn type="button" $color={"#3454d1"} $background={"#efefef"}>참여중</StyledBtn>
                  <StyledBtn type="button" id="cancel_this_act_btn" onClick={handleBtnClick}>신청 취소</StyledBtn></>
              )
            }
            <StyledBtn type="button" id="go_back_to_class_btn" onClick={handleBtnClick}>확인</StyledBtn>
          </>}
        </fieldset>
      </StyledForm>
      {isParticipating && <Homework activity={state.acti} />}
      <CircleList dataList={state.acti.studentParticipatingList} acti={state.acti}/>
      <GraphicDialogModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setMonImg={setMonImg}
      />
      <Wait3SecondsModal
        show={timerModalShow}
      />
    </>
  )
}
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
  }
  @media screen and (max-width: 767px){
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    max-width: 100%;
    margin: 0;
    padding: 15px;
    color: #efefef;
    background-color: #3454d1;
    border: none;
    border-radius: 0;
    box-shadow: none;
    overflow-y: scroll;
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
  }
  select {
    height: 35px;
  }
`
const StyledImgPicker = styled.img`
  position: relative;
  float: right;
  width: 100px;
  height: 100px;
  padding: 10px;
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