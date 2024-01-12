//라이브러리
import { useEffect, useState } from "react"
//hooks
import useFirestore from "../../hooks/useFirestore";
//컴포넌트
import GraphicDialogModal from "../../components/Modal/GraphicDialogModal";
//이미지
import mon_01 from "../../image/enemies/mon_01.png";
import mon_02 from "../../image/enemies/mon_02.png"
import mon_03 from "../../image/enemies/mon_03.png"
import question from "../../image/icon/question.png"
//스타일
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import Wait3SecondsModal from "../../components/Modal/Wait3SecondsModal";
import { useSelector } from "react-redux";
import ScoreWrapper from "../../components/ScoreWrapper";
import useChatGpt from "../../hooks/useChatGpt";

const ActivityForm = () => {
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  //1.활동 기본 정보 변수
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('default');
  const [content, setContent] = useState('');
  const [record, setRecord] = useState('');
  const [monImg, setMonImg] = useState(null);
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
  //4.데이터 쓰기/받기 변수
  const { addDocument, updateAct, deleteDocument, response } = useFirestore('activities');
  //5.경로 이동 관련 변수
  const { state } = useLocation()
  const navigate = useNavigate()
  //6.ChatGPt
  const { gptAnswer, askChatGpt, gptRes } = useChatGpt()

  //2. useEffect
  useEffect(() => {
    if (response.isSuccess) {
      setTitle('')
      setContent('')
      setRecord('')
    }
  }, [response.isSuccess]);

  useEffect(() => {
    if (state) {
      const scoresObj = state.scores
      setTitle(state.title)
      setContent(state.content)
      setRecord(state.record)
      setMonImg(state.monImg)
      setSubject(state.subject)
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

  //활동 저장 대화창 ==> 추후 디자인 수정 필요
  const showConfirmModal = () => {
    let scores = { leadership: leadershipScore, careerScore, sincerityScore, coopScore, attitudeScore };
    let money = coin
    if (state) {
      const confirm = window.confirm('활동을 수정하시겠습니까?')
      let actId = state.id
      let uid = state.uid
      if (confirm) {
        let modifiedAct = { uid, title, subject, content, record, scores, money, monImg };
        updateAct(modifiedAct, actId)
        navigate(`/activities`)
      }
    } else {
      const confirm = window.confirm('활동을 생성하시겠습니까?')
      if (confirm) {
        let newAct = { uid: user.uid, title, subject, content, record, scores, money, monImg };
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

  //저장/수정버튼 클릭 제출
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
      case 'gpt_btn':
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
      case 'go_back_btn':
        navigate(`/activities`)
        break;
      case 'delete_btn':
        const confirm = window.confirm('활동을 삭제하시겠습니까?')
        if (confirm) {
          deleteDocument(state.id)
          navigate(`/activities`)
        }
        break;
      default: return
    }
  }

  //활동 이미지 선택
  const handleImgPickerClick = () => {
    setModalShow(true)
  }

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <fieldset>
          <StyledFirstDiv>
            {state ? <legend>활동 수정하기</legend> : <legend>활동 작성하기</legend>}
            {!monImg ? <StyledImgPicker src={question} alt="엑스이미지 찾기" onClick={() => { handleImgPickerClick() }} />
              : (monImg === "mon_01") ? <StyledImgPicker src={mon_01} alt="몬스터1" onClick={() => { handleImgPickerClick() }} />
                : (monImg === "mon_02") ? <StyledImgPicker src={mon_02} alt="몬스터2" onClick={() => { handleImgPickerClick() }} />
                  : <StyledImgPicker src={mon_03} alt="몬스터3" onClick={() => { handleImgPickerClick() }} />}
          </StyledFirstDiv>
          <StyledFirstDiv>
            <div>
              <label htmlFor="act_title" >활동 제목</label>
              <input className="act_title" id="act_title" type="text" required onChange={handleChange} value={title} />
            </div>
            <select id='act_subject' required value={subject} onChange={handleChange}>
              <option value="default" disabled >과목을 선택하세요</option>
              <option value="kor">국어과</option>
              <option value="eng">영어과</option>
              <option value="math">수학과</option>
              <option value="soc">사회과</option>
              <option value="sci">과학과</option>
            </select>
          </StyledFirstDiv>
          <label htmlFor="act_content" >활동 설명</label>
          <textarea id="act_content" type="text" required onChange={handleChange} value={content} />
          <label htmlFor="act_record" >생기부 문구</label>
          <textarea id="act_record" type="text" required onChange={handleChange} value={record} />

          <ScoreWrapper handleChange={handleChange}
            leadershipScore={leadershipScore}
            careerScore={careerScore}
            coopScore={coopScore}
            sincerityScore={sincerityScore}
            attitudeScore={attitudeScore}
            coin={coin}
          />

          {/* 아이템List를 클릭하여 이동했을시 다른 폼 보여주기 */}
          <StyledBtn type="button" id="gpt_btn" onClick={handleBtnClick}>GPT로 세특 문구 작성하기</StyledBtn>
          {state ? <StyledBtn type="submit">수정하기</StyledBtn> : <StyledBtn type="submit">저장하기</StyledBtn>}
          {state && <StyledBtn type="button" id="delete_btn" onClick={handleBtnClick}>삭제하기</StyledBtn>}
          <StyledBtn type="button" id="go_back_btn" onClick={handleBtnClick}>돌아가기</StyledBtn>
        </fieldset>
      </StyledForm>
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
  height: 870px;
  margin: 60px auto;
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
  color: #efefef;
  background-color: transparent;
  border-radius: 15px;
  border: 2px solid #efefef;
  padding: 25px;
  @media screen and (max-width: 767px){
    margin-top: 20px;
  }
`
export default ActivityForm