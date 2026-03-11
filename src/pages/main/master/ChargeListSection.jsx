import React, { useState } from 'react'
import styled from 'styled-components';
//생성(260301)
const ChargeListSection = ({
  riraLedgerList,
  setRiraLedgerList,
  isMulti,
  selectedList,
  setSelectedList,
}) => {
  // **fn*
  // 다중 선택
  const handleCheckToggle = (thisItem, checked) => {
    setSelectedList((prev) => {
      if (!checked) { return [...prev, thisItem]; }
      return prev.filter(item => item.id !== thisItem.id);
    });
  }
  return (
    <GirdTable>
      <GridWrapper>
        <Header>{!isMulti ? "연번" : "선택"}</Header>
        <Header>사용자id</Header>
        <Header>일련번호</Header>
        <Header>완료시간</Header>
        <Header>status</Header>
        <Header>반복</Header>
        <Header>사용</Header>
        <Header>모델</Header>
        <Header>환불사유</Header>
      </GridWrapper>
      {riraLedgerList?.length > 0 && riraLedgerList.map((item, idx) => {
        const { id, status, uid, kind, model, amount, reason, refundedAt, times, completedAt } = item;
        const completeDate = completedAt?.toLocaleDateString("ko-KR");
        const refundDate = refundedAt?.toLocaleDateString("ko-KR");
        const isChecked = selectedList.some((item) => item.id === id);
        return <GridWrapper key={id}>
          <GirdItem>
            {!isMulti
              ? idx + 1
              : <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckToggle(item, isChecked)}
              />
            }
          </GirdItem>
          <GirdItem>{uid}</GirdItem>
          <GirdItem>{id}</GirdItem>
          <GirdItem>{completeDate || refundDate}</GirdItem>
          <GirdItem>{status}</GirdItem>
          <GirdItem>{times}</GirdItem>
          <GirdItem>{amount}</GirdItem>
          <GirdItem>{model}</GirdItem>
          <GirdItem>{reason}</GirdItem>
        </GridWrapper>
      })}
    </GirdTable>
  )
}
const Row = styled.div`
  display: flex;
`
const GirdTable = styled.div`
  display: grid;
  border-left: 1px solid #ddd;
  grid-template-columns: 60px 1fr 1fr 100px 100px 50px 50px 100px 100px;
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
const GirdItem = styled(Row)`
  justify-content: center;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
`
export default ChargeListSection
