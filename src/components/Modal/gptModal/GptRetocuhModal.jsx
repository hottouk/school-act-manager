import React, { useState } from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import styled from 'styled-components';
//컴포넌트
import MainBtn from '../../Btn/MainBtn';
import ModalBtn from '../../Btn/ModalBtn'
import DotTitle from '../../Title/DotTitle';
//hooks
import useChatGpt from '../../../hooks/useChatGpt';
//이미지
import arrow_icon from '../../../image/icon/arrows_icon.png'
//생성(250106)
const GptRetocuhModal = ({ show, onHide, size, type, passage, optionList, setPassage, setOptionList, retocuhCount, setRetouchCount }) => {
  const { retouchPassage, retouchOptions, gptAnswer, setGptAnswer, gptRes } = useChatGpt();
  const [request, setRequest] = useState('');
  const firstBtnStyles = { btnColor: "royalblue", hoverColor: "#3454d1" };
  //------함수부---------------------------------------------------
  //유효성 검사 
  const check = () => {
    let err = null;
    if (request === '') err = "요청사항을 적어주세요";
    return err;
  }
  //리터칭 요청
  const handleRetouchOnClick = () => {
    const err = check();
    if (err) { alert(err); return; } else {
      const result = window.confirm("AI 리터칭을 사용할까요? 리터칭 횟수가 1회 차감됩니다.");
      if (!result) return;
      if (retocuhCount <= 0) { alert("리터칭 횟수가 부족합니다."); return; }
      setRetouchCount(retocuhCount - 1);
      if (type === "passage") { retouchPassage(passage, request) }
      else if (type === "options") { retouchOptions(optionList, request) }
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
        <Row>
          <DotTitle title={"리터칭 횟수"} />{retocuhCount} 회 남음
        </Row>
        <Column>
          <DotTitle title={"요청 사항"} />
          <TextInput value={request} onChange={(event) => setRequest(event.target.value)} disabled={gptRes === "loading"} />
        </Column>
        {gptRes === "loading"
          ? <Column style={{ alignItems: "center" }}><Spinner /> </Column>
          : <MainBtn onClick={handleRetouchOnClick}>AI 리터칭</MainBtn>}
      </Modal.Body>
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
const TextInput = styled.input`
	width: 100%;
	height: 3dvh;
	margin-top: 10px;
`
export default GptRetocuhModal
