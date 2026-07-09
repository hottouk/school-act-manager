//라이브러리
import React from 'react'
import styled from 'styled-components'
//컴포넌트
import PetSpecUI from './PetSpecUI'
import AnimatedProgressBar from '../../components/ProgressBar';
//이미지
import qustion_icon from '../../image/icon/question.png'
//생성(250804)
const StatusUI = ({ isMaster, myUserData, myPet, mySpec, enmUserData, enmPet, enmSpec, levelInfo, enmReady, isMobile }) => {
  return (
    <Container $isMobile={isMobile}>
      <Content>
        <BattleRow>
          <PlayerPanel>
            <ProfileWrap>
              <ProfileImg src={myPet?.petImg || myUserData?.profileImg || qustion_icon} alt="내 프로필" />
              {isMaster && <CrownIcon className="fa-solid fa-crown" />}
            </ProfileWrap>
            <InfoWrap>
              {!isMobile && <PetSpecUI spec={mySpec} />}
            </InfoWrap>
          </PlayerPanel>
          <VsBadge>VS</VsBadge>
          <PlayerPanel $reverse>
            <ProfileWrap>
              <ProfileImg src={enmUserData?.profileImg || enmPet?.petImg || qustion_icon} alt="상대 프로필" />
              {!isMaster && <CrownIcon className="fa-solid fa-crown" />}
            </ProfileWrap>
            <InfoWrap $reverse>
              {!isMobile && <PetSpecUI spec={enmSpec} />}
            </InfoWrap>
          </PlayerPanel>
        </BattleRow>
        {levelInfo && <ProgressWrap><AnimatedProgressBar levelInfo={levelInfo} /></ProgressWrap>}
      </Content>
    </Container>

  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Container = styled(Row)`
  background: #ffffff;
  padding: ${({ $isMobile }) => !$isMobile ? "14px" : "10px"};
	border: 1px solid #cfd9ff;
	border-radius: ${({ $isMobile }) => !$isMobile ? "14px 14px 0 0" : "10px 10px 0 0"};
  box-shadow: 0 8px 20px rgba(25, 35, 60, 0.08);
  width: ${({ $isMobile }) => !$isMobile ? "1200px" : "100%"};
  box-sizing: border-box;
  ${({ $isMobile }) => $isMobile && "grid-row: 1/2"};
`
const Content = styled(Column)`
  width: 100%;
  gap: 10px;
`
const BattleRow = styled(Row)`
  align-items: center;
  gap: 14px;

  @media screen and (max-width: 768px) {
    gap: 8px;
  }
`
const PlayerPanel = styled(Row)`
  flex: 1;
  min-width: 0;
  align-items: center;
  flex-direction: ${({ $reverse }) => $reverse ? "row-reverse" : "row"};
  gap: 12px;
  padding: 10px;
  border: 1px solid #e3e8f7;
  border-radius: 10px;
  background: #f7f9ff;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    justify-content: center;
    padding: 8px;
  }
`
const ProfileWrap = styled(Row)`
  position: relative;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
`
const ProfileImg = styled.img`
	position: relative;
	width: 75px;
	height: 75px;
  object-fit: cover;
	border: 2px solid #ffffff;
	border-radius: 10px;
  background: #eef3fb;
  box-shadow: 0 6px 14px rgba(25, 35, 60, 0.12);

  @media screen and (max-width: 768px) {
    width: 58px;
    height: 58px;
  }
`
const CrownIcon = styled.i`
	color: #ffb703;
	position: absolute;
	top: -12px;
	left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
`
const ReadyBadge = styled.span`
  margin-top: 6px;
  width: 76px;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: ${({ $enemy }) => $enemy ? "#fff1f3" : "#e9edff"};
  color: ${({ $enemy }) => $enemy ? "#9b0c24" : "#3454d1"};
  border: 1px solid ${({ $enemy }) => $enemy ? "#ffc9d1" : "#cfd9ff"};
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
  box-sizing: border-box;
`
const InfoWrap = styled(Row)`
  flex: 1;
  min-width: 0;
  align-items: center;
  justify-content: ${({ $reverse }) => $reverse ? "flex-end" : "flex-start"};
  flex-direction: ${({ $reverse }) => $reverse ? "row-reverse" : "row"};
  gap: 10px;

  & > * {
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`
const VsBadge = styled.div`
  flex: 0 0 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #24405f;
  background: #1d3557;
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 6px 14px rgba(25, 35, 60, 0.18);

  @media screen and (max-width: 768px) {
    flex-basis: 42px;
    height: 42px;
    font-size: 14px;
  }
`
const ProgressWrap = styled.div`
  width: 100%;
`
export default StatusUI
