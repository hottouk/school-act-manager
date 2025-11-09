import React from 'react'
import { Modal } from 'react-bootstrap'
import ModalBtn from '../Btn/ModalBtn'

const BasicModal = ({ show, onHide, header, text, content, children, firstBtn, secondBtn, firstBtnOnClick, secondBtnOnClick, size, styles, }) => {
  let firstBtnStyles = styles?.firstBtnStyle || { btnColor: "royalblue", hoverColor: "#3454d1" };
  let secondBtnStyles = styles?.secondBtnStyle || null;
  return (
    <Modal
      show={show}
      size={size || 'mid'}
      onHide={onHide}
      backdrop="static"
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>{header || "샘플"}</Modal.Header>
      <Modal.Body>{text || content || children || "샘플"}</Modal.Body>
      <Modal.Footer>
        <ModalBtn styles={firstBtnStyles} onClick={firstBtnOnClick}>{firstBtn || "확인"}</ModalBtn>
        <ModalBtn styles={secondBtnStyles} onClick={secondBtnOnClick}>{secondBtn || "취소"}</ModalBtn>
      </Modal.Footer>
    </Modal>
  )
}

export default BasicModal
