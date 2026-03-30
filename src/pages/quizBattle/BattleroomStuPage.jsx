import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { callSubmitMyStance } from "../../firebase/config";
import PixiStage from './PixiStage';
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
import MainContainer from '../../components/Styled/MainContainer';
import TransparentBtn from '../../components/Btn/TransparentBtn';
import useQuizLogic from './hooks/useQuizLogic';
import useBattleLogic from './hooks/useBattleLogic';
import StatusUI from '../../components/Game/StatusUI';
import useGameroom from './hooks/useGameroom';

const BattleroomStuPage = () => {
	const user = useSelector(({ user }) => user);
	const { state: battleInfo } = useLocation();
	const { roomId, pet: myPet } = battleInfo || {}
	const navigate = useNavigate();
	//배경
	const { fetchImgUrl, fetchPathUrlMap } = useFetchStorageImg();
	const [background, setBackground] = useState(null);
	useEffect(() => { fetchImgUrl('images/battle_background.png', setBackground); }, []);
	//기본 정보
	const { room, players, pets, boss, phase, bossStance, quizList, quizListRef } = useGameroom(roomId);
	const studentList = useMemo(() =>
		Object.entries(players || {}).map(([uid, p], idx) => ({
			uid,
			nickname: p?.nickname,
			petInfo: p?.pet,
			index: idx,
		})),
		[players]);
	//스케쥴
	const intervalRef = useRef(null);
	//퀴즈
	const [number, setNumber] = useState(0);
	const [done, setDone] = useState(false);
	const [actionBall, setActionBall] = useState(0);
	const { curQuiz, optionList, marking, correctNumber, wrongList, setMarking, setCurQuiz, setCurAnswer, generateQuestion, checkAnswer, setCorrectNumber } = useQuizLogic(quizList);
	//전투 관련
	const round = useRef(1);
	const [msg, setMsg] = useState('');
	const { stanceList, animEvent, battleActionList, getRandomStance } = useBattleLogic(setMsg);
	const [myStance, setMyStance] = useState(null);
	//실시간 체력 1턴 이후부터 값 설정
	const [displayBossHp, setDisplayBossHp] = useState(null);
	const [displayTeamHp, setDisplayTeamHp] = useState(null);
	useEffect(() => {
		if (!bossStance) return;
		setMsg("보스가 행동을 결정했습니다. 5초 안에 행동을 결정하세요.");
		setCountdown(5);
	}, [bossStance]);
	// 카운트 다운
	const [countdown, setCountdown] = useState(0);
	useEffect(() => {
		const phaseManager = () => {
			console.log('페이즈 메니져 working', phase);
			switch (phase) {
				case "countdown":
					//게임 초기화
					const initGameInfo = () => {
						setNumber(0);
						quizListRef.current = quizList;
						setCurQuiz('');
						setCurAnswer('');
						setCorrectNumber(0);
						setActionBall(0);
						intervalRef.current = null;
					}
					initGameInfo();
					setCountdown(3);
					break;
				case "quiz":
					const processQuizPhase = () => {
						setMsg('');
						setDone(false);
						setNumber(prev => prev + 1);
						const idx = generateQuestion(quizListRef);
						quizListRef.current.splice(idx, 1);
						const quizInterval = setInterval(() => { //3초씩 5번
							setMarking(null);
							setDone(false);
							setNumber(prev => {
								if (prev % 5 === 0) {
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
					setMarking(null);
					setDone(false);
					setMsg("당신의 행동을 선택하세요");
					// setEnmActionEff(null);
					// setMyDmg(null);
					// setEnmDmg(null);
					// setEnmSkillEff(null);
					break;
				case "battle":
					// clearInterval(intervalRef.current);
					break;
				case "end":
					// processEndPhase();
					break;
				case "review":
					// setOptionList([]);
					break;
				default:
					break;
			}
		}
		phaseManager(phase);
		return () => {
			clearInterval(intervalRef.current);
		}
	}, [phase]);
	//버튼 클릭
	const handleOptionOnClick = (idx) => {
		if (done) return;
		setDone(true);
		checkAnswer(idx, setActionBall);
	}
	//행동 결정
	const handleStanceOnClick = async (idx) => {
		setDone(true);
		setMsg("을 선택했습니다. 보스의 턴을 기다리는 중...");
		try {
			const res = await callSubmitMyStance({ roomId, stance: stanceList[idx], actionBall });
			const { summary, turn } = res.data || {};
			const { submittedCount, atk, def, rest } = summary || {};
			setMsg(`${turn}턴, ${submittedCount}명의 합산 공격력${atk}, 방어력${def}, 치유력${rest} `);
			setActionBall(0);
		}
		catch (err) {
			console.error(err);
		}
	}

	return (
		<MainContainer>
			<div style={{ margin: "0 auto" }}>
				<StatusUI
					myPet={myPet}
					mySpec={{ atk: myPet?.atk, def: myPet?.def, hp: myPet?.hp, mat: myPet?.rest }}
				/>
				<PixiStage
					background={background}
					studentList={studentList}
					countdown={countdown}
					onDoneCountdown={() => setCountdown(null)}
					curQuiz={curQuiz}
					phase={phase}
					pets={pets}
					boss={boss}
					teamCurHp={displayTeamHp}
					bossCurHp={displayBossHp}
					animEvent={animEvent}
					marking={marking}
					actionBall={actionBall}
				/>
				<InfoWrapper>
					<MsgWrapper>
						{phase === "quiz" && <p>{number}번 문제, {marking === true && "맞췄습니다"} {marking === false && "틀렸습니다"}</p>}
						{<p>{msg}</p>}
					</MsgWrapper>
					<Column style={{ padding: "10px", gap: "5px" }}>
						<Text>남은 문제: {quizListRef.current.length}개</Text>
						<Text>맞춘 개수: {correctNumber}개</Text>
						<Text>페이즈: {phase}</Text>
					</Column>
				</InfoWrapper>
				<ControllerUI>
					{/* 문항 선지 */}
					<OptionWrapper>
						{phase === "quiz" && optionList?.map((option, idx) =>
							<TransparentBtn key={idx} onClick={() => handleOptionOnClick(idx)} disabled={done}>{option}</TransparentBtn>)}
						{/* 학생용 */}
						{phase === "stance" && stanceList?.map((stance, idx) => {
							const kor = { atk: "공격", def: "방어", rest: "치료" };
							return <TransparentBtn key={idx} onClick={() => handleStanceOnClick(idx)} disabled={done} >{kor[stance]}</TransparentBtn>
						})}
					</OptionWrapper>
					{phase !== "quiz" && <TransparentBtn onClick={() => { navigate(-1); }}>종료하기</TransparentBtn>}
				</ControllerUI >
				<p>접속 친구</p>
				{players && <ul>
					{Object.entries(players).map(([uid, p]) => (
						<li key={uid}>
							{p.nickname}
						</li>
					))}
				</ul>}
			</div>
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
export default BattleroomStuPage

