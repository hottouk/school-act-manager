import { Modal } from 'react-bootstrap'
import PetInfoSection from '../../pages/classroom/PetInfoSection'

const PetInfoModal = ({ show, onHide, pet }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size='lg'
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>펫 정보</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        <PetInfoSection pet={pet} />
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }} />
    </Modal>
  )
}

export default PetInfoModal
