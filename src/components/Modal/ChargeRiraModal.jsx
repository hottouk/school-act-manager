import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import Select from 'react-select';
import styled from 'styled-components';
//컴포넌트  
import ModalBtn from '../Btn/ModalBtn';
import DotTitle from '../Title/DotTitle';
//hooks
import useFireUserData from '../../hooks/Firebase/useFireUserData';
//상수
import { GPT_OPTION_LIST } from '../../constants/gptMode';
//이미지
import icon_ria from '../../image/money.png';
//생성(260106)
const ChargeRiraModal = ({ show, onHide, onApprove, isMulti, multiList }) => {
  const user = useSelector(({ user }) => user);
  const { userDataListener } = useFireUserData();
  useEffect(() => { userDataListener(user.uid, setUserInfo) }, [user.uid]);
  const [userInfo, setUserInfo] = useState(null);
  //다수
  const multiInterface = isMulti && multiList;
  //모델, 가격
  const [_selectedModel, setSelectedModel] = useState(null);
  //------useMemo------------------------------------------------ 
  //가격
  const bindPriceByModel = (model) => {
    if (!_selectedModel) return;
    if (!multiInterface) return _selectedModel.price;
    else return (_selectedModel.price * multiList.length);
  }
  const priceByModel = useMemo(() => bindPriceByModel(_selectedModel), [_selectedModel]);
  //------함수부------------------------------------------------ 
  //유효성 검사 
  const check = () => {
    if (!userInfo) { alert("잘못된 접근입니다."); return false; }
    if (!_selectedModel) { alert("모델을 선택해주세요"); return false; }
    const curRira = userInfo.rira || 0;
    if (curRira < priceByModel) { alert("리라가 부족합니다."); return false; }
    const leftRira = curRira - priceByModel;
    return { leftRira, result: true }
  }
  //승인
  const handleApproveOnClick = () => {
    const { result, leftRira } = check();
    if (!result) return;
    onApprove(_selectedModel?.value, leftRira);
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
        <DotTitle>결제 정보</DotTitle>
        {_selectedModel && <WhiteWrapper>
          <Row style={{ justifyContent: "space-between" }}>
            나의 리라
            <div>
              <img src={icon_ria} alt="rira" width="20px" />
              {userInfo.rira?.toLocaleString()}
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
              {(userInfo.rira - priceByModel)?.toLocaleString()}
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
