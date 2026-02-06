import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
//컴포넌트
import WidgetCheckout from "../../components/Toss/WidgetCheckout";
//hooks
import useFetchRtMyUserData from "../../hooks/RealTimeData/useFetchRtMyUserData";
import MainContainer from "../../components/Styled/MainContainer";
import MainWrapper from "../../components/Styled/MainWrapper";
//생성(251020)
const WidgetCheckoutPage = () => {
  const location = useLocation();
  const [amount, setAmount] = useState(5000);
  useEffect(() => {
    if (!location) return;
    setAmount(location.state);
  }, [location]);
  const { myUserData } = useFetchRtMyUserData();
  return (
    <MainContainer styles={{ gap: "10px", paddingTop: "20px" }}>
      <MainWrapper styles={{ width: "65%" }}>
        <Title>결제 금액</Title>
        <BasicText style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center" }}>{amount.toLocaleString()}원</BasicText>
      </MainWrapper>
      <MainWrapper styles={{ width: "65%" }}>
        <WidgetCheckout customerKey={myUserData?.uid} name={myUserData?.name} payment={{ currency: "KRW", value: amount }} />
      </MainWrapper>
    </MainContainer >
  );
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const Title = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`
const BasicText = styled.p`
  margin: 0;
`

export default WidgetCheckoutPage