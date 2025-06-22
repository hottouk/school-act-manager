//라이브러리
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
//컴포넌트
import ModalBtn from '../../Btn/ModalBtn';
import MidBtn from '../../Btn/MidBtn';
import styled from 'styled-components';
import CircularBtn from '../../Btn/CircularBtn';
//hooks
import useChatGpt from '../../../hooks/useChatGpt';

//생성(250616)
const GptAddVocabModal = ({ show, onHide, padNumber, setQuizList }) => {
  //지문
  const [text, setText] = useState('');
  //gpt
  const { extractVocab, gptAnswer, gptRes } = useChatGpt();
  useEffect(() => { renderGptAnswer(); }, [gptAnswer]);
  //추가된 단어
  const [vocabList, setVocabList] = useState([]);
  //------함수부------------------------------------------------  
  const renderGptAnswer = () => {//gpt 응답 가공
    if (gptAnswer === '') return
    const list = gptAnswer.split("^").map((item) => {
      const wordMeaning = item.split("#");
      return { word: wordMeaning[0], meaning: wordMeaning[1] }
    })
    setVocabList(list);
  }
  //빈칸 체크
  const checkVacant = (list) => {
    let result = true;
    list.forEach((item, index) => {
      if (item.word === '' || item.meaning === '') {
        alert(`${index + 1}번째 칸이 비어있습니다. 삭제하거나 채워주세요.`)
        result = false;
      }
    });
    return result
  }
  //추출 버튼 
  const extractBtnOnClick = () => { extractVocab(text); }
  //input 감지
  const handleInputOnChange = (event, index) => {
    const { id, value } = event.target;
    setVocabList((prev) => {
      const newList = [...prev];
      if (id === "word") { newList[index].word = value } else { newList[index].meaning = value }
      return newList
    })
  }
  //tab 키다운 인식
  const handleTabKeyDown = (e, index) => { if (e.key === 'Tab') { addInputs(index); } };
  //input 추가
  const addInputs = (index, quizSet = { word: '', meaning: '' }) => {
    const result = checkVacant(vocabList);
    if (!result) return
    setVocabList((prev) => {
      const newInputs = [...prev];
      newInputs.splice(index + 1, 0, quizSet);
      return newInputs
    });
  };
  //input 삭제
  const deleteInputs = (index) => { setVocabList((prev) => prev.filter((_, i) => i !== index)); }
  //확인 버튼
  const handleConfirmOnClick = () => {
    if (vocabList?.length === 0) {
      alert("추가할 단어가 없습니다.");
      return
    }
    const result = checkVacant(vocabList);
    if (!result) return
    setQuizList((prev) => { return [...prev, ...vocabList] });
    onHide();
  }
  return (
    <Modal size='lg'
      show={show}
      onHide={onHide}
      backdrop='static'>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>스마트 단어 추가</Modal.Header>
      <Modal.Body>
        <Textarea
          value={text}
          placeholder='여기에 지문을 복사/붙여넣기 하세요'
          onChange={(event) => { setText(event.target.value); }}></Textarea>
        <Row style={{ justifyContent: "center", margin: "10px 0" }}>
          {(gptRes !== "loading") && <MidBtn onClick={extractBtnOnClick}>단어 추출</MidBtn>}
          {(gptRes === "loading") && <Spinner />}
        </Row>
        {vocabList?.length > 0 && vocabList.map((item, index) => <Row key={`${index}`}>
          <NumberLabel>{padNumber(index + 1, 3)}</NumberLabel>
          <StyledInput
            id='word'
            type="text"
            value={item.word}
            onChange={(e) => handleInputOnChange(e, index)}
            placeholder='단어'
          />
          <StyledInput
            id='meaning'
            type="text"
            value={item.meaning}
            onChange={(e) => handleInputOnChange(e, index)}
            onKeyDown={(e) => handleTabKeyDown(e, index)}
            placeholder='의미'
          />
          <Row style={{ gap: "5px", paddingTop: "3px" }}>
            <CircularBtn onClick={() => { addInputs(index) }}>+</CircularBtn>
            <CircularBtn styles={{ color: "#9b0c24" }} onClick={() => { deleteInputs(index) }}>-</CircularBtn>
          </Row>
        </Row>)}
      </Modal.Body>
      <Modal.Footer>
        <ModalBtn onClick={() => { onHide() }}>취소</ModalBtn>
        <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfirmOnClick}>확인</ModalBtn>
      </Modal.Footer>
    </Modal >
  )
}

const Row = styled.div`
  display: flex;
`
const Textarea = styled.textarea`
  width: 100%;
  height: 400px;
  border: 1px solid rgba(120, 120, 120, 0.5);
  border-radius: 5px;
  background-color: white;
`
const NumberLabel = styled.label`
  margin-right: 8px;
  color: #3454d1;
  font-weight: bold;
`
const StyledInput = styled.input`
  height: 35px;
  border: 1px solid #aaa;
  flex-grow: 1;
  font-size: 12px;
  margin: 5px;
  &:disabled {
    background-color: #ddd;
  }
  &::placeholder {
    color: #999;
    font-style: italic;
  }
}
`

export default GptAddVocabModal
