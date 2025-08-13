//라이브러리
import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
//Section
import PixiResponsiveStage from './PixiResponsiveStage';
import ReviewSection from './ReviewSection';
//컴포넌트
import TransparentBtn from '../../components/Btn/TransparentBtn';
import StatusUI from '../../components/Game/StatusUI';
//hooks
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
import useFireBasic from '../../hooks/Firebase/useFireBasic';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import useBattleLogic from '../../hooks/Game/useBattleLogic';
import useLevel from '../../hooks/useLevel';
import useMediaQuery from '../../hooks/useMediaQuery';
import useQuizLogic from '../../hooks/Game/useQuizLogic';
//img
import useFireActiData from '../../hooks/Firebase/useFireActiData';
//Data
import { skillList } from '../../data/skillList';
//250111 생성
const QuizBattleSingleSection = ({ quizSetId, selectedPet, monsterDetails, gameDetails, }) => {
  const user = useSelector(({ user }) => user);
  const allSkillMap = new Map(skillList.map(item => [item.name, item]));
  const navigate = useNavigate();
  //펫 데이터
  useEffect(() => { setMyPetDetails(selectedPet); }, [selectedPet])
  const [myPetDetails, setMyPetDetails] = useState(null);
  useEffect(() => { bindMyPetData(); }, [myPetDetails]);
  useEffect(() => { bindEnmData(); }, [monsterDetails]);
  useEffect(() => { idListener(); }, [quizSetId, selectedPet]);
  const { gainXp } = useLevel();   //레벨 관련
  const { fetchImgUrl, fetchPathUrlMap } = useFetchStorageImg(); //이미지 불러오기
  const { fetchDoc } = useFireBasic("quiz");
  const { updateUserPetGameInfo, updateUserArrayInfo } = useFireUserData();
  const { updateGameResult } = useFireActiData();
  const [quizList, setQuizList] = useState([]);
  useEffect(() => { bindQuizData(); }, [quizList]);
  //문제 준비
  const [frozenAnswerList, setFrozenAnswerList] = useState(quizList?.map((quizSet) => quizSet.split("#")[1]))
  const quizListRef = useRef([]);
  //그래픽 준비
  const [enmImg, setEnmImg] = useState(null);
  const [background, setBackground] = useState(null);
  const [myPetImg, setMyPetImg] = useState(null);
  const [myPetBackImg, setMyPetBackImg] = useState(null);
  //게임 페이즈
  const [phase, setPhase] = useState("ready");
  useEffect(() => { phaseManager(); return () => clearInterval(intervalRef.current) }, [phase]);
  const [countdown, setCountdown] = useState(0); // 카운트다운 활성 상태
  //상태메세지
  const [messageList, setMessageList] = useState(['', '']);
  //문제 관련
  const intervalRef = useRef();
  const quizNumberRef = useRef(1);                     //문항 번호, 인터벌 반복 횟수
  const [curQuiz, setCurQuiz] = useState('')
  const [curAnswer, setCurAnswer] = useState('');
  useEffect(() => { setOptionList(formQuizOptionList({ answer: curAnswer, meaningList: frozenAnswerList })); }, [curAnswer]);	//문제 선지 구성
  const [optionList, setOptionList] = useState([]);
  const [actionBall, setActionBall] = useState(0)
  //채점
  const [marking, setMarking] = useState(null);                      //문제 정오
  const [correctNumber, setCorrectNumber] = useState(0);             //맞춘 개수
  const [wrongList, setWrongList] = useState([]);                    //틀린 문제 
  //전투 관련
  const battleTurnRef = useRef(1);
  const [pharseTurn, setPhraseTurn] = useState(1);
  useEffect(() => { phraseTurnListener(); }, [pharseTurn])
  //내 펫 정보
  const [mySpec, setMySpec] = useState(null);
  const [myStance, setMyStance] = useState(null);
  const [myLevel, setMyLevel] = useState(null);
  const [myCurHP, setMyCurHP] = useState(100);
  const [mySkillList, setMySkillList] = useState([]);
  const [skillCooldowns, setSkillCooldowns] = useState({});
  useEffect(() => { downloadSkillImg() }, [mySkillList]);
  //상대 몬스터 정보
  const [enmSpec, setEnmSpec] = useState(null);
  const [enmLevel, setEnmLevel] = useState(1);
  const [enmExp, setEnmExp] = useState(3);
  const [enemyCurHP, setEnemyCurHP] = useState(100);
  const [hasDone, setHasDone] = useState(false);
  //이펙트 
  const [myActionEff, setMyActionEff] = useState(null);
  const [enmActionEff, setEnmActionEff] = useState(null);
  const [enmSkillEff, setEnmSkillEff] = useState(null);
  const [myDmg, setMyDmg] = useState(null);
  const [enmDmg, setEnmDmg] = useState(null);
  //스킬 이펙트 url 맵
  const [skillEffMap, setSkillEffMap] = useState(null);
  //승리
  const [myRecordList, setMyRecordList] = useState([]);   //퀴즈 참여 기록
  const [myWinCount, setMyWinCount] = useState(0);        //승리 횟수
  useEffect(() => { bindRewardData(); }, [myWinCount]);
  const [rewardPoint, setRewardPoint] = useState(null);      //승리 횟수에 따른 보상 시점
  const [reward, setReward] = useState('');                  //승리 횟수에 따른 보상 문구
  useEffect(() => { setMyWinCount(countWinRecord()) }, [myRecordList])
  //hooks
  const { stances, getRandomStance, attackSequence, defenseSequence, restSequence, getSkillOptions } = useBattleLogic(
    { setMessageList, setMyCurHP, setEnemyCurHP, setActionBall, setEnmSkillEff, setMyActionEff, setEnmActionEff, setMyDmg, setEnmDmg });
  const { generateQuestion, checkAnswer, formQuizOptionList } = useQuizLogic({ setPhase, setHasDone, setMarking, setCurQuiz, setCurAnswer, setCorrectNumber, setActionBall, setWrongList, setMessageList });
  //게임 종료 //에니메이션 플레이 위한 지연
  useEffect(() => { if (enemyCurHP <= 0 || myCurHP <= 0) { setTimeout(() => { setPhase("end") }, 1000) } }, [enemyCurHP, myCurHP]) //종료 조건
  const [result, setResult] = useState(null);
  useEffect(() => { finalizeGame(); }, [result])
  //모드
  const isMobile = useMediaQuery("(max-width: 767px)");
  //------함수부------------------------------------------------
  //게임 리스너  
  const idListener = () => {
    if (!quizSetId) return;
    fetchImgUrl('images/battle_background.png', setBackground);
    fetchDoc(quizSetId).then((quizSetInfo) => { setQuizList(quizSetInfo.quizList) });
  }
  //내부 턴 리스너
  const phraseTurnListener = () => {
    if (phase !== "battle" && phase !== "skill") return;
    if (pharseTurn > 3) setPhase("quiz");
    else setPhase("stance");
  }
  //스킬 이펙트 초기 다운로드 => 브라우져에 저장
  const downloadSkillImg = async () => {
    const total = [...mySkillList].map((skill) => skill.imgPath);
    if (total.length === 0) return;
    const map = await fetchPathUrlMap(total);
    setSkillEffMap(map);
  }
  //퀴즈 데이터
  const bindQuizData = () => {
    if (quizList.length === 0) return;
    quizListRef.current = quizList;
    const meanings = quizList.map((voca) => voca.split("#")[1]);
    setFrozenAnswerList(meanings);
  }
  //내 pet
  const bindMyPetData = () => {
    if (!myPetDetails) return;
    const teacherPet = { spec: { atk: 80, def: 10, hp: 400, mat: 180, mdf: 55, spd: 55 }, path: "images/pet/pet_water_001_4.png", path_back: "images/pet/pet_water_001_4_back.png", level: { exp: 999, level: 100, nextLvXp: 1000, nextStepLv: 500 } }
    let { spec, skills, quizRecord, path, path_back, level } = myPetDetails;
    const thisPetSkills = skills?.map(skill => allSkillMap.get(skill.name))
    if (user.isTeacher) { spec = teacherPet.spec; skills = []; path = teacherPet.path; path_back = teacherPet.path_back }
    fetchImgUrl(path, setMyPetImg);
    fetchImgUrl(path_back || path, setMyPetBackImg);
    setMySpec(spec);
    setMyCurHP(Math.floor(spec.hp));
    setMyLevel(level);
    setMySkillList(thisPetSkills || []);
    if (quizRecord) {
      const key = gameDetails.id;
      const thisRecordList = quizRecord[key] || [];
      setMyRecordList(thisRecordList);
    }
  }
  //적 pet
  const bindEnmData = () => {
    if (!monsterDetails) return
    const { spec, path } = monsterDetails;
    setEnmSpec(spec);
    fetchImgUrl(path, setEnmImg);
    setEnmLevel(monsterDetails.level);
    setEnemyCurHP(spec.hp);
  }
  //카운트 다운 끝내기
  const endCountdown = () => {
    setPhase("quiz");
    setCountdown(0);
  }
  //퀴즈 세션
  const processQuizPhase = () => {
    generateQuestion({ quizListRef, quizNumberRef, isMulti: false });
    const quizInterval = setInterval(() => { //3초간 5번
      generateQuestion({ quizListRef, quizNumberRef, isMulti: false });
      if (quizNumberRef.current % 5 === 0) {
        clearInterval(intervalRef.current); //제거
        setTimeout(() => { setPhase("stance"); }, 3000);
      }
    }, 3000);
    intervalRef.current = quizInterval;
  }
  //페이즈 관리자
  const phaseManager = () => {
    switch (phase) {
      case "ready":
        initGameInfo();
        break;
      case "countdown":
        setMessageList((prev) => [...prev, "게임이 곧 시작됩니다. 준비하세요"]);
        setCountdown(3);
        break;
      case "quiz":
        setMessageList((prev) => [...prev, "퀴즈 스타트!!"]);
        setHasDone(false);
        processQuizPhase();
        setPhraseTurn(1);
        break;
      case "stance":
        ++battleTurnRef.current
        setCurQuiz('');
        setMessageList((prev) => [...prev, `${battleTurnRef.current}턴에 어떤 행동을 할까요?`]);
        setMarking(null);
        setHasDone(false);
        setOptionList(stances);
        setMyActionEff(null);
        setEnmActionEff(null);
        setMyDmg(null);
        setEnmDmg(null);
        setEnmSkillEff(null);
        break;
      case "battle":
        setHasDone(false);
        clearInterval(intervalRef.current);
        setOptionList([`기본 ${myStance}`, "기술 사용", "취소"]);
        break;
      case "end":
        processEndPhase();
        break;
      case "review":
        setOptionList([]);
        break;
      default:
        break;
    }
  }
  //버튼 클릭
  const handleOptionOnClick = (index) => {
    if (hasDone) return
    switch (phase) {
      case "quiz":
        setHasDone(true);
        checkAnswer({ index, curQuiz, curAnswer, optionList, quizNumberRef });
        break;
      case "stance": selectStance(index);
        break;
      case "battle": selectBattleCommand(index);
        break;
      case "skill": selectSkill(index);
        break;
      case "end":
        if (index === 0) setPhase("review");
        else if (index === 1) navigate(-1);
        break;
      default:
        break;
    }
  }
  //게임 초기화
  const initGameInfo = () => {
    quizNumberRef.current = 0;
    battleTurnRef.current = 0;
    setCurQuiz('');
    setCorrectNumber(0);
    setWrongList([]);
    setActionBall(0);
    quizListRef.current = quizList;
  }
  //리워드 데이터 바인딩- myWinCount종속
  const bindRewardData = () => {
    if (!gameDetails) return;
    const { recordList } = gameDetails;
    let record
    let goalPoint
    if (myWinCount === goalPoint) { window.alert("왜") }
    if (myWinCount < recordList[2].count) {
      record = recordList[2].record;
      goalPoint = Number(recordList[2].count);
    } else if (myWinCount < recordList[1].count) {
      record = recordList[1].record;
      goalPoint = Number(recordList[1].count);
    } else if (myWinCount < recordList[0].count) {
      record = recordList[0].record;
      goalPoint = Number(recordList[0].count);
    } else {
      record = "미쳤다"
      goalPoint = 1000
    }
    setRewardPoint(goalPoint);
    setReward(record);
  }
  //태세 선택하기
  const selectStance = (index) => {
    setMyStance(optionList[index]);
    setPhase("battle");
  }
  //기술 사용 클릭
  const showSkillList = (type) => {
    setPhase("skill");
    const skillOptions = getSkillOptions(mySkillList, type);
    setOptionList(skillOptions);
  }
  //기술 사용
  const selectSkill = (index) => {
    if (index !== 3) {
      const selected = allSkillMap.get(optionList[index]);
      if (!selected) return;
      if (skillCooldowns[selected.name] > 0) {
        setMessageList((prev) => [...prev, (`${selected.name}을(를) 사용하려면 아직 ${skillCooldowns[selected.name]}턴 남았습니다.`)]);
        return;
      }
      processCommand(selected);
      setSkillCooldowns(prev => ({ ...prev, [selected.name]: selected.delay }));
    } else { //취소
      setPhase("stance");
      setMyStance(null);
    }
  }
  //스킬 쿨타임 줄이기;
  const reduceCooldowns = () => {
    setSkillCooldowns(prev => {
      const updated = {};
      for (const key in prev) {
        updated[key] = Math.max(prev[key] - 1, 0);
      }
      return updated;
    });
  };
  //전투 명령
  const selectBattleCommand = (index) => {
    switch (index) {
      case 0:
        if (myStance === "공격" && actionBall === 0) { setMessageList((prev) => [...prev, "기력이 없습니다. 방어나 휴식을 선택하세요"]); }
        else { processCommand(); }
        break;
      case 1: //기술 사용
        if (!mySkillList || mySkillList.length === 0) return;
        if (myStance === "공격") { showSkillList("atk"); }
        else if (myStance === "방어") { showSkillList("def"); }
        else { showSkillList("rest"); }
        break;
      case 2: //취소 버튼
        setPhase("stance");
        setMyStance(null);
        --battleTurnRef.current;
        break;
      default:
        break;
    }
  }
  //사용자 행동 커맨드 처리
  const processCommand = async (skill) => {
    setHasDone(true);
    const enemyStance = getRandomStance();
    //스킬 사용 메세지
    if (!skill) { setMessageList((prev) => [...prev, `상대는 ${enemyStance} 자세를 취했다`]); }
    else { setMessageList((prev) => [...prev, skill.desc]); }
    //태세 메세지 확인 위한 1초 지연
    await new Promise((resolve) => {
      setTimeout(() => {
        setHasDone(false);
        switch (myStance) {
          case "공격":
            attackSequence({ enemyStance, mySpec, enmSpec, skill });
            break;
          case "방어":
            defenseSequence({ enemyStance, mySpec, enmSpec, skill });
            break;
          case "휴식":
            restSequence({ enemyStance, mySpec, enmSpec, skill });
            break;
          default:
            break;
        }
      }, 1000);
      resolve();
    });
    //결과 메세지 확인 2.5초 지연
    await new Promise((resolve) => {
      setTimeout(() => {
        setPhraseTurn((prev) => ++prev);
        reduceCooldowns();
      }, 2500);
      resolve();
    });
  }
  //End
  //종료 결과 계산
  const getResult = () => {
    if (enemyCurHP <= 0) {
      if (myWinCount + 1 === rewardPoint) { sendNoticeToTeacher(); }
      setResult("Win")
      setMessageList((prev) => [...prev, "분하다! 내가 지다니"]);
    } else if (myCurHP <= 0) {
      setResult("Lose")
      setMessageList((prev) => [...prev, "실력좀 더 쌓고 오지?"]);
    } else {
      setResult("Draw")
      setMessageList((prev) => [...prev, "내가 이길 수 있었는데.."]);
    }
  }
  //점수 계산 -result에 종속
  const finalizeGame = () => {
    if (!result || user.isTeacher) return;
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const { petId } = myPetDetails;
    const { exp: enmExp } = monsterDetails;
    let gameResult = { result, correct: correctNumber, enmLevel, name: user.name, uid: user.uid, actiId: gameDetails.id, date: today };
    switch (result) {
      case "Win":
        const winScore = correctNumber * 100 * 2;
        gameResult = { score: winScore, ...gameResult }
        updateUserPetGameInfo(petId, gainXp(myPetDetails, enmExp), gameResult);  //결과 기록
        updateGameResult(gameDetails.id, gameResult);
        setMyLevel((prev) => { return { ...prev, exp: prev.exp + enmExp } });
        setEnmExp(enmExp);
        break;
      case "Draw":
        gameResult = { score: correctNumber * 100, ...gameResult }
        updateUserPetGameInfo(petId, gainXp(myPetDetails, 5), gameResult);  //결과 기록
        updateGameResult(gameDetails.id, gameResult);
        setMyLevel((prev) => { return { ...prev, exp: prev.exp + 5 } });
        setEnmExp(5);
        break;
      case "Lose":
        const loseScore = correctNumber * 100 / 2;
        gameResult = { score: loseScore, ...gameResult }
        updateUserPetGameInfo(petId, gainXp(myPetDetails, 3), gameResult);  //결과 기록
        updateGameResult(gameDetails.id, gameResult);
        setMyLevel((prev) => { return { ...prev, exp: prev.exp + 3 } });
        setEnmExp(3);
        break;
      default:
        break;
    }
  }
  //승리 기록 세기
  const countWinRecord = () => {
    return myRecordList.filter((item) => item.result === "Win").length;
  }
  //생기부 기록하기
  const sendNoticeToTeacher = () => {
    window.alert("생기부 문구 획득 기준에 도달하였습니다.");
    const { petId, classId } = myPetDetails;
    const { uid: tId, id: actiId, title, } = gameDetails;
    const { name, studentNumber } = user;
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const info = { sId: user.uid, actiId, classId, petId, name, studentNumber, title, actiRecord: reward, type: "win", date: today, tId };
    updateUserArrayInfo(tId, "onSubmitList", info);
  }
  //게임 종료
  const processEndPhase = () => {
    getResult();
    clearInterval(intervalRef.current);
    battleTurnRef.current = 0;
    setHasDone(false);
    setOptionList(["틀린 문제 점검하기", "종료하기"]);
  }
  return (<Container>
    {/* 상단 상태창 */}
    <StatusUI isMaster={true} myUserData={user} myPet={selectedPet} mySpec={mySpec} enmUserData={{ name: "멍청한AI" }} enmPet={monsterDetails} enmSpec={enmSpec} levelInfo={myLevel} isMobile={isMobile} />
    {/* 메인 화면 */}
    {!background && <Spinner variant="primary" />}
    {(background && phase !== "review") &&
      <PixiResponsiveStage isMobile={isMobile} phase={phase} background={background} messageList={messageList} quizListRef={quizListRef} curQuiz={curQuiz} marking={marking} score={correctNumber * 100} actionBall={actionBall}
        mySpec={mySpec} myCurHP={myCurHP} enmSpec={enmSpec} enemyCurHP={enemyCurHP} myActionEff={myActionEff} enmActionEff={enmActionEff} myPetBackImg={myPetBackImg} enmSkillEff={enmSkillEff} enmImg={enmImg} enemyHP={enmSpec.hp}
        countdown={countdown} skillEffMap={skillEffMap} endCountdown={endCountdown} result={result} correctNumber={correctNumber} rewardPoint={rewardPoint} countWinRecord={countWinRecord} exp={enmExp} myDmg={myDmg} enmDmg={enmDmg}
      />
    }
    {/* 리뷰 phase */}
    {phase === "review" && <ReviewSection incorrectList={wrongList} />}
    {/* 컨트롤러 */}
    <ControllerUI $isMobile={isMobile}>
      {phase === "ready" && <TransparentBtn onClick={() => { setPhase("countdown") }}>시작하기</TransparentBtn>}
      {phase !== "ready" && <>{optionList?.map((option, index) => { return <TransparentBtn key={index} onClick={() => { handleOptionOnClick(index) }} disabled={hasDone}>{option}</TransparentBtn> })}</>}
      {phase === "review" && <TransparentBtn onClick={() => { navigate(-1); }}>종료하기</TransparentBtn>}
    </ControllerUI >
  </Container>)
}

const Row = styled.div`
  display: flex;
`
const Container = styled(Row)`
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 100%;
    overflow-y: auto;
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
}
`
export default QuizBattleSingleSection