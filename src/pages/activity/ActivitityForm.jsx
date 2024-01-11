//라이브러리
import OpenAI from "openai";
import { useEffect, useState } from "react"
//hooks
import useFirestore from "../../hooks/useFirestore";
//컴포넌트
import GraphicDialogModal from "../../components/Modal/GraphicDialogModal";
//이미지
import mon_01 from "../../image/enemies/mon_01.png";
import mon_02 from "../../image/enemies/mon_02.png"
import mon_03 from "../../image/enemies/mon_03.png"
//스타일
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import Wait3SecondsModal from "../../components/Modal/Wait3SecondsModal";
import { useSelector } from "react-redux";
import ScoreWrapper from "../../components/ScoreWrapper";


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
  let openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true })

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
      console.log(state)
      const scoresObj = state.scores
      setTitle(state.title)
      setContent(state.content)
      setRecord(state.record)
      setMonImg(state.monImg)
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
    if (setTimerModalShow === false) {
      clearTimeout()
    }
  }, [setTimerModalShow])

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

  const askChatGptToWrite = async () => {
    let messages
    if (content === '') {
      messages = [
        { role: "system", content: "당신은 학생의 생기부를 쓰는 교사입니다." },
        { role: "user", content: "여행지 소개하기 활동을 수행한 학생이 받을 생기부 세특 예시를 작성해 주세요." },
        { role: "assistant", content: "여행해보고 싶은 해외의 도시로 LA를 선정하여, 그 지역 명소인 디즈니랜드의 실제 리뷰를 해외 사이트에서 찾아, 이를 바탕으로 여행지를 소개하는 글을 작성하였고 구체적인 여행 계획을 세움." },
        { role: "user", content: "영어로 토론하기 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "영어로 토론하기 활동에서 '집값을 낮추어야 출산률이 반등한다' 라는 본인의 주장을 근거를 들어 토론을 진행함. 청중에게 시선을 골고루 맞추고 인상적인 제스처와 통계를 활용하여 건설적인 토의를 진행함." },
        { role: "user", content: "읽기 1회 활동은 수업시간에 자발적으로 손을 들어 주어진 지문을 읽는 활동이에요. 읽기 1회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "수업시간에 자발적으로 손을 들어 명쾌한 발음과 자연스러운 억양으로 주어진 지문을 1회 읽음." },
        { role: "user", content: "발표3회 활동은 수업시간에 영어 지문을 3회 해석하며 발표한 활동이에요. 발표3회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "다양한 영역의 지문을 섭렵하여 조사하여 설명함으로 본인의 뛰어난 융, 복합적 문해 능력을 증명함. 수업시간에 성실하게 참여하는 적극성이 돋보이는 학생임." },
        { role: "user", content: "영어 멘토 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "영어 멘토 활동에서 동료 학생들에게 영어 학습에 관한 조언과 도움을 주며, 개인화된 학습 계획을 돕는 역할을 수행함. 영어 멘토로서의 리더십과 소통 능력을 통해 학생들의 영어 실력 향상을 도왔음." },
        { role: "user", content: `${title}활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요.` }
      ]
    } else {
      messages = [
        { role: "system", content: "당신은 학생의 생기부를 쓰는 교사입니다." },
        { role: "user", content: "여행지 소개하기 활동을 수행한 학생이 받을 생기부 세특 예시를 작성해 주세요." },
        { role: "assistant", content: "여행해보고 싶은 해외의 도시로 LA를 선정하여, 그 지역 명소인 디즈니랜드의 실제 리뷰를 해외 사이트에서 찾아, 이를 바탕으로 여행지를 소개하는 글을 작성하였고 구체적인 여행 계획을 세움." },
        { role: "user", content: "영어로 토론하기 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "영어로 토론하기 활동에서 '집값을 낮추어야 출산률이 반등한다' 라는 본인의 주장을 근거를 들어 토론을 진행함. 청중에게 시선을 골고루 맞추고 인상적인 제스처와 통계를 활용하여 건설적인 토의를 진행함." },
        { role: "user", content: "읽기 1회 활동은 수업시간에 자발적으로 손을 들어 주어진 지문을 읽는 활동이에요. 읽기 1회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "수업시간에 자발적으로 손을 들어 명쾌한 발음과 자연스러운 억양으로 주어진 지문을 1회 읽음." },
        { role: "user", content: "발표3회 활동은 수업시간에 영어 지문을 3회 해석하며 발표한 활동이에요. 발표3회를 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "다양한 영역의 지문을 섭렵하여 조사하여 설명함으로 본인의 뛰어난 융, 복합적 문해 능력을 증명함. 수업시간에 성실하게 참여하는 적극성이 돋보이는 학생임." },
        { role: "user", content: "영어 멘토 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요." },
        { role: "assistant", content: "영어 멘토 활동에서 동료 학생들에게 영어 학습에 관한 조언과 도움을 주며, 개인화된 학습 계획을 돕는 역할을 수행함. 영어 멘토로서의 리더십과 소통 능력을 통해 학생들의 영어 실력 향상을 도왔음." },
        { role: "user", content: `${title}활동은 ${content}입니다. 이 활동을 수행한 학생의 생기부에 적을 예시 문구를 작성해 주세요.` }
      ]
    }

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    if (completion.choices[0].message.content) {
      setRecord(completion.choices[0].message.content)
    } else {
      setRecord('챗GPT 서버 문제로 문구를 입력할 수 없습니다.')
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
        if (title !== '') {
          try {
            askChatGptToWrite()
            setTimerModalShow(true)
          } catch (error) {
            console.log(error.message)
          }
        } else {
          window.alert('활동 제목을 채워주세요. 간단한 설명을 입력하면 더 정확한 문구를 얻을 수 있어요')
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
            {!monImg ? <StyledImgPicker alt="엑스이미지 찾기" onClick={() => { handleImgPickerClick() }} />
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
        onHide={setTimeout(() => { setTimerModalShow(false) }, 5000)}
      />
    </>
  )
}

const StyledForm = styled.form`
  max-width: 540px;
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
`
export default ActivityForm