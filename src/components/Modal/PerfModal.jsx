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
  useEffect(() => { bindStudentRec(); }, [selectedActi])
  const [savedActi, setSavedActi] = useState(null);
  const [achivList] = useState(["상", "중", "하", "최하"]);
  //pdf
  const { uploadFile, findFile } = useFireStorage();
  const inputFileRef = useRef({});
  const { getByteLengthOfString } = useGetByte();
  const { writePerfRecDataOnDB } = useAcc();
  const { askPersonalizeOnTyping, translateEngtoKorean, askPersonalizeOnKeywords, gptRes, gptProgress, gptAnswer } = useChatGpt();
  //gpt answer
  const [isTranslate, setIsTranslate] = useState(false);
  useEffect(() => { bindGptAnswer(); }, [gptAnswer]);
  //수행 문구
  const [perfRecord, setPerfRecord] = useState(null);
  useEffect(() => {
    if (!perfRecord) return;
    const last = Object.keys(perfRecord).length;
    for (let i = 0; i < last; i++) { extractContent(perfRecord[i], i); }
  }, [perfRecord]);
  //개별화
  const [personalValue, setPersoanlValue] = useState(null);
  const [extractedList, setExtractedList] = useState(null);
  const [replaceList, setReplaceList] = useState({});
  //pdf OCR
  const [pdfFile, setPdfFile] = useState(null);
  const [thisIndex, setThisIndex] = useState(null);
  const [loadingStage, setLoadingStage] = useState(null);
  const [ocrList, setOcrList] = useState([]);
  const [selectedOcr, setSelectedOcr] = useState(null);
  const [ocrStage, setOcrStage] = useState(0);

  //------함수부------------------------------------------------  
  //초기화
  const initData = () => {
    setPerfRecord(createMatrix(studentList, ''));
    setPersoanlValue(createMatrix(studentList, ''));
    setExtractedList(createMatrix(studentList, []));
    setReplaceList({});
    if (setSavedActi) { setSelectedActi(savedActi); }
    else { setSelectedActi(null); }
  }
  //이중 객체 생성
  const createMatrix = (list, initVal) => {
    let matrix = {}
    list?.forEach((_, index) => matrix[index] = initVal);
    return matrix
  }
  //활동 셀렉터 옵션
  const renderOptions = () => {
    const options = []
    actiList.forEach(acti => { options.push({ label: acti.title, value: acti.record, ...acti }) })
    setOptionList([...options])
  }

  //활동 셀렉터
  const handleActiOnChange = (event) => { setSelectedActi(event); }
  //셀렉터
  const bindStudentRec = () => {
    if (!selectedActi) return
    const perfId = selectedActi.id;
    studentList.forEach((student, i) => {
      const actiList = student.actList?.filter((acti) => acti.id === perfId) ?? null;
      const record = actiList?.length > 0 ? actiList[0].record : '';
      setPerfRecord((prev) => { return { ...prev, [i]: record } });
    })
  }

  //활동 셀렉터 옵션
  const getRecOptionList = () => {
    if (!selectedActi) return
    const { record, perfRecordList, extraRecordList, repeatInfoList } = selectedActi;
    const optionList = [{ label: "기본 문구", value: record }];
    if (perfRecordList) achivList.forEach((item, index) => { optionList.push({ label: item, value: perfRecordList[index] }); });
    if (extraRecordList) extraRecordList.forEach((item, index) => { optionList.push({ label: `랜덤문구${index}`, value: item }); });
    if (repeatInfoList) repeatInfoList.forEach((item) => {
      const { times, record } = item;
      optionList.push({ label: `${times}회 반복문구`, value: record });
    });
    return optionList
  }
  //성취도 셀렉터
  const handleAchivOnChange = (event) => {
    const record = event.value;
    const lastNumber = Object.keys(perfRecord).length;
    for (let i = 0; i < lastNumber; i++) {
      setPerfRecord((prev) => { return { ...prev, [i]: record } });
    }
  }
  //라디오 버튼
  const handleRadioOnChange = (event, index, subIndex) => {
    let record;
    if (event.target.id === "achiv_radio") record = selectedActi?.perfRecordList[subIndex];
    else record = event.target.value;
    setReplaceList({});
    setPerfRecord((prev) => { return { ...prev, [index]: record } });
  }
  //gpt 값 받아오기
  const bindGptAnswer = () => {
    if (gptAnswer === '') return
    if (isTranslate) { setPersoanlValue((prev) => ({ ...prev, [thisIndex]: gptAnswer })); }
    else { setPerfRecord((prev) => ({ ...prev, [thisIndex]: gptAnswer })); }
    setThisIndex(null);
    setIsTranslate(false);
  }
  //개별화 input
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
    const altList = replaceList[index];
    const replaced = replacePlaceholders(text, altList);
    setPerfRecord((prev) => { return { ...prev, [index]: replaced } });
  }
  //개별화 부분 변경
  const replacePlaceholders = (text, replaceList) => {
    if (!replaceList) { window.alert("빈칸을 채워주세요.") } else {
      let index = 0;
      return text.replace(/\{\/\*.*?\*\/\}/g, () => replaceList[index++] || '');
    }
  }
  //개별화 gpt
  const handleChangeGptBtnOnClick = (index) => {
    const record = perfRecord[index];
    const keywords = replaceList[index].join(',');
    setLoadingStage("⏳통합중...");
    setThisIndex(index);
    askPersonalizeOnKeywords({ record, keywords }).finally(() => { setLoadingStage(null); });
  }
  //체크 개별화 빈칸
  const checkReplaceHolder = () => {
    let result = "pass";
    let keywordList = Object.entries(replaceList);
    if (keywordList.length === 0) { result = "noInput"; }
    else {
      keywordList = keywordList.map((item) => {
        const index = item[0];
        for (let i = 0; i < extractedList[index].length; i++) { if (!item[1][i]) result = "notEqual" }
        const record = perfRecord[index];
        const keywords = item[1].join(',');
        return { index, record, keywords }
      });
    }
    return { keywordList, result }
  }
  //전체 개별화 gpt
  const handleAllPersonalizedOnClick = () => {
    const { keywordList, result } = checkReplaceHolder();
    if (result === "noInput") { alert("입력 값이 없습니다."); }
    else if (result === "notEqual") { alert("빈 칸이 있어요. 채워주세요."); }
    else {
      setLoadingStage("⏳반복중...");
      askPersonalizeOnKeywords({ keywordList })
        .then((answerList) => { bindGptListData(answerList, setPerfRecord); })
        .finally(() => { setLoadingStage(null); });
    }
  }
  //개별화 문구
  const handlePersonalTextOnChange = (event, index) => {
    const { value } = event.target;
    setPersoanlValue((prev) => ({ ...prev, [index]: value }));
  }
  //gpt 번역
  const handleTranslateOnClick = (index) => {
    setIsTranslate(true);
    setThisIndex(index);
    setLoadingStage("⏳번역중...");
    const text = personalValue[index];
    translateEngtoKorean({ text }).finally(() => { setLoadingStage(null); });
  }
  //전체 번역
  const handleAllTranslateOnClick = () => {
    let textList = Object.entries(personalValue);
    textList = textList.filter((item) => { return item[1] !== '' }).map((item) => ({ index: item[0], text: item[1] }));
    if (textList.length !== 0) {
      setLoadingStage("⏳반복중...");
      translateEngtoKorean({ textList })
        .then((answerList) => { bindGptListData(answerList, setPersoanlValue) })
        .finally(() => { setLoadingStage(null); });
    }
    else { alert("번역할 텍스트가 없습니다."); }
  }
  //gpt ocr + 문구 적용
  const handleOcrGptOnClilck = (index) => {
    if (perfRecord[index] !== '' && personalValue[index] !== '') {
      setThisIndex(index);
      setLoadingStage("⏳통합중...");
      askPersonalizeOnTyping({ record: perfRecord[index], report: personalValue[index] }).finally(() => { setLoadingStage(null); });
    } else { alert("활동 문구가 없습니다."); }
  }
  //문구 빈칸 체크
  const checkRecordHolder = () => {
    let result = "pass";
    let reportList = Object.entries(personalValue).filter((item) => item[1] !== '');
    if (reportList.length === 0) result = "noData";
    reportList = reportList.filter((item) => item[1] !== '').map((item) => {
      const index = item[0];
      const record = perfRecord[index];
      if (record === '') result = "noInput";
      return { index: item[0], report: item[1], record }
    });
    return { reportList, result }
  }
  //전체 gpt ocr + 문구 적용
  const handleAllOcrGptOnClilck = () => {
    const { reportList, result } = checkRecordHolder();
    if (result === "noInput") { alert("문구가 빈 곳이 있습니다."); }
    else if (result === "noData") { alert("통합할 데이터가 없습니다."); }
    else {
      setLoadingStage("⏳반복중...");
      askPersonalizeOnTyping({ reportList })
        .then((answerList) => { bindGptListData(answerList, setPerfRecord) })
        .finally(() => { setLoadingStage(null); });
    }
  }
  //gpt 전체 데이터 바인딩
  const bindGptListData = (list, setter) => {
    for (const item of list) {
      const { answer: gptAnswer, index } = item;
      setter((prev) => ({ ...prev, [index]: gptAnswer }));
    }
  }
  //특정 기호, {/*  */} 사이의 문자열 추출
  const extractContent = (text, index) => {
    const matches = text?.match(/\{\/\*\s*(.*?)\s*\*\/\}/g); //정규식
    const result = matches?.map(match => match?.slice(3, -3).trim()) || [];
    setExtractedList((prev) => { return { ...prev, [index]: result } })
  }
  //ocr 셀렉터 option
  const getOcrOptionList = () => {
    const ocrOptionList = ocrList.map((ocrText, index) => ({ label: `페이지 ${index + 1}: ${ocrText.slice(0, 10)}...`, value: ocrText }));
    return ocrOptionList
  }
  //최종 바이트 get
  const getByte = (index) => {
    const text = perfRecord[index];
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
    if (!selectedOcr) return;
    setPersoanlValue((prev) => { return { ...prev, [index]: selectedOcr.value } });
    setSelectedOcr(null);
  }
  //문구 text 수정
  const handlePerfRecordOnChange = (event, index) => {
    const { value } = event.target;
    setPerfRecord((prev) => { return { ...prev, [index]: value } });
  }
  //최종 저장 확인 버튼
  const saveBtnOnClick = () => {
    if (selectedActi) {
      if (window.confirm("저장하시겠습니까?")) {
        setSavedActi(JSON.parse(JSON.stringify(selectedActi)));
        writePerfRecDataOnDB(studentList, classId, selectedActi, perfRecord).then(() => { alert("저장되었습니다.") });
      }
    } else { window.alert("선택된 활동이 없습니다.") }
  }
  //취소 버튼
  const cancelBtnOnClick = () => {
    initData();
    onHide();
    setSavedActi(null);
    setSelectedActi(null);
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
        {selectedActi && <>
          <Select
            onChange={(event) => { handleAchivOnChange(event) }}
            options={getRecOptionList()}
            placeholder="일괄 입력할 문구를 선택하세요." />
          <MidBtn type="button" onClick={handleFileOnClick}>📁 PDF 선택</MidBtn>
          <span style={{ marginTop: "5px" }}>{pdfFile?.name || "파일 없음"}</span>
          {/* 안보이는 업로드 버튼 */}
          <input type='file' ref={inputFileRef} onChange={handleFileOnChange} accept="application/pdf" style={{ display: "none" }} />
          {(pdfFile && ocrStage === 0) && <SmallBtn onClick={handleUploadOnClick} disabled={loadingStage !== null}>업로드</SmallBtn>}{/* 업로드 부속 */}
          {ocrStage === 1 && <SmallBtn onClick={postExtractText} disabled={loadingStage !== null}>추출</SmallBtn>}
          {ocrStage === 2 && <SmallBtn onClick={handleGetOcrResults} disabled={loadingStage !== null}>다운로드</SmallBtn>}
          {(ocrList?.length !== 0 && ocrStage === 3) && <Select
            onChange={(event) => { setSelectedOcr(event) }}
            options={getOcrOptionList()}
            placeholder="ocr 결과를 선택해주세요." />}
        </>}
      </SubNav>
      <SubNav styles={{ padding: "5px", }}>
        {!loadingStage && <>
          <MidBtn type="button" onClick={handleAllPersonalizedOnClick}>전체 개별화</MidBtn>
          <MidBtn type="button" onClick={handleAllTranslateOnClick}>전체 번역</MidBtn>
          <MidBtn type="button" onClick={handleAllOcrGptOnClilck}>전체 통합</MidBtn>
        </>}
        {loadingStage && <>
          <span style={{ marginTop: "5px" }}>{loadingStage}</span>
          <Spinner />
          {loadingStage === "⏳반복중..." && <Row style={{ width: "30%" }}><AnimatedProgressBar gptProgress={gptProgress} /></Row>}
        </>}
      </SubNav>
      <Modal.Body>
        <GridContainer>
          <TableHeaderWrapper>
            <Header>연번</Header>
            <Header>학번</Header>
            <Header>이름</Header>
            <Header>성취도</Header>
            <Header>문구</Header>
            <Header>반복</Header>
            <Header>개별화</Header>
            <Header>문구</Header>
            <Header>바이트</Header>
          </TableHeaderWrapper>
          {(studentList?.length > 0) && studentList.map((student, index) => {
            const key = student.id;
            const studentNumber = student.studentNumber;
            const name = (student.writtenName || "미등록");
            return <React.Fragment key={key}>
              <GridItem>{index + 1}</GridItem>     {/* 연번 */}
              <GridItem>{studentNumber}</GridItem> {/* 학번 */}
              <GridItem>{name}</GridItem>          {/* 이름 */}
              <GridItem> {/* 성취도 */}
                {selectedActi?.perfRecordList && <RadioWrapper>{achivList.map((achiv, subIndex) => {
                  return <label key={`a${index}${subIndex}`}
                  ><input type="radio"
                    id='achiv_radio'
                    name="record"
                    value={achiv}
                    onChange={(event) => { handleRadioOnChange(event, index, subIndex) }}
                    disabled={gptRes === "loading"} /> {achiv}</label>
                })}</RadioWrapper>}
              </GridItem>
              <GridItem> {/* 랜덤 */}
                {selectedActi && <RadioWrapper>
                  <label>
                    <input type="radio" id='random_radio' name="random"
                      value={selectedActi.record}
                      onChange={(event) => { handleRadioOnChange(event, index, undefined) }}
                      disabled={gptRes === "loading"} />
                    <span>&nbsp;기본 문구</span>
                  </label>
                  {selectedActi.extraRecordList?.map((item, subIndex) => {
                    return <label key={`r${index}${subIndex}`}><input
                      type="radio" id='random_radio' name="random"
                      value={item}
                      onChange={(event) => { handleRadioOnChange(event, index, subIndex) }}
                      disabled={gptRes === "loading"} /> {`랜덤 ${subIndex + 1}`}</label>
                  })}</RadioWrapper>}
              </GridItem>
              <GridItem> {/* 반복 */}
                {selectedActi && <RadioWrapper>
                  {selectedActi.repeatInfoList?.map((item, subIndex) => {
                    const { times, record } = item;
                    return <label key={`r${index}${subIndex}`}><input
                      type="radio" id='repeat' name="record"
                      value={record}
                      onChange={(event) => { handleRadioOnChange(event, index, subIndex) }}
                      disabled={gptRes === "loading"} /> {`${times}회 반복`}</label>
                  })}
                </RadioWrapper>}
              </GridItem>
              {/* 개별화 */}
              <GridItem>
                {(extractedList[index]?.length > 0)
                  ? <ExtractWrapper>
                    {extractedList[index].map((result, subIndex) => {
                      //place홀더 개수에 따라 input 생성
                      return (<React.Fragment key={`${result}${subIndex}`}>
                        <p>{result}</p>
                        <InputText
                          type="text"
                          onChange={(event) => { handleInputOnChange(event, index, subIndex) }}
                          disabled={gptRes === "loading"} />
                      </React.Fragment>)
                    })}
                    {!thisIndex && <Row style={{ gap: "10px", justifyContent: "center" }}>
                      <SmallBtn onClick={() => { handleChangeBtnOnClick(index) }} disabled={gptRes === "loading"}>변경</SmallBtn>
                      <SmallBtn onClick={() => { handleChangeGptBtnOnClick(index) }} disabled={gptRes === "loading"}>통합</SmallBtn>
                    </Row>}
                  </ExtractWrapper>
                  : <Column>
                    <Textarea
                      $clickable={selectedOcr ? true : false}
                      value={personalValue[index]}
                      onChange={(event) => { handlePersonalTextOnChange(event, index); }}
                      onClick={() => { handleOcrInsertOnClick(index); }}
                      disabled={gptRes === "loading"}
                    />
                    {(personalValue[index] !== '') &&
                      <Row style={{ gap: "10px", justifyContent: "center", marginTop: "10px" }}>
                        <SmallBtn onClick={() => { handleTranslateOnClick(index) }} disabled={gptRes === "loading"}>번역</SmallBtn>
                        <SmallBtn onClick={() => { handleOcrGptOnClilck(index) }} disabled={gptRes === "loading"}>통합</SmallBtn>
                      </Row>}
                  </Column>
                }
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
          <ModalBtn onClick={() => { cancelBtnOnClick(); }}>닫기</ModalBtn>
          <ModalBtn onClick={() => { saveBtnOnClick() }} styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} >저장</ModalBtn>
        </BtnWrapper>
      </Modal.Footer>
    </Modal >
  )
}

const GridContainer = styled.div`
  margin: 20px auto;
  display: grid;
  grid-template-columns: 70px 100px 100px 120px 120px 120px 400px 600px 70px;
  justify-content: center;
`
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
  height: 100%;
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
  &: first-child { border-top-left-radius: 5px;  }
  &: last-child { border-top-right-radius: 5px;  }
`
const GridItem = styled.div`
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  &.left-align { text-align: left; }
`
const InputText = styled.input`
  border: none;
`
const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  height: 100%;
  border: none;
  border-radius: 10px;
  min-height: 150px;
  background-color: ${({ $clickable }) => { return $clickable ? "rgba(52,84,209,0.3)" : "white" }};
  cursor: ${({ $clickable }) => { return $clickable ? "pointer" : "auto" }};;
`
export default PerfModal