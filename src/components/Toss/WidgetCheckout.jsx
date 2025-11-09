import { loadTossPayments, } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import styled from "styled-components";
import MainBtn from "../Btn/MainBtn";
import useFireBasic from "../../hooks/Firebase/useFireBasic";
// TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
// TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
// 난수 생성
const generateRandomString = () => { return window.btoa(Math.random().toString()).slice(0, 20); }
const WidgetCheckout = ({ payment, customerKey, name, }) => {
	const [ready, setReady] = useState(false);
	const [widgets, setWidgets] = useState(null);
	const { setData, deleteData } = useFireBasic("paymentcheck");
	useEffect(() => {
		const fetchPaymentWidgets = async () => {
			if (!customerKey) return;
			try {
				const tossPayments = await loadTossPayments(clientKey);
				const widgets = tossPayments.widgets({ customerKey });
				setWidgets(widgets);
			} catch (error) {
				console.error("Error fetching payment widget:", error);
			}
		}
		fetchPaymentWidgets();
	}, [clientKey, customerKey]);

	useEffect(() => {
		async function renderPaymentWidgets() {
			if (widgets == null) return;
			// ------  주문서의 결제 금액 설정 ------
			// TODO: 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
			// TODO: renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
			// @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
			await widgets.setAmount(payment);
			await Promise.all([
				// ------  결제 UI 렌더링 ------
				// @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
				widgets.renderPaymentMethods({
					selector: "#payment-method",
					// 렌더링하고 싶은 결제 UI의 variantKey
					// @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
					variantKey: "DEFAULT",
				}),
				// ------  이용약관 UI 렌더링 ------
				// @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderagreement
				widgets.renderAgreement({
					selector: "#agreement",
					variantKey: "AGREEMENT",
				}),
			]);
			setReady(true);
		}
		renderPaymentWidgets();
	}, [widgets]);

	// ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
	// @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
	const handleOnClick = async () => {
		const orderId = generateRandomString();
		try {
			// 결제 요청 전에 orderId, amount를 서버에 임시 저장. 무결성 확인 용도
			const amount = payment;
			await setData({ orderId, amount }, orderId);
			await widgets.requestPayment({
				orderId: orderId, // 고유 주문 번호
				orderName: `${amount.value}리라 포인트`,
				successUrl: window.location.origin + "/purchase/success", // 결제 요청 성공 리다이렉트되는 URL
				failUrl: window.location.origin + "/purchase/fail", // 결제 요청 실패 리다이렉트되는 URL
				customerName: name,
				// 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
				// customerMobilePhone: "01012341234",
			});
		} catch (error) {
			// 에러 처리하기
			console.error(error);
			await deleteData(orderId);
		}
	}

	return (
		<Container>
			<div className="wrapper">
				<div className="box_section">
					{/* 결제 UI */}
					<div id="payment-method" />
					{/* 이용약관 UI */}
					<div id="agreement" />
					{/* 쿠폰 체크박스 */}
					{/* <div T={{ paddingLeft: "30px" }}>
						<div className="checkable typography--p">
							<label htmlFor="coupon-box" className="checkable__label typography--regular">
								<input
									id="coupon-box"
									className="checkable__input"
									type="checkbox"
									aria-checked="true"
									disabled={!ready}
									// ------  주문서의 결제 금액이 변경되었을 경우 결제 금액 업데이트 ------
									// @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
									onChange={async (event) => {
										if (event.target.checked) {
											await widgets.setAmount({
												currency: amount.currency,
												value: amount.value - 5000,
											});
											return;
										}
										await widgets.setAmount({
											currency: amount.currency,
											value: amount.value,
										});
									}}
								/>
								<span className="checkable__label-text">5,000원 쿠폰 적용</span>
							</label>
						</div>
					</div> */}
				</div>
				{/* 결제하기 버튼 */}
			</div>
			<MainBtn
				disabled={!ready}
				onClick={handleOnClick}
			>결제하기</MainBtn>
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
	border-radius: 6px;
	background-color: white;
	padding: 15px;
`
export default WidgetCheckout