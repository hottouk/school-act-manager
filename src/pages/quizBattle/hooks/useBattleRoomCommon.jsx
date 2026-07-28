import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { callPhaseManager, callCloseStanceCollection, callCompleteBattleSequence } from '../../../firebase/config'
import useGameroom from './useGameroom'
import useQuizLogic from './useQuizLogic'
import useBattleLogic from './useBattleLogic'
import useFetchStorageImg from '../../../hooks/Game/useFetchStorageImg'
import { getBackgroundOption, getBossOption } from '../../../data/battleRoomData'

const useBattleRoomCommon = ({ roomId, user, participantUid, onBattleResolved }) => {
  const { room, isRoomResolved, players, pets, boss, phase, quizList, quizListRef, bossStance, stanceSummary, allStances, battleResults } = useGameroom(roomId)
  const { fetchPathUrlMap } = useFetchStorageImg();
  const isHost = !!user?.uid && !!room?.hostUid && user.uid === room.hostUid
  const [background, setBackground] = useState(null)
  const [bossImages, setBossImages] = useState({ front: null, back: null })
  const [msg, setMsg] = useState('')
  const [countdown, setCountdown] = useState(null)
  const [displayBossHp, setDisplayBossHp] = useState(null)
  const [displayTeamHp, setDisplayTeamHp] = useState(null)
  const [number, setNumber] = useState(0)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const summaryKeyRef = useRef(null)
  const summaryTransitionRef = useRef(null)
  const completionFallbackRef = useRef(null)
  const playedBattleResultRef = useRef(null)
  const onBattleResolvedRef = useRef(onBattleResolved)

  const {
    curQuiz,
    curAnswer,
    optionList,
    marking,
    correctNumber,
    wrongList,
    setCurQuiz,
    setCurAnswer,
    setMarking,
    generateQuestion,
    checkAnswer,
    resetQuizResults,
    setCorrectNumber,
  } = useQuizLogic(quizList)
  const { stanceList, animEvent, playBattleSequence } = useBattleLogic({ setMsg })
  const connectedPlayerCount = useMemo(
    () => Object.values(players || {}).filter((player) => player?.connected).length,
    [players]
  )
  const battleReport = useMemo(() => {
    const report = { damage: 0, heal: 0, defense: 0, score: 0, result: 'Draw', endReason: null }
    const targetUid = participantUid || user?.uid
    const roundStat = (value) => Math.round(value * 10) / 10

    const orderedResults = Object.values(battleResults || {})
      .filter((item) => item?.resolved)
      .sort((a, b) => Number(a.turn || 0) - Number(b.turn || 0))

    if (isHost) {
      orderedResults.forEach((result) => {
        report.damage += Number(result.damageToBoss || 0)
        report.heal += Number(result.healToTeam || 0)
        report.defense += Number(result.summary?.def || 0)
      })
    }

    Object.entries(allStances || {}).forEach(([turnKey, turnStances]) => {
      if (isHost) return
      const entry = turnStances?.[targetUid]
      const turn = Number(turnKey || 0)
      const turnResult = orderedResults.find((result) => Number(result.turn || 0) === turn)

      if (!entry?.stance) return
      const point = Number(entry.point || 0)
      if (entry.stance === 'atk') {
        const totalAtk = Number(turnResult?.summary?.atk || 0)
        const totalDamage = Number(turnResult?.damageToBoss || 0)
        report.damage += totalAtk > 0 ? totalDamage * (point / totalAtk) : 0
      }
      if (entry.stance === 'rest') report.heal += point
      if (entry.stance === 'def') report.defense += point
    })

    const lastResult = orderedResults[orderedResults.length - 1]
    if (lastResult?.winner === 'team') report.result = 'Win'
    else if (lastResult?.winner === 'boss') report.result = 'Lose'
    report.endReason = lastResult?.endReason || null

    report.damage = roundStat(report.damage)
    report.heal = roundStat(report.heal)
    report.defense = roundStat(report.defense)
    report.score = roundStat(report.damage + report.heal + report.defense)
    return report
  }, [allStances, battleResults, isHost, participantUid, user?.uid])

  const battleRankings = useMemo(() => {
    const roundStat = (value) => Math.round(value * 10) / 10
    const orderedResults = Object.values(battleResults || {})
      .filter((item) => item?.resolved)
      .sort((a, b) => Number(a.turn || 0) - Number(b.turn || 0))
    const rankingMap = {}

    Object.entries(players || {}).forEach(([uid, player]) => {
      rankingMap[uid] = {
        uid,
        nickname: player?.nickname || '이름 없음',
        score: 0,
      }
    })

    Object.entries(allStances || {}).forEach(([turnKey, turnStances]) => {
      const turn = Number(turnKey || 0)
      const turnResult = orderedResults.find((result) => Number(result.turn || 0) === turn)
      const totalAtk = Number(turnResult?.summary?.atk || 0)
      const totalDamage = Number(turnResult?.damageToBoss || 0)

      Object.entries(turnStances || {}).forEach(([uid, entry]) => {
        if (!entry?.stance) return
        const player = players?.[uid]
        if (!rankingMap[uid]) {
          rankingMap[uid] = {
            uid,
            nickname: player?.nickname || `player-${uid.slice(0, 4)}`,
            score: 0,
          }
        }

        const point = Number(entry.point || 0)
        if (entry.stance === 'atk') {
          rankingMap[uid].score += totalAtk > 0 ? totalDamage * (point / totalAtk) : 0
        }
        if (entry.stance === 'rest' || entry.stance === 'def') {
          rankingMap[uid].score += point
        }
      })
    })

    return Object.values(rankingMap)
      .map((student) => ({ ...student, score: roundStat(student.score) }))
      .sort((a, b) => b.score - a.score)
      .map((student, index) => ({ ...student, rank: index + 1 }))
  }, [allStances, battleResults, players])

  const formatSummaryMessage = useCallback((turn, summary) => {
    const { submittedCount = 0, atk = 0, def = 0, rest = 0, autoDefenseCount = 0 } = summary || {}
    const autoDefenseText = autoDefenseCount > 0 ? `, 자동 방어 ${autoDefenseCount}명` : ''
    return `${turn}턴, ${submittedCount}명의 합산 공격력${atk}, 방어력${def}, 치유력${rest}${autoDefenseText}`
  }, [])

  useEffect(() => {
    setBackground(getBackgroundOption(room?.backgroundId).image)
  }, [room?.backgroundId])

  useEffect(() => {
    let isActive = true
    const selectedBoss = getBossOption(room?.bossType)
    fetchPathUrlMap([selectedBoss.frontPath, selectedBoss.backPath])
      .then((imageMap) => {
        if (!isActive || !imageMap) return
        setBossImages({
          front: imageMap.get(selectedBoss.frontPath) || null,
          back: imageMap.get(selectedBoss.backPath) || imageMap.get(selectedBoss.frontPath) || null,
        })
      })
      .catch((error) => {
        console.error('보스 이미지를 불러오지 못했습니다.', error)
        if (isActive) setBossImages({ front: null, back: null })
      })

    return () => { isActive = false }
  }, [room?.bossType, fetchPathUrlMap])

  useEffect(() => {
    onBattleResolvedRef.current = onBattleResolved
  }, [onBattleResolved])

  useEffect(() => {
    if (phase === 'waiting' || phase === 'countdown') {
      quizListRef.current = [...quizList]
    }
  }, [phase, quizList, quizListRef])

  useEffect(() => {
    const phaseManager = async () => {
      switch (phase) {
        case 'countdown': {
          summaryKeyRef.current = null
          clearTimeout(summaryTransitionRef.current)
          resetQuizResults()
          setNumber(0)
          setCurQuiz('')
          setCurAnswer('')
          setMsg('게임이 곧 시작되니 준비하세요.')
          setDone(false)
          setCountdown(3)
          break
        }
        case 'quiz': {
          setNumber(prev => prev + 1)
          const picked = generateQuestion(quizListRef)
          if (quizListRef.current && picked?.idx >= 0) quizListRef.current.splice(picked.idx, 1)
          const quizInterval = setInterval(() => {
            setNumber(prev => {
              if (quizListRef.current.length === 0 || prev % 5 === 0) {
                clearInterval(quizInterval)
                if (isHost) callPhaseManager({ roomId, status: 'stance' })
                setCurQuiz('')
                setCurAnswer('')
                return prev
              }
              const nextPicked = generateQuestion(quizListRef)
              if (quizListRef.current && nextPicked?.idx >= 0) quizListRef.current.splice(nextPicked.idx, 1)
              return prev + 1
            })
          }, 3000)
          intervalRef.current = quizInterval
          break
        }
        case 'stance': {
          setMsg(isHost ? '보스의 행동 패턴을 선택하세요.' : '행동을 선택하세요. 교사가 행동을 선택하면 5초 뒤 집계됩니다.')
          setDone(false)
          break
        }
        case 'battle': {
          const resolveBattle = onBattleResolvedRef.current
          if (isHost && typeof resolveBattle === 'function') {
            try {
              await resolveBattle({ roomId, user })
            } catch (error) {
              console.error('battle resolve 실패:', error)
            }
          }
          break
        }
        default:
          break
      }
    }
    phaseManager()
    return () => {
      clearInterval(intervalRef.current)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      intervalRef.current = null
    }
  }, [phase, roomId, isHost, user, generateQuestion, resetQuizResults, setCurAnswer, setCurQuiz, quizListRef])

  useEffect(() => {
    if (phase !== 'battle') return

    const orderedResults = Object.values(battleResults || {})
      .filter((item) => item?.resolved)
      .sort((a, b) => Number(a.turn || 0) - Number(b.turn || 0))
    const latestResult = orderedResults[orderedResults.length - 1]
    const resultTurn = Number(latestResult?.turn || 0)

    if (!latestResult || !resultTurn) return

    const resultKey = `${roomId}-${resultTurn}`
    if (playedBattleResultRef.current === resultKey) return
    playedBattleResultRef.current = resultKey

    const completeSequence = async (attempt = 0) => {
      try {
        await callCompleteBattleSequence({
          uid: participantUid || user?.uid,
          roomId,
          turn: resultTurn,
        })
      } catch (error) {
        console.error('전투 애니메이션 완료 처리 실패:', error)
        if (attempt < 2) {
          completionFallbackRef.current = setTimeout(
            () => completeSequence(attempt + 1),
            1500
          )
        }
      }
    }

    playBattleSequence({
      turn: resultTurn,
      result: latestResult,
      setDisplayBossHp,
      setDisplayTeamHp,
      bossMaxHp: Number(boss?.hp || latestResult.nextBossHp || 0),
      teamMaxHp: Number(pets?.hp || latestResult.nextPetHp || 0),
      onDone: () => {
        if (latestResult.nextStatus !== 'ended') {
          if (isHost) callPhaseManager({ roomId, status: latestResult.nextStatus })
          return
        }
        if (isHost) {
          completeSequence()
          return
        }
        // 호스트 연결이 끊긴 경우에도 방이 battle 상태에 고정되지 않도록 참가자가 대신 완료합니다.
        completionFallbackRef.current = setTimeout(completeSequence, 2500)
      },
    })

    return () => {
      clearTimeout(completionFallbackRef.current)
      completionFallbackRef.current = null
    }
  }, [phase, battleResults, roomId, boss?.hp, pets?.hp, isHost, participantUid, user?.uid, playBattleSequence])

  useEffect(() => {
    if (!bossStance) return
    setMsg(isHost ? '학생들이 행동을 선택하는 중입니다.' : '보스가 행동을 결정했습니다. 5초 안에 행동을 선택하세요. 선택하지 않으면 자동으로 방어합니다.')
    setCountdown(5)
  }, [bossStance, isHost])

  useEffect(() => {
    if (phase !== 'stance' || !stanceSummary || connectedPlayerCount === 0) return

    const turn = Number(room?.turn || 1)
    const isClosed = !!stanceSummary?.closed

    if (!isClosed) return

    const summaryKey = `${roomId}-${turn}`
    if (summaryKeyRef.current === summaryKey) return
    summaryKeyRef.current = summaryKey

    setCountdown(null)
    setMsg(formatSummaryMessage(turn, stanceSummary))

    if (!isHost) return

    const closeAndMoveToBattle = async () => {
      try {
        if (!isClosed) {
          await callCloseStanceCollection({ uid: user.uid, roomId })
        }
        summaryTransitionRef.current = setTimeout(() => {
          callPhaseManager({ roomId, status: 'battle' })
        }, 3000)
      } catch (error) {
        console.error('스탠스 집계 후 전투 전환 실패:', error)
      }
    }

    closeAndMoveToBattle()
  }, [phase, stanceSummary, connectedPlayerCount, room?.turn, roomId, isHost, user.uid, formatSummaryMessage])

  useEffect(() => {
    if (phase !== 'quiz' || number === 0) return
    setDone(false)
    setMarking(null)
  }, [phase, number, setMarking])

  const handleCountdownDone = useCallback(async () => {
    const next = { waiting: 'countdown', countdown: 'quiz', quiz: 'stance', stance: 'battle' }
    if (phase === 'countdown') {
      await callPhaseManager({ roomId, status: next[phase] })
    }
    if (phase === 'stance' && isHost) {
      try {
        const res = await callCloseStanceCollection({ uid: user.uid, roomId })
        const { summary, turn } = res?.data || {}
        setMsg(formatSummaryMessage(turn, summary))
      } catch (error) {
        console.error('클로징 스탠스 수집 실패:', error)
      }
    }
    setCountdown(null)
  }, [phase, roomId, user.uid, isHost, formatSummaryMessage])

  useEffect(() => {
    return () => {
      clearTimeout(summaryTransitionRef.current)
      clearTimeout(completionFallbackRef.current)
    }
  }, [])

  const studentList = useMemo(
    () => Object.entries(players || {}).map(([uid, p], idx) => ({
      uid,
      nickname: p?.nickname || `player-${idx + 1}`,
      petImg: p?.petImg || null,
      index: idx,
      pet: p?.pet || {},
    })),
    [players]
  )

  return {
    room,
    isRoomResolved,
    players,
    pets,
    boss,
    phase,
    bossStance,
    quizList,
    quizListRef,
    remainingQuestionCount: quizListRef.current.length,
    studentList,
    background,
    bossImages,
    msg,
    countdown,
    displayBossHp,
    displayTeamHp,
    number,
    done,
    curQuiz,
    curAnswer,
    optionList,
    marking,
    correctNumber,
    wrongList,
    battleReport,
    battleRankings,
    setDone,
    setMsg,
    setCountdown,
    setDisplayBossHp,
    setDisplayTeamHp,
    setNumber,
    setCurQuiz,
    setCurAnswer,
    setMarking,
    generateQuestion,
    checkAnswer,
    setCorrectNumber,
    stanceList,
    animEvent,
    playBattleSequence,
    onDoneCountdown: handleCountdownDone,
  }
}

export default useBattleRoomCommon
