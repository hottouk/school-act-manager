import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import styled from 'styled-components'
//컴포넌트
import MainBtn from '../Btn/MainBtn'
import ByteCalculator from '../Etc/ByteCalculator'
//hooks
import useFireTransaction from '../../hooks/useFireTransaction'
//이미지
import arrows_icon from "../../image/icon/arrows_icon.png"
//생성(251110)
const EditRecordModal = ({ show, onHide, info }) => {
  const [newRecord, setNewRecord] = useState('');
  const { approveEditTransaction } = useFireTransaction();
  const handleOnClick = (info) => {
    const confirm = window.confirm("세특을 수정하시겠습니까?");
    if (!confirm) return;
    approveEditTransaction(info);
    onHide();
  }
  return (
    <Modal
      show={show}
      onHide={onHide}>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>세특 재수정</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef", borderRadius: "5px" }}>
        <p onClick={() => setNewRecord(info?.record)} style={{ margin: "10px 0" }}><Hilit>기존 {info?.byte} 바이트</Hilit>: <Underlined>{info?.record}</Underlined></p>
        <Row style={{ justifyContent: "center" }}>
          <img src={arrows_icon} alt="아래화살표" />
        </Row>
        <p onClick={() => setNewRecord(info?.newRecord)} style={{ margin: "10px 0" }}><Hilit>학생 수정 {info?.newByte} 바이트</Hilit>: <Underlined>{info?.newRecord}</Underlined></p>
        <Row style={{ justifyContent: "center" }}>
          <img src={arrows_icon} alt="아래화살표" />
        </Row>
        <Textarea
          value={newRecord}
          onChange={(event) => { setNewRecord(event.target.value) }}
        />
        <ByteCalculator str={newRecord} styles={{ isTotalByteHide: "true" }} />
        <Column style={{ marginTop: "20px" }}>
          <MainBtn onClick={() => handleOnClick({ ...info, renewal: newRecord })}>재수정하기</MainBtn>
        </Column>
      </Modal.Body>
    </Modal>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Textarea = styled.textarea`
  width: 100%;
  height: 4rem;
  border: none;
  border-radius: 5px;
  margin: 10px 0 5px 0;
`
const Hilit = styled.span`
  font-weight: bold;
  color: #3454d1;
`
const Underlined = styled.span`
  text-decoration: underline;
  cursor: pointer;
`
export default EditRecordModal
