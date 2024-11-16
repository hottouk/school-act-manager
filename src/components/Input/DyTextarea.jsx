import React from 'react'
import styled from 'styled-components';
import CommonTextarea from '../CommonTextArea'
//2024.08.17(생성) 사용처 수행 
const DyTextarea = ({ number, titleList, valueList, onChange }) => {
  const placeHolderList = ["상 문구를 입력하세요", "중 문구를 입력하세요", "하 문구를 입력하세요", "최하 문구를 입력하세요"]
  const renderInputs = () => {
    const textareaList = [];
    for (let i = 0; i < number; i++) {
      textareaList.push(
        <React.Fragment key={i}>
          <CommonTextarea
            title={titleList[i]}
            type="text"
            value={valueList[i]}
            placeholder={placeHolderList[i]}
            onChange={(e) => onChange(e, i)} // 각 input 필드에서 onChange 호출
          />

        </React.Fragment>
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