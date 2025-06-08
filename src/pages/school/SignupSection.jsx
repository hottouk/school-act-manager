//라이브러리
import React, { useState } from 'react'
import styled from 'styled-components'
import Select from 'react-select'
//컴포넌트
import MainPanel from '../../components/MainPanel'
import TwoRadios from '../../components/Radio/TwoRadios'
import FindSchoolSelect from '../../components/FindSchoolSelect'
import SearchSection from '../../components/Bar/SearchSection'
import EmptyResult from '../../components/EmptyResult'
//애니메이션
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity'
import MainBtn from '../../components/Btn/MainBtn'
//hooks
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import useFireUserData from '../../hooks/Firebase/useFireUserData'
import useFireSchoolData from '../../hooks/Firebase/useFireSchoolData'
import useLogout from '../../hooks/useLogout'
import useFireTransaction from '../../hooks/useFireTransaction'

//생성(250218)
const SignupSection = ({ myUserData: user, findSchool, selectedSchool, setFindSchool, TitleText, ClickableText }) => {
	const [_isPublic, setIsPublic] = useState(false);
	const [_otherName, setOtherName] = useState('');
	const [_otherTel, setOtherTel] = useState('');
	const { setData } = useFireBasic("school");
	const { updateUserInfo } = useFireUserData();
	const { joinSchool, searchSchoolByField } = useFireSchoolData();
	//탈퇴
	const { deleteUserTransaction } = useFireTransaction();
	//검색
	const [_keyword, setKeyword] = useState('');
	const options = [{ label: "학교명", value: "school" }, { label: "학교 코드", value: "code" }];
	const [_searchBy, setSearchBy] = useState("school");
	const [otherShcool, setOtherSchool] = useState(null);
	//------함수부------------------------------------------------  
	//나이스 등재 학교 가입
	const handleSignUpSchool = () => {
		const confirm = window.confirm("이 학교 멤버로 가입하시겠습니까?")
		if (!confirm) return;
		if (selectedSchool?.memberList?.length > 0) {							//기존 멤버 있는 학교 가입
			const { memberList, ...rest } = selectedSchool;
			const code = selectedSchool.schoolCode;
			updateUserInfo("school", { ...rest });
			joinSchool(code, user);
		} else {													//학교에서 첫 가입자
			const { createdTime, uid, ...rest } = user
			const schoolInfo = { ...findSchool, memberList: [{ ...rest, uid }], schoolMaster: uid };
			setData(schoolInfo, findSchool.schoolCode);	//학교 신설
			updateUserInfo("school", { ...findSchool })	//내 정보 수정
		}
	}
	//미등재 학교 가입
	const handleSignUpOtherSchool = () => {
		const confirm = window.confirm("이 학교 멤버로 가입하시겠습니까?")
		if (!confirm) return;
		const { memberList, ...rest } = otherShcool;
		const code = otherShcool.schoolCode;
		updateUserInfo("school", { ...rest });
		joinSchool(code, user);
	}
	//미등재 학교 검색
	const handleSeachOnClick = async () => {
		let schoolsData;
		if (_searchBy === "school") { schoolsData = await searchSchoolByField("schoolName", _keyword); }
		else { schoolsData = await searchSchoolByField("schoolCode", _keyword); }
		setOtherSchool(schoolsData[0]);
	}
	//학교 id 생성
	const getRandomID = () => {
		return String(crypto.getRandomValues(new Uint32Array(1))[0]);
	}
	//체크
	const check = () => {
		if (_otherName === '') { return { valid: false, msg: "학교 이름을 입력하세요" } };
		if (_otherTel === '') { return { valid: false, msg: "담당자 번호을 입력하세요" } };
		return { valid: true, msg: "성공 " };
	}
	//학교 신설 폼 제출
	const onSubmit = (event) => {
		event.preventDefault();
		const result = check();
		if (!result.valid) { window.alert(result.msg); }
		else {
			const confirm = window.confirm(`${_otherName} 학교를 신설하시겠습니까?`)
			if (!confirm) return;
			const { createdTime, ...rest } = user;
			const schoolCode = getRandomID();
			const memberList = [{ ...rest }];
			const schoolInfo = { schoolName: _otherName, schoolTel: _otherTel, address: "나이스 미등재", eduOfficeName: "나이스 미등재", schoolCode };
			setData({ ...schoolInfo, memberList }, schoolCode); //학교 신설
			updateUserInfo("school", { ...schoolInfo });				//내 정보 수정	
		}
	}
	//회원 탈퇴
	const handleLeaveOnClick = () => {
		const first = window.prompt("회원 탈퇴는 모든 클래스와 학생정보가 삭제되며 절대로 복구할 수 없습니다. 진행하려면 '탈퇴합니다'를 입력해주세요");
		if (first === "탈퇴합니다") {
			const second = window.confirm("확인을 누르면 탈퇴가 진행됩니다ㅠㅠ영원한 이별은 아니겠죠?");
			if (second) {
				alert("작별이다! 다음에 더 좋은 모습으로 만나요 :D");
				deleteUserTransaction();
			} else {
				alert("잘 생각하셨어요:D 내가 더 잘할게요");
			}
		}
	}

	return (<>
		<MainPanel>
			<TitleText>1. 나이스에 등재된 학교입니까?</TitleText>
			<Wrapper><TwoRadios value={_isPublic} label={["등재 학교", "그 외 단체, 학원, 대안학교"]} onChange={() => setIsPublic(!_isPublic)} /></Wrapper>
			<Row style={{ justifyContent: "flex-end" }}><ClickableText onClick={handleLeaveOnClick}>쫑알이 회원 탈퇴</ClickableText></Row>
		</MainPanel>
		{/* 나이스 등재 */}
		<AnimMaxHightOpacity isVisible={_isPublic === true}>
			<MainPanel>
				<TitleText>2. 학교 찾기</TitleText>
				<Wrapper><FindSchoolSelect setSchool={setFindSchool} /></Wrapper>
			</MainPanel>
		</AnimMaxHightOpacity>
		<AnimMaxHightOpacity isVisible={selectedSchool !== null}>
			<MainPanel>
				<TitleText>{selectedSchool?.schoolName}</TitleText>
				<p>{selectedSchool?.eduOfficeName}</p>
				<p>{selectedSchool?.address}</p>
				<p>{selectedSchool?.schoolTel}</p>
				{selectedSchool && <p>학교 코드: {selectedSchool?.schoolCode}</p>}
				{(selectedSchool === undefined) && <TitleText>현재 학교 첫 가입이세요. 환영합니다.</TitleText>}
				<Row style={{ justifyContent: "flex-end" }}><ClickableText onClick={handleSignUpSchool}>학교 가입</ClickableText></Row>
			</MainPanel>
		</AnimMaxHightOpacity>
		{/* 나이스 미등재 */}
		<AnimMaxHightOpacity isVisible={_isPublic === false}>
			<MainPanel>
				<TitleText>2. 미등재 학교 검색</TitleText>
				<Row style={{ justifyContent: "center", gap: "20px", margin: "30px 0 10px" }}>
					{(_searchBy === "school") && <SearchSection keyword={_keyword} placeholder={"학교명 검색"} onChange={(event) => setKeyword(event.target.value)} onClick={handleSeachOnClick} />}
					{(_searchBy === "code") && <SearchSection keyword={_keyword} placeholder={"학교코드 검색"} onChange={(event) => setKeyword(event.target.value)} onClick={handleSeachOnClick} />}
					<Select options={options} onChange={(event) => setSearchBy(event.value)} />
				</Row>
			</MainPanel>
			<AnimMaxHightOpacity isVisible={otherShcool?.length !== 0}>
				{otherShcool && <MainPanel>
					<TitleText>{otherShcool?.schoolName}</TitleText>
					<p>{otherShcool?.eduOfficeName}</p>
					<p>{otherShcool?.address}</p>
					<p>{otherShcool?.schoolTel}</p>
					{otherShcool && <p>학교 코드: {otherShcool?.schoolCode}</p>}
					<Row style={{ justifyContent: "flex-end" }}><ClickableText onClick={() => { handleSignUpOtherSchool(); }}>본교 가입</ClickableText></Row>
				</MainPanel>}
			</AnimMaxHightOpacity>
			{(otherShcool === undefined) && <MainPanel>
				<TitleText>3. 검색 결과 없음!</TitleText>
				<Row style={{ marginTop: "20px", borderTop: "1px solid rgba(120, 120, 120, 0.5)", borderBottom: "1px solid rgba(120, 120, 120, 0.5)" }}>
					<EmptyResult comment={"아직 등재된 학교가 없습니다."} />
				</Row>
				{user?.isTeacher && <StyledForm onSubmit={onSubmit}>
					<Row style={{ gap: "20px", margin: "20px auto", alignItems: "center" }}><p style={{ margin: "0" }}>학교이름</p><StyledInput type="text" value={_otherName} onChange={(event) => setOtherName(event.target.value)} /></Row>
					<Row style={{ gap: "20px", margin: "0 auto", alignItems: "center" }}><p style={{ margin: "0" }}>전화번호</p><StyledInput type="text" value={_otherTel} onChange={(event) => { setOtherTel(event.target.value) }} /></Row>
					<BtnWrapper><MainBtn type="submit">제출하기</MainBtn></BtnWrapper>
				</StyledForm>}
			</MainPanel>}
		</AnimMaxHightOpacity>
	</>
	)
}

const Row = styled.div`
	display: flex;
`
const Wrapper = styled(Row)`
  margin-top: 20px;
  justify-content: center;
`
const BtnWrapper = styled(Row)`
	button { width: 150px; }
	margin-top: 30px;
	justify-content: center;
`
const StyledInput = styled.input`
	height: 35px;
	border-radius: 7px;
	border: 1px solid rgba(120, 120, 120, 0.5);
`
const StyledForm = styled.form`
	width: 80%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;	
`

export default SignupSection
