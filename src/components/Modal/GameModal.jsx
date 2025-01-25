import React from 'react'
import Modal from 'react-bootstrap/Modal'
import QuizBattlePage from '../../pages/quizBattle/QuizBattlePage'

const GameModal = ({ show, onHide, quizSetId, myPetDetails, monsterDetails }) => {
  //todo 가운데 화면으로
  return (
    <Modal
      show={show}
      onHide={onHide}
      fullscreen={true}>
      <Modal.Body>
        <QuizBattlePage quizSetId={quizSetId} myPetDetails={myPetDetails} monsterDetails={monsterDetails} />
      </Modal.Body>
    </Modal>
  )
}
export default GameModal
