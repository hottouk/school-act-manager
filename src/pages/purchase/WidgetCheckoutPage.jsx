import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
//컴포넌트
import WidgetCheckout from "../../components/Toss/WidgetCheckout";
//hooks
import useFetchRtMyUserData from "../../hooks/RealTimeData/useFetchRtMyUserData";
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
    <Container>
      <AmWrapper>
        <h4 style={{ fontSize: "20px", fontWeight: "bold" }}>결제 금액</h4>
        <BasicText style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center" }}>{amount.toLocaleString()}원</BasicText>
      </AmWrapper>
      <Wrapper>
        <WidgetCheckout customerKey={myUserData?.uid} name={myUserData?.name} payment={{ currency: "KRW", value: amount }} />
      </Wrapper>
    </Container >
  );
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const Container = styled(Column)`
  box-sizing: border-box;
  background-color : #efefef;
  min-height: 100dvh;
  align-items: center;
  gap: 10px;
`
const Wrapper = styled(Column)`
  width: 60%;
  background-color: white;
  border-radius: 6px;
  padding: 15px;
`
const AmWrapper = styled(Wrapper)`
  padding: 30px;
`
const BasicText = styled.p`
  margin: 0;
`

export default WidgetCheckoutPage