//라이브러리
import React from 'react'
import styled from 'styled-components'
//컴포넌트
import PetSpecUI from './PetSpecUI'
import AnimatedProgressBar from '../../../components/ProgressBar';
//이미지
import qustion_icon from '../../../image/icon/question.png'
//생성(250804)
const StatusUI = ({
  isMaster,
  myUserData,
  myPet,
  mySpec,
  myRole = 'student',
  myLabel,
  myMeta,
  enmUserData,
  enmPet,
  enmSpec,
  enmRole = 'boss',
  enmLabel,
  enmMeta,
  hideEnmProfile = false,
  levelInfo,
  isMobile,
}) => {
  return (
    <Container $isMobile={isMobile}>
      <Content>
        <BattleRow>
          <PlayerPanel $role={myRole}>
            <ProfileWrap>
              <ProfileImg src={myPet?.petImg || myUserData?.profileImg || qustion_icon} alt="내 프로필" />
              {isMaster && <CrownIcon className="fa-solid fa-crown" />}
            </ProfileWrap>
            <InfoWrap>
              <PanelHeading>
                <RoleBadge $role={myRole}>{myRole === 'boss' ? 'BOSS' : 'STUDENT'}</RoleBadge>
                <PanelTitle>{myLabel || (myRole === 'boss' ? '보스' : myPet?.name || '학생 펫')}</PanelTitle>
                {myMeta && <PanelMeta>{myMeta}</PanelMeta>}
              </PanelHeading>
              <PetSpecUI spec={mySpec} role={myRole} />
            </InfoWrap>
          </PlayerPanel>
          <Row style={{ alignItems: 'center' }}><VsBadge>VS</VsBadge></Row>
          <PlayerPanel $reverse $role={enmRole}>
            {!hideEnmProfile && (
              <ProfileWrap>
                <ProfileImg src={enmUserData?.profileImg || enmPet?.petImg || qustion_icon} alt="상대 프로필" />
                {!isMaster && <CrownIcon className="fa-solid fa-crown" />}
              </ProfileWrap>
            )}
            <InfoWrap $reverse>
              <PanelHeading $reverse>
                <RoleBadge $role={enmRole}>{enmRole === 'boss' ? 'BOSS' : 'STUDENT'}</RoleBadge>
                <PanelTitle>{enmLabel || (enmRole === 'boss' ? '보스' : enmPet?.name || '학생 펫')}</PanelTitle>
                {enmMeta && <PanelMeta>{enmMeta}</PanelMeta>}
              </PanelHeading>
              <PetSpecUI spec={enmSpec} role={enmRole} />
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
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 52%, #fff8f8 100%);
  padding: ${({ $isMobile }) => !$isMobile ? "14px" : "10px"};
	border: 1px solid #cfd9ff;
	border-radius: ${({ $isMobile }) => !$isMobile ? "14px 14px 0 0" : "10px 10px 0 0"};
  box-shadow: 0 8px 20px rgba(25, 35, 60, 0.08);
  width: min(1200px, 100%);
  box-sizing: border-box;
  ${({ $isMobile }) => $isMobile && "grid-row: 1/2"};
`
const Content = styled(Column)`
  width: 100%;
  gap: 10px;
`
const BattleRow = styled(Row)`
  align-items: stretch;
  gap: 14px;
  @media screen and (max-width: 768px) {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }
`
const PlayerPanel = styled(Row)`
  flex: 1;
  min-width: 0;
  height: 100%;
  align-items: center;
  flex-direction: ${({ $reverse }) => $reverse ? "row-reverse" : "row"};
  gap: 12px;
  padding: 10px;
  border: 1px solid ${({ $role }) => $role === 'boss' ? '#ffd7da' : '#d8e1ff'};
  border-radius: 14px;
  background: ${({ $role }) => $role === 'boss'
    ? 'linear-gradient(135deg, #fff8f8, #ffffff)'
    : 'linear-gradient(135deg, #f5f8ff, #ffffff)'};
  box-sizing: border-box;
  box-shadow: 0 4px 14px rgba(29, 53, 87, 0.06);

  @media screen and (max-width: 768px) {
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
const InfoWrap = styled(Row)`
  flex: 1;
  min-width: 0;
  align-items: stretch;
  flex-direction: column;
  gap: 8px;

  & > * {
    margin: 0;
  }

`
const PanelHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $reverse }) => $reverse ? 'flex-end' : 'flex-start'};
  gap: 7px;
  min-width: 0;
`
const RoleBadge = styled.span`
  flex: 0 0 auto;
  padding: 3px 7px;
  border-radius: 999px;
  color: ${({ $role }) => $role === 'boss' ? '#b4232d' : '#3454d1'};
  background: ${({ $role }) => $role === 'boss' ? '#ffe8ea' : '#e9edff'};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
`
const PanelTitle = styled.strong`
  min-width: 0;
  color: #172033;
  font-size: 15px;
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const PanelMeta = styled.span`
  margin-left: auto;
  color: #7b849b;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
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
    align-self: center;
    flex-basis: auto;
    width: 42px;
    height: 42px;
    font-size: 14px;
  }
`
const ProgressWrap = styled.div`
  width: 100%;
`
export default StatusUI
