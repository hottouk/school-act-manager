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

const Master = () => {
  const { fetchAllData } = useFireBasic("rira_ledger");
  const { addFieldToAllDocs } = useFireSchoolData();
  //사용 데이터
  const [riraLedgerList, setRiraLedgerList] = useState([]);
  const [searcyType, setSearcyType] = useState("uid");
  const selectOptions = [{ value: "uid", label: "uid" }, { value: "id", label: "구매번호" }]

  useEffect(() => {
    const bindRiraLedgerData = async () => {
      const data = await fetchAllData("rira_ledger");
      setRiraLedgerList(data);
    }
    bindRiraLedgerData();
  }, [fetchAllData]);

  return (
    <MainContainer>
      <MainWrapper styles={{ width: "85%" }}>
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