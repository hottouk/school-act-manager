import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Select from 'react-select';
//컴포넌트
import ExamEditSection from './ExamEditSection.jsx'
import MainContainer from '../../components/Styled/MainContainer.jsx'
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
import { monthList, numbers, typeData } from '../../data/examData.jsx'
import { GPT_RESPONSE } from '../../constants/gpt.jsx'
//생성(251222)
const ExamFormPage = () => {
	const user = useSelector(({ user }) => user);
	const { setData, fetchDoc } = useFireBasic("exam");
	//과목
	const subjectList = [{ label: "영어", value: "eng" }, { label: "국어", value: "kor" }];
	const [subject, setSubject] = useState(null);
	useEffect(() => { setYear(null); }, [subject]);
	//연도
	const yearList = [{ label: 2025, value: 2025 }];
	const [year, setYear] = useState(null);
	useEffect(() => { setGrade(null); }, [year]);
	//학년
	const gradeList = [{ label: "고1", value: "고1" }, { label: "고2", value: "고2" }, { label: "고3", value: "고3" }];
	const [grade, setGrade] = useState(null);
	useEffect(() => { setMonth(null); setExam(null); }, [grade]);
	//월
	const [month, setMonth] = useState(null);
	useEffect(() => { fetchExamData(); }, [month]);
	//기출 문항
	const [exam, setExam] = useState(null);
	const numberList = numbers.map((item) => ({ label: item, value: item })) || [];
	const [number, setNumber] = useState(null);
	useEffect(() => {
		if (!number || !exam) {
			initData();
		} else {
			setMockPassage(exam[number]?.passage ?? '');
			setPassage(exam[number]?.original?.replace(/(\r\n|\n|\r)/g, " ") ?? exam[number]?.passage.replace(/(\r\n|\n|\r)/g, " ") ?? '');
			setMockQuestion(exam[number]?.question ?? '');
			setMockOptionList(exam[number]?.optionList ?? []);
		}
	}, [number]);
	//기출
	const [mockQuestion, setMockQuestion] = useState('');
	const [mockPassage, setMockPassage] = useState('');
	const [mockOptionList, setMockOptionList] = useState([]);
	//제작
	const [type, setType] = useState(null);
	useEffect(() => {
		const list = passage.split(". ").filter((item) => item !== '');
		setSentenceList(list);
	}, [type]);
	const [level, setLevel] = useState(null);
	const typeOptList = Object.entries(typeData).map((item) => ({ label: item[0], value: item[1] }));
	const [question, setQuestion] = useState('');
	const [passage, setPassage] = useState('');
	const { makeExamQuestion, gptAnswer, setGptAnswer, gptRes, gptStatus, gptProgress } = useChatGpt();
	//특수 문형
	const [target, setTarget] = useState(''); //감정, 함축의미
	const circleNumber = ["①", "②", "③", "④", "⑤"];
	const [sentenceList, setSentenceList] = useState([]); //무관한 문장
	const [circleAnswer, setCircleAnswer] = useState(null);
	//관리자(Master)
	const [m_options, setOptions] = useState('');
	const [m_question, setMasterQuestion] = useState('');
	const [m_passage, setMasterPassage] = useState('');
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
	//유효성 검사
	const check = () => {
		let err = null;
		if (question === '') err = "문항 유형을 선택하세요.";
		if (passage === '') err = "지문을 넣어 주세요."
		if (!level) err = "수준을 선택하세요."
		if (["심경, 분위기", "함축 의미"].includes(type)) {
			console.log(type)
			if (target === '') err = `${type}를 묻는 대상을 입력해주세요.`
		}
		return err;
	}
	//문제 생성
	const handleMakeOnClick = () => {
		const err = check();
		if (err) {
			alert(err);
			return;
		}
		if (type === "심경, 분위기") setQuestion(`다음 글에 드러난 ${target}의 심경 변화로 가장 적절한 것은?`);
		if (type === "함축 의미") setQuestion(`밑줄 친 ${target}이 다음 글에서 의미하는 바로 가장 적절한 것은?`);
		setIsChargeModal(true);
	}
	//지문 서버 업로드(마스터)
	const handleMasterOnClick = () => {
		const confirm = window.confirm(`${subject}${number}: ${m_question}${m_options}${m_passage},`);
		if (!confirm || !number) return;
		const optionList = m_options.split("/", 5);
		const question = isOriginal
			? { original: m_passage }
			: { question: m_question, optionList, passage: m_passage };
		const data = { [number]: question };
		setData(data, `${year}${grade}${month}${subject}`);
	}
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
						placeholder={"연도"}
					/>
				</Row>
				<AnimMaxHightOpacity isVisible={subject}>
					<Row>
						<DotTitle>기출 모의고사</DotTitle>
						<Row style={{ gap: "20px" }}>
							<Select
								onChange={(event) => setYear(event.value)}
								options={yearList}
								placeholder={"연도"}
							/>
							{year && <Select
								onChange={(event) => setGrade(event.value)}
								options={gradeList}
								placeholder={"학년"}
							/>}
							{grade && <Select
								onChange={(event) => setMonth(event.value)}
								options={monthList}
								placeholder={"월"}
							/>}
							{month && <Select
								onChange={(event) => setNumber(event.value)}
								options={numberList}
								placeholder={"문항"}
							/>}
						</Row>
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
				<AnimMaxHightOpacity isVisible={subject && !gptAnswer} styles={{ width: "60%", alignSelf: "center" }}>
					<MainWrapper styles={{ width: "100%", gap: "10px", position: "relative" }}>
						<FormHeader styles={{ top: "-30px" }}>지문 선택</FormHeader>
						{passage !== '' && <Row style={{ justifyContent: "space-between" }}>
							<Row>
								<DotTitle>제작 문항 유형</DotTitle>
								<Select
									onChange={(event) => {
										setType(event.label)
										setQuestion(typeData[event.label])
									}}
									options={typeOptList}
									placeholder={"유형 선택"} />
							</Row>
							{type && <h5 style={{ margin: "10px 0" }}>[발문] {typeData[type]}</h5>}
						</Row>}
						{passage !== '' && <Row>
							<DotTitle>제작 문항 수준</DotTitle>
							<Select
								onChange={(event) => setLevel(event.value)}
								options={gradeList}
								placeholder={"수준 선택"} />
						</Row>}
						{["심경, 분위기", "함축 의미"].includes(type) && <Row>
							<DotTitle>대상</DotTitle>
							<TextInput style={{ width: "30%" }} value={target} onChange={(event) => setTarget(event.target.value)} />
						</Row>}
						{["무관한 문장"].includes(type) && <Column>
							<DotTitle>[선택] 정답을 몇번으로 지정할까요?</DotTitle>
							<Row style={{ gap: "20px" }}>
								{circleNumber.map((item, index) =>
									<Row key={item} style={{ gap: "3px" }}><input type='radio' name='answer' value={index} onClick={() => setCircleAnswer(index)} />{item}</Row>)}
							</Row>
						</Column>}
						<Textarea
							value={passage}
							placeholder={"문항을 만들 지문을 선택 또는 작성하세요"}
							onChange={(event) => setPassage(event.target.value.replace(/(\r\n|\n|\r)/g, " "))}
						/>
						{gptRes !== "loading" && <Column>
							<MainBtn onClick={handleMakeOnClick}>AI 문제 생성</MainBtn>
						</Column>}
					</MainWrapper>
				</AnimMaxHightOpacity>
				{/* 결과물 */}
				{gptAnswer &&
					<ExamEditSection gptAnswer={gptAnswer} setGptAnswer={setGptAnswer}
						question={question} passage={passage} subject={subject} type={type} level={level}
						sentenceList={sentenceList} circleAnswer={circleAnswer} />}
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
				<MainBtn styles={{ margin: "15px 0 0 0" }} onClick={handleMasterOnClick}>서버 업로드</MainBtn>
			</MainWrapper>}
		</MainContainer>
		<ChargeRiraModal
			show={isChargeModal}
			onHide={() => setIsChargeModal(false)}
			onApprove={({ model, leftRira }) => makeExamQuestion(type, question, passage, level, target, model, leftRira)}
		/>
		<GptIngModal
			show={gptRes === GPT_RESPONSE.LOADING}
			status={gptStatus}
			progress={gptProgress}
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
const QuestionText = styled.p`
	font-size: 18px;
	font-weight: 500;
	margin: 0;
`
const Textarea = styled.textarea`
	margin-top: 10px;
	min-height: 20dvh;
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
	margin-top: 10px;
`
export default ExamFormPage