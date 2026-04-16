import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Select from 'react-select';
//컴포넌트
import MainContainer from '../../components/Styled/MainContainer.jsx'
import MockExamSelect from '../../components/Select/MockExamSelect.jsx';
import SubNav from '../../components/Bar/SubNav.jsx';
import MainWrapper from '../../components/Styled/MainWrapper'
import FormHeader from '../../components/Form/FormHeader.jsx'
import DotTitle from '../../components/Title/DotTitle'
import MainBtn from '../../components/Btn/MainBtn'
import GptIngModal from '../../components/Modal/gptModal/GptIngModal.jsx'
import ChargeRiraModal from '../../components/Modal/ChargeRiraModal.jsx'
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity.jsx'
//hooks
import useChatGpt from '../../hooks/useChatGpt.jsx'
import useFireBasic from '../../hooks/Firebase/useFireBasic.jsx'
//data
import { typeData } from '../../data/examData.jsx'
import { GPT_RESPONSE } from '../../constants/gpt.jsx'
import useAiExamParser from './hooks/useAiExamParser.jsx';
import useFireTestData from '../../hooks/Firebase/useFireTestData.jsx';
//생성(251222)
const ExamFormPage = () => {
	const user = useSelector(({ user }) => user);
	const { setData, fetchDoc } = useFireBasic("exam");
	//과목
	const subjectList = [{ label: "과목", value: '' }, { label: "영어", value: "eng" },];
	const [subject, setSubject] = useState(null);
	useEffect(() => setYear(null), [subject]);
	//연도
	const [year, setYear] = useState(null);
	useEffect(() => { setGrade(null); }, [year]);
	//학년
	const gradeList = [{ label: "고1", value: "고1" }, { label: "고2", value: "고2" }, { label: "고3", value: "고3" }];
	const [grade, setGrade] = useState(null);
	useEffect(() => { setMonth(null); setExam(null); }, [grade]);
	//월
	const [month, setMonth] = useState(null);
	useEffect(() => {
		const fetchExamData = async () => { //모고 불러오기
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
		if (!number || !exam) {
			initData();
		} else {
			if (gptAnswer) {
				const confirm = window.confirm("저장하지 않은 AI 생성 문항이 사라집니다. 계속하시겠습니까?");
				if (!confirm) return;
			}
			setMockPassage(exam[number]?.passage ?? '');
			setPassage(exam[number]?.original?.replace(/(\r\n|\n|\r)/g, " ") ?? exam[number]?.passage.replace(/(\r\n|\n|\r)/g, " ") ?? '');
			setMockQuestion(exam[number]?.question ?? '');
			setMockOptionList(exam[number]?.optionList ?? []);
			setMasterQuestion(() => {
				if (number === 18) { return typeData["글의 목적"]; }
				else if (number === 20) { return typeData["필자의 주장"]; }
				else if (number === 22) { return typeData["글의 요지"]; }
				else if (number === 23) { return typeData["글의 주제"]; }
				else if (number === 24) { return typeData["글의 제목"]; }
				else if (number === 29) { return "다음 글의 밑줄 친 부분 중, 어법상 틀린 것은?"; }
				else if (number === 30) { return typeData["어휘 밑줄"]; }
				else if (number === 31 || number === 32 || number === 33 || number === 34) { return typeData["빈칸 추론"]; }
				else if (number === 35) { return typeData["무관한 문장"]; }
				else if (number === 36 || number === 37) { return typeData["글의 순서"] }
				else if (number === 38 || number === 39) { return "글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 적절한 곳은?" }
				else if (number === 40) { return typeData["요약"] }
				else if (number === 41) { return "윗 글의 제목으로 가장 적절한 것은?" }
				else if (number === 42) { return "밑줄 친 (a)~(e) 중에서 문맥상 낱말의 쓰임이 적절하지 않은것은?" }
				else if (number === 43) { return "주어진 글 (A)에 이어질 내용을 순서에 맞게 배열한 것으로 가장 적절한 것은?" }
				else if (number === 44) { return "밑줄 친 (a)~(e) 중에서 가리키는 대상이 나머지 넷과 다른것은?" }
				else if (number === 45) { return "윗글에 관한 내용으로 적절하지 않은 것은?" }
				else return "";
			})
			setOptions(() => {
				if (number === 36 || number === 37) { return "① (A) - (C) - (B)/② (B) - (A) - (C)/③ (B) - (C) - (A)/④ (C) - (A) - (B)/⑤ (C) - (B) - (A)" }
				if (number === 42 || number === 44) { return "① (a)/② (b)/③ (c)/④ (d)/⑤ (e)" }
				if (number === 43) { return "① (B) - (D) - (C)/② (C) - (B) - (D)/③ (C) - (D) - (B)/④ (D) - (B) - (C)/⑤ (D) - (C) - (B)" }
			})
		}
	}, [number]);
	//기출
	const [mockQuestion, setMockQuestion] = useState('');
	const [mockPassage, setMockPassage] = useState('');
	const [mockOptionList, setMockOptionList] = useState([]);
	//문항 제작
	const [type, setType] = useState(null);
	const circleNumber = ["①", "②", "③", "④", "⑤"];
	useEffect(() => {
		setQuestion(typeData[type] ?? '');
	}, [type]);
	const [level, setLevel] = useState(null);
	const typeOptList = Object.entries(typeData).map((item) => ({ label: item[0], value: item[1] }));
	const [question, setQuestion] = useState('');
	const [passage, setPassage] = useState('');
	const [optionList, setOptionList] = useState([]);
	const [explanation, setExplanation] = useState('');
	const handleOptionOnChange = (event, idx) => {
		const newList = [...optionList];
		newList[idx] = event.target.value;
		setOptionList(newList);
	}
	//특수 문형
	const [target, setTarget] = useState(''); //감정, 함축의미
	const [nonRelatedAnswer, setNonRelatedAnswer] = useState(null); //무관한 문장 정답
	//AI 생성
	const { makeExamQuestion, gptAnswer, gptRes, gptStatus, } = useChatGpt();
	const { gptParser } = useAiExamParser({ setPassage, setOptionList, setExplanation });
	useEffect(() => {
		if (!gptAnswer) return;
		gptParser(gptAnswer, type, passage, nonRelatedAnswer);
		return () => {
			setPassage('');
			setOptionList([]);
			setExplanation('');
		}
	}, [gptAnswer, gptParser]);
	//관리자(Master)
	const [m_options, setOptions] = useState('');
	const [m_question, setMasterQuestion] = useState('');
	const [m_passage, setMasterPassage] = useState('');
	const [m_explanation, setMasterExplanation] = useState('');
	const [isOriginal, setIsOriginal] = useState(false);
	//과금 모달
	const [isChargeModal, setIsChargeModal] = useState(false);
	//초기화
	const initData = () => {
		setMockPassage('');
		setPassage('');
		setMockQuestion('');
		setMockOptionList([]);
	}
	//유효성 검사
	const check = () => {
		let err = null;
		if (question === '') err = "문항 유형을 선택하세요.";
		if (passage === '') err = "지문을 넣어 주세요."
		if (!level) err = "수준을 선택하세요."
		if (["심경, 분위기", "함축 의미", "빈칸 추론"].includes(type)) {
			if (target === '') err = `${type}(을)를 묻는 대상을 입력해주세요.`
		}
		return err;
	}
	//문제 생성
	const handleCreateOnClick = () => {
		const err = check();
		if (err) {
			alert(err);
			return;
		}
		if (type === "심경, 분위기") setQuestion(`다음 글에 드러난 ${target}의 심경 변화로 가장 적절한 것은?`);
		if (type === "함축 의미") setQuestion(`밑줄 친 ${target}이 다음 글에서 의미하는 바로 가장 적절한 것은?`);
		setIsChargeModal(true);
	};
	//문제 저장
	const { addTestArrItem } = useFireTestData();
	const handleSaveOnClick = () => {
		const title = prompt("문항 제목을 작성하세요");
		if (title === "" || title === null) alert("빈칸입니다.");
		else {
			const examItem = { subject, title, type, level, question, passage, optionList, explanation, };
			addTestArrItem("questions", examItem);
		}
	}
	//지문 서버 업로드(마스터)
	const handleMasterOnClick = () => {
		const confirm = window.confirm(`${subject}${number}: ${m_question}${m_options}${m_passage},`);
		if (!confirm || !number) return;
		const optionList = m_options?.split("/", 5) || [''];
		const question = isOriginal
			? { original: m_passage }
			: { question: m_question, optionList, passage: m_passage };
		const data = { [number]: question };
		setData(data, `${year}${grade}${month}${subject}`);
	};
	return (<>
		<MainContainer styles={{ gap: "50px" }}>
			<SubNav />
			{/* 기출 */}
			<MainWrapper styles={{ width: "60%", gap: "10px", position: "relative" }}>
				<FormHeader styles={{ top: "-30px" }}>지문 선택</FormHeader>
				<Row>
					<DotTitle>과목</DotTitle>
					<Select
						onChange={(event) => setSubject(event.value)}
						options={subjectList}
						placeholder={"과목"}
					/>
				</Row>
				<AnimMaxHightOpacity isVisible={subject}>
					<Row>
						<DotTitle>기출 모의고사</DotTitle>
						<MockExamSelect year={year}
							setYear={setYear}
							grade={grade}
							setGrade={setGrade}
							month={month}
							setMonth={setMonth}
							setNumber={setNumber} />
					</Row>
				</AnimMaxHightOpacity>
				{(!number && passage) && <h5>사용자가 입력한 자체 지문입니다.</h5>}
				<AnimMaxHightOpacity isVisible={number}>
					<h5>[지문]: {year}학년도 {grade} {month} 모의고사 {number}번</h5>
					<QuestionWrapper>
						<QuestionText>{number}. {mockQuestion}</QuestionText>
						<PassageWrapper>{mockPassage}</PassageWrapper>
						{<ul style={{ margin: "10px 0 0 0" }}>
							{mockOptionList?.map((item, index) => <li key={index}>{item}</li>)}
						</ul>}
					</QuestionWrapper>
				</AnimMaxHightOpacity>
			</MainWrapper>
			{/* 제작대 */}
			<Column>
				<AnimMaxHightOpacity isVisible={subject} styles={{ width: "60%", alignSelf: "center" }}>
					<MainWrapper styles={{ width: "100%", gap: "10px", position: "relative" }}>
						<FormHeader styles={{ top: "-30px" }}>문항 제작대</FormHeader>
						{passage !== '' && <Row style={{ justifyContent: "space-between" }}>
							<Column style={{ gap: "10px" }}>
								<Row style={{ justifyContent: "space-between" }}>
									<Row>
										<DotTitle>제작 문항 유형</DotTitle>
										<Select
											onChange={(event) => setType(event.label)}
											options={typeOptList}
											placeholder={"유형 선택"} />
									</Row>
								</Row>
								<Row>
									<DotTitle>제작 문항 수준</DotTitle>
									<Select
										onChange={(event) => setLevel(event.value)}
										options={gradeList}
										placeholder={"수준 선택"} />
								</Row>
							</Column>
							<AiBtn onClick={handleCreateOnClick} disabled={["글의 순서"].includes(type) || !level}>
								<i className="fa-solid fa-brain" />
							</AiBtn>
						</Row>}
						{["심경, 분위기", "함축 의미", "빈칸 추론"].includes(type) && <Row>
							<DotTitle>대상</DotTitle>
							<TextInput style={{ width: "30%" }}
								value={target}
								placeholder={type === "심경, 분위기" ? "심경이나 분위기의 변화를 일으키는 요소(ex. 상황, 사건, 대상 등)" : "빈칸 또는 밑줄 칠 부분"}
								onChange={(event) => setTarget(event.target.value)} />
						</Row>}
						{["무관한 문장"].includes(type) && <Column>
							<DotTitle>[선택] 정답을 몇번으로 지정할까요?</DotTitle>
							<Row style={{ gap: "20px" }}>
								{circleNumber.map((item, index) =>
									<Row key={item} style={{ gap: "3px" }}><input type='radio' name='answer' value={index}
										onClick={() => setNonRelatedAnswer(index)} />{item}</Row>)}
							</Row>
						</Column>}
						<DotTitle>문항</DotTitle>
						<TextInput
							value={question}
							placeholder={"발문"}
							onChange={(event) => setQuestion(event.target.value)} />
						<Textarea
							value={passage}
							placeholder={"문항을 만들 지문을 선택 또는 작성하세요"}
							onChange={(event) => setPassage(event.target.value.replace(/(\r\n|\n|\r)/g, " "))}
						/>
						{circleNumber.map((item, idx) =>
							<Row key={item} style={{ gap: "5px", }}>
								<TextInput key={item}
									value={optionList[idx] ?? ''}
									placeholder={`${item}번 선택지`}
									onChange={(event) => handleOptionOnChange(event, idx)}
									disabled={["무관한 문장", "글의 순서", "어휘 밑줄"].includes(type)}
								/>
							</Row>
						)}
						<DotTitle>해설</DotTitle>
						<Textarea
							value={explanation}
							onChange={(event) => setExplanation(event.target.value)}
							placeholder={"문제의 해설을 입력해주세요. (선택)"}
						/>
						{gptRes !== "loading" && <Column style={{ gap: "10px" }}>
							<MainBtn onClick={handleSaveOnClick}>문항 저장</MainBtn>
						</Column>}
					</MainWrapper>
				</AnimMaxHightOpacity>
			</Column>

			{/* 관리자 */}
			{user.isMaster && <MainWrapper styles={{ width: "60%", margin: "20px 0 0 0", gap: "5px", position: "relative" }}>
				<FormHeader>관리자</FormHeader>
				<TextInput
					type='text'
					value={m_question}
					onChange={(event) => setMasterQuestion(event.target.value)}
					placeholder={"발문"} />
				<Row>
					<DotTitle>원문 체크</DotTitle>
					<input type='checkbox' onClick={() => setIsOriginal(!isOriginal)} />
				</Row>
				<Textarea
					value={m_passage}
					onChange={(event) => setMasterPassage(event.target.value)}
					placeholder={"지문"}
				/>
				<Textarea
					value={m_options}
					onChange={(event) => setOptions(event.target.value)}
					placeholder={"선택지 구분자'/'"}
				/>
				<Textarea
					value={m_explanation}
					onChange={(event) => setMasterExplanation(event.target.value)}
					placeholder={"정답 해설"}
				/>
				<MainBtn styles={{ margin: "15px 0 0 0" }} onClick={handleMasterOnClick}>서버 업로드</MainBtn>
			</MainWrapper>}
		</MainContainer>
		<ChargeRiraModal
			show={isChargeModal}
			onHide={() => setIsChargeModal(false)}
			onApprove={(payload) =>
				makeExamQuestion({ type, question, passage, level, target, ...payload })}
		/>
		<GptIngModal
			show={gptRes === GPT_RESPONSE.LOADING}
			status={gptStatus}
		/>
	</>
	)
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
const AiBtn = styled.button`
  background-color: ${({ $disabled }) => !$disabled ? "#3454d1a1" : "#949192"};
	width: 86px;
	height: 86px;
	color: white;
	font-size: 30px;
	border-radius: 10px;
	border: none;
	padding: 10px;
	&:hover {
  background-color: ${({ $disabled }) => !$disabled ? "#3454d1;" : "#949192"};
  transform: translateY(2px);
  transition-duration: .35s;
  }
	&:disabled {
		cursor: not-allowed;
		background-color: #949192;
	}	
`
const QuestionText = styled.p`
	font-size: 18px;
	font-weight: 500;
	margin: 0;
`
const Textarea = styled.textarea`
	margin-top: 5px;
	height: 17dvh;
	white-space: pre-wrap;
	word-break: break-word;
	border-radius: 5px;
`
const QuestionWrapper = styled.div`
	width: 500px;
	margin: 0 auto;
	padding: 10px;
	border: 1px solid gray;	
	border-radius: 5px;
`
const PassageWrapper = styled.div`
	white-space: pre-wrap;
`
const TextInput = styled.input`
	width: 100%;
	height: 3dvh;
	border-radius: 3px;
	padding: 5px;
	&: disabled {
		background-color: #e0e0e0;
	}
`
export default ExamFormPage