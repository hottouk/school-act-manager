//라이브러리
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
//hooks
import useAddUpdFireStore from '../../hooks/useAddUpdFirestore';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const AddNewStudentModal = ({ show, onHide, classId }) => {
  //1. 변수
  const selectedClassInfo = useSelector(({ classSelected }) => classSelected)
  const { addStudent } = useAddUpdFireStore("classRooms")
  const [name, setName] = useState('')
  const [studentNumber, setStudentNumber] = useState('')
  //2. 함수
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
  const handleBtnClick = () => {
    onHide()
    setName('')
    setStudentNumber('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (name !== '' && studentNumber !== '') {
      addStudent({ studentNumber, writtenName: name, subject: selectedClassInfo.subject }, classId,)
      onHide()
      setName('')
      setStudentNumber('')
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>학생 추가</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <fieldset>
            <StyeldInputDiv>
              <label htmlFor="student_number">학번:&nbsp;&nbsp;</label>
              <input type="text" id="student_number" required value={studentNumber} onChange={handleOnChange} />
            </StyeldInputDiv>
            <StyeldInputDiv>
              <label htmlFor="student_number">이름:&nbsp;&nbsp;</label>
              <input type="text" id="student_name" required value={name} onChange={handleOnChange} />
            </StyeldInputDiv>
          </fieldset>
          <Modal.Footer>
            <Button variant="secondary" id="cancel_btn" onClick={handleBtnClick}>취소</Button>
            <Button type='submit' variant="primary" id="confirm_btn" >확인</Button>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal >
  )
}
const StyeldInputDiv = styled.div`
  margin-top: 10px;  
  input {
    display: inline-block;
  }
`
export default AddNewStudentModal