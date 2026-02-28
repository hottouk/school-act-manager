//라이브러리
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Select from 'react-select';
//hooks
import useMasterTool from '../../hooks/useMasterTool'
import useFireSchoolData from '../../hooks/Firebase/useFireSchoolData'
import MainContainer from '../../components/Styled/MainContainer'
import MainWrapper from '../../components/Styled/MainWrapper'
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import SearchBar from '../../components/Bar/SearchBar'
import UpperTabs from '../../components/UpperTabs';

const Master = () => {
  const { fetchAllData } = useFireBasic("rira_ledger");
  const { addFieldToAllDocs } = useFireSchoolData();
  //사용 데이터
  const [riraLedgerList, setRiraLedgerList] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [searcyType, setSearcyType] = useState("uid");
  const selectOptions = [{ value: "uid", label: "uid" }, { value: "id", label: "구매번호" }]
  const [tab, SetTab] = useState(0);
  useEffect(() => {
    const bindRiraLedgerData = async () => {
      const data = await fetchAllData("rira_ledger");
      setRiraLedgerList(data);
    }
    const bindPurchasesData = async () => {
      const data = await fetchAllData("purchases");
      setPurchaseList(data);
    }
    if (tab === 0) bindPurchasesData();
    if (tab === 1) bindRiraLedgerData();
  }, [fetchAllData, tab]);

  return (
    <MainContainer>
      <MainWrapper styles={{ position: "relative", width: "85%", margin: "30px auto" }}>
        <UpperTabs
          top={"-20px"}
          selectedIdx={tab}
          tabList={["구매내역", "사용내역"]}
          onClick={SetTab}
        />
        {tab === 0 && <>
          <GirdTable>
            <GridWrapper>
              <Header>연번</Header>
              <Header>uid</Header>
              <Header>구매번호</Header>
              <Header>구매명</Header>
              <Header>방법</Header>
              <Header>통화</Header>
              <Header>반복횟수</Header>
              <Header>사용리라</Header>
              <Header>-</Header>
              <Header>-</Header>
            </GridWrapper>
            {purchaseList?.length > 0 && purchaseList.map((item, idx) => {
              const { uid, orderId, method, orderName, currency, createdAt, totalAmount } = item;
              return <GridWrapper key={idx}>
                <GirdItem>{idx + 1}</GirdItem>
                <GirdItem>{uid}</GirdItem>
                <GirdItem>{orderId}</GirdItem>
                <GirdItem>{orderName}</GirdItem>
                <GirdItem>{method}</GirdItem>
                <GirdItem>{currency}</GirdItem>
                <GirdItem>{totalAmount}</GirdItem>
                <GirdItem>{"-"}</GirdItem>
                <GirdItem>{"-"}</GirdItem>
                <GirdItem>{"-"}</GirdItem>
              </GridWrapper>
            })}
          </GirdTable>
        </>}
        {tab === 1 && <>
          <Row style={{ gap: "10px", justifyContent: "center" }}>
            <SearchBar type={searcyType} list={riraLedgerList} setList={setRiraLedgerList} />
            <Select options={selectOptions} onChange={(event) => setSearcyType(event.value)} />
          </Row>
          <GirdTable>
            <GridWrapper>
              <Header>연번</Header>
              <Header>uid</Header>
              <Header>구매번호</Header>
              <Header>완료시간</Header>
              <Header>status</Header>
              <Header>kind</Header>
              <Header>반복횟수</Header>
              <Header>사용리라</Header>
              <Header>사용모델</Header>
              <Header>환불사유</Header>
            </GridWrapper>
            {riraLedgerList?.length > 0 && riraLedgerList.map((item, idx) => {
              const { id, status, uid, kind, model, amount, reason, refundedAt, times, completedAt } = item;
              const completeDate = completedAt?.toLocaleDateString("ko-KR");
              const refundDate = refundedAt?.toLocaleDateString("ko-KR");
              return <GridWrapper key={id}>
                <GirdItem>{idx + 1}</GirdItem>
                <GirdItem>{uid}</GirdItem>
                <GirdItem>{id}</GirdItem>
                <GirdItem>{completeDate || refundDate}</GirdItem>
                <GirdItem>{status}</GirdItem>
                <GirdItem>{kind}</GirdItem>
                <GirdItem>{times}</GirdItem>
                <GirdItem>{amount}</GirdItem>
                <GirdItem>{model}</GirdItem>
                <GirdItem>{reason}</GirdItem>
              </GridWrapper>
            })}
          </GirdTable>
        </>}
      </MainWrapper>
    </MainContainer >
  )
}

const Row = styled.div`
  display: flex;
`
const GridWrapper = styled.div`
  display: contents;
`
const Header = styled.div`
  display: flex;
  background-color: #3453d1a1;
  color: white;
  padding: 5px;
  font-weight: bold;
  justify-content: center;
`
const GirdTable = styled.div`
  display: grid;
  border-left: 1px solid #ddd;
  grid-template-columns: 60px 400px  1fr 100px 100px 100px 100px 100px 100px 100px;
`
const GirdItem = styled(Row)`
  justify-content: center;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
`


export default Master