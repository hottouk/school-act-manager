import React from 'react'
import { Modal } from 'react-bootstrap'
import PetInfoSection from '../../pages/classroom/PetInfoSection'

const PetInfoModal = ({ show, onHide, pet }) => {
  const { subject, studentNumber, petName, levelInfo, writtenName, master } = pet

  return (
    <Modal
      show={show}
      onHide={onHide}
      size='lg'
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>펫 정보</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        <PetInfoSection subject={subject} studentNumber={studentNumber} petName={petName} levelInfo={levelInfo} writtenName={writtenName} master={master} />
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }} />
    </Modal>
  )
}

export default PetInfoModal
