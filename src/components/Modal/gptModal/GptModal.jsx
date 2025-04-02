//라이브러리
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
//컴포넌트
import DotTitle from '../../Title/DotTitle';
import GptPersonalRow from './GptPersonalRow';
import AnimMaxHightOpacity from '../../../anim/AnimMaxHightOpacity';
import ByteCalculator from '../../Etc/ByteCalculator';
import MidBtn from '../../Btn/MidBtn';
import ModalBtn from '../../Btn/ModalBtn';
//hooks
import useChatGpt from '../../../hooks/useChatGpt';
import useFireStorage from '../../../hooks/useFireStorage';
//data
import { academicAbility, subjectCareerAbility, subjectCoopAbility } from '../../../data/AbilityList';
//img
import plusIcon from '../../../image/icon/plus.png'
import arrowsIcon from '../../../image/icon/arrows_icon.png'

//수정(240904) => 보고서탭(241203) => OCR(250327)
const GptModal = ({ show, onHide, acti, setPersonalRecord }) => {
  const { uploadFile, findFile } = useFireStorage();
  const { askGptPersonalize, askPersonalizeOnReport, askPersonalizeOnTyping, gptAnswer, gptRes } = useChatGpt();
  //역량
  const [acadList, setAcadList] = useState([])      //학업
  const [careerList, setCareerList] = useState([])  //진로
  const [coopList, setCoopList] = useState([])      //공동체
  useEffect(() => {
    sortAbilityList(academicAbility, "academic")
    sortAbilityList(subjectCareerAbility, "career")
    sortAbilityList(subjectCoopAbility, "coop")
  }, [academicAbility, subjectCareerAbility, subjectCoopAbility])
  const [inputValues, setInputValues] = useState(null);
  //탭 
  const [tab, setTab] = useState(1)
  //숨기기 토글
  const [isAcadShown, setIsAcadShown] = useState(false)
  const [isCareerShown, setIsCareerShown] = useState(false)
  const [isCoopShown, setIsCoopShown] = useState(false)
  //자기 보고서
  const [report, setReport] = useState("");
  //텍스트 추출
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (!file) return;
    if (file.name.endsWith(".jpg")) { setIsPdf(false) } else if (file.name.endsWith(".pdf")) { setIsPdf(true) };
  }, [file])
  const [filePath, setFilePath] = useState(null);
  const [extracted, setExtracted] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [ocrStage, setOcrStage] = useState(0);
  const [loadingStage, setLoadingStage] = useState(null);
  const inputFileRef = useRef(null);
  //------함수부------------------------------------------------  
  //능력 분류
  const sortAbilityList = (list, type) => {
    list.forEach((obj) => {
      let prop = (Object.keys(obj)[0])
      let wordList = (Object.values(obj)[0])
      let propWithKeyword = { prop, wordList }
      switch (type) {
        case "academic":
          setAcadList((prevList) => [...prevList, propWithKeyword])
          break;
        case "career":
          setCareerList((prevList) => [...prevList, propWithKeyword])
          break;
        case "coop":
          setCoopList((prevList) => [...prevList, propWithKeyword])
          break;
        default:
          return;
      }
    })
  }
  //placeholder text
  const getPlaceholderText = () => {
    if (tab === 1) { return "모든 역량을 다 눌러쓰시기보다 2~3개만 채우시는게 바람직합니다...from gpt" }
    else if (tab === 2) { return "학생 보고서를 복사, 붙여넣기 하세요." }
    else { return "pdf 또는 jpg 파일만 가능합니다." }
  }

  //input 변경
  const handleInputChange = (event, type) => {
    if (type === "input") {
      let { id, value } = event.target;
      setInputValues({ ...inputValues, [id]: value });
    } else {
      let { id, value } = event
      setInputValues({ ...inputValues, [id]: value });
    }
  };
  //제출
  const handleSubmit = (event) => {
    event.preventDefault();
    //탭1: 특성 기반 개별화
    if (tab === 1) {
      const resultArray = convertObjectToArray(inputValues)
      askGptPersonalize(acti, resultArray)
    }
    //탭2: 보고서 기반 개별화
    else if (tab === 2) {
      const check = report !== ""
      if (check) {
        askPersonalizeOnReport(acti?.record, report)
      } else {
        window.alert("학생 활동 보고서를 입력해주세요.")
      }
    }
    //탭3: 추출 text 기반 개별화
    else if (tab === 3) {
      const check = extracted !== ""
      if (check) {
        askPersonalizeOnTyping(acti?.record, extracted)
      } else {
        window.alert("추출된 text가 없습니다.")
      }
    }
  };
  //inputValues중 값이 있는 항목만 배열로 변경
  const convertObjectToArray = (obj) => {
    return Object.entries(obj)
      .filter(([key, value]) => value) // 값이 있는 항목만 필터링
      .map(([key, value]) => ({ [key]: value }));
  };
  //파일 선택 버튼
  const handleFileOnClick = (event) => {
    event.preventDefault();
    inputFileRef.current.click();
    setOcrStage(0);
  }
  //파일 선택
  const handleFileOnChange = (event) => {
    setFile(event.target.files[0]);
  }
  //업로드 버튼
  const handleUploadOnClick = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("파일이 없습니다.")
      return;
    }
    const fileName = file.name
    if (fileName.endsWith(".pdf")) {
      const filePath = `pdfs/${file.name}`;
      const isExist = await findFile("pdfs", fileName);
      if (isExist) {
        setFilePath(filePath);
        setOcrStage(1);
      } else {
        uploadFile("pdfs", file).then(() => {
          setLoadingStage("⏳ 파일 업로드중...");
          setFilePath(filePath);
          setLoadingStage(null);
          setOcrStage(1);
        })
      };
    } else if (fileName.endsWith(".jpg")) {
      const filePath = `jpgs/${file.name}`;
      const isExist = await findFile("jpgs", fileName);
      if (isExist) {
        setFilePath(filePath);
        setOcrStage(1);
      } else {
        uploadFile("jpgs", file).then(() => {
          setFilePath(filePath);
          setLoadingStage(null);
          setOcrStage(1);
        })
      }
    } else {
      alert("jpg 또는 pdf 파일이 아닙니다.");
      setLoadingStage(null);
      return;
    }
  }
  //추출 버튼
  const postExtractText = async (event) => {
    event.preventDefault();
    const fileName = file.name.split(".")[0];
    const isExist = await findFile("ocr_results", fileName);
    let response = null;
    if (!isPdf) { //jpg
      setLoadingStage("📤 텍스트 추출중...이 작업은 오래 걸릴 수 있습니다.");
      try {
        response = await axios.post(process.env.REACT_APP_OCR_API_URL, { filePath: filePath }, { headers: { "Content-Type": "application/json" } });
        setOcrStage(3);
        setExtracted(response.data.text);
        setLoadingStage(null);
      } catch (error) {
        console.error("추출 실패: ", error);
        alert("추출 실패: ", error);
      }
    } else if (isPdf) { //pdf
      if (isExist) { setOcrStage(2); }
      else {
        setLoadingStage("📤 텍스트 추출중...이 작업은 오래 걸릴 수 있습니다.");
        try {
          response = await axios.post(process.env.REACT_APP_OCR_API_PDF_URL, { fileName: file.name }, { headers: { "Content-Type": "application/json" } })
          if (response) {
            alert("추출 작업이 완료되었습니다.");
            setOcrStage(2);
            setLoadingStage(null);
          }
        } catch (error) {
          console.error("추출 실패: ", error);
          alert("추출 실패: ", error);
        }
      }
    }
  }
  //다운로드 버튼
  const handleGetOcrResults = async (event) => {
    event.preventDefault();
    let response = null;
    setLoadingStage("⏳ 다운로드중...")
    try {
      response = await axios.get(process.env.REACT_APP_OCR_RESULT_URL, {
        params: { fileName: file.name }
      })
      setExtracted(response.data.pages.join(","));
      setOcrStage(3);
      setLoadingStage(null);
    } catch (error) {
      console.error("OCR 결과 가져오기 실패:", error);
      alert("OCR 결과 가져오기 실패:", error);
      setLoadingStage(null);
      setOcrStage(3);
    }
  };
  //확인 버튼
  const handleConfirmOnClick = (event) => {
    event.preventDefault();
    setPersonalRecord(gptAnswer);
    onHide();
  }

  return (
    <Modal size="lg"
      show={show}
      onHide={onHide}
      backdrop="static"
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>GPT 개별화</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        {(gptRes === "loading")
          ? <div className="text-center">
            <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>
          </div>
          : <StyledForm onSubmit={handleSubmit}>
            <StyledText>{acti?.record}</StyledText>
            <StyledImg src={plusIcon} alt="plus_icon" />
            <DotTitleWrapper>
              <StyledTab $tab={tab} onClick={() => { setTab(1) }}>특성</StyledTab>
              <StyledTab className="tab2" $tab={tab} onClick={() => { setTab(2) }}>보고서</StyledTab>
              <StyledTab className="tab3" $tab={tab} onClick={() => { setTab(3) }}>OCR</StyledTab>
              {tab === 1 && <>
                <StyledSpan>학생의 특성을 간단히 적어주세요</StyledSpan>
                <DotTitle title={"학업 역량 ▼"} onClick={() => { setIsAcadShown((prev) => !prev) }} pointer="pointer"
                  styles={{ dotColor: "#3454d1", width: "50%", marginBot: "0" }} />
                <AnimMaxHightOpacity isVisible={isAcadShown}
                  content={<RowWrapper>
                    {acadList?.map((obj) => { return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} /> })}
                  </RowWrapper>
                  } />
                <DotTitle title={"진로 역량 ▼"} onClick={() => { setIsCareerShown((prev) => !prev) }} pointer="pointer"
                  styles={{ dotColor: "#3454d1", width: "50%", marginBot: "0" }} />
                <AnimMaxHightOpacity isVisible={isCareerShown}
                  content={<RowWrapper>
                    {careerList?.map((obj) => { return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} /> })}
                  </RowWrapper>
                  } />
                <DotTitle title={"공동체 역량 ▼"} onClick={() => { setIsCoopShown((prev) => !prev) }} pointer="pointer"
                  styles={{ dotColor: "#3454d1", width: "50%", marginBot: "0" }} />
                <AnimMaxHightOpacity isVisible={isCoopShown}
                  content={<RowWrapper>
                    {coopList?.map((obj) => { return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} /> })}
                  </RowWrapper>
                  } />
                <Row style={{ marginTop: "10px" }}><MidBtn type="submit">Chat GPT </MidBtn></Row>

              </>}
              {tab === 2 && <>
                <StyledSpan>위 활동에 참여한 학생이 작성한 보고서 또는 소감문을 넣어주세요.</StyledSpan>
                <textarea
                  value={report}
                  placeholder="복사/붙여넣기 하시면 됩니다."
                  onChange={(e) => { setReport(e.target.value) }} />
                <Row style={{ marginTop: "10px" }}><MidBtn type="submit">Chat GPT </MidBtn></Row>
              </>}
              {tab === 3 && <>
                <StyledSpan>pdf 또는 jpg 파일만 text 추출 가능합니다.</StyledSpan>
                {loadingStage && <Row style={{ justifyContent: "center" }}><Spinner />{loadingStage}</Row>}
                {loadingStage === "downloading" && <Row style={{ justifyContent: "center" }}><p>⏳ 다운로드중...</p></Row>}
                {!loadingStage && <>
                  {(file && !filePath) && <StyledText style={{ borderColor: "rgba(120,120,120,0.5)" }}>파일명: {file.name}</StyledText>}
                  {(file && filePath) && <StyledText style={{ borderColor: "rgba(120,120,120,0.5)" }}>파일 경로: {filePath}</StyledText>}
                  <input type="file" ref={inputFileRef} onChange={handleFileOnChange} accept="application/pdf,image/jpeg" style={{ display: 'none' }} />
                  <Row style={{ gap: "15px" }}>
                    <MidBtn type="button" onClick={handleFileOnClick}>📁 파일 선택</MidBtn>
                    {(file && ocrStage === 0) && <MidBtn type="button" onClick={handleUploadOnClick}>업로드</MidBtn>}
                    {ocrStage === 1 && <Row><MidBtn type="button" onClick={postExtractText}>추출</MidBtn></Row>}
                    {ocrStage === 2 && <Row style={{ gap: "5px" }}><MidBtn type="button" onClick={handleGetOcrResults}>다운로드</MidBtn></Row>}
                  </Row>
                  {(ocrStage === 3 && extracted) && <textarea value={extracted} onChange={(e) => { setExtracted(e.target.value) }} style={{ marginTop: "10px" }} />}
                  {extracted && <Row style={{ marginTop: "10px" }}><MidBtn type="submit">Chat GPT </MidBtn></Row>}
                </>}
              </>}
            </DotTitleWrapper>
            <StyledImg src={arrowsIcon} alt="arrows_icon" />
            <textarea
              defaultValue={gptAnswer || ''}
              placeholder={getPlaceholderText()}
              disabled
            >
            </textarea>
            <Row style={{ margin: "10px 0", justifyContent: "flex-end" }}><ByteCalculator str={gptAnswer} styles={{ isTotalByteHide: true }} /></Row>
          </StyledForm>
        }
      </Modal.Body >
      <Modal.Footer style={{ backgroundColor: "#efefef" }}>
        <ModalBtn onClick={() => { onHide() }}>취소</ModalBtn>
        <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfirmOnClick}>확인</ModalBtn>
      </Modal.Footer>
    </Modal >)
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  padding: 10px;
  textarea {
    border: 1px solid rgba(120, 120, 120, 0.5);
    border-radius: 10px;
    padding: 5px;
    height: 100px;
  }
  p.byte { 
    widht: 80px;
    align-self: flex-end;
  }
`
const Row = styled.div`
  display: flex;
  justify-content: center;
`
const StyledText = styled.p`
  width: 100%;
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
`
const StyledImg = styled.img`
  width: 27px;
  margin: 10px auto;
`
const StyledSpan = styled.span`
  margin: 7px;
`
const DotTitleWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid #919294;
  border-radius: 10px;
  padding: 13px;
  margin: 15px 0;
  gap: 5px;
`
const StyledTab = styled.p`
  position: absolute;
  top: -35px;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  background-color: ${(props) => { return (props.$tab === 1 ? "#3454d1" : "#919294") }};
  color: white;
  padding: 5px 15px;
  cursor: pointer;
  &.tab2 {
    background-color: ${(props) => { return (props.$tab === 2 ? "#3454d1" : "#919294") }};
    left: 75px;
  }
  &.tab3 {
    background-color: ${(props) => { return (props.$tab === 3 ? "#3454d1" : "#919294") }};
    left: 153px;
  }
`
const RowWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: -10px;
  margin-top: 5px;
  margin-bottom: 5px;
`
export default GptModal