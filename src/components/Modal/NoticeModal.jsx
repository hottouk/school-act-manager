import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';

const NoticeModal = ({ show, onHide }) => {

  const closeTodayPop = () => {
    let expires = new Date();
    expires.setHours(expires.getHours() + 1)
    localStorage.setItem("recentVisited", expires.getTime())
    onHide();
  }

  const handleBtnClick = () => {
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
        <p>1. 생기부 쫑알이 v.0.2.1 최근 업데이트일: 24.3.3</p>
        <p>2. 사용방법 영상으로 제작중</p>
        <p>3. 학생 활동 포인트 교환할 수 있는 상점 구현 예정 </p>
        <p>4. 원클릭으로 나이스에 전 학생 생기부 복, 붙여넣기 할 수 있는 매크로 구현 예정</p>
        <p>5. 몬스터 디자이너 모집, 고등학생, 대학생 환영, 어도비 일러, 피그마 가능자 우대</p>
      </Modal.Body>
      <Modal.Footer>
        <input type="checkbox" onChange={closeTodayPop} />오늘 하루 그만 보기
        <Button onClick={handleBtnClick}>닫기</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NoticeModal