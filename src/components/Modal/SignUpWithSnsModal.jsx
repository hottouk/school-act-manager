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

//24.01.21
const SignUpWithSnsModal = (props) => {
  //1. 변수
  const tempUser = useSelector(({ tempUser }) => { return tempUser }) //회원 가입 전 구글 전역 변수
  const [isTeacher, setIsTeacher] = useState(undefined);
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
    if (isTeacher !== undefined) {
      const user = { ...tempUser, isTeacher }
      try {
        addUser(user)
        dispatcher(setUser(user))
      } catch (error) {
        window.alert(error)
      }
    } else {
      window.alert("학생/교사 회원을 선택해 주세요")
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
            <label>학교 정보</label>
            {/* todo 학교정보 api 불러오기*/}
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
export default SignUpWithSnsModal