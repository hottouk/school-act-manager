//라이브러리
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux'
//hooks
import useLogin from '../../hooks/useLogin';

//CSS
import styled from 'styled-components'
import CSInfoSelect from '../Select/CSInfoSelect';
import FindSchoolSelect from '../FindSchoolSelect';
import TwoRadios from '../Radio/TwoRadios';
import LongW100Btn from '../Btn/LongW100Btn';
import { setUser } from '../../store/userSlice';

//24.07.30(디자인 수정, 코드 경량화)
const SignUpWithSnsModal = (props) => {
  //1. 변수
  const tempUser = useSelector(({ tempUser }) => { return tempUser }) //회원 가입 전 구글 전역 변수
  const dispatcher = useDispatch()
  //userInfo 설정
  const [_isTeacher, setIsTeacher] = useState(false);
  const [_grade, setGrade] = useState("default");
  const [_classNumber, setClassNumber] = useState("default");
  const [_number, setNumber] = useState(1)
  const [_school, setSchool] = useState(null)
  const [_isSearchSchool, setIsSearchSchool] = useState(false) //학교 검색창 보이기
  //hooks
  const { classifyUserInfo, addUser } = useLogin()
  //2. 함수
  //취소
  const handleCancelBtnClick = () => {
    props.onHide()
    setIsSearchSchool(false)
    setSchool(null)
  }
  //제출
  const handleSubmit = (event) => {
    event.preventDefault(); //새로고침 방지
    let userInfo = { ...tempUser, isTeacher: _isTeacher, school: _school, grade: _grade, classNumber: _classNumber, number: _number } //유저 정보
    userInfo = classifyUserInfo(userInfo)
    addUser(userInfo)
    dispatcher(setUser(userInfo))
  }

  //학생 학번 변경
  const handleStudentNumber = (event) => {
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
            <Wrapper>
              <StyledTitle>이름</StyledTitle>
              <h4>{tempUser.name}</h4>
            </Wrapper>
            <Wrapper>
              <StyledTitle>email</StyledTitle>
              <h4>{tempUser.email}</h4>
            </Wrapper>
            <Wrapper>
              <StyledTitle>구분</StyledTitle>
              <TwoRadios
                name="회원구분"
                id={["isTeacher_radio_btn", "isStudent_radio_btn"]}
                label={["교사 회원", "학생 회원"]}
                value={_isTeacher}
                onChange={() => { setIsTeacher((prev) => !prev) }} />
            </Wrapper>
            {_isTeacher === false &&
              <Wrapper>
                <StyledTitle>학번</StyledTitle>
                <CSInfoSelect grade={_grade} classNumber={_classNumber} number={_number} handleOnChange={handleStudentNumber} />
              </Wrapper>
            }
            <InputWrapper>
              <StyledTitle>학교</StyledTitle>
              {_school ? <input type="text" value={_school.schoolName} readOnly /> : <input type="text" value={''} readOnly onClick={() => { setIsSearchSchool(true) }} />}
            </InputWrapper>
            {_isSearchSchool && <FindSchoolSelect setSchool={setSchool} />}
          </fieldset>
          <BtnWrapper>
            <LongW100Btn type="submit" btnName="회원가입" />
            <LongW100Btn type="button" btnOnClick={handleCancelBtnClick} btnName="취소" />
          </BtnWrapper>
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
  legend {
    font-size: 1.5em;
    margin-bottom: 20px;
  }
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 18px;
    border: none;
  }
  h4 {
    margin: 0;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-top: 0;
  }
`
const InputWrapper = styled.div`
  display: flex;
  input {
    height: 35px;
    border: 1px solid black;
    border-radius: 5px;
  }
`
const Wrapper = styled.div`
  display: flex;
`
const StyledTitle = styled.p`
  position: relative;
  display: flex;
  align-items: center;
  width: 30%; 
  margin: 0;
  padding: 0 20px;  /* 텍스트가 동그라미와 겹치지 않도록 왼쪽 여백 추가 */
  &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 20px;
      background-color: white;  /* 동그라미 색상 */
      border-radius: 2px;
    }
`
const BtnWrapper = styled.div`
  display: flex;
  gap: 10px;
`

export default SignUpWithSnsModal