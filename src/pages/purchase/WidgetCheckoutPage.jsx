import { loadTossPayments, } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import WidgetCheckout from "../../components/Toss/WidgetCheckout";
// TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
// TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = generateRandomString();
function generateRandomString() { return window.btoa(Math.random().toString()).slice(0, 20); }
const WidgetCheckoutPage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <WidgetCheckout />
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
`
export default WidgetCheckoutPage