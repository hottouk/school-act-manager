import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
//컴포넌트
import TermsModal from '../Modal/TermsModal'
//hooks
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData';
import useMediaQuery from '../../hooks/useMediaQuery';
//생성(251016)
const Footer = () => {
  const { myUserData } = useFetchRtMyUserData();
  useEffect(() => {
    if (!myUserData) return;
    setIsMyTermAgree(myUserData.isMyTermAgree);
    if (!myUserData.isMyTermAgree) setIsModal(true);
  }, [myUserData])
  const [isMyTermAgree, setIsMyTermAgree] = useState(null);
  const [isModal, setIsModal] = useState(false);
  return (<>
    <Container>
      <Wrapper>
        <Text>
          사업자등록번호 858-59-00843 | 대표: 강건<br />
          화성 동탄원천로 350 | 고객센터: 010-6554-4161<br /><br />
          Copyright © 생기부쫑아리 All Rights Reserved. <br />
          생기부 쫑알이는 수업에 전념할 수 있는 교사를 위해 교사 1인 개발자가 만들었습니다.
        </Text>
        <Row style={{ gap: "20px", height: "fitContent" }}>
          <CopyRightText onClick={() => setIsModal(true)}>이용 약관</CopyRightText>
          <p> | </p>
          <CopyRightText onClick={() => setIsModal(true)}>개인정보 처리방침</CopyRightText>
        </Row>
      </Wrapper>
    </Container>
    <TermsModal
      show={isModal}
      onHide={() => setIsModal(false)}
      isMyTermAgree={isMyTermAgree}
    />
  </>
  )
}

const Container = styled.footer`
  min-height: 15dvh;
  background-color: #efefef;
  margin-top: auto;            /* 푸터를 아래로 밀착 *
`
const Row = styled.div`
  display: flex;
`
const Wrapper = styled(Row)`
  width: 60%;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #949192;
  margin: 0 auto;
  @media screen and (max-width: 768px){
    width: 100%;
    flex-direction: column;
    padding: 10px 10px 90px 10px;
  }
`
const Text = styled.p`
  color: rgb(120, 120, 120);
  margin: 0;
`
const CopyRightText = styled(Text)`
  cursor: pointer;
  text-decoration: underline;
`
export default Footer
