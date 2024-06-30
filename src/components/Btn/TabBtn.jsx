import React, { useState } from 'react';
import styled from 'styled-components';

function TabBtn(props) {
  const [sampleTab, setSampleTab] = useState("1")
  // 1부터 9까지의 숫자 배열 생성
  const tabSamples = Array.from({ length: 9 }, (_, index) => index + 1);

  const handleTabClick = (item) => {
    // setSampleTab(item);
    props.setActiveTab(item);
  };

  return (
      <Container>
        {!props.tabItems && tabSamples.map((item, index) => {
          return <StyledTabBtn
            key={`${item}${index}`}
            className={`tab-button ${sampleTab === item ? 'active' : ''}`}
            onClick={() => handleTabClick(item)}
          >{item}</StyledTabBtn>
        })}
        {props.tabItems && props.tabItems.map((tabItem, index) => {
          return <StyledTabBtn
            key={`${tabItem}${index}`}
            className={`${props.activeTab === tabItem ? 'active' : ''}`}
            onClick={() => handleTabClick(tabItem)}
          >{tabItem}</StyledTabBtn>
        })}
      </Container>
  );
}

const Container = styled.div`
  display: flex;
  margin: 10px auto;
  justify-content: center;
  align-items: center;
`

const Title = styled.h4`
  display: inline-block;
  margin-right: 25px;
  margin-bottom: 0;
`

const StyledTabBtn = styled.button`
  background-color: #fff;
  border: 1px solid #ccc;
  height: 45px;
  margin-right: -1px; /* 가운데 줄이 두껍지 않도록 음수 margin 사용 */
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #e0e0e0;
  }
  &.active {
    background-color: #ccc;
  }
  &:first-of-type { //type을 적용한 이유는 앞에 p테그가 있기 때문임.
    border-top-left-radius: 5px; /* 첫 버튼의 좌측 상단 모서리 둥글게 */
    border-bottom-left-radius: 5px; /* 첫 버튼의 좌측 하단 모서리 둥글게 */
  }
  &:last-child {
    border-top-right-radius: 5px; /* 마지막 버튼의 우측 상단 모서리 둥글게 */
    border-bottom-right-radius: 5px; /* 마지막 버튼의 우측 하단 모서리 둥글게 */
  }
`

export default TabBtn;