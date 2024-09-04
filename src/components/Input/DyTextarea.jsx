import React from 'react'
import styled from 'styled-components';
import CommonTextarea from '../CommonTextArea'
//2024.08.17(생성)
const DyTextarea = ({ number, titleList, valueList, onChange }) => {
  const placeHolderList = ["상 문구를 입력하세요", "중 문구를 입력하세요", "하 문구를 입력하세요", "최하 문구를 입력하세요"]
  const renderInputs = () => {
    const textareaList = [];
    for (let i = 0; i < number; i++) {
      textareaList.push(
        <CommonTextarea key={i}
          title={titleList[i]}
          type="text"
          value={valueList[i]}
          placeholder={placeHolderList[i]}
          onChange={(e) => onChange(e, i)} // 각 input 필드에서 onChange 호출
        />
      );
    }
    return textareaList;
  };

  return (
    <Container>
      {renderInputs()}
    </Container>
  )
}

const Container = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  input { 
    height: 35px;
    border-radius: 5px;
  }
`

export default DyTextarea