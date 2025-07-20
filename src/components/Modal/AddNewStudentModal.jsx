//라이브러리
import { useState } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
//컴포넌트
import ModalBtn from '../Btn/ModalBtn';
//hooks
import useFireClassData from '../../hooks/Firebase/useFireClassData';

//정리(241022) -> 디자인수정(250502)
const AddNewStudentModal = ({ show, onHide, classId, type }) => {
  const selectedClassInfo = useSelector(({ classSelected }) => classSelected);
  const [_name, setName] = useState('');
  const [_studentNumber, setStudentNumber] = useState('');
  const { addStudent } = useFireClassData();

  //------함수부------------------------------------------------
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
  //취소
  const handleBtnClick = () => {
    onHide();
    setName('');
    setStudentNumber('');
  }
  //제출
  const handleSubmit = (event) => {
    event.preventDefault()
    let student = { studentNumber: _studentNumber, writtenName: _name }
    if (type === "homeroom") { student = { ...student, type: "homeroom" } }
    else { student = { ...student, subject: selectedClassInfo.subject } }
    if (_name !== '' && _studentNumber !== '') {
      addStudent(student, classId);
      onHide();
      setName('');
      setStudentNumber('');
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>학생 추가</Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <fieldset>
            <InputWrapper>
              <label htmlFor="student_number">학번:&nbsp;&nbsp;</label>
              <StyledInptu type="text" id="student_number" required value={_studentNumber} onChange={handleOnChange} />
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="student_number">이름:&nbsp;&nbsp;</label>
              <StyledInptu type="text" id="student_name" required value={_name} onChange={handleOnChange} />
            </InputWrapper>
          </fieldset>
          <Modal.Footer>
            <ModalBtn onClick={handleBtnClick}>취소</ModalBtn>
            <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} type="submit">확인</ModalBtn>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal >
  )
}
const InputWrapper = styled.div`
  margin-top: 10px;  
`
const StyledInptu = styled.input`
  width: 100%;
  height: 35px;
`
export default AddNewStudentModal