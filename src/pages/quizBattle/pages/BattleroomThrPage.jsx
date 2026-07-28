import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { callStartGame, callSetBossStance, callFinalizeGame, callResolveBattleTurn, callKickBattlePlayer } from '../../../firebase/config'
import BattleRoomFrame from '../components/BattleRoomFrame'
import BattleActionPanel from '../components/BattleActionPanel'
import BattleFriendSection from '../components/BattleFriendSection'
import useBattleRoomCommon from '../hooks/useBattleRoomCommon'
import useBattleBgm from '../hooks/useBattleBgm'
import GptIngModal from '../../../components/Modal/gptModal/GptIngModal'
import defaultBossImg from '../../../image/monsters/mon_evil_002_3_back.png'
import useMediaQuery from '../../../hooks/useMediaQuery'

const BattleroomThrPage = () => {
  const user = useSelector(({ user }) => user)
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { state: battleInfo } = useLocation()
  const { roomId } = battleInfo || {}
  const navigate = useNavigate()
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [kickingUid, setKickingUid] = useState(null)
  const { isMuted, start: startBgm, stop: stopBgm, toggleMute } = useBattleBgm()

  const {
    room,
    players,
    pets,
    boss,
    phase,
    bossStance,
    quizList,
    remainingQuestionCount,
    background,
    bossImages,
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
      await callStartGame({
        uid: user.uid,
        roomId,
        studentList,
        quizCount: quizList.length,
      })
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
  if (phase === 'stance' && stanceList) {
    const kor = { atk: '공격', def: '방어', rest: '치료' }
    stanceList.forEach((stance, idx) => {
      actionButtons.push({ label: kor[stance], onClick: () => handleStanceOnClick(idx), disabled: done || !!bossStance, variant: 'primary' })
    })
  }
  if (phase !== 'quiz') {
    actionButtons.push({ label: '종료하기', onClick: handleFinalizeGame, disabled: isFinalizing, variant: 'danger' })
  }

  const connectedStudents = useMemo(
    () => Object.values(players || {}).filter((player) => player?.connected && player?.pet),
    [players]
  )
  const baseBossSpec = room?.bossStatPerPlayer || null
  const waitingBossSpec = baseBossSpec ? {
    hp: Number(baseBossSpec.hp || 0) * connectedStudents.length,
    atk: Number(baseBossSpec.atk || 0) * connectedStudents.length,
    def: Number(baseBossSpec.def || 0) * connectedStudents.length,
  } : null
  const bossSpec = boss ? {
    hp: boss.hp,
    atk: boss.atk,
    def: boss.def,
  } : waitingBossSpec
  const teamSpec = connectedStudents.length > 0
    ? connectedStudents.reduce((total, player) => ({
      hp: total.hp + Number(player.pet?.hp || 0),
      atk: total.atk + Number(player.pet?.atk || 0),
      def: total.def + Number(player.pet?.def || 0),
      rest: total.rest + Number(player.pet?.rest || 0),
    }), { hp: 0, atk: 0, def: 0, rest: 0 })
    : null
  if (teamSpec && pets?.hp != null) teamSpec.hp = Number(pets.hp)
  const firstStudentPet = connectedStudents[0]?.pet || null
  const bossPlayerCount = boss && Number(baseBossSpec?.hp) > 0
    ? Math.max(1, Math.round(Number(boss.hp) / Number(baseBossSpec.hp)))
    : 1

  return (
    <>
      <BattleRoomFrame
        statusProps={{
          isMaster: true,
          myPet: { petImg: bossImages.back || defaultBossImg },
          mySpec: bossSpec,
          myRole: 'boss',
          myLabel: '보스',
          myMeta: `${boss ? bossPlayerCount : connectedStudents.length}명 기준`,
          enmPet: firstStudentPet,
          enmSpec: teamSpec,
          enmRole: 'student',
          enmLabel: connectedStudents.length > 0 ? '학생 팀' : '학생 입장 대기',
          enmMeta: connectedStudents.length > 0 ? `${connectedStudents.length}명 합계` : null,
          hideEnmProfile: true,
        }}
        pixiProps={{
          background,
          bossImages,
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
          isBgmMuted: isMuted,
          onToggleBgmMute: toggleMute,
          result: battleReport.result,
          correctNumber,
          battleStats: battleReport,
          battleRankings,
          isMobile,
        }}
        infoProps={{
          phase,
          msg,
          number,
          stats: [
            { label: '남은 문제', value: remainingQuestionCount },
            { label: '페이즈', value: phase },
            { label: '턴', value: `${room?.turn}/${room?.maxTurn}` },
          ],
        }}
        controlPanel={
          <BattleActionPanel buttons={actionButtons} />
        }
        friendPanel={
          <BattleFriendSection
            players={players}
            onKickPlayer={handleKickPlayer}
            kickingUid={kickingUid}
          />
        }
      />
      <GptIngModal
        show={isFinalizing}
        status="게임방을 종료하고 있습니다..."
      />
    </>
  )
}

export default BattleroomThrPage
