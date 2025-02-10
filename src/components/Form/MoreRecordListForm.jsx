import React from 'react'
import styled from 'styled-components'
import SmallBtn from '../Btn/SmallBtn'
//2024.08.15(생성)
const MoreRecordListForm = ({ moreRecList, noListText, isBtnShown, btnOnClick }) => {
  //isBtnShown 검사식: 본인이 만든 활동만 가능 && 퍼온 활동이 아닌 경우만 가능
  return (
    <Container>
      <InputWrapper>
        {moreRecList && moreRecList.length > 0 ? (
          moreRecList.map((extraRec) => {
            return <StyledInput type="text" value={extraRec} disabled key={extraRec} />;
          })
        ) : (
          <p>{noListText || "샘플"}</p>
        )}
      </InputWrapper>
      <BtnWrapper>
        {isBtnShown && <SmallBtn id="extra_Rbtn" btnName="설정" btnColor="rgba(52,84,209,0.8)" hoverBtnColor="#3454d1" margin="0 10px" btnOnClick={btnOnClick} />}
      </BtnWrapper>
    </Container>
  )
}

const Container = styled.div`
  margin-top: 10px;
  flex-grow: 1;
`
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
  p {
    margin: 0;
  }
`
const BtnWrapper = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
`
const StyledInput = styled.input`
  height: 35px;
  border-radius : 5px;
`
export default MoreRecordListForm