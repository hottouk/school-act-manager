import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { appAuth, callLeaveBattleRoom, callSubmitMyStance } from '../../../firebase/config'
import BattleRoomFrame from '../components/BattleRoomFrame'
import BattleActionPanel from '../components/BattleActionPanel'
import BattleFriendSection from '../components/BattleFriendSection'
import useBattleRoomCommon from '../hooks/useBattleRoomCommon'
import useMediaQuery from '../../../hooks/useMediaQuery'
import defaultBossImg from '../../../image/monsters/mon_evil_002_3.png'

const BattleroomStuPage = () => {
  const user = useSelector(({ user }) => user);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { state: battleInfo } = useLocation();
  const { roomId, pet: myPet } = battleInfo || {};
  const navigate = useNavigate();
  const participantUid = appAuth.currentUser?.uid || user?.uid;
  const [actionBall, setActionBall] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const resultAudioContextRef = useRef(null);
  // BGM 관련 훅
  const playQuizResultSound = useCallback(async (isCorrect) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioContext = resultAudioContextRef.current || new AudioContext();
    resultAudioContextRef.current = audioContext;

    try {
      if (audioContext.state === 'suspended') await audioContext.resume();

      const startedAt = audioContext.currentTime;
      const notes = isCorrect
        ? [
          { frequency: 523.25, offset: 0, duration: 0.14 },
          { frequency: 659.25, offset: 0.13, duration: 0.14 },
          { frequency: 783.99, offset: 0.26, duration: 0.24 },
        ]
        : [
          { frequency: 220, offset: 0, duration: 0.22 },
          { frequency: 146.83, offset: 0.18, duration: 0.32 },
        ];

      notes.forEach(({ frequency, offset, duration }) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const noteStart = startedAt + offset;
        const noteEnd = noteStart + duration;

        oscillator.type = isCorrect ? 'sine' : 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(isCorrect ? 0.14 : 0.08, noteStart + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteEnd + 0.01);
      });
    } catch (error) {
      // 효과음 재생 실패가 퀴즈 진행을 막지 않게 한다.
      console.debug('Quiz result sound could not be played.', error);
    }
  }, []);

  const {
    room,
    isRoomResolved,
    players,
    pets,
    boss,
    phase,
    bossStance,
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
    optionList,
    marking,
    correctNumber,
    wrongList,
    battleReport,
    stanceList,
    animEvent,
    onDoneCountdown,
    setDone,
    setMsg,
    checkAnswer,
  } = useBattleRoomCommon({
    roomId,
    user,
    participantUid,
  })

  useEffect(() => {
    if (isRoomResolved && !room) {
      navigate('/quiz_game', { replace: true })
    }
  }, [isRoomResolved, room, navigate])

  useEffect(() => {
    const currentUid = participantUid
    if (!currentUid || !players) return
    if (!players[currentUid]) {
      navigate('/quiz_game', { replace: true })
    }
  }, [players, participantUid, navigate])

  useEffect(() => {
    if (typeof marking !== 'boolean') return;
    playQuizResultSound(marking);
  }, [marking, playQuizResultSound]);

  useEffect(() => () => {
    resultAudioContextRef.current?.close();
    resultAudioContextRef.current = null;
  }, []);

  const handleOptionOnClick = (idx) => {
    if (done) return
    setDone(true)
    checkAnswer(idx, setActionBall)
  }

  const handleStanceOnClick = async (idx) => {
    setDone(true)
    setMsg(bossStance ? '행동을 선택했습니다. 보스의 턴을 기다리는 중...' : '행동을 선택했습니다. 교사의 행동 선택을 기다리는 중...')
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

  const handleLeaveRoom = async () => {
    if (isLeaving) return
    setIsLeaving(true)

    try {
      if (roomId) {
        await callLeaveBattleRoom({ roomId })
      }
    } catch (error) {
      console.error('방 퇴장 실패:', error)
      window.alert(error?.message || '방에서 퇴장하지 못했습니다.')
      setIsLeaving(false)
      return
    }

    navigate('/quiz_game', { replace: true })
  }

  const handleReviewWrongWords = () => {
    if (wrongList.length === 0) return

    navigate('/quiz_study', {
      state: {
        title: `${room?.title || '단어 배틀'} 틀린 단어 복습`,
        quizList: wrongList.map(({ quiz, answer }) => `${quiz}#${answer}`),
      },
    })
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
  if (phase === 'ended') {
    actionButtons.push({
      label: '틀린 단어 복습하기',
      onClick: handleReviewWrongWords,
      disabled: wrongList.length === 0,
      variant: 'secondary',
    })
  }
  if (phase !== 'quiz') {
    actionButtons.push({ label: isLeaving ? '퇴장 중...' : '종료하기', onClick: handleLeaveRoom, disabled: isLeaving, variant: 'danger' })
  }

  const currentPet = players?.[participantUid]?.pet || myPet
  const baseBossSpec = room?.bossStatPerPlayer || null
  const bossSpec = boss ? {
    hp: boss.hp,
    atk: boss.atk,
    def: boss.def,
  } : baseBossSpec
  const bossPlayerCount = boss && Number(baseBossSpec?.hp) > 0
    ? Math.max(1, Math.round(Number(boss.hp) / Number(baseBossSpec.hp)))
    : 1

  return (
    <BattleRoomFrame
      statusProps={{
        myPet: currentPet,
        mySpec: {
          atk: currentPet?.atk,
          def: currentPet?.def,
          hp: currentPet?.hp,
          rest: currentPet?.rest,
        },
        myRole: 'student',
        myLabel: currentPet?.name || '내 펫',
        myMeta: '기본 능력치',
        enmPet: { petImg: bossImages.front || defaultBossImg },
        enmSpec: bossSpec,
        enmRole: 'boss',
        enmLabel: '보스',
        enmMeta: boss ? `${bossPlayerCount}명 기준` : '학생 1명 기준',
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
        marking,
        actionBall,
        result: battleReport.result,
        correctNumber,
        wrongNumber: wrongList.length,
        battleStats: battleReport,
        isMobile,
      }}
      infoProps={{
        phase,
        msg,
        number,
        stats: [
          { label: '남은 문제', value: remainingQuestionCount },
          { label: '맞춘 개수', value: correctNumber },
          { label: '턴', value: `${room?.turn}/${room?.maxTurn}` },
        ],
      }}
      controlPanel={<BattleActionPanel buttons={actionButtons} />}
      friendPanel={<BattleFriendSection players={players} />}
    />
  )
}

export default BattleroomStuPage
