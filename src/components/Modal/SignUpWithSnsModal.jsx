//라이브러리
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form';
//hooks
import useFirestore from '../../hooks/useFirestore'
//전역변수
import { setUser } from '../../store/userSlice';
//CSS
import styled from 'styled-components'
import useStudent from '../../hooks/useStudent';

//24.01.21
const SignUpWithSnsModal = (props) => {
  //1. 변수
  const tempUser = useSelector(({ tempUser }) => { return tempUser }) //회원 가입 전 구글 전역 변수
  const [isTeacher, setIsTeacher] = useState(undefined);
  const { createStudentNumber } = useStudent()
  //학번 재료
  const [grade, setGrade] = useState("default");
  const [classNumber, setClassNumber] = useState("default");
  const [number, setNumber] = useState(1)
  const { addUser } = useFirestore("user")
  const dispatcher = useDispatch()
  //2. 함수
  //취소
  const handleBtnClick = () => {
    props.onHide()
  }

  //제출
  const handleSubmit = (event) => {
    event.preventDefault(); //새로고침 방지
    let studentNumber = "00000"
    let user = { ...tempUser, isTeacher, studentNumber }
    if (isTeacher) {
      if (window.confirm(`교사회원으로 가입 하시겠습니까?`)) {
        addUser(user)
        dispatcher(setUser(user))
      }
    } else {
      if (grade !== "default" && classNumber !== "default") {
        user.studentNumber = createStudentNumber(number - 1, grade, classNumber)
        if (window.confirm(`학번 ${user.studentNumber}로 회원가입 하시겠습니까?`)) {
          addUser(user)
          dispatcher(setUser(user))
        }
      } else {
        window.alert("학년과 반을 선택하세요.")
      }
    }
  }

  //학년반
  const handleOnChange = (event) => {
    switch (event.target.id) {
      case "class_grade":
        setGrade(event.target.value)
        break;
      case "class_number":
        setClassNumber(event.target.value)
        break;
      case "number_input":
        setNumber(event.target.value)
        break;
      default: return
    }
  }

  //라디오 버튼
  const handleRadioBtnClick = (event) => {
    switch (event.target.value) {
      case 'teacher':
        setIsTeacher(true)
        break;
      case 'student':
        setIsTeacher(false)
        break;
      default: return
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}>
      <Modal.Header>
        <legend>추가 정보 기입</legend>
      </Modal.Header>
      <Modal.Body>
        <StyledForm onSubmit={handleSubmit}>
          <fieldset>
            <div>
              <label htmlFor="name">이름</label>
              <h4>{tempUser.name}</h4>
            </div>
            <div>
              <label htmlFor="email">email</label>
              <h4>{tempUser.email}</h4>
            </div>
            <div className='radio_div'>
              <label>회원구분</label>
              <Form.Check onChange={handleRadioBtnClick}
                inline
                type='radio'
                id={'teacher_radio_btn'}
                name='group1'
                label={'교사 회원'}
                value={'teacher'} />
              <Form.Check onChange={handleRadioBtnClick} required
                inline
                type='radio'
                id={'teacher_radio_btn'}
                name='group1'
                label={'학생 회원'}
                value={'student'} />
            </div>
            {/* todo 학교정보 api 불러오기*/}
            <label>학번</label>
            {isTeacher === false && <StyledSelectDiv>
              <select id="class_grade" required value={grade} onChange={handleOnChange}>
                <option value="default" disabled >학년</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
              </select>
              <select id="class_number" required value={classNumber} onChange={handleOnChange}>
                <option value="default" disabled >반</option>
                <option value="01">1반</option>
                <option value="02">2반</option>
                <option value="03">3반</option>
                <option value="04">4반</option>
                <option value="05">5반</option>
                <option value="06">6반</option>
                <option value="07">7반</option>
                <option value="08">8반</option>
                <option value="09">9반</option>
                <option value="10">10반</option>
                <option value="11">11반</option>
                <option value="12">12반</option>
                <option value="13">13반</option>
                <option value="14">14반</option>
                <option value="15">15반</option>
                <option value="16">16반</option>
                <option value="17">17반</option>
                <option value="18">18반</option>
                <option value="19">19반</option>
                <option value="20">기타</option>
              </select>
              <input type="number" id="number_input" value={number} onChange={handleOnChange} required min={1} max={99} />
            </StyledSelectDiv>}
          </fieldset>
          <button type='submit'>회원가입</button>
          <button type='button' onClick={handleBtnClick}>취소</button>
        </StyledForm>
      </Modal.Body>
    </Modal>
  )
}

const StyledForm = styled.form`
  max-width: 540px;
  margin: 0 auto;
  padding: 20px;
  color: #efefef;
  background-color: #3454d1;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  div {
    margin-bottom: 20px;
  }
  .radio_div {
    margin-bottom: 0;
  }
  div .form-check-inline { 
    margin-right: 70px;
  }
  filedset {
    border: none;
  }
  legend {
    font-size: 1.5em;
    margin-bottom: 20px;
  }
  label {
    display: block;
    color: #efefef;
  }
  button {
    display: inline;
    width: 100%;
    margin-top: 15px;
    padding: 10px 15px;
    border-radius: 15px;
    border: 2px solid whitesmoke;
    background-color: transparent;
    color: whitesmoke;
    cursor: pointer;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-top: 0;
  }
`

const StyledSelectDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`
export default SignUpWithSnsModal