import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import MainWrapper from '../../components/Styled/MainWrapper'
import DotTitle from '../../components/Title/DotTitle'
import MainBtn from '../../components/Btn/MainBtn'
import Select from 'react-select';
import { numbers, typeData } from '../../data/examData.jsx'
import useChatGpt from '../../hooks/useChatGpt.jsx'
import parse from 'html-react-parser';
import { Spinner } from 'react-bootstrap'
import useFireBasic from '../../hooks/Firebase/useFireBasic.jsx'

const ExamFormPage = () => {
	const { setData, fetchDoc } = useFireBasic("exam");
	//연도
	const yearList = [{ label: 2025, value: 2025 }];
	const [year, setYear] = useState(null);
	useEffect(() => { setGrade(null); }, [year])
	//학년
	const gradeList = [{ label: "고1", value: "고1" }, { label: "고2", value: "고2" }, { label: "고3", value: "고3" }];
	const [grade, setGrade] = useState(null);
	useEffect(() => { setMonth(null); setExam(null); }, [grade]);
	//월
	const monthList = [{ label: "10월", value: "10월" }];
	const [month, setMonth] = useState(null);
	useEffect(() => { fetchExamData(); }, [month]);
	const [exam, setExam] = useState(null);
	//문항
	const numberList = numbers.map((item) => ({ label: item, value: item })) || [];
	const [number, setNumber] = useState(null);
	useEffect(() => {
		if (!number || !exam) return;
		setPassage(exam[number]);
	}, [number]);
	const [passage, setPassage] = useState('');
	//유형
	const typeOptList = Object.entries(typeData).map((item) => ({ label: item[0], value: item[1] }));
	const [type, setType] = useState(null);
	const [question, setQuestion] = useState(null);
	//수준
	const [level, setLevel] = useState(null);
	const { makeExamQuestion, gptAnswer, gptRes } = useChatGpt();

	const handleTypeOnChange = (event) => {
		setType(event.label);
		setQuestion(event.value);
	}
	//모고 불러오기
	const fetchExamData = async () => {
		const docId = `${year}${grade}${month}`;
		const examInfo = await fetchDoc(docId);
		console.log(examInfo)
		setExam(examInfo);
	}
	const check = () => {
		let err = null;
		if (!type) err = "문항 유형을 설정해주세요.";
		if (passage === '') err = "지문을 넣어 주세요."
		return err;
	}
	//문제 생성
	const handleMakeOnClick = () => {
		const err = check();
		if (err) {
			alert(err);
			return;
		}
		makeExamQuestion(type, question, passage);
	}
	//지문 서버 업로드(마스터)
	const handleMasterOnClick = () => {
		const data = { [number]: passage };
		console.log(data);
		setData(data, `${year}${grade}${month}`);
	}
	return (
		<Container>
			<MainWrapper styles={{ width: "60%" }}>
				<Column style={{ gap: "10px" }}>
					<Row style={{ justifyContent: "space-between" }}>
						<DotTitle>모의고사</DotTitle>
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
					<Row style={{ justifyContent: "space-between" }}>
						<DotTitle>문항 유형</DotTitle>
						<Select
							onChange={(event) => handleTypeOnChange(event)}
							options={typeOptList}
							placeholder={"유형 선택"}
						/>
					</Row>
					<Row style={{ justifyContent: "space-between" }}>
						<DotTitle>문항 수준</DotTitle>
						<Select
							onChange={(event) => setLevel(event.value)}
							options={gradeList}
							placeholder={"수준 선택"}
						/>
					</Row>
				</Column>
				{question && <h5 style={{ margin: "10px 0" }}>[발문] {question}</h5>}
				{(year && grade && month && number) && <h5>[지문]: {year}학년도 {grade} {month} 모의고사 {number}번</h5>}
				<Textarea
					value={passage}
					placeholder={"문항을 만들 지문을 선택 또는 작성하세요"}
					onChange={(event) => setPassage(event.target.value)}
				/>
				<Row style={{ justifyContent: "center", margin: "10px 0" }}>
					{gptRes === "loading" && <Spinner />}</Row>
				{gptAnswer !== '' && <TestWrapper>{parse(gptAnswer)}</TestWrapper>}
				<Column>
					<MainBtn
						onClick={handleMakeOnClick}
						disabled={gptRes === "loading"}
					>AI 문제 생성</MainBtn>
					<MainBtn styles={{ margin: "15px 0 0 0" }}>문항 저장</MainBtn>
					<MainBtn styles={{ margin: "15px 0 0 0" }} onClick={handleMasterOnClick}>서버 업로드</MainBtn>
				</Column>
			</MainWrapper>
		</Container>
	)
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
const Container = styled(Column)`
	box-sizing: border-size;
	min-height: 100dvh;
  background-color: #efefef;
	align-items: center;
`
const Textarea = styled.textarea`
	margin-top: 10px;
	min-height: 20dvh;
	white-space: pre-wrap;
	word-break: break-word;
	border-radius: 5px;
`
const TestWrapper = styled.div`
	border: 1px solid #949192;
	border-radius: 10px;
	margin: 10px 0;
	padding: 10px;

`
export default ExamFormPage