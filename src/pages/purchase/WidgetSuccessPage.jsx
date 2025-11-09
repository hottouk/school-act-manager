import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFireBasic from "../../hooks/Firebase/useFireBasic";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";
import MainBtn from "../../components/Btn/MainBtn";

const WidgetSuccessPage = () => {
  const user = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const [res, setRes] = useState(null);
  const TOSS_API_URL = process.env.REACT_APP_TOSS_PAYMENT_URL;
  const { fetchDoc, deleteData } = useFireBasic("paymentcheck");
  useEffect(() => {
    (async () => {
      try {
        setRes("결제 요청 무결성 검사");
        const req = await checkRequest();
        if (!req) return;
        setRes("승인 중");
        const data = await confirm(req);
        setResponseData(data);
        setRes(null);
      } catch (error) {
        deleteData(searchParams.get("orderId")); //임시 데이터 삭제
        setRes(null);
        alert(error);
        console.log(error);
        navigate(`/purchase/fail?message=${error}`);
      }
    })();
  }, [searchParams]);
  //무결성 체크
  const checkRequest = async () => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
      userId: user.uid
    };
    const temp = await fetchDoc(requestData?.orderId);
    console.log("임시 저장 결제 데이터", temp);
    console.log(requestData);
    if (!temp) throw new Error("서버에 저장된 결제 정보가 없습니다.");
    const { orderId, uid, amount } = temp;
    if (orderId !== requestData?.orderId) throw new Error("고유 주문 번호가 다릅니다.");
    if (amount.value !== Number(requestData?.amount)) throw new Error("결제 금액이 맞지 않습니다.");
    if (uid !== user.uid) throw new Error("사용자가 맞지 않습니다.");
    return requestData;
  }
  //승인 요청 
  const confirm = async (req) => {
    const response = await fetch(TOSS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(req),
    });
    console.log("응답", response);
    const json = await response.json();
    if (!response.ok) throw new Error(json.message);
    return json;
  }
  return (
    <Container>
      <Wrapper>
        <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" alt="결재 완료" style={{ alignSelf: "center" }} />
        <h2 style={{ textAlign: "center" }}>{res || "결제가 완료되었습니다"}</h2>
        {res && <Spinner style={{ alignSelf: "center" }} />}
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {`${searchParams.get("orderId")}`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
            {`${searchParams.get("paymentKey")}`}
          </div>
        </div>
      </Wrapper>
      <MainBtn onClick={() => { navigate('/'); }}>홈으로</MainBtn>
    </Container>
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
export default WidgetSuccessPage