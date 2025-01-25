//라이브러리
import React, { useState } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
//hooks
import useFireTransaction from '../../hooks/useFireTransaction';

//25.01.23 학생 클래스 가입 모달 수정
const ApplyClassModal = ({ show, onHide, klass }) => {
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
    return options
  }

  //유저 상호작용
  //가입 버튼 클릭
  const handleOnSubmit = (event) => {
    event.preventDefault()
    if (_selected) {
      const confirm = window.confirm(`"${_selected.label}" 학번과 이름이 맞습니까?`)
      if (confirm) {
        let info = { ...klass, petId: _selected.value, petLabel: _selected.label }
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
      <Modal.Header closeButton>
        <Modal.Title>클래스 가입 신청</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <p>{grade}학년 {subjDetail}과목 {classTitle}반에 가입 신청하시겠습니까?</p>
          <Select
            options={createOptions()}
            placeholder="자신의 학번을 선택하세요"
            onChange={(event) => { setSelected(event) }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onHide()}>취소</Button>
          <Button type="submit" variant="primary">가입</Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default ApplyClassModal