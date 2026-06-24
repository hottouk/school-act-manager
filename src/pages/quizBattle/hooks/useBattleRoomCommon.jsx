import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { callPhaseManager, callCloseStanceCollection } from '../../../firebase/config'
import useGameroom from './useGameroom'
import useQuizLogic from './useQuizLogic'
import useBattleLogic from './useBattleLogic'
import useFetchStorageImg from '../../../hooks/Game/useFetchStorageImg'

const useBattleRoomCommon = ({ roomId, user, onBattleResolved }) => {
  const { room, isRoomResolved, players, pets, boss, phase, quizList, quizListRef, bossStance } = useGameroom(roomId)
  const { fetchImgUrl } = useFetchStorageImg()
  const isHost = !!user?.uid && !!room?.hostUid && user.uid === room.hostUid
  const [background, setBackground] = useState(null)
  const [msg, setMsg] = useState('')
  const [countdown, setCountdown] = useState(null)
  const [displayBossHp, setDisplayBossHp] = useState(null)
  const [displayTeamHp, setDisplayTeamHp] = useState(null)
  const [number, setNumber] = useState(0)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

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
    setCorrectNumber,
  } = useQuizLogic(quizList)
  const { stanceList, animEvent, playBattleSequence } = useBattleLogic({ setMsg })

  useEffect(() => {
    fetchImgUrl('images/battle_background.png', setBackground)
  }, [fetchImgUrl])

  useEffect(() => {
    const phaseManager = async () => {
      switch (phase) {
        case 'countdown': {
          setNumber(0)
          quizListRef.current = quizList
          setCurQuiz('')
          setCurAnswer('')
          setMsg('게임이 곧 시작되니 준비하세요.')
          setDone(false)
          setCountdown(3)
          break
        }
        case 'quiz': {
          setNumber(prev => prev + 1)
          const idx = generateQuestion(quizListRef)
          if (quizListRef.current && quizListRef.current.length > 0) quizListRef.current.splice(idx, 1)
          const quizInterval = setInterval(() => {
            setNumber(prev => {
              if (prev % 5 === 0) {
                if (isHost) callPhaseManager({ roomId, status: 'stance' })
                setCurQuiz('')
                setCurAnswer('')
                return prev
              }
              const idx2 = generateQuestion(quizListRef)
              if (quizListRef.current && quizListRef.current.length > 0) quizListRef.current.splice(idx2, 1)
              return prev + 1
            })
          }, 3000)
          intervalRef.current = quizInterval
          break
        }
        case 'stance': {
          setMsg(isHost ? '보스의 행동 패턴을 선택하세요.' : '당신의 행동을 선택하세요')
          setDone(false)
          break
        }
        case 'battle': {
          if (typeof onBattleResolved === 'function') {
            try {
              const res = await onBattleResolved({ roomId, user, boss, pets, playBattleSequence })
              if (res?.nextStatus) {
                await callPhaseManager({ roomId, status: res.nextStatus })
              }
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
  }, [phase, roomId, isHost, boss?.hp, pets?.hp, user, generateQuestion, playBattleSequence, setCurAnswer])

  useEffect(() => {
    if (!bossStance) return
    setMsg('보스가 행동을 결정했습니다. 5초 안에 행동을 결정하세요.')
    setCountdown(5)
  }, [bossStance])

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
        const { submittedCount, atk, def, rest } = summary || {}
        setMsg(`${turn}턴, ${submittedCount}명의 합산 공격력${atk}, 방어력${def}, 치유력${rest}`)
        if (res?.data?.ok) await callPhaseManager({ roomId, status: next[phase] })
      } catch (error) {
        console.error('클로징 스탠스 수집 실패:', error)
      }
    }
    setCountdown(null)
  }, [phase, roomId, user.uid, isHost])

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
    studentList,
    background,
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
