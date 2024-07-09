import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';

const NoticeModal = ({ show, onHide, onDismissed }) => {

  const handleCloseBtnClick = () => {
    onHide();
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>공지사항</Modal.Header>
      <Modal.Body>
        <p>1. 생기부 쫑알이 v.0.3.1 최근 업데이트일: 24.07.09</p>
        <p>2. 학생 활동 포인트 교환할 수 있는 상점 구현 예정 </p>
        <p>3. 1500Byte 넘으면 gpt로 생기부 요약하는 기능 탑재 예정 8월 중.. </p>
      </Modal.Body>
      <Modal.Footer>
        <input type="checkbox" onChange={() => { onDismissed() }} />오늘 하루 그만 보기
        <Button onClick={handleCloseBtnClick}>닫기</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NoticeModal