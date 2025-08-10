//라이브러리
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stage, Text } from '@pixi/react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//컴포넌트
import Background from '../../components/Game/Background';
import PetSprite from '../../components/Game/PetSprite';
import MainBtn from '../../components/Btn/MainBtn';
import SpeechBublSprite from '../../components/Game/SpeechBublSprite';
import Countdown from '../../components/Game/Countdown';
import QuizUI from '../../components/Game/QuizUI';
import MarkingUI from '../../components/Game/MarkingUI';
import TransparentBtn from '../../components/Btn/TransparentBtn';
import DamageText from '../../components/Game/Skills/DamageText';
//hooks
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
import useFireGameData from '../../hooks/Firebase/useFireGameData';
import useFireQuizData from '../../hooks/Firebase/useFireQuizData';
import useQuizLogic from '../../hooks/Game/useQuizLogic';
//이미지
import qustion_icon from '../../image/icon/question.png';
import MessageUI from '../../components/Game/MessageUI';
import ActionBallUI from '../../components/Game/ActionBallUI';
import useBattleLogic from '../../hooks/Game/useBattleLogic';
import HPBarUI from '../../components/Game/HPBarUI';
import BasicAttack from '../../components/Game/Skills/BasicAttack';
import BasicDefense from '../../components/Game/Skills/BasicDefense';
import BasicRest from '../../components/Game/Skills/BasicRest';
import SkillAttack from '../../components/Game/Skills/SkillAttack';
import GameListener from './GameListener';
import BattleReport from '../../components/Game/BattleReport';
import StatusUI from '../../components/Game/StatusUI';
//데이터
import { skillList } from "../../data/skillList";
import useMediaQuery from '../../hooks/useMediaQuery';
import PixiMobileStage from './PixiMobileStage';
import ReviewSection from './ReviewSection';
//생성(250722)
const QuizBattleMultiPage = () => {
  //준비
  const allSkillMap = new Map(skillList.map(item => [item.name, item]));
  const user = useSelector(({ user }) => user);
  const { state: gameId } = useLocation();
  useEffect(() => {
    downloadImg();
    clearInterval(quizIntervalRef.current);
    sendConnectSign(gameId);
    const interval = setInterval(() => { sendConnectSign(gameId); }, 10000); // 10초마다 한 번
    return () => clearInterval(interval);
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    gameroomListener({ gameId, callback: gameListener });
    gameroomSubColListener(gameId, setIsConnect);
  }, [gameId]);
  const [isConnect, setIsConnect] = useState(false);
  useEffect(() => { connectionListener(); }, [isConnect]);
  const { fetchImgUrl, fetchPathUrlMap } = useFetchStorageImg();
  const { fetchQuizData } = useFireQuizData();
  const [isMaster, setIsMaster] = useState(null);
  useEffect(() => { if (isMaster) setMessageList((prev) => [...prev, "당신은 방장입니다."]); }, [isMaster])
  //전반
  const [background, setBackground] = useState(null);
  const [speechBubl, setSpeechBubl] = useState(null);
  const [playerList, setPlayerList] = useState([]);
  const [petList, setPetList] = useState([]);
  const [petCurList, setPetCurList] = useState([]);
  const [phase, setPhase] = useState("waiting");
  useEffect(() => { phaseManager(); }, [phase]);
  const [messageList, setMessageList] = useState(['', '']); //처음부터 진하게
  //펫 
  const [myUserData, setMyUserData] = useState(null);
  const [myPet, setMypet] = useState(null);
  useEffect(() => { bindPetData({ pet: myPet, setImg: setMyPetImg, setSpec: setMySpec, setSkill: setMySkillList, back: true }) }, [myPet]);
  const [myPetImg, setMyPetImg] = useState(null);
  const [mySpec, setMySpec] = useState(null);
  const [myCurHp, setMyCurHp] = useState(null);
  const [mySkillList, setMySkillList] = useState([]);
  const [skillCooldownList, setSkillCooldownList] = useState({});
  //적
  const [enmUserData, setEnmUserData] = useState(null);
  useEffect(() => { enmUserListener(); }, [enmUserData]);
  const [enmPet, setEnmPet] = useState(null);
  useEffect(() => { bindPetData({ pet: enmPet, setImg: setEnmPetImg, setSpec: setEnmSpec, setSkill: setEnmSkillLilst, back: false }) }, [enmPet]);
  const [enmPetImg, setEnmPetImg] = useState(null);
  const [enmSpec, setEnmSpec] = useState(null);
  const [enmCurHp, setEnmCurHp] = useState(null);
  const [enmSkillList, setEnmSkillLilst] = useState([]);
  useEffect(() => { downloadSkillImg(); }, [mySkillList, enmSkillList]);
  //레디
  const timeoutRef = useRef({});
  const [countdown, setCountdown] = useState(0);
  const [imReady, setImReady] = useState(false);
  useEffect(() => {
    if (phase === "stance") { setCountdown(0); clearTimeout(timeoutRef.current); }
  }, [imReady]);
  const [enmReady, setEnmReady] = useState(false);
  useEffect(() => {
    if (phase === "stance" && enmReady && !imReady) { timeoutRef.current = setTimeout(() => { setMessageList((prev) => [...prev, "5초 안에 행동을 선택해주세요"]); setCountdown(5); }, 5000); }
  }, [enmReady]);
  //퀴즈
  const [quizList, setQuizList] = useState(null);
  useEffect(() => { bindQuizData(); }, [quizList]);
  const quizListRef = useRef([]);
  const [frozenAnswerList, setFrozenAnswerList] = useState([]);
  const quizNumberRef = useRef(0);
  const quizIntervalRef = useRef({});
  const [curQuiz, setCurQuiz] = useState(null);
  const [curAnswer, setCurAnswer] = useState(null);
  useEffect(() => { setOptionList(formQuizOptionList({ answer: curAnswer, meaningList: frozenAnswerList })); }, [curAnswer]);	//문제 선지 구성
  const [optionList, setOptionList] = useState([]);
  const [marking, setMarking] = useState(null);
  const [hasDone, setHasDone] = useState(false);
  const [correctNumber, setCorrectNumber] = useState(0);
  const [wrongList, setWrongList] = useState([]);
  //전투
  const [stance, setStance] = useState(null);
  const [isSkillMode, setIsSkillMode] = useState(false);
  useEffect(() => { stanceListener({ stance, phase, battleActions, hasDone, battleTurn, stances }); }, [stance]);
  const [battleTurn, setBattleTurn] = useState(null);
  const [actionBall, setActionBall] = useState(0);
  const [myDmg, setMyDmg] = useState(null);
  const [myActionEff, setMyActionEff] = useState(null);
  const [mySkillEff, setMySkillEff] = useState(null);
  useEffect(() => { myActionEffListener({ myActionEff, stance, setActionBall }); }, [myActionEff]);
  const [enmDmg, setEnmDmg] = useState(null);
  const [enmActionEff, setEnmActionEff] = useState(null);
  const [enmSkillEff, setEnmSkillEff] = useState(null);
  useEffect(() => { enmActionEffListener({ enmActionEff, stance, setActionBall }); }, [enmActionEff]);
  //스킬 이펙트 url 맵
  const [skillEffMap, setSkillEffMap] = useState(null);
  //종료
  const [loser, setLoser] = useState(null);
  useEffect(() => { loserListener({ phase, loser, enmUserData, correctNumber }) }, [loser])
  const [exitList, setExitList] = useState([]);
  //hooks
  const { gameroomListener, updateGameroom, deleteGameRooom, sendConnectSign, gameroomSubColListener, exitGameroom } = useFireGameData();
  const { stances, battleActions, selectStance, getSkillOptions, selectAction, checkActionBall, selectSkill } = useBattleLogic({ gameId, setMessageList, setSkillCooldownList, setStance, setIsSkillMode, setActionBall });
  const { exitInfoListener, myActionEffListener, enmActionEffListener, loserListener, stanceListener } = GameListener({ setMessageList, setOptionList });
  const { formQuizOptionList, generateQuestion, checkAnswer } = useQuizLogic({ gameId, setHasDone, setMarking, setCurQuiz, setCurAnswer, setCorrectNumber, setActionBall, setWrongList, setMessageList });
  useEffect(() => { exitInfoListener(exitList); }, [exitList]);
  //모드
  const isMobile = useMediaQuery("(max-width: 767px)");
  //------함수부-------------------------------------------------------
  //게임 데이터 전반
  const gameListener = (data) => {
    if (data === null) return;
    const { pets, petCurStat, players, master, phase, quizId, battleTurn, exit, loser } = data;
    const myPet = pets.find((pet) => pet.petId === user.uid);
    const myCurStat = petCurStat.find((pet) => pet.petId === user.uid);
    const enmPet = pets.find((pet) => pet.petId !== user.uid);
    const enmCurStat = petCurStat.find((pet) => pet.petId !== user.uid);
    const myData = players.find((player) => player.uid === user.uid);
    const enmData = players.find((player) => player.uid !== user.uid);
    setPlayerList(players);
    setPetList(pets);
    setPetCurList(petCurStat);
    setMypet(myPet); //todo 처음 한번만
    setEnmPet(enmPet); //todo 처음 한번만
    setMyUserData(myData);
    setEnmUserData(enmData);
    setImReady(myData?.isReady || false);
    setEnmReady(enmData?.isReady || false);
    setIsMaster(user.uid === master);
    setPhase(phase); //클라이언트에서 변경 금지
    fetchQuizData(quizId).then((data) => { setQuizList(data.quizList); });
    setBattleTurn(battleTurn);
    setExitList(exit || []);
    setLoser(loser);
    //전투 이펙트 적용
    bindCurData({ curStat: myCurStat, setCurHp: setMyCurHp, setActionEff: setMyActionEff, setDmg: setMyDmg, setSkillEff: setMySkillEff, setSkillCooldownList });
    bindCurData({ curStat: enmCurStat, setCurHp: setEnmCurHp, setActionEff: setEnmActionEff, setDmg: setEnmDmg, setSkillEff: setEnmSkillEff })
  }
  //네트워크 리스너
  const connectionListener = (isConnect, phrase) => {
    if (!isConnect) {
      if (phase === "waiting" || phase === "end" || !phase) return;
      setMessageList(prev => [...prev, "상대방의 연결이 불안정합니다."]);
    }
  }
  //상대방 정보
  const enmUserListener = () => {
    if (!enmUserData || phase !== "waiting") return;
    if (isMaster) { setMessageList((prev) => [...prev, `${enmUserData.name}님이 입장하셨습니다.`]); }
  }
  //퀴즈 데이터
  const bindQuizData = () => {
    if (!quizList) return;
    if (quizListRef.current?.length > 0) return;
    quizListRef.current = quizList;
    const meanings = quizList.map((voca) => voca.split("#")[1]);
    setFrozenAnswerList(meanings);
  }
  //펫 데이터
  const bindPetData = ({ pet, setImg, setSpec, setSkill, back }) => {
    if (!pet) return
    const { spec, skills, path, path_back } = pet;
    if (back) fetchImgUrl(path_back || path, setImg);
    else fetchImgUrl(path, setImg);
    setSpec(spec);
    if (skills) {
      const thisPetSkills = skills.map(skill => allSkillMap.get(skill.name));
      setSkill(thisPetSkills || []);
    }
  }
  //스킬 이펙트 초기 다운로드 => 브라우져에 저장
  const downloadSkillImg = async () => {
    const total = [...mySkillList, ...enmSkillList].map((skill) => skill.imgPath);
    if (total.length === 0) return;
    const map = await fetchPathUrlMap(total);
    setSkillEffMap(map);
  }
  //전투 중 펫 데이터
  const bindCurData = ({ curStat, setCurHp, setActionEff, setDmg, setSkillEff, setSkillCooldownList }) => {
    if (!curStat) return;
    const { type, curHp, dmg, heal, skillEffect, sideEffect, } = curStat;
    setCurHp(curHp);
    setActionEff(type || null);
    setDmg(dmg || -heal || null);
    setSkillEff(skillEffect || null);
    if (setSkillCooldownList) setSkillCooldownList(sideEffect || {});
  }
  //배경 및 이미지
  const downloadImg = () => {
    fetchImgUrl('images/battle_background.png', setBackground);
    fetchImgUrl('images/store_speech_bubble.png', setSpeechBubl);
  }
  //페이즈 관리자
  const phaseManager = () => {
    switch (phase) {
      case "waiting":
        setOptionList([]);
        setMessageList((prev) => [...prev, "방에 입장하셨습니다."]);
        if (isMaster) { setMessageList((prev) => [...prev, "당신은 방장입니다."]); }
        break;
      case "startCounting":
        setCountdown(3);
        setMessageList((prev) => [...prev, "게임이 곧 시작됩니다. 준비하세요."]);
        break;
      case "quiz":
        setHasDone(false);
        setMessageList((prev) => [...prev, "퀴즈 스타트!!"]);
        processQuizPhase(battleTurn);
        break;
      case "stance":
        setHasDone(false);
        setMessageList((prev) => [...prev, `${battleTurn}턴에 어떤 행동을 할까요?`]);
        setOptionList(stances);
        setTimeout(() => {
          setStance(null);
          updateGameroom({ gameId, info: { petCurStat: petCurList.map((cur) => ({ ...cur, type: null })) } });
        }, 1000);
        break;
      case "battle":
        setHasDone(false);
        setOptionList([]);
        break;
      case "end":
        processEndPhrase();
        break;
      default:
        break;
    }
  }
  //단계별 버튼
  const handleOptionOnClick = (index) => {
    switch (phase) {
      case "quiz":
        setHasDone(true);
        checkAnswer({ index, curQuiz, curAnswer, optionList, quizNumberRef });
        break;
      case "stance":
        if (!stance) { selectStance(index, setStance); }
        else {
          if (!isSkillMode) {
            if (index === 0) { 				//기본 버튼
              if (!checkActionBall({ stance, actionBall, cost: 0 })) return;
              selectAction({ spec: mySpec, stance, playerList });
              setHasDone(true);
            } else if (index === 1) { //스킬 사용
              setIsSkillMode(true);
              const skillOptions = getSkillOptions(mySkillList, stance);
              setOptionList(skillOptions);
            } else { 								  //취소
              setStance(null);
              setIsSkillMode(false);
            }
          } else { //스킬 보기
            const selected = allSkillMap.get(optionList[index]);
            if (selectSkill({ index, selected, skillCooldownList, actionBall, spec: mySpec, playerList })) setHasDone(true);
            setIsSkillMode(false);
          }
        }
        break;
      default:
        break;
    }
  }
  //시작(방장)
  const handleStartOnClick = () => {
    const newPlayers = playerList.map((player) => ({ ...player, isReady: player.isReady = false }));
    updateGameroom({ gameId, info: { phase: "startCounting", players: newPlayers, leftQuizNumber: quizList.length } })
  }
  //퀴즈 세션
  const processQuizPhase = (battleTurn) => {
    generateQuestion({ quizListRef, quizNumberRef, isMulti: true });
    const quizInterval = setInterval(() => { //3초간 5번
      generateQuestion({ quizListRef, quizNumberRef, isMulti: true });
      if (quizNumberRef.current % 5 === 0) {
        clearInterval(quizIntervalRef.current); //제거
        setTimeout(() => {
          if (isMaster) updateGameroom({ gameId, info: { phase: "stance", battleTurn: Number(battleTurn) + 1 } })
        }, 3000);
      }
    }, 3000);
    quizIntervalRef.current = quizInterval;
  }
  //엔딩
  const processEndPhrase = () => {
    setMessageList((prev) => [...prev, "게임이 종료되었습니다."])
    setOptionList([]);
    clearInterval(quizIntervalRef.current);
    setHasDone(false);
    setActionBall(0);
  }
  //레디
  const handleReadyOnClick = () => {
    const isReady = myUserData.isReady;
    const myNewData = { ...myUserData, isReady: !isReady };
    const newPlayers = playerList.map((player) => player.uid === user.uid ? myNewData : player);
    updateGameroom({ gameId, info: { players: newPlayers } });
  }
  //방 나가기
  const handleExitOnClick = () => {
    const confirm = window.confirm(playerList.length === 2 ? "방을 나가시겠습니까?" : "방을 나가면 방이 삭제됩니다. 나가시겠습니까?");
    if (!confirm) return;
    if (playerList.length === 2) { exitGameroom({ gameId, petList, petCurList, playerList, exitList, enmUserData }); }
    else if (playerList.length === 1) { deleteGameRooom(gameId); }
    navigate(-1);
  }
  //카운트 끝
  const endCountDown = () => {
    if (isMaster && phase === "startCounting") updateGameroom({ gameId: gameId, info: { phase: "quiz" } });
    if (phase === "stance") {
      selectAction({ stance: "rest", spec: mySpec, playerList });
      setMessageList((prev) => [...prev, "펫에게 명령하지 않아 휴식을 취합니다."]);
    }
    setCountdown(0);
    clearTimeout(timeoutRef.current);
  }
  return (
    <Container>
      {/* 상단 상태창 */}
      <StatusUI isMaster={isMaster} myUserData={myUserData} myPet={myPet} mySpec={mySpec} enmUserData={enmUserData} enmPet={enmPet} enmSpec={enmSpec} imReady={imReady} enmReady={enmReady} isMobile={isMobile} />
      {(!isMobile && phase !== "review") && <Stage width={1200} height={900}>
        {/* 기본UI */}
        {background && <Background src={background} x={0} y={0} width={1200} height={900} />}
        <Text text={`남은 문제: ${quizListRef.current.length}개`} x={150} y={50} anchor={0.5} style={{ fontSize: 24, fontWeight: 'bold', }} ></Text>
        <Text text={`현재 점수: ${correctNumber * 100}점`} x={1050} y={50} anchor={0.5} style={{ fontSize: 24, fontWeight: 'bold', }} ></Text>
        <ActionBallUI x={350} y={600} width={400} height={60} correctAnswer={actionBall} />
        <MessageUI messages={messageList} x={350} y={700} width={800} height={175} />
        {/* 레디 */}
        {imReady && <SpeechBublSprite src={speechBubl} x={450} y={550} reverse={true} />}
        {enmReady && <SpeechBublSprite src={speechBubl} x={800} y={150} width={100} height={50} fontSize={30} />}
        {/* 카운트다운 */}
        {(countdown > 0) && <Countdown isCountdown={countdown > 0} count={countdown} endCountCallback={endCountDown} x={600} y={400} />}
        {/* 퀴즈 */}
        {(phase === "quiz") && <>
          <QuizUI x={600} y={350} width={250} height={80} pivotX={125} pivotY={40} quiz={curQuiz} />
          {marking === true && <MarkingUI x={600} y={350} radius={75} correct={marking} />}
          {marking === false && <MarkingUI x={600} y={350} crossSize={125} correct={marking} />}
        </>}
        {/* 펫 */}
        {myPetImg && <PetSprite src={myPetImg} x={150} y={750} width={400} height={400} trigger={enmActionEff === "atk" || enmSkillEff} movingPoint={35} />}
        <HPBarUI x={75} y={575} width={150} height={15} curHp={myCurHp || 0} maxHp={mySpec?.hp || 0} />
        {enmPet && <PetSprite src={enmPetImg || qustion_icon} x={1000} y={230} width={230} height={230} trigger={myActionEff === "atk" || mySkillEff} movingPoint={-35} />}
        <HPBarUI x={925} y={120} width={150} height={12} curHp={enmCurHp || 0} maxHp={enmSpec?.hp || 0} />
        {/* 내 AddOn 이펙트 */}
        {myDmg && <DamageText x={250} y={500} value={myDmg} type={"dmg"} />}
        {myActionEff && <>
          <BasicAttack x={200} y={750} width={150} height={150} trigger={myActionEff === "atk"} />
          <BasicDefense x={100} y={750} radius={200} trigger={myActionEff === "def"} />
          <BasicRest x={150} y={750} size={50} thick={15} movingPoint={900} trigger={myActionEff === "rest"} />
        </>}
        {/* 상대 AddOn 이펙트 */}
        {enmDmg && <DamageText x={875} y={175} value={enmDmg} type={"dmg"} />}
        {enmActionEff && <>
          <BasicAttack x={950} y={175} width={75} height={75} trigger={enmActionEff === "atk"} />
          <BasicDefense x={1000} y={200} radius={100} trigger={enmActionEff === "def"} />
          <BasicRest x={1000} y={255} size={35} thick={10} movingPoint={300} trigger={enmActionEff === "rest"} />
        </>}
        {/* 스킬 이펙트 */}
        {skillEffMap && <>
          {mySkillEff && <SkillAttack x={200} y={750} width={500} height={500} effect={mySkillEff} skillEffMap={skillEffMap} />}
          {enmSkillEff && <SkillAttack x={950} y={175} width={250} height={250} effect={enmSkillEff} skillEffMap={skillEffMap} />}
        </>}
        {phase === "end" && <BattleReport x={350} y={100} result={loser === user.uid ? "Lose" : "Win"} correct={correctNumber} isMulti={true} />}
      </Stage>}
      {/* 모바일 페이지 */}
      {(isMobile && phase !== "review") &&
        <PixiMobileStage background={background} phase={phase} quizListRef={quizListRef} score={correctNumber * 100} actionBall={actionBall} messageList={messageList}
          myCurHp={myCurHp} mySpec={mySpec} enmImg={enmPetImg} imReady={imReady} enmReady={enmReady}
          countdown={countdown} endCountCallback={endCountDown} curQuiz={curQuiz} marking={marking}
          myActionEff={myActionEff} enmActionEff={enmActionEff} myDmg={myDmg} enmDmg={enmDmg}
          skillEffMap={skillEffMap} mySkillEff={mySkillEff} enmSkillEff={enmSkillEff} loser={loser} correctNumber={correctNumber} isMulti={true}
        />}
      {/* 리뷰 phase */}
      {phase === "review" && <ReviewSection incorrectList={wrongList} />}
      <ControllerUI $isMobile={isMobile}>
        {(phase === "waiting") && <>
          {(imReady && enmReady && isMaster) && <MainBtn onClick={handleStartOnClick}>Start</MainBtn>}
          <MainBtn onClick={handleReadyOnClick}>Ready</MainBtn>
          <MainBtn onClick={handleExitOnClick}>방 나가기</MainBtn>
        </>}
        {optionList?.length !== 0 && optionList?.map((option, index) => <TransparentBtn key={index} onClick={() => { handleOptionOnClick(index) }} disabled={hasDone}>{option}</TransparentBtn>)}
        {phase === "end" && <MainBtn onClick={() => setPhase("review")}>틀린 문제</MainBtn>}
        {(phase === "end" || phase === "review") && <MainBtn onClick={handleExitOnClick}>종료하기</MainBtn>}
      </ControllerUI>
      {/* <TempUi>
				<Column style={{ gap: "5px" }}>
					<MainBtn onClick={() => { updateGameroom({ gameId, info: { phase: "waiting" } }) }}>waiting</MainBtn>
					<MainBtn onClick={() => { updateGameroom({ gameId, info: { phase: "end" } }) }}>end</MainBtn>
					<MainBtn onClick={() => { updateGameroom({ gameId, info: { phase: "stance" } }) }}>stance</MainBtn>
					<MainBtn onClick={() => {
						updateGameroom({ gameId, info: { petCurStat: [{ petId: user.uid, curHp: mySpec.hp, type: null }, { petId: enmPet.petId, curHp: enmSpec.hp, type: null }], battleTurn: 1, actions: [] } })
					}}>temp초기화</MainBtn>
				</Column>
				<p>{battleTurn}턴</p>
				<p>{phase} 페이즈</p>
			</TempUi> */}
    </Container >
  )
}

const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
const Container = styled(Column)`
	align-items: center;
	box-sizing: border-box;
	position: relative;
	@media (max-width: 768px) {
    display: grid;
    width: ${window.innerWidth}px;
    grid-template-rows: 110px auto;
  }
`
const ControllerUI = styled(Row)`
  justify-content: center;
  background-color: #ddd;
  margin-top: -6px;
  padding: 16px;
	border-radius: 0 0 10px 10px;
	z-index: 999;
	gap: ${({ $isMobile }) => !$isMobile ? "100px" : "10px"};
	flex-direction: ${({ $isMobile }) => !$isMobile ? "row" : "column"};
	width: ${({ $isMobile }) => !$isMobile ? "1200px" : `${window.innerWidth}px;`};
`
const TempUi = styled(Column)`
	position: absolute;
  justify-content: center;
	right: 0;
	background-color: #ddd;
`
export default QuizBattleMultiPage