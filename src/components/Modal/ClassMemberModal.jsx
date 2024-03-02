//라이브러리
import React, { useState } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
//hooks
import useEnrollClass from '../../hooks/useEnrollClass';
//컴포넌트
import Reward from '../Reward';

const ClassMemberModal = (props) => {
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  const allStudents = useSelector(({ allStudents }) => { return allStudents })
  const [studentPetInfo, setStudentPetInfo] = useState('')
  //가입 로직
  const { signUpUserInClass } = useEnrollClass()
  //2. 함수
  const createSelectOptions = () => {
    let options = []
    allStudents.map((student) => {
      let name = '미등록'
      let number = student.studentNumber
      if (student.writtenName) { name = student.writtenName }
      options.push({ value: student.id, label: `${number} ${name}` })
      return null;
    })
    return options
  }

  const handleOnChange = (event) => {
    setStudentPetInfo(event)
  }

  const handleOnSubmit = (event) => {
    event.preventDefault()
    if (studentPetInfo !== '') {
      let id = `${user.uid}/${Math.floor((Math.random() * Date.now()))}`
      let petInfo = { ...studentPetInfo }
      let studentWithPetInfo = { id, studentInfo: user, petInfo, classInfo: props.thisClass }
      signUpUserInClass(studentWithPetInfo)
      props.onHide()
    } else {
      (studentPetInfo !== '' ? window.alert("펫을 선택해 주세요.") : window.alert("학번을 선택해 주세요."))
    }
  }

  const handleBtnClick = () => {
    props.onHide()
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>반 가입</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <div>
            <p>{props.thisClass.classTitle}반에 가입하시겠습니까?</p>
            <Select
              options={createSelectOptions()}
              placeholder="자신의 학번을 선택하세요"
              onChange={handleOnChange} />
            <Reward rewards={{ type: "class", subject: "영어" }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" id="cancel_btn" onClick={handleBtnClick}>취소</Button>
          <Button type="submit" variant="primary" id="confirm_btn" >확인</Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default ClassMemberModal