import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import styled from 'styled-components'
//컴포넌트
import MainBtn from '../Btn/MainBtn'
//hooks
import useFireUserData from '../../hooks/Firebase/useFireUserData'
//데이터
import { userTerm, privacyPolicy } from '../../data/termData'
//생성(251026)
const TermsModal = ({ show, onHide, isMyTermAgree, setIsFirstAgree }) => {
	const { updateMyInfo } = useFireUserData();
	const [isAgree, setIsAgree] = useState(false);
	//체크박스
	const handleOnChange = () => {
		if (isAgree) setIsAgree(false);
		else setIsAgree(true);
	};
	//회원가입
	const handleFirstAgreeOnClick = () => {
		setIsFirstAgree(true);
		onHide();
	};
	//동의
	const handleOnClick = () => {
		const info = { isMyTermAgree: true, termAgreeDate: new Date().toISOString() };
		updateMyInfo(info);
		onHide();
	};
	return (
		<Modal
			show={show}
			size="lg"
			onHide={onHide}
			backdrop="static"
			keyboard={false}
			scrollable={true}
		>
			<Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>이용약관 및 개인정보 처리방침</Modal.Header>
			<Modal.Body style={{ backgroundColor: "#efefef" }}>
				<h5 style={{ textAlign: "center" }}>쫑알이에듀(JREdu) 이용약관</h5>
				<Wrapper>
					{userTerm()}
				</Wrapper>
				<h5 style={{ textAlign: "center" }}>쫑알이에듀(JREdu) 개인정보 처리방침</h5>
				<Wrapper>
					{privacyPolicy()}
				</Wrapper>
				{!isMyTermAgree && <Column>
					<Row style={{ gap: "5px", justifyContent: "center" }}>
						<AgreeCheckbox
							id="agree"
							type="checkbox"
							checked={isAgree}
							onChange={handleOnChange} />
						<AgreeLabel htmlFor="agree">위 이용약관과 개인정보 처리방침에 동의합니다.</AgreeLabel>
					</Row>
					{/* 약관 개정 진입*/}
					{!setIsFirstAgree && <MainBtn styles={{ margin: "10px 0" }}
						onClick={handleOnClick}
						disabled={!isAgree}>동의하고 시작
					</MainBtn>}
					{/* 회원 가입 진입 */}
					{setIsFirstAgree && <MainBtn styles={{ margin: "10px 0" }}
						onClick={handleFirstAgreeOnClick}
						disabled={!isAgree}>동의하고 가입
					</MainBtn>}
				</Column>}
				{/* footer에서 진입 */}
				{isMyTermAgree && <Column><MainBtn onClick={() => onHide()}>확인</MainBtn></Column>}
			</Modal.Body>
		</Modal >
	)
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
const AgreeCheckbox = styled.input`
	type: checkbox;
	cursor: pointer;
`
const AgreeLabel = styled.label`
	cursor: pointer;
	font-weight: bold;
	color: #3454d1;
`
const Wrapper = styled.div`
	height: 300px;
	background-color: white;
	padding: 5px;
	margin-bottom: 10px;
	overflow-y: scroll;
`

export default TermsModal
