import Modal from 'react-bootstrap/Modal';
const Wait3SecondsModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>활동 이미지 선택</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>세특을 작성 중입니다. 3초만 기다려주세요.</p>
      </Modal.Body>
    </Modal>
  )
}

export default Wait3SecondsModal