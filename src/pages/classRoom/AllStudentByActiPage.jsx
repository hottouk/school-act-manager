//라이브러리
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Select from 'react-select'
import styled from 'styled-components';
//컴포넌트
import EmptyResult from '../../components/EmptyResult';
import MainContainer from '../../components/Styled/MainContainer';
import SubNav from '../../components/Bar/SubNav';
import BackBtn from '../../components/Btn/BackBtn';
import SmallBtn from '../../components/Btn/SmallBtn';
import ChargeRiraModal from '../../components/Modal/ChargeRiraModal';
import GptIngModal from '../../components/Modal/gptModal/GptIngModal';
//hooks
import useAcc from '../../hooks/useAcc';
import useGetByte from '../../hooks/useGetByte';
import useChatGpt from '../../hooks/useChatGpt';
import useFireStorage from '../../hooks/useFireStorage';
//data
import { GPT_MULTI_MODE } from "../../constants/gptMode";
import { academicAbility, subjectCareerAbility, subjectCoopAbility } from '../../data/abilityList'
//효과
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity';
//리뉴얼(260121)
const AllStudentByActiPage = () => {
	useEffect(() => initData(), [])
	//학생
	const { state } = useLocation();
	const { studentList, klassId } = state;
	//활동
	const actiList = useSelector(({ allActivities }) => allActivities);
	const [selectedActi, setSelectedActi] = useState(null);
	useEffect(() => bindRecByActi(), [selectedActi]);
	//개별 문구
	const [_recordMap, setRecordMap] = useState({});
	const [_personalInfoMap, setPersonalInfoMap] = useState({});
	useEffect(() => {
		const last = Object.keys(_recordMap).length;
		for (let i = 0; i < last; i++) { bindBlankByRec(_recordMap[i], i); }
	}, [_recordMap]);
	const { getByteLengthOfString } = useGetByte();
	//gpt
	const { askPersonalizeOnReport, askPersonalizeOnKeywords, askMultipleWork, askTranslate, gptRes, gptStatus, gptProgress, gptAnswer, gptAnswerList } = useChatGpt();
	useEffect(() => setIsLoading(gptRes === "loading"), [gptRes]);
	useEffect(() => setLoadingMsg(gptStatus), [gptStatus]);
	const [gptTarget, setGptTarget] = useState({ idx: null, mode: null });
	useEffect(() => bindGptAnaswer(), [gptAnswer, gptAnswerList]);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingMsg, setLoadingMsg] = useState('');
	//다중 선택
	const [isMulti, setIsMulti] = useState(false);
	const [selectedList, setSelectedList] = useState([]);
	//저장
	const { writeByActiDataOnDB } = useAcc();
	//ocr
	const inputFileRef = useRef({});
	const { uploadFile, findFile } = useFireStorage();
	const [isOcrMenu, setIsOcrMenu] = useState(false);
	const [ocrStage, setOcrStage] = useState(0);
	const [pdfFile, setPdfFile] = useState(null);
	const [ocrList, setOcrList] = useState([]);
	const [selectedOcr, setSelectedOcr] = useState(null);
	//모달
	const [isRiraModal, setIsRiraModal] = useState(false);
	//------useMemo------------------------------------------------
	//활동 셀렉터
	const optionList = useMemo(() => (actiList ?? []).map((acti) => ({ label: acti.title, value: acti.record, ...acti })), [actiList]);
	//라디오 버튼
	const renderRadioList = (selected) => {
		if (!selected) return [];
		const { record, perfRecordList, extraRecordList, repeatInfoList } = selected;
		const list = [{ label: "기본 문구", value: record, type: "basic" }];
		if (perfRecordList?.length > 0) ["샹", "중", "하", "최하"].forEach((item, index) => list.push({ label: item, value: perfRecordList[index], type: "perf" }));
		extraRecordList?.forEach((item, index) => list.push({ label: `랜덤문구${index + 1}`, value: item }));
		repeatInfoList?.forEach(({ times, record }) => list.push({ label: `${times}회 반복문구`, value: record, type: "repeat" }));
		return list;
	}
	const radioList = useMemo(() => renderRadioList(selectedActi), [selectedActi]);
	//능력 키워드
	const abilityToOptions = (list) =>
		(list ?? []).flatMap((item) =>
			Object.values(item)[0].map((v) => ({ label: v, value: v }))
		);
	const acaOptList = useMemo(() => abilityToOptions(academicAbility), [academicAbility]);
	const careerOptList = useMemo(() => abilityToOptions(subjectCareerAbility), [subjectCareerAbility]);
	const coopOptList = useMemo(() => abilityToOptions(subjectCoopAbility), [subjectCoopAbility]);
	//------함수부--------------------------------------------------
	const initData = () => {
		if (!studentList) return;
		setRecordMap(createMatrix(studentList, ''));
		setPersonalInfoMap(createMatrix(studentList, { mode: "report", fillerMap: {}, blankList: [], keywordList: [], }));
		// if (setSavedActi) { setSelectedActi(savedActi); }
		// else { setSelectedActi(null); }
	};
	//Map 생성
	const createMatrix = (list, initVal) => {
		const matrix = {};
		list?.forEach((_, index) => matrix[index] = initVal);
		return matrix;
	};
	//활동 선택 종속
	const bindRecByActi = () => {
		if (!selectedActi) return;
		const actiId = selectedActi.id;
		const nextMap = {};
		studentList.forEach((student, idx) => {
			nextMap[idx] =
				student.actList?.find((acti) => acti.id === actiId)?.record ?? '';
		})
		setRecordMap(nextMap);
	};
	//문구 종속
	const bindBlankByRec = (record, idx,) => {
		setPersonalInfoMap((prev) => {
			const target = prev[idx];
			const blankList = getBlankList(record);
			return { ...prev, [idx]: { ...target, record, blankList } };
		});
	}
	//특정 기호, {/*  */} 사이 빈칸 만들기
	const getBlankList = (text) => {
		const matches = text?.match(/\{\/\*\s*(.*?)\s*\*\/\}/g); //정규식
		return matches?.map(match => match?.slice(3, -3).trim()) || [];
	}
	//빈칸 채우기
	const fillBalnks = (text, map) => {
		if (!map) { window.alert("빈칸을 채워주세요."); return; }
		let index = 0;
		return text.replace(/\{\/\*.*?\*\/\}/g, () => map[index++].split(":")[1] || '');
	}
	//gpt 
	const bindGptAnaswer = () => {
		const { mode, idx } = gptTarget;
		if (gptAnswer) {
			if (idx == null) return;
			if (mode === "translate") setPersonalInfoMap(prev => {
				const { report, ...rest } = prev[idx];
				return { ...prev, [idx]: { ...rest, report: gptAnswer } };
			});
			else setRecordMap((prev) => ({ ...prev, [idx]: gptAnswer }));
		} else {
			gptAnswerList.forEach((item) => {
				const { idx, answer } = item;
				if (mode === GPT_MULTI_MODE.trans) setPersonalInfoMap(prev => {
					const { report, ...rest } = prev[idx];
					return { ...prev, [idx]: { ...rest, report: answer } };
				});
				else setRecordMap((prev) => ({ ...prev, [idx]: answer }));
			})
		}
		setGptTarget({ mode: null, idx: null });
	}
	//ocr 결과
	const renderOcrOptions = () => ocrList.map((ocrText, index) => ({ label: `페이지 ${index + 1}: ${ocrText.slice(0, 10)}...`, value: ocrText }));
	//------사용자------------------------------------------------  
	//문구 변경
	const handleRecordOnChange = (rec, idx) => setRecordMap((prev) => ({ ...prev, [idx]: rec }));
	//모드 변환
	const handleAllModeOnClick = () => {
		setPersonalInfoMap(prev =>
			Object.fromEntries(
				Object.entries(prev).map(([key, value]) => {
					const nextMode = { report: "filler", filler: "keyword", keyword: "report" }[value.mode];
					return [key, { ...value, mode: nextMode }];
				}))
		);
	};
	//개별 모드 변환
	const handleModeOnClick = (idx) => {
		setPersonalInfoMap(prev => {
			const { mode, ...rest } = prev[idx];
			const nextMode = { report: "filler", filler: "keyword", keyword: "report" }[mode];
			return ({ ...prev, [idx]: { ...rest, mode: nextMode } });
		});
	}
	//개별화 변경
	const handleReportOnChange = (rec, idx, type) => {
		setPersonalInfoMap((prev) => {
			const target = prev[idx];
			return ({ ...prev, [idx]: { ...target, [type]: rec } })
		})
	};
	//필러 변경
	const handleFillerOnChange = (filler, idx, subIndex) => {
		setPersonalInfoMap((prev) => {
			const target = prev[idx];
			const name = target.blankList[subIndex];
			const fillerMap = { ...(target.fillerMap ?? {}), [subIndex]: `${name}: ${filler}`, };
			return { ...prev, [idx]: { ...target, fillerMap } };
		})
	};
	//빈칸 채우기
	const handleFillOnClick = (idx) => {
		setPersonalInfoMap((prev) => {
			const { record, fillerMap, blankList, ...rest } = prev[idx];
			const replaced = fillBalnks(record, fillerMap);
			return { ...prev, [idx]: { ...rest, record: replaced, fillerMap: {}, blankList: [] } };
		})
	};
	//키워드 변경
	const handleSelectKeyword = (rec, idx, typing) => {
		setPersonalInfoMap((prev) => {
			const target = prev[idx];
			let keywordList;
			if (!typing) keywordList = [...(target.keywordList ?? []), rec];
			else keywordList = [rec];
			return { ...prev, [idx]: { ...target, keywordList } };
		})
	};
	//gpt 유효성 검사
	const check = (mode, idx) => {
		const { report, fillerMap, keywordList } = _personalInfoMap[idx];
		if (!_recordMap[idx]) { alert("문구를 입력하세요."); return false; }
		if (mode === "report" || mode === "translate") {
			if (!report) { alert("활동 보고서를 채워주세요."); return false; }
			return true;
		} else if (mode === "filler") {
			if (Object.keys(fillerMap).length === 0) { alert("빈칸을 채워주세요."); return false; }
			return true;
		} else if (mode === "keyword") {
			if (keywordList.length === 0) { alert("키워드가 없습니다."); return false; }
			return true;
		}
	}
	//gpt 클릭
	const handleGptOnClick = (mode, idx) => {
		if (!check(mode, idx)) return;
		setGptTarget({ mode, idx });
		setIsRiraModal(true);
	}
	//gpt 다중 유효성 검사
	const multiCheck = (multiMode) => {
		if (selectedList?.length === 0) { alert("선택된 사람이 없습니다."); return false; }
		if (selectedList.some(item => !item.record?.trim())) { alert("문구를 입력하세요."); return false; }
		if (multiMode === GPT_MULTI_MODE.trans) if (selectedList.some(item => item.mode !== "report")) { alert("번역은 레포트 모드만 가능합니다."); return false; }
		const invalid = selectedList.some(item => {
			let inner = false
			const { mode, report, fillerMap, keywordList } = item;
			if (mode === "report") { if (!report) { alert("활동 보고서가 비어 있는 셀이 있습니다."); inner = true; } }
			else if (mode === "filler") { if (Object.keys(fillerMap).length === 0) { alert("비어 있는 셀이 있습니다."); inner = true; } }
			else if (mode === "keyword") { if (keywordList.length === 0) { alert("키워드가 없는 셀이 있습니다."); inner = true; } }
			return inner;
		});
		if (invalid) return false;
		return true;
	}
	//다중 gpt 클릭
	const hadnleMultiGptOnClick = (multiMode) => {
		if (!multiCheck(multiMode)) return;
		setGptTarget({ idx: null, mode: multiMode });
		setIsRiraModal(true);
	}
	//gpt 승인 함수
	const getHandleOnApprove = (model) => {
		const { idx, mode } = gptTarget;
		if (mode === GPT_MULTI_MODE.general || mode === GPT_MULTI_MODE.trans) askMultipleWork(selectedList, model, mode).then(() => setIsMulti(false));
		if (idx === null) return; // 개별					
		const record = _recordMap[idx] || '';
		const target = _personalInfoMap[idx] || {};
		if (mode === "report") {
			askPersonalizeOnReport(record, target.report || '', model)
		} else if (mode === "filler") {
			const fillers = Object.values(target.fillerMap).join(',');
			askPersonalizeOnKeywords(record, fillers, model);
		} else if (mode === "keyword") {
			const keywords = (target.keywordList ?? []).join(',');
			askPersonalizeOnKeywords(record, keywords, model);
		} else if (mode === "translate") {
			askTranslate(target.report || '', model);
		}
	}
	//gpt 다중 선택
	const handleCheckToggle = (info, checked) => {
		setSelectedList((prev) => {
			if (!checked) {
				if (prev.some(item => item.id === info.id)) return prev;
				return [...prev, info];
			}
			return prev.filter(item => item.id !== info.id);
		});
	}
	//pdf
	const handlePdfOnClick = () => {
		inputFileRef.current.click();
		setOcrStage(0);
	}
	//pdf 유효성 검사
	const pdfCheck = () => {
		if (!pdfFile) { alert("파일이 없습니다."); return false; }
		if (!pdfFile.name.endsWith(".pdf")) { alert("pdf 파일이 아닙니다."); return false; }
		return true;
	}
	//업로드
	const handleUploadOnClick = async () => {
		if (!pdfCheck()) return;
		const isExist = await findFile("pdfs", pdfFile.name);
		if (isExist) { setOcrStage(1); return; }
		setIsLoading(true);
		setLoadingMsg("⏳ 파일 업로드중...");
		uploadFile("pdfs", pdfFile)
			.then(() => { setIsLoading(false); setLoadingMsg(''); setOcrStage(1); })
	}
	//추출
	const handleExtractOnClick = async () => {
		const fileName = pdfFile.name.split(".")[0];
		const isExist = await findFile("ocr_results", fileName);
		if (isExist) { setOcrStage(2); return; }
		setIsLoading(true);
		setLoadingMsg("📤 텍스트 추출중...이 작업은 오래 걸릴 수 있습니다.");
		let response = null;
		try {
			response = await axios.post(process.env.REACT_APP_OCR_API_PDF_URL, { fileName: pdfFile.name }, { headers: { "Content-Type": "application/json" } })
			if (response) { alert("추출 작업이 완료되었습니다."); setOcrStage(2); setLoadingMsg(''); setIsLoading(false); }
		} catch (error) {
			console.error("추출 실패: ", error); alert("추출 실패: ", error); setLoadingMsg(''); setIsLoading(false);
		}
	};
	//다운로드
	const handleOcrDownOnClick = async () => {
		let response = null;
		try {
			setIsLoading(true);
			setLoadingMsg("⏳ 다운로드중...")
			response = await axios.get(process.env.REACT_APP_OCR_RESULT_URL, { params: { fileName: pdfFile.name } })
			if (!response) return;
			setOcrList(response.data.pages);
			setOcrStage(3); setLoadingMsg(''); setIsLoading(false);
		} catch (error) {
			alert("OCR 결과 가져오기 실패:", error); console.error("OCR 결과 가져오기 실패:", error);
			setOcrList(["결과가 없습니다."]);
			setOcrStage(3); setLoadingMsg(''); setIsLoading(false);
		}
	};
	//ocr 삽입
	const handleOcrInsertOnClick = (idx) => {
		if (!selectedOcr) return;
		setPersonalInfoMap((prev) => {
			const { report, ...rest } = prev[idx];
			return { ...prev, [idx]: { ...rest, report: selectedOcr.value } };
		});
		setSelectedOcr(null);
	}
	//최종 저장 확인 버튼
	const handleSaveOnClick = () => {
		if (!selectedActi) { alert("선택된 활동이 없습니다."); return; }
		if (!window.confirm("저장하시겠습니까?")) return;
		writeByActiDataOnDB(studentList, klassId, selectedActi, _recordMap).then(() => { alert("저장되었습니다.") });
	}
	return <><MainContainer>
		<SubNav>
			<Row style={{ position: "absolute", left: "0", margin: "0 15px" }}><BackBtn /></Row>
			<Select
				onChange={(event) => setSelectedActi(event)}
				options={optionList}
				placeholder="활동을 선택해주세요."
				isDisabled={isMulti}
			/>
			{(ocrList?.length > 0 && ocrStage === 3) && <Select
				onChange={(event) => setSelectedOcr(event)}
				options={renderOcrOptions()}
				placeholder="ocr 결과를 선택해주세요."
				isDisabled={isMulti}
			/>}
			<Row style={{ position: "absolute", right: "0", alignItems: "center", gap: "15px", margin: "0 15px" }}>
				{!isMulti ? <>
					{pdfFile && <div style={{ position: "relative" }}>
						<AnimMaxHightOpacity isVisible={isOcrMenu}>
							<OcrWrapper>
								{ocrStage === 0 && <span style={{ cursor: "pointer" }} onClick={handleUploadOnClick}>파일 업로드</span>}
								{ocrStage === 1 && <span style={{ cursor: "pointer" }} onClick={handleExtractOnClick}>텍스트 추출</span>}
								{ocrStage === 2 && <span style={{ cursor: "pointer" }} onClick={handleOcrDownOnClick}>다운로드</span>}
								{ocrStage === 3 && <span style={{ cursor: "pointer" }} onClick={() => setIsOcrMenu(false)}>다운로드 완료</span>}
							</OcrWrapper>
						</AnimMaxHightOpacity>
						<span style={{ textDecoration: "underline", cursor: "pointer", display: 'block', width: "100%" }} onClick={() => setIsOcrMenu(!isOcrMenu)}>{String(pdfFile.name).slice(0, 10)}...</span>
					</div>}
					<Icon className='fa-solid fa-file-pdf' onClick={handlePdfOnClick} />
					<input type='file' ref={inputFileRef} onChange={(event) => setPdfFile(event.target.files[0])} accept="application/pdf" style={{ display: "none" }} />
					<Icon className='fa-solid fa-floppy-disk' onClick={handleSaveOnClick} />
					<Icon className='fa-solid fa-rotate' onClick={handleAllModeOnClick} />
					<Icon className='fa-solid fa-user-group' onClick={() => setIsMulti(true)} />
				</> : <>
					<Icon className='fa-solid fa-brain' onClick={() => hadnleMultiGptOnClick(GPT_MULTI_MODE.general)} />
					<Icon className='fa-solid fa-language' onClick={() => hadnleMultiGptOnClick(GPT_MULTI_MODE.trans)} />
					<Icon className='fa-solid fa-user' onClick={() => { setIsMulti(false); setSelectedList([]); }} />
				</>}
			</Row>
		</SubNav>
		<GridContainer>
			<GridRowWrapper>
				<Header>연번</Header>
				<Header>학번</Header>
				<Header>이름</Header>
				<Header>종류</Header>
				<Header>문구</Header>
				<Header>개별화</Header>
				<Header>AI</Header>
				<Header>바이트</Header>
			</GridRowWrapper>
			{studentList?.length === 0 && <Row style={{ gridColumn: "1/9", backgroundColor: "#78787890", borderRadius: "0 0 5px 5px" }}>
				<EmptyResult comment={"등록된 학생이 없습니다."} color={"#black"} />
			</Row>}
			{studentList?.length ? studentList.map((student, idx) => {
				const { id, studentNumber, } = student;
				const name = (student.writtenName || "미등록");
				const { mode, blankList, fillerMap, keywordList, report } = _personalInfoMap[idx] ?? {};
				const record = _recordMap[idx] ?? '';
				const isChecked = selectedList.some(item => item.idx === idx);
				return <GridRowWrapper key={id}>
					<GridItem>
						{!isMulti && (idx + 1)}
						{isMulti && <input
							type='checkbox'
							checked={isChecked}
							onChange={() => handleCheckToggle({ idx, id, record, mode, report, blankList, fillerMap, keywordList, name, studentNumber }, isChecked)}
						/>}
					</GridItem>
					<GridItem>{studentNumber}</GridItem>
					<GridItem>{name}</GridItem>
					<GridItem style={{ gap: "5px" }}>{radioList?.map((item) => {
						const { type, label, value } = item;
						const groupName = `record-${idx}`;
						const inputId = `record-${idx}-${label ?? 'basic'}`;
						return <Row key={`${idx}${value}`} style={{ gap: "5px", justifyContent: "flex-start" }}>
							<input
								id={inputId}
								type='radio'
								name={groupName}
								value={value}
								onChange={(event) => handleRecordOnChange(event.target.value, idx, isChecked)}
								disabled={isMulti}
							/>
							{type === "basic" ? "기본 문구" : label}
						</Row>
					})}
					</GridItem>
					{/* 문구 */}
					<GridItem>
						<Textarea
							value={record}
							onChange={(event) => handleRecordOnChange(event.target.value, idx)}
							disabled={isMulti}
						/>
					</GridItem>
					{/* 개별화 */}
					<GridItem>
						{mode === "report" &&
							<Textarea
								$clickable={selectedOcr ? true : false}
								value={report}
								onChange={(event) => handleReportOnChange(event.target.value, idx, "report")}
								onClick={() => { handleOcrInsertOnClick(idx) }}
								disabled={isMulti}
							/>}
						{mode === "filler" && <Column style={{ gap: "20px", alignItems: "center" }}>
							{blankList?.map((result, subIndex) =>
								<Column key={`${result}${subIndex}`} style={{ gap: "3px" }}>
									{result}
									<input
										style={{ border: "none", height: "35px", borderRadius: "3px" }}
										type="text"
										onChange={(event) => handleFillerOnChange(event.target.value, idx, subIndex)}
										disabled={isMulti}
									/>
								</Column>
							)}
							{fillerMap && <SmallBtn onClick={() => handleFillOnClick(idx)} disabled={isMulti} >변경</SmallBtn>}
						</Column>}
						{mode === "keyword" && <Column style={{ gap: "20px", alignItems: "center" }}>
							<Select
								options={acaOptList}
								onChange={(event) => handleSelectKeyword(event.value, idx, false)}
								placeholder="학업"
								isDisabled={isMulti}
							/>
							<Select
								options={careerOptList}
								onChange={(event) => handleSelectKeyword(event.value, idx, false)}
								placeholder="진로"
								isDisabled={isMulti}
							/>
							<Select
								options={coopOptList}
								onChange={(event) => handleSelectKeyword(event.value, idx, false)}
								placeholder="공동체"
								isDisabled={isMulti}
							/>
							<KeywordHolder type='text' value={keywordList} onChange={(event) => handleSelectKeyword(event.target.value, idx, true)} disabled={isMulti} />
						</Column>}
					</GridItem>
					<GridItem style={{ gap: "15px", alignItems: "center", justifyContent: "center" }}>
						{!isMulti && <>
							<i className='fa-solid fa-rotate' style={{ cursor: "pointer", color: "#3454d1", fontSize: "18px" }} onClick={() => handleModeOnClick(idx)} />
							<i className='fa-solid fa-brain' style={{ cursor: "pointer", color: "#3454d1", fontSize: "18px" }} onClick={() => handleGptOnClick(mode, idx)} />
							<i className='fa-solid fa-language' style={{ cursor: "pointer", color: "#3454d1", fontSize: "18px" }} onClick={() => handleGptOnClick("translate", idx)} />
						</>}
					</GridItem>
					<GridItem>{getByteLengthOfString(record)} byte</GridItem>
				</GridRowWrapper>
			}) : null}
		</GridContainer >
	</MainContainer >
		<ChargeRiraModal
			show={isRiraModal}
			onHide={() => setIsRiraModal(false)}
			onApprove={getHandleOnApprove}
			isMulti={isMulti}
			multiList={selectedList}
		/>
		<GptIngModal
			show={isLoading}
			onHide={() => { setIsLoading(false); }}
			status={loadingMsg}
			progress={gptProgress}
		/>
	</>
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
const Icon = styled.i`
	font-size: 23px;
	cursor: pointer;
	border-radius: 30px;
	padding: 6px;
	&:hover {
  background-color: #3454d130;;
	transition-duration: .35s;
  }
`
const OcrWrapper = styled(Column)`
	position: absolute;
	width: 100%;
	top: 40px;
	left: 0;
	background-color: white;
	padding: 10px;
	border-radius: 15px;
	align-items: center;
`
const GridContainer = styled.div`
  display: grid;
	width: 85%;
  margin: 10px auto;
	justify-content: center;
  grid-template-columns: 50px 80px 80px 160px 1fr 1fr 70px 70px;
`
// lastChild의 범위를 명확하게 하기 위함.
const GridRowWrapper = styled.div`
  display: contents;
`
const Header = styled.div`
  display: flex;
  background-color: #3454d1a1;
  color: white;
  padding: 10px;
  font-weight: bold;
  justify-content: center;
  &: first-child { border-top-left-radius: 5px;  }
  &: last-child { border-top-right-radius: 5px;  }
`
const GridItem = styled(Column)`
	min-height: 10dvh;
  padding: 10px;
  color: black;
	background-color: #dddddd90;
  border: 1px solid #78787880;
  border-radius: 5px;
  text-align: center;
  &.left-align { text-align: left; }
`
const Textarea = styled.textarea`
	width: 100%;
	min-height: 10dvh;
	height: 100%;
  padding: 5px;
  border-radius: 5px;
	background-color: ${({ $clickable }) => $clickable ? "rgba(52,84,209,0.3)" : "white"};
	cursor: ${({ $clickable }) => { return $clickable ? "pointer" : "auto" }};;
`
const KeywordHolder = styled.textarea`
	width: 100%;
	height: 50px;
	border-radius: 5px;
`
export default AllStudentByActiPage