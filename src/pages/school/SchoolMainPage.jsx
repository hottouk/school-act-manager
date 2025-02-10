import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import useFireSchoolData from '../../hooks/Firebase/useFireSchoolData'

const SchoolMainPage = () => {
	const user = useSelector(({ user }) => user);
	const { school } = user;
	useEffect(() => { fetchSchoolInfo() }, [])
	const [schoolInfo, setSchoolInfo] = useState(null);
	useEffect(() => { sortMember(); }, [schoolInfo])
	const { fetchSchoolByCode } = useFireSchoolData();
	const [teacherList, setTeacherList] = useState([]);
	const [studentList, setStudentList] = useState([]);

	//학교 정보 가져오기
	const fetchSchoolInfo = async () => {
		if (!school.schoolCode) return;
		const schoolData = await fetchSchoolByCode(school.schoolCode)
		setSchoolInfo(schoolData)
	}

	//교사, 학생 분리
	const sortMember = () => {
		const teachers = []
		const students = []
		if (!schoolInfo) return;
		const memberList = schoolInfo.memberList
		if (!memberList) return;
		memberList.forEach(item => {
			if (item.isTeacher === true) { teachers.push(item) }
			else { students.push(item) }
			setTeacherList(teachers)
			setStudentList(students)
		});
	}

	return (
		<Container>
			<StyledMain>
				<TitleText>{schoolInfo?.schoolName}</TitleText>
				<p>{schoolInfo?.eduOfficeName}</p>
				<p>{schoolInfo?.schoolTel}</p>
				<p>추후 활용 예정입니다.</p>
			</StyledMain>
			<StyledMain>
				<TitleText>등록 교사 명단</TitleText>
				{teacherList.map((item) => {
					return item.name
				})}
			</StyledMain>

		</Container>
	)
}

const Container = styled.div`
	box-sizing: border-box;
`
const StyledMain = styled.main`
	width: 80%;
  margin: 25px auto;
  padding: 15px;
  border-left: 12px #3454d1 double;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
`
const TitleText = styled.h5`
  display: flex;
  justify-content: center;
  color: #3a3a3a;
  font-weight: bold;
  margin: 10px auto;
`

export default SchoolMainPage
