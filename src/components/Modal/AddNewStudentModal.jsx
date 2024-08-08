//라이브러리
import { useState } from 'react'
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
//hooks
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
//css
import styled from 'styled-components';

const AddNewStudentModal = ({ show, onHide, classId }) => {
  //1. 변수
  const selectedClassInfo = useSelector(({ classSelected }) => classSelected)
  const [_name, setName] = useState('')
  const [_studentNumber, setStudentNumber] = useState('')
  const { addStudent } = useAddUpdFireData("classRooms")

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
    if (_name !== '' && _studentNumber !== '') {
      addStudent({ studentNumber: _studentNumber, writtenName: _name, subject: selectedClassInfo.subject }, classId,)
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
            <InputWrapper>
              <label htmlFor="student_number">학번:&nbsp;&nbsp;</label>
              <input type="text" id="student_number" required value={_studentNumber} onChange={handleOnChange} />
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="student_number">이름:&nbsp;&nbsp;</label>
              <input type="text" id="student_name" required value={_name} onChange={handleOnChange} />
            </InputWrapper>
          </fieldset>
          <Modal.Footer>
            <Button variant="secondary" id="cancel_btn" onClick={handleBtnClick}>취소</Button>
            <Button type="submit" variant="primary" id="confirm_btn" >확인</Button>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal >
  )
}
const InputWrapper = styled.div`
  margin-top: 10px;  
  input {
    display: inline-block;
    height: 35px;
    border-radius: 5px;
  }
`
export default AddNewStudentModal