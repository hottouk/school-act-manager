//라이브러리
import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//Section
import PixiResponsiveStage from './PixiResponsiveStage';
import ReviewSection from './ReviewSection';
//컴포넌트
import TransparentBtn from '../../components/Btn/TransparentBtn';
import AnimatedProgressBar from '../../components/ProgressBar';
//hooks
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
import useFireBasic from '../../hooks/Firebase/useFireBasic';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import useBattleLogic from '../../hooks/Game/useBattleLogic';
import useLevel from '../../hooks/useLevel';
//img
import qustion_icon from '../../image/icon/question.png'
import useFireActiData from '../../hooks/Firebase/useFireActiData';
//Data
import { skillList } from '../../data/skillList';
import useMediaQuery from '../../hooks/useMediaQuery';

//250111 생성
const QuizBattlePage = ({ quizSetId, myPetDetails, monsterDetails, gameDetails, onHide: exitGame }) => {
  //실시간 데이터
  const user = useSelector(({ user }) => user);
  const [monsterInfo, setMonsterInfo] = useState(null);
  useEffect(() => { bindMyPetData(); }, [myPetDetails]);
  useEffect(() => { bindEnmData(); }, [monsterDetails]);
  useEffect(() => { fetchQuizData(); }, [quizSetId])
  const { gainXp, getEarnedXp } = useLevel();   //레벨 관련
  const { fetchImgUrl } = useFetchStorageImg(); //이미지 불러오기
  const { fetchDoc } = useFireBasic("quiz");
  const { updateUserPetGameInfo, updateUserArrayInfo } = useFireUserData();
  const { updateGameResult } = useFireActiData();
  const { getRandomStance, getSkillDamge } = useBattleLogic();
  const [quizList, setQuizList] = useState([]);
  useEffect(() => { bindQuizInfo(); }, [quizList]);
  //문제 준비
  const [frozenAnswerList, setFrozenAnswerList] = useState(quizList?.map((quizSet) => quizSet.split("#")[1]))
  const quizListRef = useRef(quizList?.map((quizSet) => quizSet.split("#")[0]))
  const answerListRef = useRef(quizList?.map((quizSet) => quizSet.split("#")[1]))
  //그래픽 준비
  const [enmImg, setEnmImg] = useState(null);
  const [background, setBackground] = useState(null);
  const [myPetImg, setMyPetImg] = useState(null);
  const [myPetBackImg, setMyPetBackImg] = useState(null);
  //게임 페이즈
  const [phase, setPhase] = useState("ready")
  const [isCountdown, setIsCountdown] = useState(false); // 카운트다운 활성 상태
  //상태메세지
  const [message, setMessage] = useState('')
  //문제 관련
  const intervalRef = useRef();
  const qNumRef = useRef(0)                     //문항 번호, 인터벌 반복 횟수
  const [curQuiz, setCurQuiz] = useState('')
  const [curAnswer, setCurAnswer] = useState('')
  const [optionList, setOptionList] = useState([]);
  const [actionBall, setActionBall] = useState(0)
  //채점
  const [marking, setMarking] = useState(null);                      //문제 정오
  const [correctNumber, setCorrectNumber] = useState(0);             //맞춘 개수
  const [incorrectList, setIncorrectList] = useState([]);            //틀린 문제 
  const [score, setScore] = useState(0);                             //현재 점수
  const [battleTurn, setBattleTurn] = useState(0)
  useEffect(() => {
    if (battleTurn === 0 || phase === "end") return
    setPhase(battleTurn === 4 ? "quiz" : "stance");
  }, [battleTurn])
  //내 펫 정보 
  const [myStance, setMyStance] = useState(null);
  const [myHP, setMyHP] = useState(100);
  const [myCurHP, setMyCurHP] = useState(100);
  const [myAttck, setMyAttck] = useState(20);
  const [myDef, setMyDef] = useState(3);
  const [myMatk, setMyMatk] = useState(0);
  const [myMdef, setMyMdef] = useState(0);
  const [mySpd, setMySpd] = useState(1);
  const [mySkillList, setMySkillList] = useState([]);
  const [skillCooldowns, setSkillCooldowns] = useState({});
  //상대 몬스터 정보
  const [enmLevel, setEnmLevel] = useState(1);
  const [enemyHP, setEnemyHP] = useState(100);
  const [enemyCurHP, setEnemyCurHP] = useState(100);
  const [enemyAttck, setEmenyAttck] = useState(20);
  const [enemyDef, setEnemyDef] = useState(3);
  const [enmSpd, setEnmSpd] = useState(1);
  const [hasDone, setHasDone] = useState(false);
  //이펙트 트리거
  const [isMyAttack, setIsMyAttack] = useState(false);
  const [isMySkillAttack, setIsMySkillAttack] = useState(false);
  const [isMyDefense, setIsMyDefense] = useState(false);
  const [isMyRest, setIsMyRest] = useState(false);
  //상대 트리거
  const [isEnmDefense, setIsEnmDefense] = useState(false);
  const [isEnmAttack, setIsEnmAttack] = useState(false);
  const [isEnmRest, setIsEnmRest] = useState(false);
  //승리
  const [myRecordList, setMyRecordList] = useState([]);   //퀴즈 참여 기록
  const [myWinCount, setMyWinCount] = useState(0);        //승리 횟수
  useEffect(() => { bindRewardData(); }, [myWinCount])
  const [rewardPoint, setRewardPoint] = useState(null);      //승리 횟수에 따른 보상 시점
  const [reward, setReward] = useState('');                  //승리 횟수에 따른 보상 문구
  useEffect(() => { setMyWinCount(countWinRecord()) }, [myRecordList])
  //게임 종료
  useEffect(() => {
    if (enemyCurHP <= 0 || myCurHP <= 0) {
      setTimeout(() => { setPhase("end") }, 1000)
    } //에니메이션 플레이 위한 지연
  }, [enemyCurHP, myCurHP]) //종료 조건
  const [result, setResult] = useState(null);
  useEffect(() => { finalizeGame(); }, [result])
  //모드
  const isMobile = useMediaQuery("(max-width: 767px)");
  //페이즈★
  useEffect(() => {
    switch (phase) {
      case "ready":
        initGameInfo();
        break;
      case "countdown":
        setMessage("게임이 곧 시작됩니다. 준비하세요");
        setIsCountdown(true)
        break;
      case "quiz":
        setBattleTurn(0)
        if (!quizListRef.current) return
        generateQuestion();             //1번 바로 출제
        let interval = setInterval(() => {
          generateQuestion();
          if (qNumRef.current % 5 === 0) {
            clearInterval(intervalRef.current)
            setTimeout(() => setBattleTurn(1), 3000)
          }
        }, 3000);                       // 2번부터 3초마다 새 문제 출제
        intervalRef.current = interval; // interval ID를 상태로 저장
        break;
      case "stance":
        setMarking(null)
        setCurQuiz('')
        setHasDone(false)
        setMessage(`3턴 중 ${battleTurn}턴에 어떤 행동을 할까요?`);
        setOptionList(["공격", "방어", "휴식"])
        break;
      case "battle":
        clearInterval(intervalRef.current)
        setHasDone(false)
        setOptionList([`기본 ${myStance}`, "기술 사용", "취소"])
        break;
      case "end":
        endGame();
        break;
      default:
        break;
    }
    return () => clearInterval(intervalRef.current)  // cleanUp
  }, [phase])

  //------함수부------------------------------------------------  
  //퀴즈 데이터 다운로드
  const fetchQuizData = () => {
    if (!quizSetId) return;
    fetchImgUrl('images/battle_background.png', setBackground);
    fetchDoc(quizSetId).then((quizSetInfo) => { setQuizList(quizSetInfo.quizList) });
  }
  //퀴즈 데이터 바인딩
  const bindQuizInfo = () => {
    if (quizList.length === 0) return;
    quizListRef.current = quizList?.map((voca) => voca.split("#")[0]);
    answerListRef.current = quizList?.map((voca) => voca.split("#")[1]);
    setFrozenAnswerList(answerListRef.current)
  }
  //게임 초기화
  const initGameInfo = () => {
    qNumRef.current = 0;
    setBattleTurn(0)
    setCurQuiz('');
    setCorrectNumber(0);
    setIncorrectList([]);
    setActionBall(0);
    setScore(0);
    quizListRef.current = (quizList?.map((voca) => voca.split("#")[0]));
    answerListRef.current = (quizList?.map((voca) => voca.split("#")[1]));
  }
  //내 spec 바인딩
  const bindMyPetData = () => {
    if (!myPetDetails) return;
    const teacherPet = { spec: { atk: 80, def: 10, hp: 400, mat: 180, mdf: 55, spd: 55 }, path: "images/pet/pet_water_001_4.png", path_back: "images/pet/pet_water_001_4_back.png", level: { exp: 999, level: 100, nextLvXp: 1000, nextStepLv: 500 } }
    let { spec, skills, quizRecord, path, path_back } = myPetDetails;
    if (user.isTeacher) { //교사 시험
      spec = teacherPet.spec;
      skills = [];
      path = teacherPet.path;
      path_back = teacherPet.path_back
    }
    fetchImgUrl(path, setMyPetImg);
    fetchImgUrl(path_back || path, setMyPetBackImg);
    setMyHP(Math.floor(spec.hp));
    setMyCurHP(Math.floor(spec.hp));
    setMyAttck(Math.floor(spec.atk));
    setMyDef(Math.floor(spec.def));
    setMyMatk(Math.floor(spec.mat));
    setMyMdef(Math.floor(spec.mdf));
    setMySpd(Math.floor(spec.spd));
    setMySkillList(skills);
    if (quizRecord) {
      const key = gameDetails.id;
      const thisRecordList = quizRecord[key] || [];
      setMyRecordList(thisRecordList);
    }
  }
  //적 spec 바인딩 -enmLevel
  const bindEnmData = () => {
    if (!monsterDetails) return
    setMonsterInfo(monsterDetails);
    const { spec, desc, path } = monsterDetails;
    fetchImgUrl(path, setEnmImg);
    setEnmLevel(monsterDetails.level);
    setEnemyHP(spec.hp);
    setEnemyCurHP(spec.hp);
    setEmenyAttck(spec.atk);
    setEnemyDef(spec.def);
    setEnmSpd(spec.spd);
    setMessage(desc);
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
  //During
  //문제 출제★
  const generateQuestion = () => {
    setHasDone(false);
    setMarking(null);
    if (phase !== "quiz") return
    if (quizListRef.current.length === 0) {
      setMessage("모든 문제가 출제되었습니다. 게임이 종료됩니다!");
      setPhase("end")
      return; // 단어가 소진되면 종료
    }
    ++qNumRef.current
    setMessage(`${qNumRef.current}번 문제`);   // 인터벌 반복 횟수 추적 -> 문제 번호
    //문제 랜덤 선택
    const index = Math.floor(Math.random() * quizListRef.current.length);
    const selectedQuiz = quizListRef.current[index];
    const selectedAnswer = answerListRef.current[index];
    //문제와 답 출제
    setCurQuiz(selectedQuiz)
    setCurAnswer(selectedAnswer);
    //출제된 단어 제거
    let newQuizList = [...quizListRef.current];
    newQuizList.splice(index, 1);
    quizListRef.current = newQuizList
    //출제된 정답 제거
    let newAnswerList = [...answerListRef.current];
    newAnswerList.splice(index, 1)
    answerListRef.current = (newAnswerList)
    //정답 + 랜덤 선택지 구성
    const options = [selectedAnswer]
    let attempts = 0;         // 무한 루프 방지용 카운터
    const MAX_ATTEMPTS = 100; // 최대 시도 횟수
    while (options.length < 4 && attempts < MAX_ATTEMPTS) { //while에서 무한루프 발생하면 브라우져 다운됨.
      const randomOption = frozenAnswerList[Math.floor(Math.random() * frozenAnswerList.length)];
      if (!options.includes(randomOption)) options.push(randomOption);  //정답 선택지 중복 생성 방지
      setOptionList(options.sort(() => Math.random() - 0.5));           //배열 섞기
      attempts++;
    }
  }
  //버튼 클릭
  const handleOptionOnClick = (index) => {
    if (hasDone) return
    switch (phase) {
      case "quiz":
        setHasDone(true);
        checkAnswer(index);
        break;
      case "stance":
        handleSelectStance(index);
        break;
      case "battle":
        handleBattleCommand(index);
        break;
      case "skill":
        handleUsingSkill(index);
        break;
      default:
        break;
    }
  }
  //정답 확인하기
  const checkAnswer = (index) => {
    if (curAnswer === optionList[index]) {
      setMessage(`${qNumRef.current}번 문제, 정답입니다.`);
      setActionBall(prev => Math.min(prev + 1, 5));
      setMarking(true);
      setCorrectNumber(prev => ++prev);
      setScore(prev => prev + 100)
    } else {
      setMessage(`${qNumRef.current}번 문제, 틀렸습니다.`);
      setMarking(false);
      setIncorrectList(prev => [...prev, { quiz: curQuiz, answer: curAnswer }])
    }
  }
  //태세 선택하기
  const handleSelectStance = (index) => {
    setMyStance(optionList[index]);
    setPhase("battle");
  }
  //기술 사용 클릭
  const showSkillList = (type) => {
    setPhase("skill");
    const skills = mySkillList.filter(item => item.type === type).map(item => { return item.name; });
    const filledSkills = [...skills];
    while (filledSkills.length < 3) { filledSkills.push("기술 없음"); };
    filledSkills.push("취소");
    setOptionList(filledSkills);
  }
  //기술 사용
  const handleUsingSkill = (index) => {
    if (index === 3) { //취소
      setPhase("stance");
      setMyStance(null);
    } else {
      const selected = skillList.find((item) => item.name === optionList[index]);
      if (!selected) return;
      if (skillCooldowns[selected.name] > 0) {
        alert(`${selected.name}을(를) 사용하려면 아직 ${skillCooldowns[selected.name]}턴 남았습니다.`);
        return;
      }
      processCommand(selected);
      setSkillCooldowns(prev => ({
        ...prev,
        [selected.name]: selected.delay
      }));
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
  const handleBattleCommand = (index) => {
    switch (index) {
      case 0:
        if (myStance === "공격" && actionBall === 0) { setMessage("기력이 없습니다. 방어나 휴식을 선택하세요"); }
        else { processCommand() }
        break;
      case 1: //기술 사용
        if (!mySkillList || mySkillList.length === 0) return;
        if (myStance === "공격") { showSkillList("atk"); }
        else if (myStance === "방어") { showSkillList("def"); }
        else { showSkillList("res"); }
        break;
      case 2: //취소 버튼
        setPhase("stance")
        setMyStance(null)
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
    if (!skill) { setMessage(`상대는 ${enemyStance} 자세를 취했다`); }
    else { setMessage(skill.desc); }
    //태세 메세지 확인 위한 1초 지연
    await new Promise((resolve) => {
      setTimeout(() => {
        switch (myStance) {
          case "공격":
            attackSequence(enemyStance, skill);
            break;
          case "방어":
            defenseSequence(enemyStance, skill);
            break;
          case "휴식":
            restSequence(enemyStance, skill);
            break;
          default:
            break;
        }
      }, 1000);
      resolve();
    });
    await new Promise((resolve) => {
      //결과 메세지 확인 2.5초 지연
      setTimeout(() => {
        reduceCooldowns();
        setBattleTurn(prev => ++prev)
      }, 2500);
      resolve();
    })
  }
  //공격 결과 계산
  const attackSequence = async (enemyStance, skill) => {
    let damge = 0;
    if (skill) {
      setIsMySkillAttack(prev => !prev);
      damge = getSkillDamge(skill, myPetDetails.spec);
    } else {
      setIsMyAttack(prev => !prev);
      damge = myAttck;
    }
    setActionBall((prev) => Math.max(0, prev - 1));
    switch (enemyStance) {
      case "공격":
        setMessage("서로 공격해 피해를 입혔다.")
        setIsEnmAttack(prev => !prev);
        setEnemyCurHP((prev) => prev - Math.max(Math.floor(damge - enemyDef)), 1);
        setMyCurHP((prev) => prev - Math.floor(enemyAttck - myDef));
        break;
      case "방어":
        setMessage("상대는 효과적으로 방어했다. 상대 다음턴 공격력 증가!!")
        setIsEnmDefense(prev => !prev);
        setEnemyCurHP((prev) => prev - Math.max(Math.floor(damge * 0.9 - (enemyDef * 2)), 1));
        break;
      case "휴식":
        setMessage("상대의 휴식 중에 공격하여 휴식을 방해했다")
        setEnemyCurHP((prev) => prev - Math.floor(damge * 1.3));
        break;
      default:
        break;
    }
  }
  //방어 결과 계산
  const defenseSequence = async (enemyStance) => {
    setIsMyDefense(prev => !prev)
    switch (enemyStance) {
      case "공격":
        setMessage("상대의 공격을 효과적으로 막아냈다. 전투 의욕이 상승한다");
        setIsEnmAttack(prev => !prev)
        setMyCurHP((prev) => prev - Math.max(Math.floor(enemyAttck * 90 / 100 - (myDef * 2)), 1))
        setActionBall(prev => Math.min(prev + 1, 5))
        break;
      case "방어":
        setMessage("서로 방어했다. 아무일도 일어나지 않았다");
        setIsEnmDefense(prev => !prev)
        break;
      case "휴식":
        setMessage("상대는 방어하는 나를 비웃으며 휴식을 취했다");
        setIsEnmRest(prev => !prev)
        setEnemyCurHP((prev) => Math.min(prev + 10, enemyHP)
        )
        break;
      default:
        break;
    }
  }
  //휴식 결과 계산
  const restSequence = async (enemyStance) => {
    switch (enemyStance) {
      case "공격":
        setMessage("휴식 중에 공격당해 제대로 방비하지 못했다")
        setIsEnmAttack(prev => !prev)
        setMyCurHP((prev) => prev - Math.floor(enemyAttck * 1.2))
        break;
      case "방어":
        setMessage("상대는 무의미한 방어를 했다.");
        setIsMyRest(prev => !prev)
        setIsEnmDefense(prev => !prev)
        setMyCurHP((prev) => prev + 15)
        setActionBall(prev => Math.min(prev + 1, 5))
        break;
      case "휴식":
        setMessage("서로 휴식을 취했다.");
        setIsEnmRest(prev => !prev)
        setEnemyCurHP((prev) => Math.min(prev + 10, enemyHP))
        setMyCurHP((prev) => Math.min(prev + 10, myHP))
        setActionBall(prev => Math.min(prev + 1, 5))
        break;
      default:
        break;
    }
  }
  //End
  //종료 결과 계산
  const getResult = () => {
    if (enemyCurHP <= 0) {
      if (myWinCount + 1 === rewardPoint) { sendNoticeToTeacher(); }
      setResult("Win")
      setMessage("분하다! 내가 지다니");
    } else if (myCurHP <= 0) {
      setResult("Lose")
      setMessage("실력좀 더 쌓고 오지?")
    } else {
      setResult("Draw")
      setMessage("내가 이길 수 있었는데..");
    }
  }
  //점수 계산 -result에 종속
  const finalizeGame = () => {
    if (!result || user.isTeacher) return;
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
    const { petId } = myPetDetails;
    const { exp } = monsterDetails;
    let gameResult = { result, correct: correctNumber, enmLevel, name: user.name, uid: user.uid, actiId: gameDetails.id, date: today };
    switch (result) {
      case "Win":
        const winScore = score * 2;
        gameResult = { score: winScore, ...gameResult }
        setScore(winScore);
        updateUserPetGameInfo(petId, gainXp(myPetDetails, exp), gameResult);  //결과 기록
        updateGameResult(gameDetails.id, gameResult);
        break;
      case "Draw":
        gameResult = { score, ...gameResult }
        updateUserPetGameInfo(petId, gainXp(myPetDetails, 5), gameResult);  //결과 기록
        updateGameResult(gameDetails.id, gameResult);
        break;
      case "Lose":
        const loseScore = score / 2;
        gameResult = { score: loseScore, ...gameResult }
        setScore(loseScore);
        updateUserPetGameInfo(petId, gainXp(myPetDetails, 3), gameResult);  //결과 기록
        updateGameResult(gameDetails.id, gameResult);
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
  const endGame = () => {
    getResult();
    clearInterval(intervalRef.current);
    setBattleTurn(0);
    setHasDone(false);
    setOptionList([]);
  }

  return (<Container>
    {/* 상단 상태창 */}
    <StyledStatusUI>
      <Row>
        <Wrapper><StyledImg src={myPetImg || qustion_icon} alt="상태창" /></Wrapper>
        {!isMobile && <Wrapper style={{ width: "140px" }}>
          <p>{myPetDetails?.name || "??"}</p>
          <p style={{ margin: "0" }}>레벨: {myPetDetails?.level?.level || "??"}</p>
        </Wrapper>}
        <Wrapper style={{ width: "240px" }}>
          <Row>
            <p style={{ margin: "0" }}>체력: {myHP || "??"}</p>
            <p>공격: {myAttck || "??"}</p>
            <p>방어: {myDef ?? "??"}</p>
          </Row>
          <Row>
            <p style={{ margin: "0" }}>마력: {myMatk || "??"}</p>
            <p style={{ margin: "0" }}>지력: {myMdef || "??"}</p>
            <p style={{ margin: "0" }}>민첩: {mySpd || "??"}</p>
          </Row>
        </Wrapper>
        {!isMobile && <Wrapper style={{ flexGrow: "1" }}><p style={{ margin: "0" }}>{myPetDetails?.desc || "??"}</p></Wrapper>}
      </Row>
      <Row><AnimatedProgressBar levelInfo={myPetDetails?.level || "??"} /></Row>
    </StyledStatusUI >
    {!background && <Spinner variant="primary" />}
    {(background && phase !== "review") &&
      <PixiResponsiveStage isMobile={isMobile} phase={phase} background={background} message={message} quizListRef={quizListRef} curQuiz={curQuiz} marking={marking} score={score} actionBall={actionBall}
        myPetImg={myPetImg} myPetInfo={myPetDetails} myHP={myHP} myCurHP={myCurHP} isMyAttack={isMyAttack} isMyDefense={isMyDefense} isMyRest={isMyRest} myPetBackImg={myPetBackImg} isMySkillAttack={isMySkillAttack}
        enmImg={enmImg} monsterInfo={monsterInfo} enmLevel={enmLevel} enemyHP={enemyHP} enemyCurHP={enemyCurHP} enemyAttck={enemyAttck} enemyDef={enemyDef} enmSpd={enmSpd} isEnmAttack={isEnmAttack} isEnmDefense={isEnmDefense} isEnmRest={isEnmRest}
        isCountdown={isCountdown} setIsCountdown={setIsCountdown} setPhase={setPhase}
        result={result} correctNumber={correctNumber} rewardPoint={rewardPoint} countWinRecord={countWinRecord} exp={monsterDetails.exp}
      />
    }
    {/* 리뷰 phase */}
    {phase === "review" && <ReviewSection incorrectList={incorrectList} />}
    {/* 컨트롤러 */}
    <StyledCommandUI>
      {phase === "ready" && <TransparentBtn onClick={() => { setPhase("countdown") }}>시작하기</TransparentBtn>}
      {phase !== "ready" && <>{optionList.map((option, index) => {
        return (<React.Fragment key={`${index}${option}`}>
          {hasDone && <TransparentBtn
            styles={{ boxShadow: "inset 5px 5px 10px rgba(0, 0, 0, 0.3),inset -5px -5px 10px rgba(255, 255, 255, 0.3)", cursor: "default", backgroundColor: "#3454d1" }}>{option}</TransparentBtn>}
          {!hasDone && <TransparentBtn onClick={() => { handleOptionOnClick(index) }}>{option}</TransparentBtn>}
        </React.Fragment>)
      })}</>}
      {phase === "end" && <>
        <TransparentBtn onClick={() => { setPhase("review") }}>틀린 문제 점검하기</TransparentBtn>
        <TransparentBtn onClick={() => { exitGame() }}>종료하기</TransparentBtn>
      </>}
      {phase === "review" && <>
        <TransparentBtn onClick={() => { exitGame() }}>종료하기</TransparentBtn>
      </>}
    </StyledCommandUI >
  </Container>)
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Row = styled.div`
  display: flex;
  gap: 20px;
`
const StyledStatusUI = styled.div`
  width: 1200px;
  background-color: #ddd;
  padding: 16px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  @media (max-width: 768px) {
    width: ${window.innerWidth}px;
  }
`
const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid rgb(185,185,185);
  border-radius: 10px;
  margin-bottom: 10px;
`
const StyledImg = styled.img`
  width: 75px;
`
const StyledCommandUI = styled.div`
  display: flex;
  justify-content: center;
  gap: 100px;
  background-color: #ddd;
  width: 1200px;
  margin-top: -6px;
  padding: 16px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: ${window.innerWidth}px;
  }
}
`
export default QuizBattlePage