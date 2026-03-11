import { CheckBox } from 'docx';
import React, { useState } from 'react'
import styled from 'styled-components';
//생성(260302)
const PurchaseListSection = ({
  purchaseList,
  setPurchaseList,
  isMulti,
  selectedList,
  setSelectedList
}) => {
  //오름 차순 정렬
  const [isAsc, setIsAsc] = useState(false);

  // **fn**
  const handleSortList = () => {
    setIsAsc(!isAsc);
    const sorted = isAsc
      ? purchaseList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      : purchaseList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setPurchaseList(sorted);
  };
  // 다중 선택
  const handleCheckToggle = (thisItem, checked) => {
    setSelectedList((prev) => {
      if (!checked) { return [...prev, thisItem]; }
      return prev.filter(item => item.orderId !== thisItem.orderId);
    });
  }
  return (
    <GirdTable>
      <GridWrapper>
        <Header>{!isMulti ? "연번" : "선택"}</Header>
        <Header
          onClick={handleSortList} style={{ cursor: "pointer" }}>
          {isAsc ? <p>일시 ▲</p> : <p>일시 ▼</p>}
        </Header>
        <Header>구매자</Header>
        <Header>구매번호</Header>
        <Header>구매명</Header>
        <Header>방법</Header>
        <Header>리라</Header>
      </GridWrapper>
      {purchaseList?.length > 0 && purchaseList.map((item, idx) => {
        const { uid, orderId, method, orderName, createdAt, totalAmount } = item;
        const date = createdAt?.toLocaleDateString("ko-KR");
        // check
        const isChecked = selectedList.some(item => item.orderId === orderId);
        return <GridWrapper key={idx}>
          <GirdItem>
            {!isMulti
              ? idx + 1
              : <input type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckToggle(item, isChecked)}
              />}
          </GirdItem>
          <GirdItem>{date}</GirdItem>
          <GirdItem>{uid}</GirdItem>
          <GirdItem>{orderId}</GirdItem>
          <GirdItem>{orderName}</GirdItem>
          <GirdItem>{method}</GirdItem>
          <GirdItem>{totalAmount.toLocaleString()}원</GirdItem>
        </GridWrapper>
      })}
    </GirdTable>
  )
}
const GirdTable = styled.div`
  width: 100%;
  display: grid;
  border-left: 1px solid #ddd;
  grid-template-columns: 60px 120px 2fr 2fr 1fr 100px 90px;
`
const GridWrapper = styled.div`
  display: contents;
`
const Row = styled.div`
  display: flex;
`
const Header = styled.div`
  display: flex;
  background-color: #3453d1b1;
  color: white;
  padding: 5px;
  font-weight: bold;
  justify-content: center;
  p { margin: 0; }
`
const GirdItem = styled(Row)`
  justify-content: center;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
`
export default PurchaseListSection