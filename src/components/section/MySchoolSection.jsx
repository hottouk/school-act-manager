import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
//Components
import DotTitle from '../Title/DotTitle'
import Title from '../Title/Title'
import ClickableText from '../Styled/ClickableText'
//생성(260207)
const MySchoolSection = ({ mySchooInfo, leaveSchoolTx, isFromInfoPage }) => {
	const navigate = useNavigate();
	//학교 탈퇴
	const handleLeaveOnClick = async () => {
		const msg = window.prompt("현재 학교로 개설된 모든 클래스와 학생정보가 삭제되며 복구할 수 없습니다. 진행하려면 '탈퇴합니다'를 입력해주세요");
		if (msg !== "탈퇴합니다") { alert("문구가 제대로 입력되지 않았습니다."); return; }
		try {
			await leaveSchoolTx(mySchooInfo.schoolCode);
			alert("학교를 탈퇴했습니다.");
		} catch (error) {
			alert("학교를 탈퇴 중 오류가 발생했습니다.");
		}
	};
	return (
		<section>
			<Column style={{ gap: "15px" }}>
				<Title>{mySchooInfo?.schoolName || "학교 정보 없음"}</Title>
				<Row>
					<DotTitle>교육 지원청</DotTitle>
					<span>{mySchooInfo?.eduOfficeName || "없음"}</span>
				</Row>
				<Row>
					<DotTitle>학교 주소</DotTitle>
					<span>{mySchooInfo?.address || "없음"}</span>
				</Row>
				<Row>
					<DotTitle>학교 전화</DotTitle>
					<span>{mySchooInfo?.schoolTel || "없음"}</span>
				</Row>
				<Row>
					<DotTitle>학교 코드</DotTitle>
					<span>{mySchooInfo?.schoolCode || "없음"}</span>
				</Row>
				<Row>
					<DotTitle>담당자</DotTitle>
					<span>{mySchooInfo?.schoolMaster || "없음"}</span>
				</Row>
				<Row style={{ justifyContent: "flex-end", gap: "20px" }}>
					{(!mySchooInfo && isFromInfoPage) && <ClickableText onClick={() => navigate("school")}>학교 등록</ClickableText>}
					{(mySchooInfo && isFromInfoPage) && <ClickableText onClick={handleLeaveOnClick}>학교 탈퇴</ClickableText>}
				</Row>
			</Column>
		</section>
	)
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
export default MySchoolSection
