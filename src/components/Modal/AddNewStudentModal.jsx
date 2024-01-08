//라이브러리
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
//hooks
import useFirestore from '../../hooks/useFirestore';

const AddNewStudentModal = (props) => {
  const { addStudent } = useFirestore("classRooms")
  const [name, setName] = useState('')
  const [studentNumber, setStudentNumber] = useState('')

  const handleOnChange = (event) => {
    switch (event.target.id) {
      case "student_number":
        setStudentNumber(event.target.value)
        break;
      case "student_name":
        setName(event.target.value)
        break;
      default: return;
    }
  }

  const handleBtnClick = (event) => {
    switch (event.target.id) {
      case "cancel_btn":
        props.onHide()
        break;
      case "confirm_btn":
        addStudent({ studentNumber, writtenName: name }, props.classId)
        break;
      default: return;
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>학생 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="student_number">학번</label>
        <input type="text" id="student_number" value={studentNumber} onChange={handleOnChange} />
        <label htmlFor="student_number">이름</label>
        <input type="text" id="student_name" value={name} onChange={handleOnChange} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" id="cancel_btn" onClick={handleBtnClick}>취소</Button>
        <Button variant="primary" id="confirm_btn" onClick={handleBtnClick}>확인</Button>
      </Modal.Footer>
    </Modal >
  )
}

export default AddNewStudentModal