import { useEffect, useState } from "react"
import useFirestore from "../../hooks/useFirestore";
import GraphicDialogModal from "../../components/GraphicDialogModal";
//이미지
import mon_01 from "../../image/enemies/mon_01.png";
import mon_02 from "../../image/enemies/mon_02.png"
import mon_03 from "../../image/enemies/mon_03.png"
//스타일
import styled from "styled-components";

const StyledFieldSet = styled.fieldset`
  position: relative;
`
const StyledScoreWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  min-width: 400px;
  margin : 20px auto;
  text-align : center;
`
const StyledInputBox = styled.div`
  display: inline-block;
  background-color: red;
`
const StyledInput = styled.input`
  width: 72px;
  height: 30px;
  margin-top: 7px;
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

const Activities = ({ uid }) => {
  //활동 기본 정보
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [record, setRecord] = useState('');
  const [monImg, setMonImg] = useState(null);

  //경험치 점수
  const [leadershipScore, setLeadershipScore] = useState(0);
  const [careerScore, setCareerScore] = useState(0);
  const [sincerityScore, setSincerityScore] = useState(0);
  const [coopScore, setCoopScore] = useState(0);
  const [attitudeScore, setAttitudeScore] = useState(0);

  //대화창 보여주기 변수
  const [modalShow, setModalShow] = useState(false)

  //데이터 쓰기/받기
  const { addDocument, response } = useFirestore('activities');

  useEffect(() => {
    if (response.isSuccess) {
      setTitle('')
      setContent('')
      setRecord('')
    }
  }, [response.isSuccess])

  //활동 저장 대화창 ==> 추후 디자인 수정 필요
  const showConfirmWindow = () => {
    const confirm = window.confirm('활동을 저장하시겠습니까?')
    if (confirm) {
      let scores = { leadership: leadershipScore, careerScore: careerScore, sincerityScore: sincerityScore, coopScore: coopScore, attitudeScore: attitudeScore };
      let newAct = { uid, title, content, record, scores }
      addDocument(newAct)
    }
  }

  const handleChange = (event) => { //변수 수정 
    if (event.target.id === 'act_title') {
      setTitle(event.target.value)
    } else if (event.target.id === 'act_content') {
      setContent(event.target.value)
    } else if (event.target.id === 'act_record') {
      setRecord(event.target.value)
    } else if (event.target.id === 'act_leadership') {
      setLeadershipScore(event.target.value)
    } else if (event.target.id === 'act_career') {
      setCareerScore(event.target.value)
    } else if (event.target.id === 'act_sincerity') {
      setSincerityScore(event.target.value)
    } else if (event.target.id === 'act_coop') {
      setCoopScore(event.target.value)
    } else if (event.target.id === 'act_attitudes') {
      setAttitudeScore(event.target.value)
    }
  }

  const handleSubmit = (event) => { //양식 제출
    event.preventDefault();
    showConfirmWindow();
  }

  const handleImgPickerClick = () => {
    setModalShow(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <StyledFieldSet>
          <legend>활동 작성하기</legend>
          {!monImg ? <StyledImgPicker alt="엑스이미지 찾기" onClick={() => { handleImgPickerClick() }}/>
            : (monImg === "mon_01") ? <StyledImgPicker src={mon_01} alt="몬스터1" onClick={() => { handleImgPickerClick() }} />
              : (monImg === "mon_02") ? <StyledImgPicker src={mon_02} alt="몬스터2" onClick={() => { handleImgPickerClick() }} />
                : <StyledImgPicker src={mon_03} alt="몬스터3" onClick={() => { handleImgPickerClick() }} />}

          <label htmlFor="act_title" >활동 제목</label>
          <input id="act_title" type="text" required onChange={handleChange} value={title} />

          <label htmlFor="act_content" >활동 설명</label>
          <textarea id="act_content" type="text" required onChange={handleChange} value={content} />

          <label htmlFor="act_record" >생기부 문구</label>
          <textarea id="act_record" type="text" required onChange={handleChange} value={record} />

          <StyledScoreWrapper>
            <StyledInputBox>
              <label htmlFor="act_leadership">리더십</label>
              <StyledInput id="act_leadership" type="number" value={leadershipScore} onChange={handleChange}></StyledInput>
            </StyledInputBox>
            <StyledInputBox>
              <label htmlFor="act_career">진로</label>
              <StyledInput id="act_career" type="number" value={careerScore} onChange={handleChange}></StyledInput>
            </StyledInputBox>
            <StyledInputBox>
              <label htmlFor="act_sincerity">성실성</label>
              <StyledInput id="act_sincerity" type="number" value={sincerityScore} onChange={handleChange}></StyledInput>
            </StyledInputBox>
            <StyledInputBox>
              <label htmlFor="act_coop">협동성</label>
              <StyledInput id="act_coop" type="number" value={coopScore} onChange={handleChange}></StyledInput>
            </StyledInputBox>
            <StyledInputBox>
              <label htmlFor="act_attitude">태도</label>
              <StyledInput id="act_attitudes" type="number" value={attitudeScore} onChange={handleChange}></StyledInput>
            </StyledInputBox>
          </StyledScoreWrapper>

          <button type="submit">저장하기</button>
        </StyledFieldSet>
      </form>
      <GraphicDialogModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setMonImg={setMonImg}
      />
    </>
  )
}

export default Activities