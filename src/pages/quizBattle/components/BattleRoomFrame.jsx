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
  return (
    <MainContainer>
      <StatusUI {...statusProps} />
      <PixiStage {...pixiProps} />
      <InfoWrapper>
        <MsgWrapper>
          {phase === 'quiz' && <p>{number}번 문제</p>}
          {phase !== 'quiz' && <p>{msg}</p>}
        </MsgWrapper>
        <Column style={{ padding: '10px', gap: '5px' }}>
          {stats.map((stat, index) => (
            <Text key={index}>{stat.label}: {stat.value}</Text>
          ))}
        </Column>
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
  width: 1200px;
  height: 150px;
  border: 2px solid #3454d1;
  border-radius: 5px;
`
const MsgWrapper = styled(Row)`
  width: 70%;
  padding: 10px;
  border-right: 2px solid #3454d1;
  p {
    margin: 0;
    font-size: 33px;
  }
`
const Text = styled.p`
  margin: 0;
  font-size: 22px;
  font-weight: 500;
`

export default BattleRoomFrame
