import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import Reward from '../Reward'

const RewardModal = (props) => {
  let reward
  let actTitle;
  let money;
  let scores;
  if (props.reward) {
    if (props.reward.type === "class") {
      switch (props.reward.subject) {
        case "영어":
          reward = "eng"
          break;
        default: return;
      }
    } else if (props.reward.type === "homework") {
      reward = props.reward.type
      actTitle = props.reward.title
      money = props.reward.money
      scores = props.reward.scores
    }
  }

  const handleBtnClick = () => {
    props.onHide()
  }

  return (
    <Modal
      show={props.show}
      hide={props.onHide}
      backdrop="static"
      keyboard={false}>
      <Modal.Header>
        <Modal.Title>{actTitle}보상 획득</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Reward reward={reward} money={money} scores={scores} complete={true} />
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={handleBtnClick} variant="primary" id="confirm_btn" >확인</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RewardModal