import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import styled from 'styled-components';
//컴포넌트  
import ModalBtn from '../Btn/ModalBtn';
import DotTitle from '../Title/DotTitle';
import SpectrumSelector from '../commons/SpectrumSelector';
//hooks
import useFireUserData from '../../hooks/Firebase/useFireUserData';
//상수
import { GPT_OPTION_LIST } from '../../constants/gpt';
//이미지
import icon_ria from '../../image/money.png';
//생성(260106)
const ChargeRiraModal = ({ show, onHide, onApprove, isMulti, multiList, }) => {

  //유저 정보
  const { userRtData, userDataListener } = useFireUserData();
  useEffect(() => { userDataListener() }, [userDataListener]);
  const userRira = useMemo(() => { //유저 리라
    if (!userRtData) return 0;
    return userRtData.rira || 0;
  }, [userRtData])
  //다수
  const multiInterface = isMulti && multiList;
  // 모델 가격
  const [_selectedModel, setSelectedModel] = useState(null);
  const priceByModel = useMemo(() => {
    if (!_selectedModel) return;
    if (!multiInterface) return _selectedModel.price;
    else return (_selectedModel.price * multiList.length);
  }, [_selectedModel, multiInterface, multiList]);
  // 추론/길이
  const THINK_EFFORT_OPTIONS = [
    { label: "낮음", value: "low" },
    { label: "중간", value: "medium" },
    { label: "높음", value: "high" },
  ];
  const VERBOSITY_OPTIONS = [
    { label: "낮음", value: "low" },
    { label: "중간", value: "medium" },
    { label: "높음", value: "high" },
  ];
  const [thinkEffort, setThinkEffort] = useState("low");
  const [verbosity, setVerbosity] = useState("medium");
  //**함수부**
  //유효성 검사 
  const check = () => {
    if (!userRtData) { alert("잘못된 접근입니다."); return false; }
    if (!_selectedModel) { alert("모델을 선택해주세요"); return false; }
    const curRira = userRtData.rira || 0;
    if (curRira < priceByModel) { alert("리라가 부족합니다."); return false; }
    const leftRira = curRira - priceByModel;
    return { leftRira, ok: true }
  }
  //승인
  const handleApproveOnClick = async () => {
    const result = check();
    if (!result.ok) return;
    const commonPayload = {
      model: _selectedModel.value,
      thinkEffort,
      verbosity,
      leftRira: result.leftRira,
    };
    await onApprove(commonPayload);
    onHide();
  }
  //취소
  const handleCancelOnClick = () => {
    setSelectedModel(null);
    onHide();
  }
  return (<>
    <Modal
      show={show}
      onHide={onHide}
      keyboard={false}
      backdrop={'static'}
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }}>{multiInterface ? "다중 리라 결제" : "리라 결제"}</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef", borderRadius: "5px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {multiInterface && <Column>
          <DotTitle>인원 정보</DotTitle>
          {multiList.length}명을 선택하셨습니다.
        </Column>}
        <Select
          options={GPT_OPTION_LIST}
          onChange={(event) => setSelectedModel(event)}
          placeholder={"GPT 모델 선택"}
        />
        <Column>
          <DotTitle>모델 소개</DotTitle>
          {_selectedModel &&
            <WhiteWrapper>
              {_selectedModel.des}
              <span>추천 작업: <Highlight>{_selectedModel.recommend}</Highlight></span>
            </WhiteWrapper>}
        </Column>
        {_selectedModel && <>
          <DotTitle>추론 정도</DotTitle>
          <SpectrumSelector options={THINK_EFFORT_OPTIONS} value={thinkEffort} setValue={setThinkEffort} />
          <DotTitle>생성 길이</DotTitle>
          <SpectrumSelector options={VERBOSITY_OPTIONS} value={verbosity} setValue={setVerbosity} />
        </>}
        <DotTitle>결제 정보</DotTitle>
        {_selectedModel && <WhiteWrapper>
          <Row style={{ justifyContent: "space-between" }}>
            나의 리라
            <div>
              <img src={icon_ria} alt="rira" width="20px" />
              {userRira?.toLocaleString()}
            </div>
          </Row>
          <Row style={{ justifyContent: "space-between" }}>
            gpt 사용료
            <Row>
              - <img src={icon_ria} alt="rira" width="20px" />
              {!multiInterface && priceByModel.toLocaleString()}
              {multiInterface && <>
                {_selectedModel.price.toLocaleString()}
                <span> x {multiList?.length} = </span>
                {priceByModel.toLocaleString()}
              </>}
            </Row>
          </Row>
          <Row style={{ borderTop: "1px dotted black", justifyContent: "space-between", paddingTop: "15px" }}>
            결제 후 리라 잔액
            <div>
              <img src={icon_ria} alt="rira" width="20px" />
              {(userRira - priceByModel)?.toLocaleString()}
            </div>
          </Row>
        </WhiteWrapper>}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }}>
        <ModalBtn
          onClick={handleApproveOnClick}
          styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }}>승인</ModalBtn>
        <ModalBtn onClick={handleCancelOnClick}>취소</ModalBtn>
      </Modal.Footer>
    </Modal>
  </>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const WhiteWrapper = styled(Column)`
  background-color: white;
  margin-top: 10px;
  padding: 10px;
  gap: 10px;
  border-radius: 5px;
  white-space: pre-wrap;
`
const Highlight = styled.span`
  font-weight: 500;
  color: #3454d1;
  font-style: italic;
`
export default ChargeRiraModal
