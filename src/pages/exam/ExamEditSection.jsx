//라이브러리
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
//컴포넌트
import MainWrapper from '../../components/Styled/MainWrapper'
import FormHeader from '../../components/Form/FormHeader'
import MainBtn from '../../components/Btn/MainBtn'
import DotTitle from '../../components/Title/DotTitle'
import GptRetocuhModal from '../../components/Modal/gptModal/GptRetocuhModal'
//hooks
import useFireTestData from '../../hooks/Firebase/useFireTestData'
import useDocxFile from '../../hooks/useDocxFile'
//이미지
import edit_icon from '../../image/icon/edit_icon.png'
//생성(251219)
const ExamEditSection = ({ gptAnswer, setGptAnswer, question, passage, subject, type, level, examItem, sentenceList, circleAnswer }) => {
	console.log(gptAnswer);
	const { addTestArrItem, updateTestQuestion } = useFireTestData();
	const { downloadQuestionDocx } = useDocxFile();
	const questionList = useSelector(({ exam }) => exam["questions"]); //전체 문제
	const navigate = useNavigate();
	useEffect(() => { bindTestItem(); }, [examItem]);
	useEffect(() => { gptParser(gptAnswer) }, [gptAnswer]);
	//편집 항목
	const [_title, setTitle] = useState('');
	const [_question, setQuestion] = useState('');
	const [_passage, setPassage] = useState('');
	const [_optionList, setOptionList] = useState([]);
	const [_explanation, setExplanation] = useState('');
	const [itemType, setItemType] = useState(null);
	//편집 여부
	const [isEditing, setIsEditing] = useState(false);
	const [prevInfo, setPrevInfo] = useState(null);
	const [isTitleEdit, setIsTitleEdit] = useState(false);
	const [isQuestionEdit, setIsQuestionEdit] = useState(false);
	const [isPassageEdit, setIsPassageEdit] = useState(false);
	const [isOptionsEdit, setIsOptionsEdit] = useState(false);
	const [isExplainEdit, setIsExplainEdit] = useState(false);
	//모달
	const [modalType, setModalType] = useState('');
	const [isRetouchModal, setIsRetouchModal] = useState(false);
	//------함수부------------------------------------------------
	const bindTestItem = () => {
		if (!examItem) return;
		console.log(examItem)
		const { title, question, passage, optionList, explanation, type, } = examItem;
		setTitle(title);
		setItemType(type);
		setQuestion(question);
		setPassage(passage.replace(/(\r\n|\n|\r)/g, " "));
		setOptionList(optionList.slice(0, 5));
		setExplanation(explanation);
	}
	//gpt 분석
	const gptParser = (gptAnswer) => {
		if (!gptAnswer) return '';
		const options = gptAnswer.split("<br>")[0];
		const explanations = gptAnswer.split("<br>")[1];
		const alteredPassage = gptAnswer.split("<br>")[2];
		const list = options.split("</li>").slice(0, 5);
		setQuestion(question);
		if (alteredPassage) { setPassage(alteredPassage.replace(/(\r\n|\n|\r)/g, " ")); } else { setPassage(passage); }
		setOptionList(list);
		if (type === "무관한 문장") {
			const delIdx = sentenceList.length - (4 - circleAnswer);
			const fabricated = [...sentenceList.slice(0, delIdx), options, ...sentenceList.slice(delIdx),]
				.map((item, index, arr) => {
					const circledNums = ["①", "②", "③", "④", "⑤"].reverse();
					const idx = arr.length - 1 - index;
					return `${circledNums[idx] || ''} ${item}. `
				})
				.join(' ');
			setPassage(fabricated);
		}
		if (["어법 밑줄", "어휘 밑줄"].includes(type)) { setPassage(options); setOptionList([]); };
		setExplanation(explanations);
		setItemType(type);
	}
	//문제 편집 토글
	const handleEditOnClick = (type, confirm) => {
		setIsEditing(!isEditing);
		switch (type) {
			case "title":
				confirm ? setPrevInfo(_title) : setTitle(prevInfo);
				setIsTitleEdit(prev => !prev);
				break;
			case "question":
				confirm ? setPrevInfo(_question) : setQuestion(prevInfo);
				setIsQuestionEdit(prev => !prev);
				break;
			case "passage":
				confirm ? setPrevInfo(_passage) : setPassage(prevInfo);
				setIsPassageEdit(prev => !prev);
				break;
			case "explain":
				confirm ? setPrevInfo(_explanation) : setExplanation(prevInfo);
				setIsExplainEdit(prev => !prev);
				break;
			case "options":
				confirm ? setPrevInfo(_optionList) : setOptionList(prevInfo);
				setIsOptionsEdit(prev => !prev);
				break;
			default:
				break;
		}
	}
	//원문자 뒤 첫단어 밑줄
	const renderPassageWithUnderline = (text) => {
		if (!text) return text;
		const pattern = /([①②③④⑤❶❷❸❹❺])(\s+)(\S+)/g;
		const parts = [];
		let lastIndex = 0;
		let match;
		while ((match = pattern.exec(text)) !== null) {
			const [full, circled, ws, word] = match;
			parts.push(text.slice(lastIndex, match.index));
			parts.push(
				<span key={`${match.index}-${circled}`}>
					{circled}{ws}<u>{word}</u>
				</span>
			);
			lastIndex = match.index + full.length;
		}
		parts.push(text.slice(lastIndex));
		return parts;
	}
	//문제 저장
	const handleSaveOnClick = () => {
		if (examItem) {
			const result = window.confirm("문항을 이대로 저장할까요?");
			if (!result) return;
			const changed = {
				...examItem,
				title: _title, question: _question, passage: _passage, optionList: _optionList, explanation: _explanation,
			};
			const newArr = questionList?.map(((item) => item.id === examItem?.id ? changed : item));
			updateTestQuestion("questions", newArr);
		}
		else {
			const title = prompt("문항 제목을 작성하세요");
			if (title === "" || title === null) alert("빈칸입니다.");
			else {
				const question = { subject, title, type, level, question: _question, passage: _passage, optionList: _optionList, explanation: _explanation, };
				addTestArrItem("questions", question);
			}
		}
	}
	//워드 파일 다운로드
	const handleDownloadOnClick = () => {
		downloadQuestionDocx({ question: _question, passage: _passage, explanation: _explanation, optionList: _optionList, title: _title, type: itemType });
	}
	//문항 재생성
	const handleReworkOnClick = () => {
		const result = window.confirm("AI에게 문항 재생성을 요청할까요? (저장하지 않은 기존 문항은 사라집니다.)");
		if (!result) return;
		setGptAnswer('');
	}
	//문항 삭제
	const handleDelOnClick = () => {
		const result = window.confirm("이 문항을 삭제할까요?");
		if (!result) return;
		const deleted = questionList?.filter((item) => item.id !== examItem?.id);
		updateTestQuestion("questions", deleted, navigate("/exam"));
	}
	return (<>
		<MainWrapper styles={{ width: "60%", gap: "15px", position: "relative" }}>
			<FormHeader styles={{ top: "-30px" }}>생성 문제 편집 및 저장</FormHeader>
			{examItem && <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
				{!isTitleEdit
					? <DotTitle>{_title}</DotTitle>
					: <TextInput type='text' value={_title} onChange={(event) => setTitle(event.target.value)} />}
				{(!isTitleEdit && !isEditing) && <ImgIcon src={edit_icon} alt="편집" onClick={() => handleEditOnClick("title", true)} />}
				{isTitleEdit && <IconWrapper>
					<i className="fa-solid fa-check" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("title", true)} />
					<i className="fa-solid fa-x" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("title", false)} />
				</IconWrapper>}
			</Row>}
			<Column>
				<Row style={{ justifyContent: "space-between", alignItems: "center" }}>
					{!isQuestionEdit
						? <QuestionText>{_question}</QuestionText>
						: <TextInput type='text' value={_question} onChange={(event) => { setQuestion(event.target.value) }} />}
					{(!isQuestionEdit && !isEditing) && <ImgIcon src={edit_icon} alt="편집" onClick={() => handleEditOnClick("question", true)} />}
					{isQuestionEdit && <IconWrapper>
						<i className="fa-solid fa-check" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("question", true)} />
						<i className="fa-solid fa-x" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("question", false)} />
					</IconWrapper>}
				</Row>
				{!isPassageEdit
					? <TestCol style={{ whiteSpace: "pre-line" }} >
						<QuestionWrapper>
							{itemType === "어휘 밑줄" ? renderPassageWithUnderline(_passage) : _passage}
						</QuestionWrapper>
					</TestCol>
					: <Textarea value={_passage} onChange={(event) => setPassage(event.target.value)} />}
				{(!isPassageEdit && !isEditing) && <IconWrapper>
					<ImgIcon src={edit_icon} alt="편집" onClick={() => handleEditOnClick("passage", true)} />
					<i className="fa-solid fa-brain" style={{ cursor: "pointer" }}
						onClick={() => { setIsRetouchModal(true); setModalType("passage"); }} />
				</IconWrapper>}
				{isPassageEdit && <IconWrapper>
					<i className="fa-solid fa-check" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("passage", true)} />
					<i className="fa-solid fa-x" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("passage", false)} />
				</IconWrapper>}
				{_optionList?.length > 0 && <TestCol>
					<ul style={{ marginTop: "10px" }}>
						{_optionList.map((item, index) => {
							if (!isOptionsEdit) return <li key={index}>{item}</li>
							else return <TextInput type='text' key={index} value={item}
								onChange={(event) => {
									setOptionList((prev) => {
										const copied = [...prev];
										copied[index] = event.target.value;
										return copied;
									})
								}} />
						})}
					</ul>
					{(!isOptionsEdit && !isEditing) && <IconWrapper>
						<ImgIcon src={edit_icon} alt="편집" onClick={() => handleEditOnClick("options", true)} />
						<i className="fa-solid fa-brain" style={{ cursor: "pointer" }} onClick={() => { setIsRetouchModal(true); setModalType("options"); }} />
					</IconWrapper>}
					{isOptionsEdit && <IconWrapper>
						<i className="fa-solid fa-check" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("options", true)} />
						<i className="fa-solid fa-x" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("options", false)} />
					</IconWrapper>}
				</TestCol>}
				<TestCol style={{ whiteSpace: "pre-line" }}>
					{!isExplainEdit ? _explanation : <Textarea value={_explanation} onChange={(event) => setExplanation(event.target.value)}></Textarea>}
					{(!isExplainEdit && !isEditing) && <ImgIcon src={edit_icon} alt="편집" onClick={() => handleEditOnClick("explain", true)} />}
					{isExplainEdit && <IconWrapper>
						<i className="fa-solid fa-check" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("explain", true)} />
						<i className="fa-solid fa-x" style={{ cursor: "pointer" }} onClick={() => handleEditOnClick("explain", false)} />
					</IconWrapper>}
				</TestCol>
			</Column>
			<MainBtn onClick={handleSaveOnClick}>문제 저장</MainBtn>
			<MainBtn onClick={handleDownloadOnClick}>docx 파일 다운로드</MainBtn>
			{!examItem && <MainBtn onClick={handleReworkOnClick}>AI 재생성</MainBtn>}
			{examItem && <MainBtn onClick={handleDelOnClick}>문제 삭제</MainBtn>}
		</MainWrapper >
		<GptRetocuhModal
			show={isRetouchModal}
			onHide={() => setIsRetouchModal(false)}
			size={"lg"}
			type={modalType}
			passage={_passage}
			optionList={_optionList}
			setPassage={setPassage}
			setOptionList={setOptionList}
		/>
	</>)
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const QuestionWrapper = styled.div`
	width: 480px;
	margin: 0 auto;
	padding: 10px;
	border: 1px solid gray;	
	border-radius: 5px;
`
const Textarea = styled.textarea`
	margin-top: 10px;
	min-height: 20dvh;
	white-space: pre-wrap;
	word-break: break-word;
	border-radius: 5px;
`
const QuestionText = styled.p`
	font-size: 18px;
	font-weight: 500;
	margin: 0;
`
const TextInput = styled.input`
	width: 100%;
	height: 3dvh;
	margin-top: 10px;
`
const ImgIcon = styled.img`
	width: 20px;
	cursor: pointer;
	align-self: flex-end;
`
const TestCol = styled(Column)`
	margin: 10px 0 0 0;
	padding: 5px 0 0 0;
	border-top: 1px solid #949192;
`
const IconWrapper = styled(Row)`
	margin: 3px 10px;
	gap: 10px;
	align-self: flex-end;
`
export default ExamEditSection