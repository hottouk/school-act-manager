import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { callStartGame, callPhaseManager, callSetBossStance, callFinalizeGame, callResolveBattleTurn, callKickBattlePlayer } from '../../../firebase/config'
import BattleRoomFrame from '../components/BattleRoomFrame'
import BattleActionPanel from '../components/BattleActionPanel'
import useBattleRoomCommon from '../hooks/useBattleRoomCommon'
import useBattleBgm from '../hooks/useBattleBgm'
import GptIngModal from '../../../components/Modal/gptModal/GptIngModal'
import bossImg from '../../../image/monsters/mon_evil_002_3_back.png'

const BattleroomThrPage = () => {
  const user = useSelector(({ user }) => user)
  const { state: battleInfo } = useLocation()
  const { roomId } = battleInfo || {}
  const navigate = useNavigate()
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [kickingUid, setKickingUid] = useState(null)
  const { isMuted, isPlaying, start: startBgm, stop: stopBgm, toggleMute } = useBattleBgm()

  const {
    room,
    players,
    pets,
    boss,
    phase,
    bossStance,
    quizList,
    background,
    msg,
    countdown,
    displayBossHp,
    displayTeamHp,
    number,
    done,
    curQuiz,
    correctNumber,
    battleReport,
    battleRankings,
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
      const connectedPlayers = Object.entries(players || {}).filter(([, p]) => p?.connected)
      const studentList = connectedPlayers.map(([uid, p], idx) => ({
        uid,
        nickname: p?.nickname || `player-${idx + 1}`,
        petImg: p?.petImg || null,
        index: idx,
        pet: p?.pet || {},
      }))

      if (studentList.length === 0) {
        setMsg('접속한 학생이 없습니다. 학생이 입장한 뒤 시작해주세요.')
        return
      }

      if (quizList.length === 0) {
        setMsg('단어 목록을 불러오지 못했습니다. 잠시 후 다시 시작해주세요.')
        return
      }

      await startBgm()
      await callStartGame({ uid: user.uid, roomId, studentList })
    } catch (error) {
      console.error(error)
      stopBgm()
      setMsg(error?.message || '게임 시작에 실패했습니다. 다시 시도해주세요.')
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

  const handleKickPlayer = async (targetUid, nickname) => {
    if (!targetUid || kickingUid) return;
    if (!window.confirm(`${nickname || '학생'}을(를) 방에서 내보내시겠습니까?`)) return;
    setKickingUid(targetUid);
    try {
      await callKickBattlePlayer({ uid: user.uid, roomId, targetUid })
      setMsg(`${nickname || '학생'}을(를) 방에서 내보냈습니다.`);
    } catch (error) {
      console.error(error);
      window.alert(error?.message || '학생 추방에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setKickingUid(null);
    }
  }

  const actionButtons = []
  if (phase === 'waiting') {
    actionButtons.push({ label: '시작하기', onClick: handleStartGame, disabled: false, variant: 'primary' })
  }
  if (phase === 'ended') {
    actionButtons.push({ label: '재시작하기', onClick: () => callPhaseManager({ roomId, status: 'ended' }), disabled: false, variant: 'primary' })
  }
  if (phase === 'stance' && stanceList) {
    const kor = { atk: '공격', def: '방어', rest: '치료' }
    stanceList.forEach((stance, idx) => {
      actionButtons.push({ label: kor[stance], onClick: () => handleStanceOnClick(idx), disabled: done || !!bossStance, variant: 'primary' })
    })
  }
  if (phase !== 'quiz') {
    actionButtons.push({ label: '종료하기', onClick: handleFinalizeGame, disabled: isFinalizing, variant: 'danger' })
  }

  const bossSpec = boss ? {
    hp: boss.hp,
    atk: boss.atk,
    def: boss.def,
  } : null

  const footer = (
    <BattleFooter>
      <FriendSection>
        <h4>접속 친구</h4>
        <FriendsGrid>
          {players && Object.entries(players).map(([uid, p]) => (
            <FriendCard
              key={uid}
              title={`${p.nickname} 추방하기`}
              onClick={() => handleKickPlayer(uid, p.nickname)}
              $disabled={!!kickingUid}
            >
              <Avatar src={p.petImg || '/image/icon/default_avatar.png'} alt={p.nickname} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{p.nickname}</span>
                <small>{kickingUid === uid ? '내보내는 중...' : p.score ? `점수 ${p.score}` : ''}</small>
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
        statusProps={{
          isMaster: true,
          myPet: { petImg: bossImg },
          mySpec: bossSpec,
        }}
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
          battleCode: battleInfo?.battleCode,
          isTeacherView: true,
          result: battleReport.result,
          correctNumber,
          battleStats: battleReport,
          battleRankings,
        }}
        infoProps={{
          phase,
          msg,
          number,
          stats: [
            { label: '남은 문제', value: Math.max((quizList.length ?? 0) - number, 0) },
            { label: '페이즈', value: phase },
            { label: '턴', value: `${room?.turn}/${room?.maxTurn}` },
          ],
        }}
        controlPanel={
          <BattleActionPanel
            buttons={actionButtons}
            extraButton={
              <BgmButton type="button" onClick={toggleMute}>
                {isMuted ? '브금 켜기' : '브금 음소거'}{isPlaying ? '' : ' - 시작 전'}
              </BgmButton>
            }
          />
        }
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
  justify-content: flex-end;
  align-items: flex-start;
  width: 1200px;
  gap: 12px;
  margin-top: 12px;
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
  cursor: ${({ $disabled }) => ($disabled ? 'wait' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.72 : 1)};
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;

  &:hover {
    border-color: ${({ $disabled }) => ($disabled ? '#eee' : '#dc3545')};
    box-shadow: ${({ $disabled }) => ($disabled ? 'none' : '0 4px 12px rgba(220, 53, 69, 0.16)')};
    transform: ${({ $disabled }) => ($disabled ? 'none' : 'translateY(-1px)')};
  }
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
const BgmButton = styled.button`
  align-self: flex-end;
  min-height: 40px;
  padding: 8px 14px;
  border: 1px solid #aebcf2;
  border-radius: 8px;
  color: #3454d1;
  background: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #eef2ff;
  }
`

export default BattleroomThrPage
