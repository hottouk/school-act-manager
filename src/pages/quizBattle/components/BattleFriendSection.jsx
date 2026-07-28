import React from 'react'
import styled from 'styled-components'
import questionIcon from '../../../image/icon/question.png'

const BattleFriendSection = ({ players, onKickPlayer, kickingUid }) => {
  const playerEntries = Object.entries(players || {})

  return (
    <Section aria-label="접속 친구 목록">
      <Heading>
        <Title>접속 친구</Title>
        <Count>{playerEntries.filter(([, player]) => player?.connected).length}명 접속</Count>
      </Heading>
      <FriendsList>
        {playerEntries.map(([uid, player]) => {
          const nickname = player?.nickname || '이름 없는 친구'
          const isKicking = kickingUid === uid

          return (
            <FriendCard
              as={onKickPlayer ? 'button' : 'div'}
              type={onKickPlayer ? 'button' : undefined}
              key={uid}
              title={onKickPlayer ? `${nickname} 추방하기` : nickname}
              onClick={onKickPlayer ? () => onKickPlayer(uid, nickname) : undefined}
              disabled={onKickPlayer ? Boolean(kickingUid) : undefined}
              $interactive={Boolean(onKickPlayer)}
            >
              <Avatar
                src={player?.pet?.petImg || player?.petImg || questionIcon}
                alt={`${nickname}의 펫`}
              />
              <FriendInfo>
                <Nickname>{nickname}</Nickname>
                <Score>{isKicking ? '내보내는 중...' : player?.score ? `점수 ${player.score}` : '\u00a0'}</Score>
              </FriendInfo>
              <StatusDot $online={Boolean(player?.connected)} aria-label={player?.connected ? '접속 중' : '접속 종료'} />
            </FriendCard>
          )
        })}
        {playerEntries.length === 0 && <EmptyNotice>접속한 친구가 없습니다.</EmptyNotice>}
      </FriendsList>
    </Section>
  )
}

const Section = styled.aside`
  width: 100%;
  padding: 14px;
  border: 1px solid #cfd9ff;
  border-radius: 0 0 14px 14px;
  background: #f7f9ff;
  box-shadow: 0 8px 20px rgba(25, 35, 60, 0.08);
  box-sizing: border-box;
`

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
`

const Title = styled.h4`
  margin: 0;
  color: #172033;
  font-size: 16px;
  font-weight: 900;
`

const Count = styled.span`
  flex: 0 0 auto;
  padding: 4px 8px;
  border-radius: 999px;
  color: #3454d1;
  background: #e9edff;
  font-size: 12px;
  font-weight: 800;
`

const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FriendCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  padding: 7px 8px;
  border: 1px solid #e3e8f7;
  border-radius: 9px;
  color: inherit;
  background: #ffffff;
  box-sizing: border-box;
  font: inherit;
  text-align: left;
  cursor: ${({ $interactive, disabled }) => disabled ? 'wait' : $interactive ? 'pointer' : 'default'};
  opacity: ${({ disabled }) => disabled ? 0.72 : 1};
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;

  &:hover {
    border-color: ${({ $interactive, disabled }) => $interactive && !disabled ? '#dc3545' : '#e3e8f7'};
    box-shadow: ${({ $interactive, disabled }) => $interactive && !disabled ? '0 4px 12px rgba(220, 53, 69, 0.16)' : 'none'};
    transform: ${({ $interactive, disabled }) => $interactive && !disabled ? 'translateY(-1px)' : 'none'};
  }
`

const Avatar = styled.img`
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #dde3ef;
`

const FriendInfo = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
`

const Nickname = styled.span`
  width: 100%;
  overflow: hidden;
  color: #172033;
  font-size: 14px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Score = styled.small`
  color: #677089;
  font-size: 12px;
`

const StatusDot = styled.span`
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  margin-left: auto;
  border-radius: 50%;
  background: ${({ $online }) => $online ? '#37b24d' : '#9ca3af'};
`

const EmptyNotice = styled.div`
  padding: 18px 8px;
  color: #677089;
  font-size: 14px;
  text-align: center;
`

export default BattleFriendSection
