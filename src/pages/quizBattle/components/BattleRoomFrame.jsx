import React from 'react'
import styled from 'styled-components'
import MainContainer from '../../../components/Styled/MainContainer'
import StatusUI from '../../../components/Game/StatusUI'
import PixiStage from '../PixiStage'

const BattleRoomFrame = ({
  statusProps = {},
  pixiProps = {},
  infoProps = {},
  controlPanel,
  footer,
}) => {
  const { phase = '', msg = '', number = 0, stats = [] } = infoProps;
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
      <StatusUI {...statusProps} />
      <PixiStage {...pixiProps} />
      <InfoWrapper>
        <MsgWrapper>
          <PhaseBadge>{phaseLabels[phase] || phase || '상태'}</PhaseBadge>
          <MessageText>{messageText || '잠시 기다려주세요.'}</MessageText>
        </MsgWrapper>
        <StatsWrapper>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue>{stat.value}</StatValue>
            </StatItem>
          ))}
        </StatsWrapper>
      </InfoWrapper>
      <ControllerUI>
        {controlPanel}
      </ControllerUI>
      {footer}
    </MainContainer>
  )
}

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
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
  border-radius: 14px 14px 0 0;
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
const StatsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  width: 260px;

  @media screen and (max-width: 768px) {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
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
`
const StatLabel = styled.span`
  color: #677089;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
`
const StatValue = styled.span`
  min-width: 0;
  color: #171b24;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.2;
  text-align: right;
  overflow-wrap: anywhere;
`

export default BattleRoomFrame
