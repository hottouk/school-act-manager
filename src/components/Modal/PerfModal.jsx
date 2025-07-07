//라이브러리
import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useRef, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import axios from "axios";
import styled from 'styled-components';
//컴포넌트
import ModalBtn from '../Btn/ModalBtn';
import MidBtn from '../Btn/MidBtn';
import SubNav from '../Bar/SubNav';
import SmallBtn from '../Btn/SmallBtn';
import AnimatedProgressBar from '../ProgressBar';
//hooks
import useGetByte from '../../hooks/useGetByte';
import useAcc from '../../hooks/useAcc';
import useFireStorage from '../../hooks/useFireStorage';
import useChatGpt from '../../hooks/useChatGpt';

//생성(241113)-> OCR(250402) -> 모든 활동으로 변경(250703) -> 전체개별화(250706)
const PerfModal = ({ show, onHide, studentList, classId }) => {
  const actiList = useSelector(({ allActivities }) => allActivities);
  useEffect(() => { initData(); }, [studentList]);
  useEffect(() => { renderOptions(); }, [actiList]);
  //활동 셀렉터 옵션
  const [optionList, setOptionList] = useState([]);
  //선택 활동
  const [selectedActi, setSelectedActi] = useState(null);
  const [achivList] = useState(["상", "중", "하", "최하"]);
  //pdf
  const { uploadFile, findFile } = useFireStorage();
  const radioRef = useRef({});
  const inputRef = useRef({});
  const inputFileRef = useRef({});
  const { getByteLengthOfString } = useGetByte();
  const { writePerfRecDataOnDB } = useAcc();
  const { askPersonalizeOnTyping, translateEngtoKorean, askPersonalizeOnKeywords, gptRes, gptProgress, gptAnswer } = useChatGpt();

  //gpt answer 임시 구분.
  const [isTranslate, setIsTranslate] = useState(false);
  useEffect(() => {//★★★//
    if (isTranslate) { setStudentOcr((prev) => ({ ...prev, [gptLoadingIndex]: gptAnswer })); }
    else { setPerfRecord((prev) => ({ ...prev, [gptLoadingIndex]: gptAnswer })); }
    setGptLoadingIndex(null);
    setIsTranslate(false);
  }, [gptAnswer])
  //수행 문구
  const [perfTempRecord, setPerfTempRecord] = useState(); //todo 제거하기
  const [perfRecord, setPerfRecord] = useState();
  useEffect(() => {
    if (perfTempRecord) {
      let lastNumber = Object.keys(perfTempRecord).length
      for (let i = 0; i < lastNumber; i++) {
        let rec = perfTempRecord[i]
        extractContent(rec, i)
      }
    }
  }, [perfTempRecord]);
  const [extractResult, setExtractResult] = useState(null);
  const [studentOcr, setStudentOcr] = useState();
  //개별화 대체
  const [replaceList, setReplaceList] = useState({});
  //pdf OCR
  const [pdfFile, setPdfFile] = useState(null);
  const [gptLoadingIndex, setGptLoadingIndex] = useState(null);
  const [loadingStage, setLoadingStage] = useState(null);
  const [ocrList, setOcrList] = useState([]);
  const [selectedOcr, setSelectedOcr] = useState(null);
  const [ocrStage, setOcrStage] = useState(0);

  //------함수부------------------------------------------------  
  //초기화
  const initData = () => {
    setPerfRecord(createMatrix(studentList, ''));
    setPerfTempRecord(createMatrix(studentList, ''));
    setExtractResult(createMatrix(studentList, []));
    setStudentOcr(createMatrix(studentList, ''));
    setSelectedActi(null);
    setReplaceList({});
  }
  //옵션 랜더링
  const renderOptions = () => {
    const options = []
    actiList.forEach(acti => {
      options.push({
        label: acti.title, value: acti.record, title: acti.title, perfRecordList: acti.perfRecordList, id: acti.id,
        uid: acti.uid, record: acti.record, subject: acti.subject, scores: acti.scores, money: acti.money,
      }) //필요 속성들 재구성
    })
    setOptionList([...options])
  }
  //활동 셀렉터
  const handleActiOnChange = (event) => {
    const perfId = event?.id ?? null;
    if (perfId) {
      studentList.forEach((student, i) => {
        const actiList = student.actList?.filter((acti) => acti.id === perfId) ?? null;
        const record = actiList?.length > 0 ? actiList[0].record : '';
        setSelectedActi(event);
        setPerfTempRecord((prev) => { return { ...prev, [i]: record } });
        setPerfRecord((prev) => { return { ...prev, [i]: record } });
      })
    }
  }
  //이중 객체 생성
  const createMatrix = (list, initVal) => {
    let matrix = {}
    list?.forEach((_, index) => matrix[index] = initVal);
    return matrix
  }
  //성취도 셀렉터
  const handleAchivOnChange = (event) => {
    const achivIndex = event.value;
    const achivRec = selectedActi?.perfRecordList[achivIndex] ?? '';
    const lastNumber = Object.keys(perfRecord).length;
    for (let i = 0; i < lastNumber; i++) {
      setPerfRecord((prev) => { return { ...prev, [i]: achivRec } });
      setPerfTempRecord((prev) => { return { ...prev, [i]: achivRec } });
    }
  }
  //성취도 라디오 버튼
  const handleRadioOnChange = (index, subIndex) => {
    if (selectedActi) {
      let record = selectedActi?.perfRecordList[subIndex]
      setPerfRecord((prev) => { return { ...prev, [index]: record } })
      setPerfTempRecord((prev) => { return { ...prev, [index]: record } })
    } else {
      window.alert("수행 평가를 먼저 선택하세요.")
    }
  }
  //개별화 부분 text 변경 시
  const handleInputOnChange = (event, index, subIndex) => {
    const { value } = event.target;
    setReplaceList((prev) => {
      const updated = { ...prev }
      if (!updated[index]) { updated[index] = []; } //없다면 생성
      updated[index][subIndex] = value;             //값 넣기
      return updated
    })
  }
  //변경 버튼
  const handleChangeBtnOnClick = (index) => {
    const text = perfRecord[index];
    const altList = (replaceList[index]);
    const replaced = replacePlaceholders(text, altList);
    setPerfRecord((prev) => { return { ...prev, [index]: replaced } });
  }
  //GPT 버튼
  const handleChangeGptBtnOnClick = (index) => {
    const record = perfRecord[index];
    const keywords = replaceList[index].join(',');
    setGptLoadingIndex(index); //스피너 작동
    askPersonalizeOnKeywords({ record, keywords });
  }
  //개별화 체크
  const checkReplaceHolder = () => {
    let result = "pass";
    let keywordList = Object.entries(replaceList);
    if (keywordList.length === 0) { result = "noInput"; }
    else {
      keywordList = keywordList.map((item) => {
        const index = item[0];
        for (let i = 0; i < extractResult[index].length; i++) { if (!item[1][i]) result = "notEqual" }
        const record = perfRecord[index];
        const keywords = item[1].join(',');
        return { index, record, keywords }
      });
    }
    return { keywordList, result }
  }
  //전체 gpt
  const getAllPersonalizedOnClick = async () => {
    const { keywordList, result } = checkReplaceHolder();
    if (result === "noInput") { alert("입력 값이 없습니다.") }
    else if (result === "notEqual") { alert("빈 칸이 있어요. 채워주세요.") }
    else {
      askPersonalizeOnKeywords({ keywordList }).then((answerList) => {
        for (const answer of answerList) {
          const { answer: gptAnswer, index } = answer;
          setPerfRecord((prev) => ({ ...prev, [index]: gptAnswer }));
        }
      });
    }
  }
  //개별화 부분 대체
  const replacePlaceholders = (text, replaceList) => {
    if (!replaceList) { window.alert("빈칸을 채워주세요.") } else {
      let index = 0;
      return text.replace(/\{\/\*.*?\*\/\}/g, () => replaceList[index++] || '');
    }
  }
  //특정 기호, {/*  */} 사이의 문자열 추출
  const extractContent = (text, index) => {
    let matches = text.match(/\{\/\*\s*(.*?)\s*\*\/\}/g); //정규식
    let result = matches?.map(match => match.slice(3, -3).trim()) ?? []
    setExtractResult((prev) => { return { ...prev, [index]: result } })
  }
  //성취도 셀렉터 option
  const getAchivOptionList = () => {
    const achivOptionList = achivList.map((achiv, index) => ({ label: achiv, value: index }));
    return achivOptionList
  }
  //ocr 셀렉터 option
  const getOcrOptionList = () => {
    const ocrOptionList = ocrList.map((ocrText, index) => ({ label: `페이지 ${index + 1}: ${ocrText.slice(0, 10)}...`, value: ocrText }));
    return ocrOptionList
  }
  //최종 바이트 get
  const getByte = (index) => {
    const text = perfRecord[index]
    if (typeof (text) == "string") {
      return getByteLengthOfString(text)
    } else { return 0 }
  }

  //------OCR------------------------------------------------  
  //pdf 선택 버튼
  const handleFileOnClick = () => {
    inputFileRef.current.click();
    setOcrStage(0);
  }
  //pdf 파일 선택
  const handleFileOnChange = (event) => {
    setPdfFile(event.target.files[0]);
  }
  //업로드
  const handleUploadOnClick = async () => {
    if (!pdfFile) {
      alert("파일이 없습니다.")
      return;
    }
    if (pdfFile.name.endsWith(".pdf")) {
      const isExist = await findFile("pdfs", pdfFile.name);
      if (isExist) { setOcrStage(1); }
      else {
        setLoadingStage("⏳ 파일 업로드중...");
        uploadFile("pdfs", pdfFile).then(() => {
          setLoadingStage(null);
          setOcrStage(1);
        })
      }
    } else {
      alert("pdf 파일이 아닙니다.");
      return;
    }
  }
  //추출
  const postExtractText = async () => {
    const fileName = pdfFile.name.split(".")[0];
    const isExist = await findFile("ocr_results", fileName);
    if (isExist) { setOcrStage(2); } else {
      let response = null;
      setLoadingStage("📤 텍스트 추출중...이 작업은 오래 걸릴 수 있습니다.")
      try {
        response = await axios.post(process.env.REACT_APP_OCR_API_PDF_URL, { fileName: pdfFile.name }, { headers: { "Content-Type": "application/json" } })
        if (response) {
          alert("추출 작업이 완료되었습니다.")
          setOcrStage(2);
          setLoadingStage(null);
        };
      } catch (error) {
        console.error("추출 실패: ", error);
        alert("추출 실패: ", error);
      }
    }
  }
  //다운로드
  const handleGetOcrResults = async () => {
    let response = null;
    try {
      setLoadingStage("⏳ 다운로드중...")
      response = await axios.get(process.env.REACT_APP_OCR_RESULT_URL, {
        params: { fileName: pdfFile.name }
      })
      if (response) {
        setOcrList(response.data.pages);
        setOcrStage(3);
        setLoadingStage(null);
      }
    } catch (error) {
      console.error("OCR 결과 가져오기 실패:", error);
      alert("OCR 결과 가져오기 실패:", error);
      setOcrStage(3);
    }
  };
  //ocr 삽입
  const handleOcrInsertOnClick = (index) => {
    setStudentOcr((prev) => { return { ...prev, [index]: selectedOcr.value } });
    setSelectedOcr(null);
  }
  //ocr text 수정
  const handleOcrTextOnChange = (event, index) => {
    const { value } = event.target;
    setStudentOcr((prev) => { return { ...prev, [index]: value } })
  }
  //문구 text 수정
  const handlePerfRecordOnChange = (event, index) => {
    const { value } = event.target;
    setPerfRecord((prev) => { return { ...prev, [index]: value } });
  }
  //ocr 제거
  const handleOcrRemoveOnClick = (index) => { setStudentOcr((prev) => { return { ...prev, [index]: '' } }) }
  //gpt ocr + 문구 적용
  const handleOcrGptOnClilck = (index) => {
    setGptLoadingIndex(index); //스피너 작동
    askPersonalizeOnTyping(perfRecord[index], studentOcr[index])
  }
  //gpt 번역
  const handleTranslateOnClick = (index) => {
    setIsTranslate(true);
    setGptLoadingIndex(index); //스피너 작동
    translateEngtoKorean(studentOcr[index]);
  }
  //최종 저장 확인 버튼
  const saveBtnOnClick = () => {
    if (selectedActi) {
      if (window.confirm("저장하시겠습니까?")) {
        writePerfRecDataOnDB(studentList, classId, selectedActi, perfRecord);
        initData();
        onHide();
      }
    } else { window.alert("선택된 수행평가가 없습니다.") }
  }
  //취소 버튼
  const cancelBtnOnClick = () => {
    initData();
    onHide();
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      fullscreen={true}>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>활동별 관리</Modal.Header>
      <SubNav styles={{ padding: "5px", marginBottom: "0" }}>
        <Select
          onChange={(event) => { handleActiOnChange(event) }}
          options={optionList}
          placeholder="활동을 선택해주세요."
        />
        {selectedActi?.perfRecordList && <Select
          onChange={(event) => { handleAchivOnChange(event) }}
          options={getAchivOptionList()}
          placeholder="성취도를 선택해주세요."
        />}
      </SubNav>
      {selectedActi && <SubNav styles={{ padding: "5px", }}>
        {gptRes !== "loading" && <>
          <MidBtn type="button" onClick={getAllPersonalizedOnClick}>전체 개별화</MidBtn>
          <MidBtn type="button" onClick={handleFileOnClick}>📁 PDF 선택</MidBtn>
          <span style={{ marginTop: "5px" }}>{loadingStage || pdfFile?.name || "파일 없음"}</span>
        </>}
        {gptRes === "loading" && <Row style={{ width: "30%" }}><AnimatedProgressBar gptProgress={gptProgress} /></Row>}
        <input type='file' ref={inputFileRef} onChange={handleFileOnChange} accept="application/pdf" style={{ display: "none" }} />
        {(pdfFile && ocrStage === 0) && <MidBtn onClick={handleUploadOnClick}>업로드</MidBtn>}
        {ocrStage === 1 && <MidBtn onClick={postExtractText}>추출</MidBtn>}
        {ocrStage === 2 && <MidBtn onClick={handleGetOcrResults}>다운로드</MidBtn>}
        {(ocrList?.length !== 0 && ocrStage === 3) && <Select
          onChange={(event) => { setSelectedOcr(event) }}
          options={getOcrOptionList()}
          placeholder="ocr 결과를 선택해주세요." />}
        {loadingStage && <Spinner />}
      </SubNav>}
      <Modal.Body>
        <GridContainer>
          <TableHeaderWrapper>
            <Header>연번</Header>
            <Header>학번</Header>
            <Header>이름</Header>
            <Header>성취도</Header>
            <Header>개별화</Header>
            <Header>문구</Header>
            <Header>바이트</Header>
          </TableHeaderWrapper>
          {(studentList?.length > 0) && studentList.map((student, index) => {
            const key = student.id
            const studentNumber = student.studentNumber
            const name = (student.writtenName || "미등록")
            return <React.Fragment key={key}>
              <GridItem>{index + 1}</GridItem>     {/* 연번 */}
              <GridItem>{studentNumber}</GridItem> {/* 학번 */}
              <GridItem>{name}</GridItem>          {/* 이름 */}
              <GridItem> {/* 성취도 */}
                {selectedActi?.perfRecordList && <FormWrapper>{achivList.map((val, subIndex) => {
                  return <label key={`${index}${subIndex}`}>
                    <input
                      type="radio"
                      ref={(ele) => radioRef.current[`${index}-${val}`] = ele}
                      name="achivement"
                      value={val}
                      onChange={() => { handleRadioOnChange(index, subIndex) }}
                      disabled={gptRes === "loading"} />
                    {val}</label>
                })}</FormWrapper>}
              </GridItem>
              {/* 개별화 */}
              <GridItem>
                <ExtractWrapper>
                  {extractResult[index]?.length > 0 && extractResult[index].map((result, subIndex) => {
                    //place홀더 개수에 따라 input 생성
                    return (<React.Fragment key={`${result}${subIndex}`}>
                      <p>{result}</p>
                      <TextInput
                        type="text"
                        ref={(ele) => inputRef.current[`${index}-${subIndex}`] = ele}
                        onChange={(event) => { handleInputOnChange(event, index, subIndex) }}
                        disabled={gptRes === "loading"}
                      />
                    </React.Fragment>)
                  })}
                  {(extractResult[index]?.length > 0 && !gptLoadingIndex) && <Row style={{ gap: "10px" }}>
                    <SmallBtn onClick={() => { handleChangeBtnOnClick(index) }} disabled={gptRes === "loading"}>변경</SmallBtn>
                    <SmallBtn onClick={() => { handleChangeGptBtnOnClick(index) }} disabled={gptRes === "loading"}>GPT</SmallBtn>
                  </Row>}
                  {(studentOcr[index] !== '' && !gptLoadingIndex) && <>
                    <Textarea
                      value={studentOcr[index]}
                      onChange={(event) => { handleOcrTextOnChange(event, index) }} />
                    {!gptLoadingIndex && <Row style={{ gap: "10px" }}>
                      <MidBtn onClick={() => { handleOcrGptOnClilck(index) }}>통합</MidBtn>
                      <MidBtn onClick={() => { handleTranslateOnClick(index) }}>한국말로</MidBtn>
                      <MidBtn onClick={() => { handleOcrRemoveOnClick(index) }}>제거</MidBtn>
                    </Row>}
                  </>}
                  {gptLoadingIndex === index && <Row style={{ marginTop: "10px" }}><Spinner /></Row>}
                  {(selectedOcr && perfRecord[index] !== '') && <Row><MidBtn onClick={() => { handleOcrInsertOnClick(index) }}>OCR 추가</MidBtn></Row>}
                </ExtractWrapper>
              </GridItem>
              {/* 문구 */}
              <GridItem><Textarea value={perfRecord[index]} onChange={(event) => { handlePerfRecordOnChange(event, index) }} disabled={gptRes === "loading"} /></GridItem>
              <GridItem>{getByte(index)}</GridItem>
            </React.Fragment>
          })}
        </GridContainer>
      </Modal.Body >
      <Modal.Footer>
        <BtnWrapper>
          <ModalBtn onClick={() => { cancelBtnOnClick(); }}>취소</ModalBtn>
          <ModalBtn onClick={() => { saveBtnOnClick() }} styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} >저장</ModalBtn>
        </BtnWrapper>
      </Modal.Footer>
    </Modal >
  )
}

const GridContainer = styled.div`
  margin: 20px auto;
  display: grid;
  grid-template-columns: 70px 100px 100px 120px 300px 600px 70px;
  justify-content: center;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
`
// lastChild의 범위를 명확하게 하기 위함.
const TableHeaderWrapper = styled.div` 
  display: contents;
`
const Header = styled.div`
  display: flex;
  background-color: #3454d1;
  color: white;
  padding: 10px;
  font-weight: bold;
  justify-content: center;
  &: first-child {
    border-top-left-radius: 5px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
`
const TextInput = styled.input`
  border: none;
`
const GridItem = styled.div`
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  
  &.left-align {
    text-align: left;
  }
`
const FormWrapper = styled.form`
  display: flex;
  gap: 10px;
`
const ExtractWrapper = styled.div`
  display: flex;
  flex-direction: column;
  p {
   margin-bottom: 0;
   margin-top: 5px;
  }
  input {
    width: 90%;
    margin: 0 auto;
    height: 30px;
    border-radius: 5px;
  }
  button {
    margin-top: 10px;
    &:focus {
      border: 3px solid black;
    }
  }
`
const BtnWrapper = styled.div`
  display: flex;
  gap: 20px;
`
const Textarea = styled.textarea`
  width: 100%;
  border: none;
  border-radius: 10px;
  height: 150px;
`
export default PerfModal