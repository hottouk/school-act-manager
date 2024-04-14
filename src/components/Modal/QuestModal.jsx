import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import React from 'react'

const QuestModal = (props) => {
  const handleBtnClick = () => {
    props.onHide()
  }

  return (
    <Modal
      show={props.show}
      hide={props.onHide}
      backdrop="static"
      keyboard={false} >
      <Modal.Header>
        퀘스트 받기
      </Modal.Header>
      <Modal.Body>
        
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleBtnClick}></Button>
      </Modal.Footer>
    </Modal>
  )
}

export default QuestModal