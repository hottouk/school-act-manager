//라이브러리
import { useState } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';
//hooks
import ModalBtn from '../Btn/ModalBtn';
import useFireClassData from '../../hooks/Firebase/useFireClassData';

//퀴즈 등록 모달(250719)
const AddQuizModal = ({ show, onHide, quizData, klassId }) => {
	//퀴즈 선택
	const [_selected, setSelected] = useState(null);

	const { updateKlassroomArrayInfo } = useFireClassData();
	//------함수부------------------------------------------------  
	//셀렉터 옵션
	const createOptions = () => {
		return quizData
			.map((quiz) => ({ label: quiz.title, value: quiz }))
			.sort((a, b) => a.label.localeCompare(b.label));
	}
	//가입 버튼
	const handleOnSubmit = (event) => {
		event.preventDefault();
		if (_selected) {
			const confirm = window.confirm(`"${_selected.label}" 이 퀴즈를 등록하시겠습니까?`);
			if (confirm) { updateKlassroomArrayInfo(klassId, "addedQuizIdList", _selected.value.id); }
			onHide();
		} else { window.alert("퀴즈를 선택하세요"); }
	}

	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop="static">
			<Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>퀴즈 등록</Modal.Header>
			<Modal.Body style={{ backgroundColor: "#efefef" }}>
				<Select
					options={createOptions()}
					placeholder="등록할 퀴즈를 선택하세요"
					onChange={(event) => { setSelected(event) }} />
			</Modal.Body>
			<Modal.Footer style={{ backgroundColor: "#efefef" }}>
				<ModalBtn onClick={() => { onHide(); }} type="button">취소</ModalBtn>
				<ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={(event) => handleOnSubmit(event)}>등록</ModalBtn>
			</Modal.Footer>
		</Modal>
	)
}

export default AddQuizModal