import React from 'react'
import styled from 'styled-components'
import MainContainer from '../../../components/Styled/MainContainer'
import StatusUI from './StatusUI'
import PixiStage from './PixiStage'
//codex(260704)
const BattleRoomFrame = ({
  statusProps = {},
  pixiProps = {},
  infoProps = {},
  controlPanel,
  friendPanel,
}) => {
  const { phase = '', msg = '', number = 0, stats = [] } = infoProps;
  const {
    isBgmMuted = false,
    onToggleBgmMute,
    ...stageProps
  } = pixiProps;
  const isStudentMobile = stageProps.isMobile === true;
  const showBgmControl = stageProps.isTeacherView === true
    && typeof onToggleBgmMute === 'function';
  const phaseLabels = {
    waiting: '대기',
    countdown: '준비',
    quiz: '문제',
    stance: '행동 선택',
    battle: '전투',
    end: '종료',
    ended: '종료',
  }
  const messageText = phase === 'quiz' ? `${number}번 문제` : msg;

  return (
    <MainContainer>
      <BattleLayout>
        <GameColumn>
          <StatusWrapper>
            <StatusUI {...statusProps} />
          </StatusWrapper>
          {isStudentMobile && <MobileStatsWrapper stats={stats} compact />}
          <PixiStage {...stageProps} />
          <InfoWrapper>
            <MsgWrapper>
              <PhaseBadge>{phaseLabels[phase] || phase || '상태'}</PhaseBadge>
              <MessageText>{messageText || '잠시 기다려주세요.'}</MessageText>
            </MsgWrapper>
            {!isStudentMobile && <DesktopStatsWrapper stats={stats} />}
          </InfoWrapper>
          <ControllerUI>
            {controlPanel}
          </ControllerUI>
        </GameColumn>
        {(showBgmControl || friendPanel) && (
          <SidebarColumn>
            {showBgmControl && (
              <SoundPanel>
                <SoundPanelLabel>배경 음악</SoundPanelLabel>
                <MuteButton
                  type="button"
                  onClick={onToggleBgmMute}
                  aria-label={isBgmMuted ? '배경 음악 음소거 해제' : '배경 음악 음소거'}
                  aria-pressed={isBgmMuted}
                  title={isBgmMuted ? '음소거 해제' : '음소거'}
                >
                  <i
                    className={`fa-solid ${isBgmMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}
                    aria-hidden="true"
                  />
                  <span>{isBgmMuted ? '음소거 해제' : '음소거'}</span>
                </MuteButton>
              </SoundPanel>
            )}
            {friendPanel && <FriendSidebar>{friendPanel}</FriendSidebar>}
          </SidebarColumn>
        )}
      </BattleLayout>
    </MainContainer>
  )
}

const statIconMap = {
  '남은 문제': 'fa-circle-question',
  '맞춘 개수': 'fa-check',
  '턴': 'fa-rotate',
  '페이즈': 'fa-flag',
}

const StatsList = ({ stats, className, compact = false }) => (
  <div className={className}>
    {stats.map((stat, index) => (
      <StatItem
        key={index}
        $compact={compact}
        aria-label={`${stat.label} ${stat.value}`}
        title={`${stat.label}: ${stat.value}`}
      >
        <StatLabel $compact={compact}>
          <StatIcon
            className={`fa-solid ${statIconMap[stat.label] || 'fa-chart-simple'}`}
            $compact={compact}
            aria-hidden="true"
          />
          <StatLabelText $compact={compact}>{stat.label + ': '}</StatLabelText>
        </StatLabel>
        <StatValue $compact={compact}>{stat.value}</StatValue>
      </StatItem>
    ))}
  </div>
)

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const BattleLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1200px) 260px;
  align-items: start;
  gap: 16px;
  width: min(1476px, 100%);
  margin: 0 auto;

  @media screen and (max-width: 1280px) {
    grid-template-columns: minmax(0, 1fr);
  }
`
const GameColumn = styled(Column)`
  min-width: 0;

  & canvas {
    display: block;
    width: 100% !important;
    height: auto !important;
  }
`
const StatusWrapper = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`
const SidebarColumn = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 12px;
  min-width: 0;
  max-height: calc(100dvh - 24px);
  overflow-y: auto;

  @media screen and (max-width: 1280px) {
    position: static;
    max-height: none;
    overflow-y: visible;
    margin-top: 12px;
  }
`
const SoundPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #d9e2ff;
  border-bottom: 0;
  border-radius: 10px 10px 0 0;
  background: #f7f9ff;
`
const SoundPanelLabel = styled.span`
  color: #34405e;
  font-size: 13px;
  font-weight: 800;
`
const MuteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  padding: 7px 10px;
  border: 1px solid #c8d3ff;
  border-radius: 8px;
  color: #2945b8;
  background: #ffffff;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;

  &:hover {
    border-color: #3454d1;
    background: #eef2ff;
  }

  &:focus-visible {
    outline: 3px solid rgba(52, 84, 209, 0.28);
    outline-offset: 2px;
  }
`
const FriendSidebar = styled.div`
  min-width: 0;
`
const ControllerUI = styled(Column)`
  justify-content: center;
  gap: 10px;
  background: #f1f4ff;
  padding: 12px;
  border: 1px solid #d9e2ff;
  border-top: 0;
  border-radius: 0 0 14px 14px;
  box-shadow: 0 8px 20px rgba(52, 84, 209, 0.08);
  box-sizing: border-box;
  z-index: 999;
  width: min(1200px, 100%);

  @media screen and (max-width: 768px) {
    padding: 8px;
    border-radius: 0 0 10px 10px;
  }
`
const InfoWrapper = styled(Row)`
  width: min(1200px, 100%);
  min-height: 132px;
  padding: 14px;
  gap: 14px;
  border: 1px solid #cfd9ff;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(25, 35, 60, 0.08);
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
    padding: 10px;
    gap: 10px;
    border-radius: 10px 10px 0 0;
  }
`
const MsgWrapper = styled(Row)`
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 16px 18px;
  border: 1px solid #d9e2ff;
  border-radius: 10px;
  background: #f7f9ff;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    padding: 12px;
    gap: 8px;
  }
`
const PhaseBadge = styled.span`
  width: fit-content;
  max-width: 100%;
  padding: 5px 10px;
  border-radius: 999px;
  color: #3454d1;
  background: #e9edff;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.2;
`
const MessageText = styled.p`
  margin: 0;
  color: #171b24;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;

  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
`
const StatsWrapper = styled(StatsList)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  width: 260px;
`
const DesktopStatsWrapper = styled(StatsWrapper)`
  @media screen and (max-width: 768px) {
    display: none;
  }
`
const MobileStatsWrapper = styled(StatsWrapper)`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  padding: 6px;
  border: 1px solid #cfd9ff;
  border-bottom: 0;
  border-radius: 10px 10px 0 0;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(25, 35, 60, 0.08);
  box-sizing: border-box;
`
const StatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 36px;
  padding: 8px 10px;
  border: 1px solid #e3e8f7;
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;

  ${({ $compact }) => $compact && `
    justify-content: center;
    gap: 6px;
    min-width: 0;
    min-height: 32px;
    padding: 6px 4px;
  `}
`
const StatLabel = styled.span`
  display: inline-flex;
  align-items: center;
  color: #677089;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  gap: 5px;
`
const StatIcon = styled.i`
  display: ${({ $compact }) => $compact ? 'inline-block' : 'none'};
  flex: 0 0 auto;
  color: #3454d1;
  font-size: 14px;
`
const StatLabelText = styled.span`
  ${({ $compact }) => $compact && `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `}
`
const StatValue = styled.span`
  min-width: 0;
  color: #171b24;
  font-size: ${({ $compact }) => $compact ? '15px' : '17px'};
  font-weight: 800;
  line-height: 1.2;
  text-align: right;
  overflow-wrap: anywhere;
  white-space: ${({ $compact }) => $compact ? 'nowrap' : 'normal'};
`

export default BattleRoomFrame
