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
//hooks
import useGetByte from '../../hooks/useGetByte';
import useAcc from '../../hooks/useAcc';
import useFireStorage from '../../hooks/useFireStorage';
import useChatGpt from '../../hooks/useChatGpt';

//생성(241113)-> OCR(250402)
const PerfModal = ({ show, onHide, studentList, classId }) => {
  useEffect(() => { initData() }, [studentList])
  const actiList = useSelector(({ allActivities }) => allActivities)
  const { uploadFile, findFile } = useFireStorage();

  //acti중에서 수행평가를 찾는다.
  useEffect(() => { renderOptions(); }, [actiList])
  const [selectedPerf, setSelectedPerf] = useState(null)
  useEffect(() => {
    let perfId = selectedPerf?.id ?? null;
    if (perfId) {
      studentList.forEach((student, i) => {
        let actiList = student.actList?.filter((acti) => acti.id === perfId) ?? null;
        let record = actiList?.length > 0 ? actiList[0].record : ''
        setPerfTempRecord((prev) => { return { ...prev, [i]: record } })
        setPerfRecord((prev) => { return { ...prev, [i]: record } })
      })
    }

  }, [selectedPerf])
  const [optionList, setOptionList] = useState([]);
  const [achivList] = useState(["상", "중", "하", "최하"]);
  const radioRef = useRef({});
  const inputRef = useRef({});
  const inputFileRef = useRef({});
  const { getByteLengthOfString } = useGetByte();
  const { writePerfRecDataOnDB } = useAcc();
  const { askPersonalizeOnTyping, translateEngtoKorean, gptAnswer } = useChatGpt();
  //gpt answer 임시 구분.
  const [isTranslate, setIsTranslate] = useState(false);
  useEffect(() => {//★★★//
    if (isTranslate) { setStudentOcr((prev) => ({ ...prev, [gptLoadingIndex]: gptAnswer })); }
    else { setPerfRecord((prev) => ({ ...prev, [gptLoadingIndex]: gptAnswer })); }
    setGptLoadingIndex(null);
    setIsTranslate(false);
  }, [gptAnswer])
  //수행 문구
  const [perfTempRecord, setPerfTempRecord] = useState();
  useEffect(() => {
    if (perfTempRecord) {
      let lastNumber = Object.keys(perfTempRecord).length
      for (let i = 0; i < lastNumber; i++) {
        let rec = perfTempRecord[i]
        extractContent(rec, i)
      }
    }
  }, [perfTempRecord]);
  const [perfRecord, setPerfRecord] = useState();
  const [extractResult, setExtractResult] = useState();
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
    setSelectedPerf(null);
  }
  //옵션 랜더링
  const renderOptions = () => {
    const options = []
    const perfList = actiList.filter(acti => acti.perfRecordList && acti.perfRecordList.length > 0)
    perfList.forEach(perf => {
      options.push({
        label: perf.title, value: perf.record, title: perf.title, perfRecordList: perf.perfRecordList, id: perf.id,
        uid: perf.uid, record: perf.record, subject: perf.subject, scores: perf.scores, money: perf.money,
      }) //필요 속성들 재구성
    })
    setOptionList([...options])
  }
  //이중 객체 생성
  const createMatrix = (list, initVal) => {
    let matrix = {}
    list?.forEach((key, index) => matrix[index] = initVal);
    return matrix
  }
  //성취도 selector 변경 시
  const handleAchivOnChange = (event) => {
    let achivIndex = event.value
    let achivRec = selectedPerf?.perfRecordList[achivIndex] ?? ''
    let lastNumber = Object.keys(perfRecord).length
    for (let i = 0; i < lastNumber; i++) {
      setPerfRecord((prev) => { return { ...prev, [i]: achivRec } })
      setPerfTempRecord((prev) => { return { ...prev, [i]: achivRec } })
    }
  }
  //라디오 버튼 변경 시
  const handleRadioOnChange = (index, subIndex) => {
    if (selectedPerf) {
      let record = selectedPerf?.perfRecordList[subIndex]
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
  const handleAltBtnOnClick = (index) => {
    const text = perfTempRecord[index]
    const altList = (replaceList[index])
    const replaced = replacePlaceholders(text, altList)
    setPerfRecord((prev) => { return { ...prev, [index]: replaced } })
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
  //성취도 selector option
  const getAchivOptionList = () => {
    const achivOptionList = achivList.map((achiv, index) => ({ label: achiv, value: index }));
    return achivOptionList
  }
  //ocr selector option
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
    if (selectedPerf) {
      if (window.confirm("저장하시겠습니까?")) {
        writePerfRecDataOnDB(studentList, classId, selectedPerf, perfRecord);
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
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>수행 평가 관리</Modal.Header>
      <SubNav styles={{ padding: "5px", marginBottom: "0" }}>
        <Select
          onChange={(event) => { setSelectedPerf(event) }}
          options={optionList}
          placeholder="수행평가를 선택해주세요."
        />
        {selectedPerf && <Select
          onChange={(event) => { handleAchivOnChange(event) }}
          options={getAchivOptionList()}
          placeholder="성취도를 선택해주세요."
        />}
      </SubNav>
      {selectedPerf && <SubNav styles={{ padding: "5px", }}>
        <MidBtn type="button" onClick={handleFileOnClick}>📁 PDF 선택</MidBtn>
        <input type='file' ref={inputFileRef} onChange={handleFileOnChange} accept="application/pdf" style={{ display: "none" }} />
        {(pdfFile && ocrStage === 0) && <MidBtn onClick={handleUploadOnClick}>업로드</MidBtn>}
        {ocrStage === 1 && <MidBtn onClick={postExtractText}>추출</MidBtn>}
        {ocrStage === 2 && <MidBtn onClick={handleGetOcrResults}>다운로드</MidBtn>}
        {(ocrList?.length !== 0 && ocrStage === 3) && <Select
          onChange={(event) => { setSelectedOcr(event) }}
          options={getOcrOptionList()}
          placeholder="ocr 결과를 선택해주세요." />}
        {loadingStage && <Spinner />}
        <span style={{ marginTop: "5px" }}>{loadingStage || pdfFile?.name || "파일 없음"}</span>
      </SubNav>}
      <Modal.Body>
        <GridContainer>
          <TableHeaderWrapper>
            <StyledHeader>연번</StyledHeader>
            <StyledHeader>학번</StyledHeader>
            <StyledHeader>이름</StyledHeader>
            <StyledHeader>성취도</StyledHeader>
            <StyledHeader>개별화 부분</StyledHeader>
            <StyledHeader>문구</StyledHeader>
            <StyledHeader>바이트</StyledHeader>
          </TableHeaderWrapper>
          {(studentList?.length > 0) && studentList.map((student, index) => {
            const key = student.id
            const studentNumber = student.studentNumber
            const name = (student.writtenName || "미등록")
            return <React.Fragment key={key}>
              <StyledGridItem>{index + 1}</StyledGridItem>     {/* 연번 */}
              <StyledGridItem>{studentNumber}</StyledGridItem> {/* 학번 */}
              <StyledGridItem>{name}</StyledGridItem>          {/* 이름 */}
              <StyledGridItem>                                 {/* 성취도 */}
                <FormWrapper>
                  {achivList.map((val, subIndex) => {
                    return <label key={`${index}${subIndex}`}>
                      <input
                        type="radio"
                        ref={(ele) => radioRef.current[`${index}-${val}`] = ele}
                        name="achivement"
                        value={val}
                        onChange={() => { handleRadioOnChange(index, subIndex) }} />
                      {val}</label>
                  })}
                </FormWrapper>
              </StyledGridItem>
              {/* 개별화 */}
              <StyledGridItem>
                <ExtractWrapper>
                  {extractResult[index]?.length > 0 && extractResult[index].map((result, subIndex) => {
                    //place홀더 개수에 따라 input 생성
                    return (<React.Fragment key={`${result}${subIndex}`}>
                      <p>{result}</p>
                      <input
                        type="text"
                        ref={(ele) => inputRef.current[`${index}-${subIndex}`] = ele}
                        onChange={(event) => { handleInputOnChange(event, index, subIndex) }}
                      />
                    </React.Fragment>)
                  })}
                  {extractResult[index]?.length > 0 && <Row><MidBtn onClick={() => { handleAltBtnOnClick(index) }}>변경</MidBtn></Row>}
                  {(studentOcr[index] !== '' && !gptLoadingIndex) && <>
                    <StyledTextarea
                      value={studentOcr[index]}
                      onChange={(event) => { handleOcrTextOnChange(event, index) }} />
                    {!gptLoadingIndex && <Row style={{ gap: "10px" }}>
                      <MidBtn onClick={() => { handleOcrGptOnClilck(index) }}>GPT 적용</MidBtn>
                      <MidBtn onClick={() => { handleTranslateOnClick(index) }}>한국말로</MidBtn>
                      <MidBtn onClick={() => { handleOcrRemoveOnClick(index) }}>제거</MidBtn>
                    </Row>}
                  </>}
                  {gptLoadingIndex === index && <Row style={{ marginTop: "10px" }}><Spinner /></Row>}
                  {(selectedOcr && perfRecord[index] !== '') && <Row><MidBtn onClick={() => { handleOcrInsertOnClick(index) }}>OCR 추가</MidBtn></Row>}
                </ExtractWrapper>
              </StyledGridItem>
              {/* 문구 */}
              <StyledGridItem><StyledTextarea value={perfRecord[index]} onChange={(event) => { handlePerfRecordOnChange(event, index) }} /></StyledGridItem>
              <StyledGridItem>{getByte(index)}</StyledGridItem>
            </React.Fragment>
          })}
        </GridContainer>
      </Modal.Body>
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
const StyledHeader = styled.div`
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
const StyledGridItem = styled.div`
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
const StyledTextarea = styled.textarea`
  width: 100%;
  border: none;
  border-radius: 10px;
  height: 150px;
`
export default PerfModal