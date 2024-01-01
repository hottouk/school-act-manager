import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useFirestore from '../../hooks/useFirestore';

const StyledForm = styled.form`
  max-width: 480px;
  margin: 60px auto;
  padding: 20px;
  background-color: #6495ed;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  filedset {
    border: none;
  }
  legend {
    font-size: 1.5em;
    margin-bottom: 20px;
  }
  label {
    display: block;
    color: whitesmoke;
  }
  button {
    display: inline;
    width: 100%;
    padding: 10px 15px;
    border-radius: 15px;
    border: 2px solid whitesmoke;
    background-color: transparent;
    color: whitesmoke;
    cursor: pointer;
  }
  `

const SignUpWithSNS = () => { //회원 가입
  const userWithoutClassInfo = useSelector(({ user }) => { return user }) //전역 변수
  const [isTeacher, setIsTeacher] = useState(undefined);
  const navigate = useNavigate()
  const { addUser } = useFirestore("user")

  const handleSubmit = (event) => {
    event.preventDefault(); //새로고침 방지
    if (isTeacher !== undefined) {
      const user = { ...userWithoutClassInfo, isTeacher }
      try {
        addUser(user)
        navigate("/")
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("학생/교사 회원을 선택해 주세요")
    }
  }

  const handleRadioBtnClick = (event) => {
    switch (event.target.value) {
      case 'teacher':
        setIsTeacher(true)
        console.log(event.target.value)
        break;
      case 'student':
        setIsTeacher(false)
        console.log(event.target.value)
        break;
      default: return
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <fieldset>
        <legend>추가 정보 기입</legend>
        <label htmlFor="name">이름</label>
        <h4>{userWithoutClassInfo.name}</h4>
        <label htmlFor="email">email</label>
        <h4>{userWithoutClassInfo.email}</h4>
        <label>회원구분</label>
        <Form.Check onChange={handleRadioBtnClick}
          inline
          type='radio'
          id={'teacher_radio_btn'}
          name='group1'
          label={'교사회원'}
          value={'teacher'} />
        <Form.Check onChange={handleRadioBtnClick}
          inline
          type='radio'
          id={'teacher_radio_btn'}
          name='group1'
          label={'학생'}
          value={'student'} />
        <label>학교 정보</label>
        {/* todo 학교정보 api 불러오기*/}
      </fieldset>
      <button type='submit'>회원가입</button>
    </StyledForm>
  )
}

export default SignUpWithSNS