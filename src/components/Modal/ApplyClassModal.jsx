//라이브러리
import React, { useState } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
//hooks
import useFireTransaction from '../../hooks/useFireTransaction';
import ModalBtn from '../Btn/ModalBtn';

//학생 클래스 가입 모달 수정(250123)
const ApplyClassModal = ({ show, onHide, klass, myUserData: user }) => {
  //준비
  const allStudents = useSelector(({ allStudents }) => { return allStudents })
  const { applyKlassTransaction } = useFireTransaction();
  klass = klass || { grade: "1", subjDetail: "과목", classTitle: "샘플" }
  const { grade, subjDetail, classTitle } = klass
  //학번 선택
  const [_selected, setSelected] = useState(null)

  //------함수부------------------------------------------------  
  //셀렉터 옵션
  const createOptions = () => {
    let options = []
    allStudents.forEach((student) => {
      let name = '미등록'
      let number = student.studentNumber
      if (student.writtenName) { name = student.writtenName }
      options.push({ value: student.id, label: `${number} ${name}` })
    })
    options.sort((a, b) => a.label.localeCompare(b.label));
    return options
  }

  //유저 상호작용
  //가입 버튼 클릭
  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (_selected) {
      const confirm = window.confirm(`"${_selected.label}" 학번과 이름이 맞습니까?`)
      if (confirm) {
        let info = { klass, user, petId: _selected.value, petLabel: _selected.label }
        applyKlassTransaction(info);
      }
      onHide();
    } else {
      window.alert("학번을 선택하세요")
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>클래스 가입 신청</Modal.Header>
      <form onSubmit={handleOnSubmit}>
        <Modal.Body style={{ backgroundColor: "#efefef" }}>
          <p>{grade}학년 {subjDetail}과목 {classTitle}반에 가입 신청하시겠습니까?</p>
          <Select
            options={createOptions()}
            placeholder="자신의 학번을 선택하세요"
            onChange={(event) => { setSelected(event) }} />
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#efefef" }}>
          <ModalBtn onClick={() => { onHide(); }}>취소</ModalBtn>
          <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} type="submit">가입</ModalBtn>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default ApplyClassModal