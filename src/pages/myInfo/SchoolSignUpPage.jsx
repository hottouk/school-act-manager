//라이브러리
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
//section
import MySchoolSection from '../../components/section/MySchoolSection'
import SearchSection from '../../components/Bar/SearchSection'
//컴포넌트
import MainContainer from '../../components/Styled/MainContainer'
import MainWrapper from '../../components/Styled/MainWrapper'
import Title from '../../components/Title/Title'
import DotTitle from '../../components/Title/DotTitle'
import TwoRadios from '../../components/Radio/TwoRadios'
import FindSchoolSelect from '../../components/FindSchoolSelect'
import EmptyResult from '../../components/EmptyResult'
import MainBtn from '../../components/Btn/MainBtn'
//애니메이션
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity'
//hooks
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import useFireUserData from '../../hooks/Firebase/useFireUserData'
import useFireSchoolData from '../../hooks/Firebase/useFireSchoolData'
//utils
import { getRandomStringId } from '../../utils/CryptoUtils'
//생성(250218)->수정(260210)
const SchoolSignUpPage = () => {
	const { userRtData, userDataListener, } = useFireUserData();
	const navigate = useNavigate();
	const { fetchSchoolByCode, joinSchool, searchSchoolByField } = useFireSchoolData();
	const { setData } = useFireBasic("school");
	const { updateUserInfo } = useFireUserData();
	//나이스 등재
	const [isPublic, setIsPublic] = useState(true);
	//학교 선택
	const [selectedSchool, setSelectedSchool] = useState(null);
	const [schoolInfo, setSchoolInfo] = useState(null);
	//미등재 학교 정보
	const [otherSchool, setOtherSchool] = useState(null);
	//검색
	const [keyword, setKeyword] = useState('');
	const options = [{ label: "학교명", value: "school" }, { label: "학교 코드", value: "code" }];
	const [searchBy, setSearchBy] = useState("school");
	//신설 학교
	const [otherName, setOtherName] = useState('');
	const [otherTel, setOtherTel] = useState('');
	//**useEffect**
	useEffect(() => userDataListener(), []);
	//학교 정보 있을 시 이동
	useEffect(() => {
		if (!userRtData) return;
		if (userRtData.school) navigate("/myinfo");
	}, [userRtData]);
	// 나이스 등재 학교 선택 시 상세 정보 조회
	useEffect(() => {
		const fetchSchoolData = async () => {
			const code = selectedSchool?.schoolCode ?? null;
			if (!code) return;
			const schoolInfo = await fetchSchoolByCode(code);
			setSchoolInfo(schoolInfo);
		};
		fetchSchoolData();
	}, [selectedSchool]);
	//탭 전환 상태 초기화
	useEffect(() => {
		setSelectedSchool(null);
		setSchoolInfo(null);
		setOtherSchool(null);
		setKeyword('');
	}, [isPublic]);
	//**함수부**
	//나이스 등재 학교 가입
	const handleSignUpSchool = async () => {
		const confirm = window.confirm("이 학교 멤버로 가입하시겠습니까?");
		if (!confirm) return;
		if (schoolInfo?.memberList?.length > 0) {	//교내 멤버 존재
			const { memberList, ...rest } = schoolInfo;
			const code = schoolInfo.schoolCode;
			try {
				await updateUserInfo({ "school": { ...rest } });
				await joinSchool(code, userRtData);
				alert("성공적으로 가입 되었습니다.");
			} catch (error) {
				alert("회원 가입 중 에러가 발생했습니다.", error);
			}
		} else {																  									//첫 가입자
			const { naem, uid, isTeacher, phoneNumber } = userRtData;
			const schoolInfo = { ...selectedSchool, memberList: [{ uid, isTeacher, naem, phoneNumber }], schoolMaster: uid };
			try {
				await setData(schoolInfo, selectedSchool.schoolCode);	//학교 신설
				await updateUserInfo({ "school": selectedSchool });	  //내 정보 수정
				alert("성공적으로 가입 되었습니다.");
			} catch (error) {
				alert("회원 가입 중 에러가 발생했습니다.", error);
			}
		}
		navigate("/myinfo");
	};
	//미등재 학교 가입
	const handleSignUpOtherSchool = () => {
		const confirm = window.confirm("이 학교 멤버로 가입하시겠습니까?");
		if (!confirm) return;
		const { memberList, schoolCode, ...rest } = otherSchool;
		updateUserInfo({ "school": rest });
		joinSchool(schoolCode, userRtData);
		navigate("/myinfo");
	}
	//미등재 학교 검색
	const handleSeachOnClick = useCallback(async () => {
		if (!keyword.trim()) {
			alert("검색어를 입력하세요");
			return;
		}
		try {
			const field = searchBy === "school" ? "schoolName" : "schoolCode";
			const results = await searchSchoolByField(field, keyword);
			if (!results || results.length === 0) { setOtherSchool(null); return; }
			setOtherSchool(results[0]);
		} catch (error) {
			alert("검색 중 오류가 발생했습니다.");
			setOtherSchool(null);
		}
	}, [searchBy])
	//체크
	const check = () => {
		if (!otherName) { return { valid: false, msg: "학교 이름을 입력하세요" } };
		if (!otherTel) { return { valid: false, msg: "담당자 번호을 입력하세요" } };
		return { valid: true, msg: "성공 " };
	}
	//학교 신설 폼 제출
	const handleCreateOnClick = async () => {
		const result = check();
		if (!result.valid) { alert(result.msg); return; }
		const confirm = window.confirm(`${otherName} 학교를 신설하시겠습니까?`);
		if (!confirm) return;
		const { naem, uid, isTeacher, phoneNumber } = userRtData;
		const schoolCode = getRandomStringId();
		const memberList = [{ naem, uid, isTeacher, phoneNumber }];
		const schoolInfo = { schoolName: otherName, schoolTel: otherTel, address: "나이스 미등재", eduOfficeName: "나이스 미등재", schoolCode };
		try {
			await setData({ ...schoolInfo, memberList }, schoolCode); //학교 신설
			await updateUserInfo({ "school": schoolInfo });						//내 정보 수정	
			navigate("/myinfo")
		} catch (error) {
			alert("학교 생성중 오류가 발생했습니다.");
		}
	}
	return (<MainContainer styles={{ paddingTop: "20px", gap: "10px" }}>
		<MainWrapper>
			<Title>나이스 등재 여부</Title>
			<Wrapper><TwoRadios value={isPublic} label={["등재 학교", "그 외 단체, 학원, 대안학교"]} onChange={() => setIsPublic(!isPublic)} /></Wrapper>
		</MainWrapper>
		{/* 나이스 등재 */}
		{isPublic && <>
			<AnimMaxHightOpacity isVisible={isPublic}>
				<MainWrapper styles={{ margin: "0 auto" }}>
					<Title>학교 찾기</Title>
					<Wrapper>
						<FindSchoolSelect setSchool={setSelectedSchool} />
					</Wrapper>
				</MainWrapper>
			</AnimMaxHightOpacity>
			<AnimMaxHightOpacity isVisible={selectedSchool !== null}>
				<MainWrapper styles={{ margin: "0 auto" }}>
					{schoolInfo?.memberList?.length > 0
						? <MySchoolSection mySchooInfo={schoolInfo} />
						: <Title>{selectedSchool?.schoolName}의 첫 가입자이십니다. 환영합니다.😊</Title>}
					<Row style={{ justifyContent: "flex-end" }}>
						<MainBtn onClick={handleSignUpSchool}>학교 가입</MainBtn>
					</Row>
				</MainWrapper>
			</AnimMaxHightOpacity>
		</>}
		{/* 나이스 미등재 */}
		{!isPublic && <>
			<MainWrapper styles={{ margin: "0 auto" }}>
				<Title>미등재 학교 검색</Title>
				<Row style={{ justifyContent: "center", gap: "20px", margin: "30px 0 10px" }}>
					{(searchBy === "school") && <SearchSection keyword={keyword} placeholder={"학교명 검색"} onChange={(event) => setKeyword(event.target.value)} onClick={handleSeachOnClick} />}
					{(searchBy === "code") && <SearchSection keyword={keyword} placeholder={"학교코드 검색"} onChange={(event) => setKeyword(event.target.value)} onClick={handleSeachOnClick} />}
					<Select options={options} onChange={(event) => setSearchBy(event.value)} />
				</Row>
			</MainWrapper>
			{otherSchool && <MainWrapper>
				<MySchoolSection mySchooInfo={otherSchool} />
				<Row style={{ justifyContent: "flex-end" }}>
					<MainBtn onClick={() => handleSignUpOtherSchool()}>본교 가입</MainBtn>
				</Row>
			</MainWrapper>}
			{!otherSchool && <MainWrapper>
				<Row style={{ marginTop: "20px", justifyContent: "center", borderTop: "1px solid rgba(120, 120, 120, 0.5)", borderBottom: "1px solid rgba(120, 120, 120, 0.5)" }}>
					<EmptyResult comment={"아직 등재된 학교가 없습니다."} />
				</Row>
			</MainWrapper>}
			{userRtData?.isTeacher && <MainWrapper styles={{ gap: "10px" }}>
				<Title>학교/학원 신설하기</Title>
				<Row style={{ gap: "20px", alignItems: "center" }}>
					<DotTitle>학교 이름</DotTitle>
					<TextInput type="text" value={otherName} onChange={(event) => setOtherName(event.target.value)} />
				</Row>
				<Row style={{ gap: "20px", alignItems: "center", marginBottom: "20px" }}>
					<DotTitle>전화 번호</DotTitle>
					<TextInput type="text" value={otherTel} onChange={(event) => { setOtherTel(event.target.value) }} /></Row>
				<MainBtn onClick={handleCreateOnClick}>제출하기</MainBtn>
			</MainWrapper>}
		</>}
	</MainContainer >
	)
}
const Row = styled.div`
	display: flex;
`
const Wrapper = styled(Row)`
  margin-top: 20px;
  justify-content: center;
`
const TextInput = styled.input`
	height: 35px;
	border-radius: 7px;
	border: 1px solid rgba(120, 120, 120, 0.5);
`
export default SchoolSignUpPage