//라이브러리
import React, { useState } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
//hooks
import useEnrollClass from '../../hooks/useEnrollClass';
//이미지
import egg01 from "../../image/myPet/egg_b.png";
import egg02 from "../../image/myPet/egg_g.png";
import egg03 from "../../image/myPet/egg_y.png";

const ClassMemberModal = (props) => {
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  const allStudents = useSelector(({ allStudents }) => { return allStudents })
  const [petImgSrc, setPetImgSrc] = useState('')
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
    if (studentPetInfo !== '' && petImgSrc !== '') {
      let id = `${user.uid}/${Math.floor((Math.random() * Date.now()))}`
      let petInfo = { ...studentPetInfo, petImgSrc }
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

  const handlePetImgClick = (event) => {
    setPetImgSrc(event.target.id)
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
          <p>{ }반에 가입하시겠습니까?</p>
          <Select
            options={createSelectOptions()}
            placeholder="자신의 학번을 선택하세요"
            onChange={handleOnChange} />
          <p>받을 펫을 선택하세요.</p>
          <StyledImageWrapper>
            {/* 선택하면 몬스터 배경색을 바꿔준다. */}
            {(petImgSrc === 'egg01')
              ? <SelectedMonImg id='egg01' src={egg01} alt="펫" width="100px" height="100px" onClick={handlePetImgClick} />
              : <img id='egg01' src={egg01} alt="펫" width="100px" height="100px" onClick={handlePetImgClick} />}
            {(petImgSrc === 'egg02')
              ? <SelectedMonImg id='egg02' src={egg02} alt="펫" width="100px" height="100px" onClick={handlePetImgClick} />
              : <img id='egg02' src={egg02} alt="펫" width="100px" height="100px" onClick={handlePetImgClick} />}
            {(petImgSrc === 'egg03')
              ? <SelectedMonImg id='egg03' src={egg03} alt="펫" width="100px" height="100px" onClick={handlePetImgClick} />
              : <img id='egg03' src={egg03} alt="펫" width="100px" height="100px" onClick={handlePetImgClick} />}
          </StyledImageWrapper>
          <p>잘못 기입할 경우 가입이 거부될 수 있습니다.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" id="cancel_btn" onClick={handleBtnClick}>취소</Button>
          <Button type='submit' variant="primary" id="confirm_btn" >확인</Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

const StyledImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  img { 
    padding: 10px;
  }
  p {
    margin-top: 1rem;
  }
  margin: 10px;
  gap: 8px;
`
const SelectedMonImg = styled.img`
  background-color: orange;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid black;
`

export default ClassMemberModal