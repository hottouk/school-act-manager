import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { callSubmitMyStance } from '../../../firebase/config'
import BattleRoomFrame from '../components/BattleRoomFrame'
import BattleActionPanel from '../components/BattleActionPanel'
import useBattleRoomCommon from '../hooks/useBattleRoomCommon'

const BattleroomStuPage = () => {
  const user = useSelector(({ user }) => user);
  const { state: battleInfo } = useLocation();
  const { roomId, pet: myPet } = battleInfo || {};
  const navigate = useNavigate();
  const [actionBall, setActionBall] = useState(0);

  const {
    room,
    isRoomResolved,
    players,
    pets,
    boss,
    phase,
    quizList,
    background,
    msg,
    countdown,
    displayBossHp,
    displayTeamHp,
    number,
    done,
    curQuiz,
    optionList,
    marking,
    correctNumber,
    stanceList,
    animEvent,
    onDoneCountdown,
    setDone,
    setMsg,
    checkAnswer,
  } = useBattleRoomCommon({
    roomId,
    user,
  })

  useEffect(() => {
    if (isRoomResolved && !room) {
      navigate('/quiz_game', { replace: true })
    }
  }, [isRoomResolved, room, navigate])

  const handleOptionOnClick = (idx) => {
    if (done) return
    setDone(true)
    checkAnswer(idx, setActionBall)
  }

  const handleStanceOnClick = async (idx) => {
    setDone(true)
    setMsg('을 선택했습니다. 보스의 턴을 기다리는 중...')
    try {
      const res = await callSubmitMyStance({ roomId, stance: stanceList[idx], actionBall })
      const { summary, turn } = res?.data || {}
      const { submittedCount, atk, def, rest } = summary || {}
      setMsg(`${turn}턴, ${submittedCount}명의 합산 공격력${atk}, 방어력${def}, 치유력${rest}`)
      setActionBall(0)
    } catch (error) {
      console.error(error)
    }
  }

  const actionButtons = []
  if (phase === 'quiz') {
    optionList?.forEach((option, idx) => {
      actionButtons.push({ label: option, onClick: () => handleOptionOnClick(idx), disabled: done, variant: 'primary' })
    })
  }
  if (phase === 'stance' && stanceList) {
    const kor = { atk: '공격', def: '방어', rest: '치료' }
    stanceList.forEach((stance, idx) => {
      actionButtons.push({ label: kor[stance], onClick: () => handleStanceOnClick(idx), disabled: done, variant: 'primary' })
    })
  }
  if (phase !== 'quiz') {
    actionButtons.push({ label: '종료하기', onClick: () => navigate(-1), disabled: false, variant: 'danger' })
  }

  const footer = (
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
  )

  return (
    <BattleRoomFrame
      statusProps={{ myPet, mySpec: { atk: myPet?.atk, def: myPet?.def, hp: myPet?.hp, mat: myPet?.rest } }}
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
        marking,
        actionBall,
      }}
      infoProps={{
        phase,
        msg,
        number,
        stats: [
          { label: '남은 문제', value: Math.max((quizList.length ?? 0) - number, 0) },
          { label: '맞춘 개수', value: correctNumber },
          { label: '페이즈', value: phase },
        ],
      }}
      controlPanel={<BattleActionPanel buttons={actionButtons} />}
      footer={footer}
    />
  )
}

const FriendSection = styled.div`
  width: 100%;
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

export default BattleroomStuPage
