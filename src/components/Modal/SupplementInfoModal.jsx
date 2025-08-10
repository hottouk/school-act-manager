//라이브러리
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
//컴포넌트
import ModalBtn from '../Btn/ModalBtn';
import CSInfoSelect from '../Select/CSInfoSelect';
//hooks
import useStudent from '../../hooks/useStudent';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import { useSelector } from 'react-redux';
import useLogout from '../../hooks/useLogout';
//생성(250722)
const SupplementInfoModal = ({ show, onHide, type }) => {
	const user = useSelector(({ user }) => user);
	const { logout } = useLogout();
	//학번 관련
	const { updateUserInfo } = useFireUserData();
	const { createStudentNumber } = useStudent();
	const [_grade, setGrade] = useState(1);
	const [_klassNumber, setKlassNumber] = useState("01");
	const [_number, setNumber] = useState(1);
	//학생 학번 변경
	const handleStudentNumber = (event) => {
		switch (event.target.id) {
			case "class_grade":
				setGrade(event.target.value)
				break;
			case "class_number":
				setKlassNumber(event.target.value)
				break;
			case "number_input":
				setNumber(event.target.value)
				break;
			default: return
		}
	}
	//저장
	const handleConfirmOnClick = () => {
		if (_grade && _klassNumber && _number) {
			const studentNumber = createStudentNumber(_number - 1, _grade, _klassNumber);
			updateUserInfo("studentNumber", studentNumber, user.uid);
			logout();
			alert("재로그인 해주세요");
		} else { alert("학번을 채워주세요"); }
	}

	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop="static">
			<Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>정보 등록</Modal.Header>
			<Modal.Body style={{ backgroundColor: "#efefef" }}>
				{/* 학생 학번 */}
				<Row style={{ alignItems: "center", justifyContent: "space-around" }}>
					<span>학번: &nbsp;</span>
					<CSInfoSelect grade={_grade} classNumber={_klassNumber} number={_number} handleOnChange={handleStudentNumber} />
				</Row>
			</Modal.Body>
			<Modal.Footer style={{ backgroundColor: "#efefef" }}>
				<ModalBtn onClick={() => { alert("학번은 필수 등록사항입니다.") }} type="button">취소</ModalBtn>
				<ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfirmOnClick}>등록</ModalBtn>
			</Modal.Footer>
		</Modal>
	)
}

const Row = styled.div`
	display: flex;
`
export default SupplementInfoModal
