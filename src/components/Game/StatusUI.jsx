//라이브러리
import React from 'react'
import styled from 'styled-components'
//컴포넌트
import PlayerInfoUI from './PlayerInfoUI'
import PetSpecUI from './PetSpecUI'
import AnimatedProgressBar from '../../components/ProgressBar';
//이미지
import qustion_icon from '../../image/icon/question.png'
import SmallBtn from '../Btn/SmallBtn';
//생성(250804)
const StatusUI = ({ isMaster, myUserData, myPet, mySpec, enmUserData, enmPet, enmSpec, levelInfo, imReady, enmReady, isMobile }) => {
  return (
    <Container $isMobile={isMobile}>
      <Column>
        <Row>
          <Row style={{ flexGrow: "1", gap: "15px" }}>
            <Row style={{ position: "relative", flexDirection: "column" }}>
              <ProfileImg src={myUserData?.profileImg || qustion_icon} alt="내 프로필" />
              {isMaster && <Icon className="fa-solid fa-crown"></Icon>}
              {(imReady && isMobile) && <SmallBtn styles={{ width: "75px" }}>준비완료</SmallBtn>}
            </Row>
            {!isMobile && <PlayerInfoUI user={myUserData} pet={myPet} />}
            {!isMobile && <PetSpecUI spec={mySpec} />}
          </Row>
          <h1>VS</h1>
          <Row style={{ flexGrow: "1", justifyContent: "flex-start", flexDirection: "row-reverse", gap: "15px" }}>
            <Row style={{ position: "relative", flexDirection: "column" }}>
              <ProfileImg src={enmUserData?.profileImg || qustion_icon} alt="상대 프로필" />
              {!isMaster && <Icon className="fa-solid fa-crown"></Icon>}
              {(enmReady && isMobile) && <SmallBtn styles={{ width: "75px" }} btnColor={"#9b0c24"}>준비완료</SmallBtn>}
            </Row>
            {!isMobile && < PlayerInfoUI user={enmUserData} pet={enmPet} />}
            {!isMobile && <PetSpecUI spec={enmSpec} />}
          </Row>
        </Row>
        {levelInfo && < AnimatedProgressBar levelInfo={levelInfo} />}
      </Column>
    </Container>

  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  width: 100%;
  flex-direction: column;
`
const Container = styled(Row)`
  width: ${({ $isMobile }) => !$isMobile ? "1200px" : "100%"};
  background-color: #ddd;
  padding: 16px;
	border-radius: 10px 10px 0 0;
`
const ProfileImg = styled.img`
	position: relative;
	width: 75px;
	height: 75px;
	border: 1px solid rgb(185,185,185);
	border-radius: 10px;
`
const Icon = styled.i`
	color: #3454d1;
	position: absolute;
	top: -15px;
	left: 30px;
`
export default StatusUI
