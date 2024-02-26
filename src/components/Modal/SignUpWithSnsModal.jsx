//라이브러리
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux'
//hooks
import useStudent from '../../hooks/useStudent';
import useLogin from '../../hooks/useLogin';
//전역변수
import { setUser } from '../../store/userSlice';
//CSS
import styled from 'styled-components'
import CSInfoSelect from '../CSInfoSelect';
import FindSchoolSelect from '../FindSchoolSelect';

//24.02.17
const SignUpWithSnsModal = (props) => {
  //1. 변수
  //학번 info
  const tempUser = useSelector(({ tempUser }) => { return tempUser }) //회원 가입 전 구글 전역 변수
  const [_isTeacher, setIsTeacher] = useState(false);
  const [_grade, setGrade] = useState("default");
  const [_classNumber, setClassNumber] = useState("default");
  const [_number, setNumber] = useState(1)
  const [_school, setSchool] = useState(null)
  const [_isSearchSchool, setIsSearchSchool] = useState(false) //학교 검색창 보이기
  //hooks
  const { createStudentNumber } = useStudent()
  const { addUser } = useLogin()
  //전역변수
  const dispatcher = useDispatch()
  //2. 함수
  //취소
  const handleBtnClick = () => {
    props.onHide()
    setIsSearchSchool(false)
    setSchool(null)
  }

  //제출
  const handleSubmit = (event) => {
    event.preventDefault(); //새로고침 방지
    let userInfo = { ...tempUser, isTeacher: _isTeacher }
    if (_isTeacher) { //교사
      if (_school) {
        userInfo.school = _school
        if (window.confirm(`교사회원으로 가입 하시겠습니까?`)) {
          addUser(userInfo)
          dispatcher(setUser(userInfo))
        }
      } else {
        window.alert("학교를 입력하세요.")
      }
    } else { //학생
      if (_grade !== "default" && _classNumber !== "default" && _school) {
        userInfo.studentNumber = createStudentNumber(_number - 1, _grade, _classNumber)
        userInfo.school = _school
        if (window.confirm(`${_school.schoolName} 학번 ${userInfo.studentNumber}로 회원가입 하시겠습니까?`)) {
          addUser(userInfo)
          dispatcher(setUser(userInfo))
        }
      } else {
        window.alert("학교, 학년, 반을 입력하세요.")
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
  const handleRadioBtnOnChange = (event) => {
    switch (event.target.value) {
      case "teacher":
        setIsTeacher(true)
        break;
      case "student":
        setIsTeacher(false)
        break;
      default: return
    }
  }

  return (
    <Modal
      show={props.show}
      backdrop={props.backdrop}
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
            <div className="radio_div">
              <label>회원 구분</label>
              <Form.Check onChange={handleRadioBtnOnChange}
                inline
                type="radio"
                id={"isTeacher_radio_btn"}
                name="group1"
                label={"교사 회원"}
                value={"teacher"}
                checked={_isTeacher} />
              <Form.Check onChange={handleRadioBtnOnChange}
                inline
                type="radio"
                id={"isStudent_radio_btn"}
                name="group1"
                label={"학생 회원"}
                value={"student"}
                checked={!_isTeacher} />
            </div>
            {_isTeacher === false && <CSInfoSelect grade={_grade} classNumber={_classNumber} number={_number} handleOnChange={handleOnChange} />}
            <div className="find_school_section">
              <p>학교: </p>
              {_school ? <input type="text" value={_school.schoolName} readOnly /> : <input type="text" value={''} readOnly onClick={() => { setIsSearchSchool(true) }} />}
            </div>
            {_isSearchSchool && <FindSchoolSelect setSchool={setSchool} />}
          </fieldset>
          <button type="submit">회원가입</button>
          <button type="button" onClick={handleBtnClick}>취소</button>
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

  div.find_school_section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      margin: 0 25px 0 0;
    }
    input {
      padding: 5px;
      border-radius: 7px;
      flex-grow: 1;
    }
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-top: 0;
  }
`
export default SignUpWithSnsModal