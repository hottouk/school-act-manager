//라이브러리
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import styled from 'styled-components';
//컴포넌트
import ModalBtn from '../../Btn/ModalBtn';
import MidBtn from '../../Btn/MidBtn';
import MockExamSelect from '../../Select/MockExamSelect';
import DotTitle from '../../Title/DotTitle';
import CircularBtn from '../../Btn/CircularBtn';
import GptIngModal from './GptIngModal';
//hooks
import useChatGpt from '../../../hooks/useChatGpt';
import useFireBasic from '../../../hooks/Firebase/useFireBasic';
import InnerOverlay from '../../Styled/InnerOverlay';
import InnerLayer from '../../Styled/InnerLayer';
//생성(250616)
const SmartAddVocabModal = ({ show, onHide, padNumber, setQuizList, setIsVocabShow }) => {
  //준비
  const { fetchDoc } = useFireBasic("exam");
  //모의고사 지문
  const subjectList = [{ label: "과목", value: '' }, { label: "영어", value: "eng" },];
  const [subject, setSubject] = useState(null);
  useEffect(() => { setYear(null); }, [subject]);
  const [year, setYear] = useState(null);
  useEffect(() => { setGrade(null); }, [year]);
  const [grade, setGrade] = useState(null);
  useEffect(() => { setMonth(null); setExam(null); }, [grade]);
  const [month, setMonth] = useState(null);
  useEffect(() => {
    //모고 불러오기
    const fetchExamData = async () => {
      setNumber(null);
      const docId = `${year}${grade}${month}${subject}`;
      const examInfo = await fetchDoc(docId);
      if (examInfo) {
        const { uid, createdTime, ...rest } = examInfo;
        setExam(rest);
      } else {
        setExam(null);
      }
    }
    fetchExamData();
  }, [month]);
  //기출 문항
  const [exam, setExam] = useState(null);
  const [number, setNumber] = useState(null);
  useEffect(() => {
    if (!number || !exam) return;
    setText(exam[number]?.original?.replace(/(\r\n|\n|\r)/g, " ") ?? exam[number]?.passage.replace(/(\r\n|\n|\r)/g, " ") ?? '');
  }, [number]);
  //지문
  const [text, setText] = useState('');
  //gpt
  const { extractVocab, gptAnswer, gptRes, gptStatus, gptProgress } = useChatGpt();
  const normalizeVocabItem = useCallback((item) => {
    if (typeof item === 'string') {
      const [word, meaning] = item.split("#").map((value) => value?.trim());
      return word && meaning ? { word, meaning } : null;
    }
    const word = item?.word?.trim();
    const meaning = item?.meaning?.trim();
    return word && meaning ? { word, meaning } : null;
  }, []);
  const parseVocabAnswer = useCallback((answer) => {
    const cleaned = answer
      .trim()
      .replace(/^```json/i, '')
      .replace(/^```/i, '')
      .replace(/```$/i, '')
      .trim();
    try {
      const parsed = JSON.parse(cleaned);
      const parsedList = Array.isArray(parsed) ? parsed : parsed?.vocabList;
      return (parsedList ?? []).map(normalizeVocabItem).filter(Boolean);
    } catch (err) {
      return cleaned.split("^").map(normalizeVocabItem).filter(Boolean);
    }
  }, [normalizeVocabItem]);
  //gpt 응답 가공
  useEffect(() => {
    const renderGptAnswer = () => {
      if (gptAnswer === '') return
      if (gptAnswer.startsWith("[에러 발생]")) {
        alert(gptAnswer);
        return;
      }
      const list = parseVocabAnswer(gptAnswer);
      if (list.length === 0) {
        alert("단어 추출 결과를 읽지 못했습니다. 다시 시도해주세요.");
        return;
      }
      setVocabList(list);
    }
    renderGptAnswer();
  }, [gptAnswer, parseVocabAnswer]);
  //추가된 단어
  const [vocabList, setVocabList] = useState([]);

  //**함수부**
  //빈칸 체크
  const checkVacant = (list) => {
    let result = true;
    list.forEach((item, index) => {
      if (item.word === '' || item.meaning === '') {
        alert(`${index + 1}번째 칸이 비어있습니다. 삭제하거나 채워주세요.`);
        result = false;
      }
    });
    return result
  }
  //추출 버튼 
  const handleExtractOnClick = async () => {
    if (text === '') { alert("단어를 추출할 지문이 없습니다."); return; }
    setVocabList([]);
    await extractVocab(text);
  }
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
    if (!result) return;
    setVocabList((prev) => {
      const newInputs = [...prev];
      newInputs.splice(index + 1, 0, quizSet);
      return newInputs;
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
    if (!result) return;
    setQuizList((prev) => { return [...prev, ...vocabList] });
    setIsVocabShow(true);
    setVocabList([]);
    onHide();
  }
  return (
    <Modal size='lg'
      show={show}
      onHide={onHide}
      backdrop='static'>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>스마트 단어 추가</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef", }}>
        <Row style={{ marginBottom: "10px" }}>
          <DotTitle>과목</DotTitle>
          <Select
            onChange={(event) => setSubject(event.value)}
            options={subjectList}
            placeholder={"과목"}
          />
        </Row>
        {subject && <Column style={{ marginBottom: "10px", gap: "10px" }}>
          <DotTitle>기출 모의고사</DotTitle>
          <MockExamSelect year={year}
            setYear={setYear}
            grade={grade}
            setGrade={setGrade}
            month={month}
            setMonth={setMonth}
            setNumber={setNumber} />
        </Column>}
        <Textarea
          value={text}
          placeholder='여기에 지문을 복사/붙여넣기 하세요'
          onChange={(event) => { setText(event.target.value); }}></Textarea>
        <Row style={{ justifyContent: "center", margin: "10px 0" }}>
          {(gptRes !== "loading") && <MidBtn onClick={handleExtractOnClick}>단어 추출</MidBtn>}
        </Row>
        {vocabList?.length > 0 && vocabList.map((item, idx) => <Row key={`${idx}`}>
          <NumberLabel>{padNumber(idx + 1, 3)}</NumberLabel>
          <WordInput
            id='word'
            type="text"
            value={item.word}
            onChange={(e) => handleInputOnChange(e, idx)}
            placeholder='단어'
          />
          <WordInput
            id='meaning'
            type="text"
            value={item.meaning}
            onChange={(e) => handleInputOnChange(e, idx)}
            onKeyDown={(e) => handleTabKeyDown(e, idx)}
            placeholder='의미'
          />
          <Row style={{ gap: "5px", paddingTop: "3px" }}>
            <CircularBtn styles={{ color: "#9b0c24" }} onClick={() => { deleteInputs(idx) }}>-</CircularBtn>
          </Row>
        </Row>)}
        <Row style={{ gap: "5px", justifyContent: "center", marginTop: "10px" }}>
          <CircularBtn onClick={() => addInputs(vocabList.length)}>+</CircularBtn>
        </Row>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef", borderRadius: "5px" }}>
        <ModalBtn onClick={() => { onHide() }}>취소</ModalBtn>
        <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfirmOnClick}>확인</ModalBtn>
      </Modal.Footer>
      {gptStatus && <InnerLayer>
        <InnerOverlay />
        <GptIngModal
          show={gptStatus}
          onHide={gptStatus === ''}
          status={gptStatus}
          progress={gptProgress} />
      </InnerLayer>}
    </Modal >
  )
}

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
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
const WordInput = styled.input`
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

export default SmartAddVocabModal
