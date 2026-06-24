import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { callStartGame, callPhaseManager, callSetBossStance, callFinalizeGame, callResolveBattleTurn } from '../../../firebase/config'
import BattleRoomFrame from '../components/BattleRoomFrame'
import BattleActionPanel from '../components/BattleActionPanel'
import useBattleRoomCommon from '../hooks/useBattleRoomCommon'
import GptIngModal from '../../../components/Modal/gptModal/GptIngModal'

const BattleroomThrPage = () => {
  const user = useSelector(({ user }) => user)
  const { state: battleInfo } = useLocation()
  const { roomId } = battleInfo || {}
  const navigate = useNavigate()
  const [isFinalizing, setIsFinalizing] = useState(false)

  const {
    room,
    players,
    pets,
    boss,
    phase,
    background,
    msg,
    countdown,
    displayBossHp,
    displayTeamHp,
    number,
    done,
    curQuiz,
    stanceList,
    animEvent,
    onDoneCountdown,
    setMsg,
  } = useBattleRoomCommon({
    roomId,
    user,
    onBattleResolved: async ({ roomId }) => {
      const res = await callResolveBattleTurn({ uid: user.uid, roomId })
      const { result } = res?.data || {}
      return { nextStatus: result?.nextStatus }
    },
  })

  const handleStartGame = async () => {
    try {
      const studentList = Object.entries(players || {}).map(([uid, p], idx) => ({
        uid,
        nickname: p?.nickname || `player-${idx + 1}`,
        petImg: p?.petImg || null,
        index: idx,
        pet: p?.pet || {},
      }))
      await callStartGame({ uid: user.uid, roomId, studentList })
    } catch (error) {
      console.error(error)
    }
  }

  const handleStanceOnClick = async (idx) => {
    try {
      await callSetBossStance({ uid: user.uid, roomId, stance: stanceList[idx] })
      setMsg('잠시 뒤 학생 행동 집계를 마감합니다.')
    } catch (error) {
      console.error(error)
    }
  }

  const handleFinalizeGame = async () => {
    if (isFinalizing) return
    setIsFinalizing(true)

    try {
      await callFinalizeGame({ uid: user.uid, roomId })
      navigate('/quiz', { replace: true })
    } catch (error) {
      console.error(error)
      setIsFinalizing(false)
      window.alert('게임방 종료에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const actionButtons = []
  if (phase === 'waiting') {
    actionButtons.push({ label: '시작하기', onClick: handleStartGame, disabled: false, variant: 'primary' })
  }
  if (phase !== 'quiz') {
    actionButtons.push({ label: '기다리기', onClick: () => callPhaseManager({ roomId, status: 'waiting' }), disabled: false, variant: 'secondary' })
  }
  if (phase === 'stance' && stanceList) {
    const kor = { atk: '공격', def: '방어', rest: '치료' }
    stanceList.forEach((stance, idx) => {
      actionButtons.push({ label: kor[stance], onClick: () => handleStanceOnClick(idx), disabled: done, variant: 'primary' })
    })
  }
  if (phase !== 'quiz') {
    actionButtons.push({ label: '종료하기', onClick: handleFinalizeGame, disabled: isFinalizing, variant: 'danger' })
  }

  const footer = (
    <BattleFooter>
      <BattleCodeBox>
        <div>
          <strong>배틀 코드</strong>
          <Code>{battleInfo?.battleCode || '없음'}</Code>
        </div>
      </BattleCodeBox>
      <FriendSection>
        <h4>접속 친구</h4>
        <FriendsGrid>
          {players && Object.entries(players).map(([uid, p]) => (
            <FriendCard key={uid} title={p.nickname}>
              <Avatar src={p.petImg || '/image/icon/default_avatar.png'} alt={p.nickname} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{p.nickname}</span>
                <small>{p.score ? `점수 ${p.score}` : ''}</small>
              </div>
              <StatusDot $online={!!p.connected} />
            </FriendCard>
          ))}
          {!players || Object.keys(players).length === 0 ? <EmptyNotice>접속한 친구가 없습니다.</EmptyNotice> : null}
        </FriendsGrid>
      </FriendSection>
    </BattleFooter>
  )

  return (
    <>
      <BattleRoomFrame
        statusProps={{}}
        pixiProps={{
          background,
          studentList: Object.entries(players || {}).map(([uid, p], idx) => ({
            uid,
            nickname: p?.nickname || `player-${idx + 1}`,
            petImg: p?.petImg || null,
            index: idx,
            pet: p?.pet || {},
          })),
          countdown,
          onDoneCountdown,
          curQuiz,
          phase,
          pets,
          boss,
          teamCurHp: displayTeamHp,
          bossCurHp: displayBossHp,
          animEvent,
        }}
        infoProps={{
          phase,
          msg,
          number,
          stats: [
            { label: '남은 문제', value: Math.max((room?.quizList?.length ?? 0) - number, 0) },
            { label: '페이즈', value: phase },
            { label: '턴', value: `${room?.turn}/${room?.maxTurn}` },
          ],
        }}
        controlPanel={<BattleActionPanel buttons={actionButtons} />}
        footer={footer}
      />
      <GptIngModal
        show={isFinalizing}
        status="게임방을 종료하고 있습니다..."
      />
    </>
  )
}

const BattleFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 1200px;
  gap: 12px;
  margin-top: 12px;
`
const BattleCodeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f5f7ff;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cdd7ff;
  min-width: 260px;
  strong { display:block; font-size:14px; color:#333 }
`
const Code = styled.span`
  display: inline-block;
  font-size: 20px;
  letter-spacing: 4px;
  margin-left: 8px;
  color: #1a1a1a;
`
const FriendSection = styled.div`
  flex: 1;
`
const FriendsGrid = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`
const FriendCard = styled.div`
  display:flex;
  align-items:center;
  gap:8px;
  padding:6px 8px;
  border-radius:8px;
  background:#fff;
  border:1px solid #eee;
  min-width: 160px;
`
const Avatar = styled.img`
  width:40px;
  height:40px;
  border-radius:50%;
  object-fit:cover;
  background:#ddd;
`
const StatusDot = styled.div`
  width:10px;
  height:10px;
  border-radius:50%;
  margin-left:auto;
  background: ${({ $online }) => ($online ? '#37b24d' : '#9ca3af')};
`
const EmptyNotice = styled.div`
  color:#666;
  font-size:14px;
`

export default BattleroomThrPage
