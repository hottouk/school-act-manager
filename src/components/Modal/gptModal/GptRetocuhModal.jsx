import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import styled from 'styled-components';
//컴포넌트
import MainBtn from '../../Btn/MainBtn';
import ModalBtn from '../../Btn/ModalBtn'
import DotTitle from '../../Title/DotTitle';
//hooks
import useChatGpt from '../../../hooks/useChatGpt';
//이미지
import arrow_icon from '../../../image/icon/arrows_icon.png'
import InnerLayer from '../../Styled/InnerLayer';
import InnerOverlay from '../../Styled/InnerOverlay';
import ChargeRiraModal from '../ChargeRiraModal';
import GptIngModal from './GptIngModal';
import { GPT_RESPONSE } from '../../../constants/gpt';
//생성(250106)
const GptRetocuhModal = ({ show, onHide, size, type, passage, optionList, setPassage, setOptionList }) => {
  const { retouchPassage, retouchOptions, gptAnswer, setGptAnswer, gptRes, gptStatus, gptProgress } = useChatGpt();
  const [request, setRequest] = useState('');
  const [isInnerModal, setIsInnerModal] = useState(false);
  const firstBtnStyles = { btnColor: "royalblue", hoverColor: "#3454d1" };
  //------함수부---------------------------------------------------
  //유효성 검사 
  const check = () => {
    let err = null;
    if (request === '') err = "요청사항을 적어주세요";
    return err;
  }
  //리터칭 요청
  const handleRetouchOnClick = ({ model, leftRira }) => {
    const err = check();
    if (err) { alert(err); return; } else {
      if (type === "passage") { retouchPassage(passage, request, model, leftRira) }
      else if (type === "options") { retouchOptions(optionList, request, model, leftRira) }
    }
  }
  //확인 클릭
  const handleConfirmOnClick = () => {
    const result = window.confirm("변경할까요?");
    if (!result) return;
    if (type === "passage") setPassage(gptAnswer);
    else if (type === "options") setOptionList(gptAnswer.split("</li>"));
    setGptAnswer('');
    setRequest('');
    onHide();
  }
  return (
    <Modal
      show={show}
      size={size || 'mid'}
      onHide={onHide}
      backdrop="static"
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white", }} closeButton>AI 리터칭</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef", borderRadius: "5px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <InnerCol>
          {type === "passage" && passage}
          {type === "options" && optionList.map((item, index) => <BasicText key={index}>{item}</BasicText>)}
        </InnerCol>
        {gptAnswer && <Column style={{ alignItems: "center" }}><img src={arrow_icon} width="20px" alt="변경" /></Column>}
        {gptAnswer && <InnerCol>
          {type === "passage" && gptAnswer}
          {type === "options" && gptAnswer.split("</li>").map((item, index) => <BasicText key={index}>{item}</BasicText>)}
        </InnerCol>}
        <Column>
          <DotTitle title={"요청 사항"} />
          <Textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        </Column>
        <MainBtn onClick={() => setIsInnerModal(true)}>AI 리터칭</MainBtn>
      </Modal.Body>
      {/* 내부 모달 */}
      {(isInnerModal || gptRes === GPT_RESPONSE.LOADING) && <InnerLayer>
        <InnerOverlay />
        <ChargeRiraModal
          show={isInnerModal}
          onHide={() => setIsInnerModal(false)}
          onApprove={handleRetouchOnClick}
        />
        <GptIngModal
          show={gptRes === GPT_RESPONSE.LOADING}
          status={gptStatus}
          progress={gptProgress}
        />
      </InnerLayer>}
      <Modal.Footer style={{ backgroundColor: "#efefef" }}>
        {gptAnswer !== '' && <ModalBtn styles={firstBtnStyles} onClick={handleConfirmOnClick}>{"확인"}</ModalBtn>}
        <ModalBtn onClick={onHide}>{"취소"}</ModalBtn>
      </Modal.Footer>
    </Modal>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const BasicText = styled.p`
  margin: 0;
`
const InnerCol = styled(Column)`
  border: 1px solid #919294;
  border-radius: 2px;
  padding: 5px;
`
const Textarea = styled.input`
	width: 100%;
	height: 5dvh;
	margin-top: 10px;
  border-radius: 5px;
  border: none;
`
export default GptRetocuhModal
