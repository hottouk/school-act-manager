import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
//컴포넌트
import DyRadios from '../../components/Radio/DyRadios'
import MainBtn from '../../components/Btn/MainBtn';
//hooks
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData';
import MainWrapper from '../../components/Styled/MainWrapper';
//생성(251019)
const AmountSelectPage = () => {
  const navigate = useNavigate();
  const { myUserData } = useFetchRtMyUserData();
  useEffect(() => {
    if (!myUserData) return;
    setRira(myUserData.rira ?? 0);
  }, [myUserData]);
  const [rira, setRira] = useState(0);
  const [_amount, setAmount] = useState(5000);
  //------함수부---------------------------------------------------  
  const handleOnClick = () => {
    navigate("widget", { state: _amount });
  }
  const handleRadioOnChange = (event) => {
    setAmount(Number(event.target.value));
  }

  return (
    <Container>
      <MainWrapper styles={{ width: "65%" }}>
        <h4 style={{ fontSize: "20px" }}>회원 정보</h4>
        <p>고유번호: {myUserData?.uid ?? "에러, 다시 시도 바랍니다."}</p>
        <p>성함: {myUserData?.name ?? "로딩"}</p>
        <p>회원구분: {myUserData?.isTeacher ? "교사 회원" : "학생 회원"} </p>
      </MainWrapper>
      <MainWrapper styles={{ width: "65%" }}>
        <BasicText style={{ textAlign: "center" }}>현재 리라</BasicText>
        <h4 style={{ fontSize: "28px", textAlign: "center", fontWeight: "bold" }}>{rira.toLocaleString()} 리라</h4>
      </MainWrapper>
      <MainWrapper styles={{ width: "65%" }}>
        <h4 style={{ fontSize: "20px" }}>결제 금액</h4>
        <DyRadios
          name="amount_radio"
          labelList={[5000, 10000, 20000, 30000, 40000, 50000]}
          unit={"원"}
          value={_amount}
          onChange={(event) => { handleRadioOnChange(event) }} />
        <MainBtn onClick={handleOnClick} styles={{ margin: "20px 0 0 0" }}>다음 단계로</MainBtn>
      </MainWrapper>
      <p>※결제 금액과 리라는 1:1의 비율로 치환됩니다.</p>
    </Container>
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
const Container = styled(Column)`
  box-sizing: border-box;
  background-color : #efefef;
  min-height: 100dvh;
  align-items: center;
  gap: 10px;
`
export default AmountSelectPage
