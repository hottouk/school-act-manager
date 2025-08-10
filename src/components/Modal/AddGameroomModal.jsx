//라이브러리
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import ModalBtn from '../Btn/ModalBtn';
import { useNavigate } from 'react-router-dom';
//hooks
import useFireGameData from '../../hooks/Firebase/useFireGameData';

//생성(250722)
const AddGameroomModal = ({ show, onHide, selectedPet, quizId }) => {
  const navigate = useNavigate();
  const { createGameroom } = useFireGameData();
  const [_title, setTitle] = useState('');
  //제목
  const handleOnChange = (event) => { setTitle(event.target.value); }
  //확인
  const handleConfimrOnClick = () => {
    createGameroom({ selectedPet, title: _title, quizId }).then((gameId) => {
      navigate("/multiplay", { state: gameId });
      onHide();
    })
  }
  return (
    <Modal show={show} onHide={onHide} backdrop={"static"}>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>방 만들기</Modal.Header>
      <Modal.Body>
        <Row style={{ alignItems: "center" }}>
          <span>방 제목:&nbsp;</span>
          <Input type="text" value={_title} onChange={(event) => { handleOnChange(event) }} />
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <ModalBtn onClick={onHide}>취소</ModalBtn>
        <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfimrOnClick}>확인</ModalBtn>
      </Modal.Footer>
    </Modal>
  )
}
const Row = styled.div`
  display: flex;
`
const Input = styled.input`
  flex-grow: 1;
  height: 35px;
  border-radius: 5px;
`
export default AddGameroomModal
