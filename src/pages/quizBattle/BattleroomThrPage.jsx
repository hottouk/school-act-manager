import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { callStartGame, callPhaseManager, callSetBossStance, callCloseStanceCollection, callResolveBattleTurn, callFinalizeGame } from "../../firebase/config";
import PixiStage from './PixiStage';
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
import MainContainer from '../../components/Styled/MainContainer';
import TransparentBtn from '../../components/Btn/TransparentBtn';
import useQuizLogic from './hooks/useQuizLogic';
import useBattleLogic from './hooks/useBattleLogic';
import StatusUI from '../../components/Game/StatusUI';
import useGameroom from './hooks/useGameroom';

const BattleroomThrPage = () => {
  const user = useSelector(({ user }) => user);
  const { state: battleInfo } = useLocation();
  const { roomId } = battleInfo || {}
  const navigate = useNavigate();
  //배경
  const { fetchImgUrl, fetchPathUrlMap, } = useFetchStorageImg();
  const [background, setBackground] = useState(null);
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    fetchImgUrl('images/battle_background.png', setBackground);
  }, []);
  //기본 정보
  const { room, players, pets, boss, phase, quizList, quizListRef } = useGameroom(roomId);
  const isHost = !!user?.uid && !!room?.hostUid && user.uid === room.hostUid;
  const [msg, setMsg] = useState('');
  const studentList = useMemo(() =>
    Object.entries(players || {}).map(([uid, p], idx) => ({
      uid,
      nickname: p?.nickname || `player-${idx + 1}`,
      petImg: p?.petImg || null,
      index: idx,
      pet: p?.pet || {},
    })),
    [players]);
  //스케쥴
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  //퀴즈
  const [number, setNumber] = useState(0);
  const { curQuiz, setCurQuiz, setCurAnswer, generateQuestion, } = useQuizLogic(quizList);
  //전투 관련
  const [done, setDone] = useState(false);
  const { stanceList, animEvent, playBattleSequence } = useBattleLogic({ setMsg });
  //실시간 체력 1턴 이후부터 값 설정
  const [displayBossHp, setDisplayBossHp] = useState(null);
  const [displayTeamHp, setDisplayTeamHp] = useState(null);
  // 카운트 다운
  const [countdown, setCountdown] = useState(0);
  const onDoneCountdown = useCallback(async () => {
    const next = { waiting: "countdown", countdown: "quiz", quiz: "stance", stance: "battle", };
    if (phase === "countdown") { callPhaseManager({ roomId, status: next[phase] }); }
    if (phase === "stance") {
      const res = await callCloseStanceCollection({ uid: user.uid, roomId });
      const { summary, turn } = res.data || {};
      const { submittedCount, atk, def, rest } = summary || {};
      setMsg(`${turn}턴, ${submittedCount}명의 합산 공격력${atk}, 방어력${def}, 치유력${rest} `);
      if (res.data.ok === true) callPhaseManager({ roomId, status: next[phase] });
    }
    setCountdown(null);
  }, [phase, roomId, user]);
  useEffect(() => {
    const phaseManager = async () => {
      switch (phase) {
        case "countdown":
          //게임 초기화
          const initGameInfo = () => {
            setNumber(0);
            quizListRef.current = quizList;
            setCurQuiz('');
            setMsg('');
            intervalRef.current = null;
          }
          initGameInfo();
          setMsg("게임이 곧 시작되니 준비하세요.");
          setCountdown(3);
          break;
        case "quiz":
          const processQuizPhase = () => {
            setNumber(prev => prev + 1);
            const idx = generateQuestion(quizListRef);
            quizListRef.current.splice(idx, 1);
            const quizInterval = setInterval(() => { //3초씩 5번
              setNumber(prev => {
                if (prev % 5 === 0) {
                  if (isHost) callPhaseManager({ roomId, status: "stance" });
                  clearInterval(quizInterval);
                  setCurQuiz('');
                  setCurAnswer('');
                  return prev;
                } else {
                  const idx = generateQuestion(quizListRef);
                  quizListRef.current.splice(idx, 1);
                  return prev + 1;
                }
              })
            }, 3000);
            intervalRef.current = quizInterval;
          }
          processQuizPhase();
          break;
        case "stance":
          setMsg("보스의 행동 패턴을 선택하세요.");
          break;
        case "battle":
          const res = await callResolveBattleTurn({ uid: user.uid, roomId });
          console.log(res?.data);
          const { turn, result } = res?.data || {};
          const { nextStatus } = result || {};
          playBattleSequence({
            turn,
            result,
            setDisplayTeamHp,
            setDisplayBossHp,
            bossMaxHp: boss?.hp,
            teamMaxHp: pets?.hp,
            onDone: () => callPhaseManager({ roomId, status: nextStatus })
          });
          break;
        case "end":

          break;
        default:
          break;
      }
    }
    phaseManager(phase);
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      intervalRef.current = null;
      setDone(false);
    }
  }, [phase]);
  //시작
  const handleStartGame = async () => {
    try {
      await callStartGame({ uid: user.uid, roomId, studentList });
    } catch (e) {
      console.error(e);
    }
  };

  //보스 스탠스
  const handleStanceOnClick = async (idx) => {
    setDone(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    try {
      await callSetBossStance({ uid: user.uid, roomId, stance: stanceList[idx] });
      setMsg("잠시 뒤 학생 행동 집계를 마감합니다.");
      setCountdown(5);
    }
    catch (err) { console.error(err); }
  }

  const handleFinalizeGame = async () => {
    try {
      await callFinalizeGame({ roomId });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MainContainer>
      <StatusUI />
      <PixiStage
        background={background}
        studentList={studentList}
        countdown={countdown}
        onDoneCountdown={onDoneCountdown}
        curQuiz={curQuiz}
        phase={phase}
        pets={pets}
        boss={boss}
        teamCurHp={displayTeamHp}
        bossCurHp={displayBossHp}
        animEvent={animEvent}
      />
      <InfoWrapper>
        <MsgWrapper>
          {phase === "quiz" && <p>{number}번 문제</p>}
          {phase !== "quiz" && <p>{msg}</p>}
        </MsgWrapper>
        <Column style={{ padding: "10px", gap: "5px" }}>
          <Text>남은 문제: {quizListRef.current.length}개</Text>
          <Text>페이즈: {phase}</Text>
          <Text>턴: {room?.turn}/{room?.maxTurn}</Text>
        </Column>
      </InfoWrapper>
      <ControllerUI>
        {phase === "waiting" && <TransparentBtn onClick={handleStartGame}>시작하기</TransparentBtn>}
        {phase !== "quiz" && <TransparentBtn onClick={() => {
          callPhaseManager({ roomId, status: "waiting" })
        }}>기다리기
        </TransparentBtn>}
        {/*행동 선택 */}
        <OptionWrapper>
          {phase === "stance" && stanceList?.map((stance, idx) => {
            const kor = { atk: "공격", def: "방어", rest: "치료" };
            return <TransparentBtn key={idx} onClick={() => handleStanceOnClick(idx)} disabled={done}>{kor[stance]}</TransparentBtn>
          })}
        </OptionWrapper>
        {phase !== "quiz" && <TransparentBtn onClick={() => {
          callFinalizeGame({ uid: user.uid, roomId, });
          navigate(-1);
        }}>종료하기</TransparentBtn>}
      </ControllerUI >
      {user.uid && <p>배틀 코드: {battleInfo.battleCode}</p>}
      <p>접속 친구</p>
      {players && <ul>
        {Object.entries(players).map(([uid, p]) => (
          <li key={uid}>
            {p.nickname}
          </li>
        ))}
      </ul>}
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
  background-color: #ddd;
  padding: 10px;
	border-radius: 0 0 10px 10px;
  z-index: 999;
  width: ${({ $isMobile }) => !$isMobile ? "1200px" : `${window.innerWidth}px;`};
}`
const OptionWrapper = styled(Row)`
	gap: 5px;
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
export default BattleroomThrPage

