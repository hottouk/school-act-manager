//라이브러리
import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import ChargeRiraModal from '../ChargeRiraModal';
import InnerLayer from '../../Styled/InnerLayer';
import InnerOverlay from '../../Styled/InnerOverlay';
//hooks
import useChatGpt from '../../../hooks/useChatGpt';
import useFireStorage from '../../../hooks/useFireStorage';
//data
import { academicAbility, subjectCareerAbility, subjectCoopAbility } from '../../../data/abilityList';
//img
import plusIcon from '../../../image/icon/plus.png'
import arrowsIcon from '../../../image/icon/arrows_icon.png'
import GptIngModal from './GptIngModal';
import { GPT_RESPONSE } from '../../../constants/gpt';
//수정(240904) => 보고서탭(241203) => OCR(250327) -> 과금(260112)
const GptModal = ({ show, onHide, acti, setPersonalRecord }) => {
  const { uploadFile, findFile } = useFireStorage();
  const { askGptOnTrait, askGptOnReport, askTranslate, gptAnswer, gptRes, gptStatus, } = useChatGpt();
  const [whichBtn, setWhichBtn] = useState("gpt")
  useEffect(() => {
    if (whichBtn === "translate") setExtracted(gptAnswer);
    else setFinalProduct(gptAnswer);
  }, [gptAnswer, whichBtn]);
  const [finalProduct, setFinalProduct] = useState(null);
  //역량
  const [acadList, setAcadList] = useState([])      //학업
  const [careerList, setCareerList] = useState([])  //진로
  const [coopList, setCoopList] = useState([])      //공동체
  useEffect(() => {
    sortAbilityList(academicAbility, "academic")
    sortAbilityList(subjectCareerAbility, "career")
    sortAbilityList(subjectCoopAbility, "coop")
  }, [academicAbility, subjectCareerAbility, subjectCoopAbility]);
  const [inputValues, setInputValues] = useState({});
  //탭 
  const [tab, setTab] = useState(1);
  const gptPromptByTap = {
    1: ({ model, thinkEffort, verbosity, leftRira }) => {
      const resultArray = convertObjectToArray(inputValues);
      askGptOnTrait({ subject: acti?.subject, record: acti?.record, personalPropList: resultArray, model, thinkEffort, verbosity, leftRira });
    },
    2: ({ model, thinkEffort, verbosity, leftRira }) => askGptOnReport({ record: acti?.record, report, model, thinkEffort, verbosity, leftRira }),
    3: ({ model, thinkEffort, verbosity, leftRira }) => {
      if (whichBtn === "gpt") askGptOnReport({ record: acti?.record, report, model, thinkEffort, verbosity, leftRira })
      else askTranslate({ text: extracted, model, thinkEffort, verbosity, leftRira });
    },
  }
  //숨기기 토글
  const [isAcadShown, setIsAcadShown] = useState(false)
  const [isCareerShown, setIsCareerShown] = useState(false)
  const [isCoopShown, setIsCoopShown] = useState(false)
  //자기 보고서
  const [report, setReport] = useState('');
  //텍스트 추출
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (!file) return;
    if (file.name.endsWith(".jpg")) { setIsPdf(false) }
    else if (file.name.endsWith(".pdf")) { setIsPdf(true) };
  }, [file])
  const [filePath, setFilePath] = useState(null);
  const [extracted, setExtracted] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [ocrStage, setOcrStage] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(null);
  const inputFileRef = useRef(null);
  //추가 모달
  const [isRiraModal, setIsRiraModal] = useState(false);
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
    if (tab === 1) { return "2~3개만 채우시는게 바람직합니다" }
    else if (tab === 2) { return "학생 보고서를 복사, 붙여넣기 하세요." }
    else { return "pdf 또는 jpg 파일만 가능합니다." }
  }
  //input 변경
  const handleInputChange = (event, type) => {
    if (type === "input") {
      const { id, value } = event.target;
      setInputValues(prev => {
        if (value === '') {
          const next = { ...prev };
          delete next[id];
          return next;
        }
        return { ...prev, [id]: value };
      });
    } else {
      const { id, name, value } = event;
      const key = id || name;
      setInputValues(prev => ({ ...prev, [key]: value }));
    }
  };
  //유효성 검사
  const check = () => {
    let result = true;
    if (tab === 1) { if (!inputValues || Object.keys(inputValues).length === 0) { alert("특성을 선택하거나 작성하세요."); result = false; } }
    else if (tab === 2) if (report === '') { alert("학생 활동 보고서를 입력해주세요."); result = false; }
    else if (tab === 3) if (extracted === '') { alert("추출된 text가 없습니다."); result = false; }
    return result;
  };
  //gpt
  const handleGptOnClick = (whichBtn) => {
    if (!check()) return;
    if (whichBtn) setWhichBtn(whichBtn);
    setIsRiraModal(true);
  };
  //GPT 승인 시
  const askGptOnApprove = ({ model, thinkEffort, verbosity, leftRira }) => {
    const fn = gptPromptByTap[tab];
    console.log(fn);
    if (typeof (fn) !== "function") { alert("지원하지 않는 GPT 타입입니다."); return; }
    fn({ model, thinkEffort, verbosity, leftRira });
  }
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
  const handleFileOnChange = (event) => setFile(event.target.files[0]);
  //업로드 버튼
  const handleUploadOnClick = async () => {
    if (!file) {
      alert("파일이 없습니다.");
      return;
    }
    const fileName = file.name;
    let fileType = null;
    if (isPdf) fileType = "pdfs";
    else if (!isPdf) fileType = "jpgs";
    else { alert("jpg 또는 pdf 파일이 아닙니다."); return; }
    const filePath = `${fileType}/${fileName}`;
    const isExist = await findFile(fileType, fileName);
    if (isExist) {
      setFilePath(filePath);
      setOcrStage(1);
    } else {
      setLoadingMsg("⏳ 파일 업로드중...");
      await uploadFile(fileType, file);
      setFilePath(filePath);
      setLoadingMsg(null);
      setOcrStage(1);
    }
  };
  //추출 버튼
  const postExtractText = async () => {
    setLoadingMsg("📤 텍스트 추출중...이 작업은 오래 걸릴 수 있습니다.");
    //jpg는 1장만 가능, pdf와 방식 다름.
    try {
      if (!isPdf) {
        const res = await axios.post(process.env.REACT_APP_OCR_API_URL,
          { filePath: filePath },
          { headers: { "Content-Type": "application/json" } });
        setExtracted(res?.data?.text || '');
      } else if (isPdf) {
        const fileName = file.name.split(".")[0];
        const isExist = await findFile("ocr_results", fileName);
        if (!isExist) {
          //추출
          const extractRes = await axios.post(process.env.REACT_APP_OCR_API_PDF_URL,
            { fileName: file.name },
            { headers: { "Content-Type": "application/json" } })
          if (!extractRes) return;
        }
        // pdf 다운로드
        setLoadingMsg("⏳ 다운로드중...")
        const downRes = await axios.get(process.env.REACT_APP_OCR_RESULT_URL,
          { params: { fileName: file.name } })
        if (!downRes) return;
        setExtracted(downRes.data.pages.join(","));
      }
      setOcrStage(2);
      setLoadingMsg(null);
    } catch (error) {
      console.error("추출 실패: ", error);
      alert("추출 실패: ", error);
    }
  };
  //확인 버튼
  const handleConfirmOnClick = () => {
    setPersonalRecord(finalProduct);
    onHide();
  };
  return <Modal size="lg"
    show={show}
    onHide={onHide}
    backdrop={'static'}
  >
    <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>GPT 개별화</Modal.Header>
    <Modal.Body style={{ backgroundColor: "#efefef" }}>
      {<Column style={{ gap: "10px" }}>
        <DotTitle>현재 문구</DotTitle>
        <WhiteWrapper>{acti?.record}</WhiteWrapper>
        <StyledImg src={plusIcon} alt="plus_icon" />
        <TabWrapper>
          <UpperTab $tab={tab} onClick={() => { setTab(1) }}>특성</UpperTab>
          <UpperTab className="tab2" $tab={tab} onClick={() => { setTab(2) }}>보고서</UpperTab>
          <UpperTab className="tab3" $tab={tab} onClick={() => { setTab(3) }}>OCR</UpperTab>
          {tab === 1 && <Column style={{ gap: "5px" }}>
            <DotTitle title={"학업 역량 ▼"} onClick={() => { setIsAcadShown((prev) => !prev) }} pointer="pointer" />
            <AnimMaxHightOpacity isVisible={isAcadShown}
              content={<RowWrapper>
                {acadList?.map((obj) => { return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} /> })}
              </RowWrapper>
              } />
            <DotTitle title={"진로 역량 ▼"} onClick={() => { setIsCareerShown((prev) => !prev) }} pointer="pointer" />
            <AnimMaxHightOpacity isVisible={isCareerShown}
              content={<RowWrapper>
                {careerList?.map((obj) => { return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} /> })}
              </RowWrapper>
              } />
            <DotTitle title={"공동체 역량 ▼"} onClick={() => { setIsCoopShown((prev) => !prev) }} pointer="pointer" />
            <AnimMaxHightOpacity isVisible={isCoopShown}
              content={<RowWrapper>
                {coopList?.map((obj) => { return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} /> })}
              </RowWrapper>
              } />
            <Row style={{ marginTop: "10px", justifyContent: "center" }}>
              <MidBtn onClick={handleGptOnClick}>Chat GPT</MidBtn>
            </Row>
          </Column>}
          {tab === 2 && <>
            <Textarea
              value={report}
              placeholder="학생 보고서"
              onChange={(event) => setReport(event.target.value)}
            />
            <Row style={{ marginTop: "10px", justifyContent: "center" }}>
              {gptRes !== "loading" && <MidBtn onClick={handleGptOnClick}>Chat GPT</MidBtn>}
              {gptRes === "loading" && <Spinner />}
            </Row>
          </>}
          {tab === 3 && <>
            <TextSpan>pdf 또는 jpg 파일만 text 추출 가능합니다.</TextSpan>
            {loadingMsg && <Row style={{ justifyContent: "center" }}><Spinner />{loadingMsg}</Row>}
            {loadingMsg === "downloading" && <Row style={{ justifyContent: "center" }}><p>⏳ 다운로드중...</p></Row>}
            {!loadingMsg && <Column>
              {(file && !filePath) && <BasicText style={{ borderColor: "rgba(120,120,120,0.5)" }}>파일명: {file.name}</BasicText>}
              {(file && filePath) && <BasicText style={{ borderColor: "rgba(120,120,120,0.5)" }}>파일 경로: {filePath}</BasicText>}
              <input type="file" ref={inputFileRef} onChange={handleFileOnChange} accept="application/pdf,image/jpeg" style={{ display: 'none' }} />
              <Row style={{ gap: "15px", justifyContent: "center" }}>
                <MidBtn type="button" onClick={handleFileOnClick}>📁 파일 선택</MidBtn>
                {(file && ocrStage === 0) && <MidBtn type="button" onClick={handleUploadOnClick}>업로드</MidBtn>}
                {ocrStage === 1 && <Row><MidBtn type="button" onClick={postExtractText}>추출</MidBtn></Row>}
              </Row>
              {ocrStage === 2 && <Column style={{ gap: "10px" }}>
                <Textarea value={extracted} onChange={(e) => { setExtracted(e.target.value) }} style={{ marginTop: "10px" }} />
                <Row style={{ alignSelf: "center", gap: "10px" }}>
                  <MidBtn onClick={() => { handleGptOnClick("translate"); }}>한국말로 번역</MidBtn>
                  <MidBtn onClick={() => { handleGptOnClick("gpt"); }}>Chat GPT</MidBtn>
                </Row>
              </Column>}
            </Column>}
          </>}
        </TabWrapper>
        <StyledImg src={arrowsIcon} alt="arrows_icon" />
        <Textarea
          value={finalProduct || ''}
          placeholder={getPlaceholderText()}
          onChange={(event) => { setFinalProduct(event.target.value) }}
        />
        <Row style={{ margin: "10px 0", justifyContent: "flex-end" }}><ByteCalculator str={finalProduct} styles={{ isTotalByteHide: true }} /></Row>
      </Column>
      }
      {/* 추가 모달 */}
      {(isRiraModal || gptRes === GPT_RESPONSE.LOADING) && <InnerLayer>
        <InnerOverlay />
        <ChargeRiraModal
          show={isRiraModal}
          onHide={() => setIsRiraModal(false)}
          onApprove={askGptOnApprove}
        />
        <GptIngModal
          show={gptRes === GPT_RESPONSE.LOADING}
          status={gptStatus}
        />
      </InnerLayer>}
    </Modal.Body >
    <Modal.Footer style={{ backgroundColor: "#efefef" }}>
      <ModalBtn onClick={() => { onHide() }}>취소</ModalBtn>
      <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfirmOnClick}>확인</ModalBtn>
    </Modal.Footer>
  </Modal >
}

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const WhiteWrapper = styled(Column)`
  background-color: white;  
  margin-top: 10px;
  padding: 10px;
  gap: 10px;
  border-radius: 5px;
  white-space: pre-wrap;
`
const BasicText = styled.p`
  width: 100%;
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
`
const StyledImg = styled.img`
  width: 27px;
  margin: 10px auto;
`
const TextSpan = styled.span`
  margin: 7px;
`
const TabWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  padding: 13px;
  gap: 5px;
`
const UpperTab = styled.p`
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
    left: 72px;
  }
  &.tab3 {
    background-color: ${(props) => { return (props.$tab === 3 ? "#3454d1" : "#919294") }};
    left: 146px;
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
const Textarea = styled.textarea`
  height: 10dvh;
  padding: 5px;
  border-radius: 5px;
`
export default GptModal