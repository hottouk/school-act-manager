import { useEffect, useState } from "react"
import useFirestore from "../../hooks/useFirestore";
import GraphicDialogModal from "../../components/GraphicDialogModal";
//이미지
import mon_01 from "../../image/enemies/mon_01.png";
import mon_02 from "../../image/enemies/mon_02.png"
import mon_03 from "../../image/enemies/mon_03.png"
//스타일
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const StyledForm = styled.form`
  padding: 20px;
  background-color: teal;
  border-radius: 10px;
`
const StyledFieldSet = styled.fieldset`
  position: relative;
  border: none;
`
const StyledLegend = styled.legend`
  color: white;
  font-size: 1.5em;
  margin-bottom: 20px;
`
const StyledTitleInput = styled.input`
  display: block;
  margin-top: 5px;
  margin-bottom: 15px;
  width: 60%;
  max-width: 280px;
  height: 27px;
`
const StyledImgPicker = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 100px;
  height: 100px;
  border-radius: 20px;
  border: 1px solid black;
  background-color: #fff;
  cursor: pointer;
`
const StyledTextarea = styled.textarea`
  display: block;
  width: 100%;
  min-width: 400px;
  min-height: 150px;
  margin-top: 5px;
  margin-bottom: 15px;
`
const StyledScoreWrapper = styled.div`
  width: 100%;
  margin : 20px auto;
  text-align : center;
`
const StyledInputBox = styled.div`
  display: inline-block;
  background-color: red;
`
const StyledNumberInput = styled.input`
  width: 72px;
  height: 30px;
  margin-top: 7px;
`
const StyledLabel = styled.label`
  display: block;
  color: white; 
`
const StyledBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px auto;
  margin-top: 25px;
  width: 80%;
  color: whitesmoke;
  background-color: transparent;
  border-radius: 15px;
  border: 2px solid whitesmoke;
  padding: 25px;
`
const ActivityForm = ({ uid }) => {
  //1.활동 기본 정보 변수
  const [title, setTitle] = useState('');
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

  //4.데이터 쓰기/받기 변수
  const { addDocument, updateAct, deleteDocument, response } = useFirestore('activities');

  //5.경로 이동 관련 변수
  const { state } = useLocation()
  const navigate = useNavigate()

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

  //활동 저장 대화창 ==> 추후 디자인 수정 필요
  const showConfirmWindow = () => {
    let scores = { leadership: leadershipScore, careerScore: careerScore, sincerityScore: sincerityScore, coopScore: coopScore, attitudeScore: attitudeScore };
    let money = coin
    if (state) {
      const confirm = window.confirm('활동을 수정하시겠습니까?')
      let actId = state.id
      let uid = state.uid
      if (confirm) {
        let modifiedAct = { uid, title, content, record, scores, money };
        updateAct(modifiedAct, actId)
        navigate(`/activities`)
      }
    } else {
      const confirm = window.confirm('활동을 생성하시겠습니까?')
      if (confirm) {
        let newAct = { uid, title, content, record, scores, money };
        addDocument(newAct)
      }
    }
  }

  //변화 감지 변수 수정
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
    } else if (event.target.id === 'act_attitudes') {
      setAttitudeScore(Number(event.target.value))
    } else if (event.target.id === 'act_coin') {
      setCoin(Number(event.target.value))
    }
  }

  //저장/수정버튼 클릭
  const handleSubmit = (event) => {
    event.preventDefault();
    showConfirmWindow();
  }

  //뒤로 가기 
  const handleGoBack = (event) => {
    event.preventDefault();
    navigate(`/activities`)
  }

  //활동 삭제
  const handleDelete = (event) => {
    event.preventDefault();
    const confirm = window.confirm('활동을 삭제하시겠습니까?')
    if (confirm) {
      deleteDocument(state.id)
      navigate(`/activities`)
    }
  }

  //활동 이미지 선택
  const handleImgPickerClick = () => {
    setModalShow(true)
  }

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFieldSet>
          {state ? <StyledLegend>활동 수정하기</StyledLegend> : <StyledLegend>활동 작성하기</StyledLegend>}
          {!monImg ? <StyledImgPicker alt="엑스이미지 찾기" onClick={() => { handleImgPickerClick() }} />
            : (monImg === "mon_01") ? <StyledImgPicker src={mon_01} alt="몬스터1" onClick={() => { handleImgPickerClick() }} />
              : (monImg === "mon_02") ? <StyledImgPicker src={mon_02} alt="몬스터2" onClick={() => { handleImgPickerClick() }} />
                : <StyledImgPicker src={mon_03} alt="몬스터3" onClick={() => { handleImgPickerClick() }} />}

          <StyledLabel htmlFor="act_title" >활동 제목</StyledLabel>
          <StyledTitleInput id="act_title" type="text" required onChange={handleChange} value={title} />

          <StyledLabel htmlFor="act_content" >활동 설명</StyledLabel>
          <StyledTextarea id="act_content" type="text" required onChange={handleChange} value={content} />

          <StyledLabel htmlFor="act_record" >생기부 문구</StyledLabel>
          <StyledTextarea id="act_record" type="text" required onChange={handleChange} value={record} />

          <StyledScoreWrapper>
            <StyledInputBox>
              <StyledLabel htmlFor="act_leadership">리더십</StyledLabel>
              <StyledNumberInput id="act_leadership" type="number" value={leadershipScore} onChange={handleChange}></StyledNumberInput>
            </StyledInputBox>
            <StyledInputBox>
              <StyledLabel htmlFor="act_career">진로</StyledLabel>
              <StyledNumberInput id="act_career" type="number" value={careerScore} onChange={handleChange}></StyledNumberInput>
            </StyledInputBox>
            <StyledInputBox>
              <StyledLabel htmlFor="act_sincerity">성실성</StyledLabel>
              <StyledNumberInput id="act_sincerity" type="number" value={sincerityScore} onChange={handleChange}></StyledNumberInput>
            </StyledInputBox>
            <StyledInputBox>
              <StyledLabel htmlFor="act_coop">협동성</StyledLabel>
              <StyledNumberInput id="act_coop" type="number" value={coopScore} onChange={handleChange}></StyledNumberInput>
            </StyledInputBox>
            <StyledInputBox>
              <StyledLabel htmlFor="act_attitude">태도</StyledLabel>
              <StyledNumberInput id="act_attitudes" type="number" value={attitudeScore} onChange={handleChange}></StyledNumberInput>
            </StyledInputBox>
            <StyledInputBox>
              <StyledLabel htmlFor="act_attitude">리아</StyledLabel>
              <StyledNumberInput id="act_coin" type="number" value={coin} onChange={handleChange}></StyledNumberInput>
            </StyledInputBox>
          </StyledScoreWrapper>
          {/* 아이템List를 클릭하여 이동했을시 다른 폼 보여주기 */}
          {state ? <StyledBtn type="submit">수정하기</StyledBtn> : <StyledBtn type="submit">저장하기</StyledBtn>}
          {state && <StyledBtn type="button" onClick={handleDelete}>삭제하기</StyledBtn>}
          {state && <StyledBtn type="button" onClick={handleGoBack}>돌아가기</StyledBtn>}
        </StyledFieldSet>
      </StyledForm>
      <GraphicDialogModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setMonImg={setMonImg}
      />
    </>
  )
}

export default ActivityForm