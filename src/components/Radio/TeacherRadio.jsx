import React from 'react'
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

const TeacherRadio = ({ isTeacher, onChange }) => {
  return (
    <StyledRadioBtnSet className="radio_div">
      <label>회원 구분: &nbsp;&nbsp;</label>
      <Form.Check onChange={onChange}
        inline
        type="radio"
        id={"isTeacher_radio_btn"}
        name="group1"
        label={"교사 회원"}
        value={"teacher"}
        checked={isTeacher} />
      <Form.Check onChange={onChange}
        inline
        type="radio"
        id={"isStudent_radio_btn"}
        name="group1"
        label={"학생 회원"}
        value={"student"}
        checked={!isTeacher} />
    </StyledRadioBtnSet>)
}

const StyledRadioBtnSet = styled.div`
  margin: 15px 0;
`

export default TeacherRadio