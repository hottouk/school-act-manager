//부품
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
//이미지
import mon_01 from "../../image/enemies/mon_01.png";
import mon_02 from "../../image/enemies/mon_02.png";
import mon_03 from "../../image/enemies/mon_03.png";
import mon_04 from "../../image/enemies/mon_04.png";
import mon_05 from "../../image/enemies/mon_05.png";

//스타일 
import styled from 'styled-components';
//변수 관리
import { useState } from 'react';

const GraphicDialogModal = (props) => {
  //몬스터 이미지 변수
  const [monImg, setMonImg] = useState('')

  const handleOnClick = (event) => {
    setMonImg(event.target.id)
  }

  const handleConfirm = () => {
    props.onHide()
    props.setMonImg(monImg)
  }

  const handleCancel = () => {
    props.onHide()
  }

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
        <StyledImageWrapper>
          {/* 선택하면 몬스터 배경색을 바꿔준다. */}
          {(monImg === 'mon_01')
            ? <SelectedMonImg id='mon_01' src={mon_01} alt="몬스터1" width="100px" height="100px" onClick={handleOnClick} />
            : <img id='mon_01' src={mon_01} alt="몬스터1" width="100px" height="100px" onClick={handleOnClick} />}
          {(monImg === 'mon_02')
            ? <SelectedMonImg id='mon_02' src={mon_02} alt="몬스터2" width="100px" height="100px" onClick={handleOnClick} />
            : <img id='mon_02' src={mon_02} alt="몬스터2" width="100px" height="100px" onClick={handleOnClick} />}
          {(monImg === 'mon_03')
            ? <SelectedMonImg id='mon_03' src={mon_03} alt="몬스터3" width="100px" height="100px" onClick={handleOnClick} />
            : <img id='mon_03' src={mon_03} alt="몬스터3" width="100px" height="100px" onClick={handleOnClick} />}
          {(monImg === 'mon_04')
            ? <SelectedMonImg id='mon_04' src={mon_04} alt="몬스터4" width="100px" height="100px" onClick={handleOnClick} />
            : <img id='mon_04' src={mon_04} alt="몬스터4" width="100px" height="100px" onClick={handleOnClick} />}
          {(monImg === 'mon_05')
            ? <SelectedMonImg id='mon_04' src={mon_05} alt="몬스터5" width="100px" height="100px" onClick={handleOnClick} />
            : <img id='mon_05' src={mon_05} alt="몬스터5" width="100px" height="100px" onClick={handleOnClick} />}
        </StyledImageWrapper>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>취소</Button>
        <Button variant="primary" onClick={handleConfirm}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
}
const StyledImageWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
`
const SelectedMonImg = styled.img`
  background-color: orange;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid black;
`
export default GraphicDialogModal;