import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
//컴포넌트
import MainBtn from "../../components/Btn/MainBtn";
//hooks
import useFetchRtMyUserData from "../../hooks/RealTimeData/useFetchRtMyUserData";
import useFireBasic from "../../hooks/Firebase/useFireBasic";
import MainContainer from "../../components/Styled/MainContainer";
import MainWrapper from "../../components/Styled/MainWrapper";
//생성(251020)
const PurchaseFailPage = () => {
  const [searchParams] = useSearchParams();
  const [isReport, setIsReport] = useState(false);
  const { myUserData } = useFetchRtMyUserData();
  const { addData } = useFireBasic("error");
  //------함수부--------------------------------------------------- 
  //에러 전송
  const handleOnClick = () => {
    const errorData = { type: "purchase", uid: myUserData.uid, usderData: myUserData, message: searchParams.get("message") }
    addData(errorData);
    setIsReport(true);
  }
  return (
    <MainContainer styles={{ paddingTop: "20px" }}>
      <MainWrapper styles={{ width: "65%" }}>
        <img width="100px" src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png" alt="에러 이미지" style={{ alignSelf: "center" }} />
        <h2 style={{ textAlign: "center" }}>결제에 실패했어요</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>에러메시지</b>
          </div>
          <div className="p-grid-col text--right" id="message">{`${searchParams.get("message")}`}</div>
        </div>
        <MainBtn styles={{ margin: "50px 0 0 0" }} onClick={handleOnClick} disabled={isReport}
        >{!isReport ? "관리자에게 에러 전송하기" : "전송 완료"}</MainBtn>
      </MainWrapper>
    </MainContainer>
  );
}

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
export default PurchaseFailPage;