import React from 'react'
import Modal from 'react-bootstrap/Modal'
import QuizBattlePage from '../../pages/quizBattle/QuizBattlePage'

const GameModal = ({ show, onHide, quizSetId, myPetDetails, gameDetails }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      fullscreen={true}>
      <Modal.Body>
        <QuizBattlePage quizSetId={quizSetId} myPetDetails={myPetDetails} gameDetails={gameDetails} onHide={onHide} />
      </Modal.Body>
    </Modal>
  )
}
export default GameModal
