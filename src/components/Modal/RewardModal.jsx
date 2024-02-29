import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import Reward from '../Reward'

const RewardModal = ({ show, onHide, rewards }) => {
  const handleBtnClick = () => {
    onHide()
  }
  
  return (
    <Modal
      show={show}
      hide={onHide}
      backdrop="static"
      keyboard={false}>
      <Modal.Header>
        <Modal.Title>보상 획득</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Reward rewards={rewards} />
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={handleBtnClick} variant="primary" id="confirm_btn" >확인</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RewardModal