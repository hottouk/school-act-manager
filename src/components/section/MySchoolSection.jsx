import React from 'react'
import Title from '../Title/Title'
import styled from 'styled-components'
import ClickableText from '../Styled/ClickableText'
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import { useSelector } from 'react-redux'

const MySchoolSection = ({ schoolInfo }) => {
	const user = useSelector(({ user }) => user);
	const [schoolMaster, setSchoolMaster] = React.useState(null);
	const [memberList, setMemberList] = React.useState([]);
	const { fetchDoc } = useFireBasic("school");
	//학교 정보 가져오기_(내 학교 정보)school Col
	const fetchSchoolInfo = async () => {
		// initData();
		const code = schoolInfo?.schoolCode;
		if (!code) return;
		fetchDoc(code).then((info) => {
			setSchoolMaster(info?.schoolMaster ?? null);
			setMemberList(info?.memberList ?? []);
		})
	}

	return (
		<section>
			<Title>{schoolInfo?.schoolName}</Title>
			<p>{schoolInfo?.eduOfficeName}</p>
			<p>{schoolInfo?.address}</p>
			<p>{schoolInfo?.schoolTel}</p>
			{schoolInfo && <p>학교 코드: {schoolInfo?.schoolCode}</p>}
			{/* <p>담당자: {schoolMaster?.slice(0, 4) + "******" || "없음"}</p> */}
			<Row style={{ justifyContent: "flex-end", gap: "20px" }}>
				{/* {user.uid === schoolMaster && <>
					<ClickableText onClick={() => { }}>교사 학생 변경</ClickableText>
					<ClickableText onClick={() => { }}>담당자 변경</ClickableText>
				</>} */}
				<ClickableText onClick={() => { }}>학교 탈퇴</ClickableText>
				<ClickableText onClick={() => { alert("학교 탈퇴 후에 회원 탈퇴를 진행하실 수 있습니다") }}>쫑알이 회원 탈퇴</ClickableText>
			</Row>
		</section>
	)
}
const Row = styled.div`
  display: flex;
`
export default MySchoolSection
