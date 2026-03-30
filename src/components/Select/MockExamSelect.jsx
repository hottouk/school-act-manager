import React, { useEffect } from 'react'
import styled from 'styled-components'
import Select from 'react-select';
import { monthList, thirdGradeMonthList, numbers, } from '../../data/examData.jsx'
//생성(260217)
const MockExamSelect = ({ year, setYear, grade, setGrade, month, setMonth, setNumber }) => {
	const yearList = [{ label: 2025, value: 2025 }, { label: 2026, value: 2026 }];
	const gradeList = [{ label: "고1", value: "고1" }, { label: "고2", value: "고2" }, { label: "고3", value: "고3" }];
	const numberList = numbers.map((item) => ({ label: item, value: item })) || [];
	return (
		<Section>
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
				options={grade === "고3" ? thirdGradeMonthList : monthList}
				placeholder={"월"}
			/>}
			{month && <Select
				onChange={(event) => setNumber(event.value)}
				options={numberList}
				placeholder={"문항"}
			/>}
		</Section>
	)
}
const Section = styled.section`
	display: flex;	 
	gap: 20px;
`
export default MockExamSelect
