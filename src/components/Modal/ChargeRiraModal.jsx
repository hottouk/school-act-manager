import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import Select from 'react-select';
import styled from 'styled-components';
//컴포넌트  
import ModalBtn from '../Btn/ModalBtn';
import DotTitle from '../Title/DotTitle';
//hooks
import useFireUserData from '../../hooks/Firebase/useFireUserData';
//이미지
import icon_ria from '../../image/money.png';
//생성(260106)
const ChargeRiraModal = ({ show, onHide, onApprove, onCancel }) => {
  const user = useSelector(({ user }) => user);
  const { userDataListener } = useFireUserData();
  const { TempDeductRira } = useFireUserData();
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => { userDataListener(user.uid, setUserInfo) }, []);
  //셀렉터
  const [selectedModel, setSelectedModel] = useState(null);
  const gptOptionList = [
    {
      label: "gpt5.1", value: "gpt-5.1_test_question", des: "gpt 범용 모델 중 최고 성능인 gpt-5.2의 바로 이전 모델입니다, 보다 저렴한 가격으로 최고 수준의 성능을 냅니다.", price: 70,
      recommend: "함축 의미, 심경/분위기, 어휘 밑줄, 빈칸 추론, 무관한 문장, 요약 등의 정교한 시험 문항 출제, 세특 개별화 문구 작성 시"
    },
    {
      label: "gpt-5-mini", value: "gpt-5-mini_test_question", des: "gpt5.1 보다 더 빠르고 가성비 좋은 추론형 모델입니다. 간단한 수능, 내신형 시험 문제 출제에는 충분한 성능입니다.", price: 20,
      recommend: "주제, 제목, 요지, 글의 목적, 내용 일치/불일치 등 기본적인 시험 문항 출제, 세특 기본 문구 작업 시"
    }
  ];
  const handleOnCancleClick = () => {
    setSelectedModel(null);
    onCancel();
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      keyboard={false}
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }}>리라 결제</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef", borderRadius: "5px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Select
          options={gptOptionList}
          onChange={(event) => setSelectedModel(event)}
          placeholder={"GPT 모델 선택"}
        />
        <Column>
          <DotTitle>모델 소개</DotTitle>
          {selectedModel &&
            <WhiteWrapper>
              {selectedModel.des}
              <span>추천 작업: <Highlight>{selectedModel.recommend}</Highlight></span>
            </WhiteWrapper>}
        </Column>
        <DotTitle>결제 정보</DotTitle>
        {selectedModel && <WhiteWrapper>
          <Row style={{ justifyContent: "space-between" }}>
            나의 리라
            <div>
              <img src={icon_ria} alt="rira" width="20px" />
              {userInfo.rira?.toLocaleString()}
            </div>
          </Row>
          <Row style={{ justifyContent: "space-between" }}>
            gpt 사용료
            <div>
              - <img src={icon_ria} alt="rira" width="20px" />
              {selectedModel?.price?.toLocaleString()}
            </div>
          </Row>
          <Row style={{ borderTop: "1px dotted black", justifyContent: "space-between", paddingTop: "15px" }}>
            결제 후 리라 잔액
            <div>
              <img src={icon_ria} alt="rira" width="20px" />
              {(userInfo.rira - selectedModel?.price)?.toLocaleString()}
            </div>
          </Row>
        </WhiteWrapper>}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }}>
        <ModalBtn
          onClick={() => {
            console.log("결제 모델:", selectedModel);
            TempDeductRira(selectedModel?.price);
            onApprove();
            onHide();
          }}
          styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }}>승인</ModalBtn>
        <ModalBtn onClick={handleOnCancleClick}>취소</ModalBtn>
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
const WhiteWrapper = styled(Column)`
  margin-top: 10px;
  background-color: white;
  padding: 10px;
  gap: 10px;
  white-space: pre-wrap;
`
const Highlight = styled.span`
  font-weight: 500;
  color: #3454d1;
  font-style: italic;
`

export default ChargeRiraModal
