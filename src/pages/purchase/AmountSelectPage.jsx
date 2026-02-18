import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
//컴포넌트
import MyinfoSection from '../../components/section/MyinfoSection';
import AmountSection from './AmountSection';
import MainContainer from '../../components/Styled/MainContainer';
import MainWrapper from '../../components/Styled/MainWrapper';
import UpperTab from '../../components/UpperTab';
import DotTitle from '../../components/Title/DotTitle';
import Title from '../../components/Title/Title';
import SmallBtn from '../../components/Btn/SmallBtn';
//hooks
import { callEnrollCoupon } from '../../firebase/config';
import useFireBasic from '../../hooks/Firebase/useFireBasic';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
//이미지
import riraImg from '../../image/money.png';
//생성(251019)
const AmountSelectPage = () => {
  const { userRtData, userDataListener, } = useFireUserData();
  useEffect(() => { userDataListener(); }, []);
  useEffect(() => { if (userRtData) { setRira(userRtData.rira || 0); } }, [userRtData]);
  const [rira, setRira] = useState(0);
  const [tab, setTab] = useState(1); //1:충전, 2:충전내역
  const [chargeList, setChargeList] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const { fetchData } = useFireBasic("purchases");
  useEffect(() => { bindChargeData(); }, []);
  //**함수부
  //충전내역 binding
  const bindChargeData = async () => {
    const list = await fetchData("uid");
    setChargeList(list);
  };
  //쿠폰 등록 기능
  const handleCouponOnClick = async () => {
    if (!couponCode) { alert("쿠폰 코드를 입력해주세요."); return; }
    try {
      const generateRandomString = () => window.btoa(Math.random().toString()).slice(0, 20);
      await callEnrollCoupon({ uid: userRtData?.uid, couponCode: couponCode, orderId: generateRandomString() });
      alert("쿠폰이 등록되었습니다.");
      setCouponCode("");
    } catch (err) {
      alert("쿠폰 등록에 실패했습니다.", err);
    }
  };
  return (
    <MainContainer styles={{ gap: "10px", paddingTop: "20px" }}>
      <MainWrapper styles={{ width: "65%", gap: "15px", position: "relative", margin: "35px 0 0" }}>
        <Row style={{ position: "absolute", top: "-35px", left: "15px", }}>
          <UpperTab className={"tab1"} value={tab} onClick={() => setTab(1)}>충전</UpperTab>
          <UpperTab className={"tab2"} value={tab} onClick={() => setTab(2)}>충전 내역</UpperTab>
        </Row>
        {tab === 1 && <AmountSection />}
        {tab === 2 && <div>
          <Title style={{ fontSize: "20px", paddingBottom: "10px", }}>충전 내역</Title>
          {chargeList?.length === 0 && <p>충전 내역이 없습니다.</p>}
          <TableContainer>
            <TableRow>
              <b>주문번호</b>
              <b>금액</b>
              <b>수단</b>
              <b>충전일</b>
            </TableRow>
            {chargeList?.length > 0 && chargeList.map((charge) => {
              return (<TableRow key={charge.orderId}>
                <p>{charge.orderId}</p>
                <p>{charge.totalAmount.toLocaleString()}원</p>
                <p>{charge.method}</p>
                <p>{charge.createdAt.toDate().toLocaleString()}</p>
              </TableRow>);
            })}
          </TableContainer>
        </div>}
      </MainWrapper>
      <MainWrapper styles={{ width: "65%" }}>
        <MyinfoSection userRtData={userRtData} />
      </MainWrapper>
      <MainWrapper styles={{ width: "65%" }}>
        <BasicText style={{ textAlign: "center" }}>현재 리라</BasicText>
        <Row style={{ justifyContent: "center" }}>
          <img src={riraImg} alt="리라 아이콘" style={{ width: "40px", height: "40px" }} />
          <h4 style={{ fontSize: "28px", textAlign: "center", fontWeight: "bold" }}>{rira.toLocaleString()} 리라</h4>
        </Row>
      </MainWrapper>
      <MainWrapper styles={{ width: "65%" }}>
        <Row style={{ gap: "10px" }}>
          <DotTitle>쿠폰</DotTitle>
          <TextInput type="text" placeholder="쿠폰 코드를 입력하세요" onChange={(e) => setCouponCode(e.target.value)} />
          <SmallBtn onClick={handleCouponOnClick}>등록</SmallBtn>
        </Row>
      </MainWrapper>
      <MainWrapper styles={{ width: "65%" }}>
        <BasicText>※결제 금액은 리라와 1:1비율로 전환되어 충전됩니다.</BasicText>
        <BasicText>※모든 리라의 사용은 1년간 유효하며, 1년이 지나면 자동으로 소멸됩니다.</BasicText>
      </MainWrapper>
    </MainContainer >
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const TableContainer = styled.div`
  display:grid;
  grid-template-columns: repeat(4, 1fr);
`
const TableRow = styled.div`
  display: contents;
`
const TextInput = styled.input`
  flex-grow: 1;
  margin-left: 10px;
  height: 30px;
  border-radius: 5px;     
  border: 1px solid #ccc;
  padding: 0 10px;       
`
const BasicText = styled.p`
  margin: 0;
`
export default AmountSelectPage
