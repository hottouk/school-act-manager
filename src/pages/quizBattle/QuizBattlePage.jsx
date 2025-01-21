//라이브러리
import React, { useEffect, useRef, useState } from 'react';
import { Stage } from '@pixi/react';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';
//컴포넌트
import ActionBallUI from '../../components/Game/ActionBallUI';
import BasicAttack from '../../components/Game/Skills/BasicAttack';
import BasicDefense from '../../components/Game/Skills/BasicDefense';
import BasicRest from '../../components/Game/Skills/BasicRest';
import Background from '../../components/Game/Background';
import HPBarUI from '../../components/Game/HPBarUI';
import PetSprite from '../../components/Game/PetSprite';
import MessageUI from '../../components/Game/MessageUI';
import QuizUI from '../../components/Game/QuizUI';
import Countdown from '../../components/Game/Countdown';
import BattleReport from '../../components/Game/BattleReport';
import MarkingUI from '../../components/Game/MarkingUI';
import TransparentBtn from '../../components/Btn/TransparentBtn';
//hooks
import useAdjustStat from '../../hooks/Game/useAdjustStat';
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
import useFireBasic from '../../hooks/Firebase/useFireBasic';
//img
import qustion_icon from '../../image/icon/question.png'
//todo 브라우져 처음 열었을때 오류
//2025.01.11 생성
const QuizBattlePage = ({ quizSetId, monsterDetails }) => {
  useEffect(() => {
    if (!monsterDetails || !quizSetId) return;
    fetchInitData();
  }, [monsterDetails, quizSetId])
  //준비
  const { fetchImgUrlList, fetchImgUrl } = useFetchStorageImg(); //이미지 불러오기
  const { fetchDoc } = useFireBasic("quiz");
  const [quizList, setQuizList] = useState([]);
  useEffect(() => {
    if (quizList.length === 0) return;
    gameDataSetting();
  }, [quizList])
  //문제 준비
  const [frozenAnswerList, setFrozenAnswerList] = useState(quizList?.map((quizSet) => quizSet.split("#")[1]))
  const quizListRef = useRef(quizList?.map((quizSet) => quizSet.split("#")[0]))
  const answerListRef = useRef(quizList?.map((quizSet) => quizSet.split("#")[1]))
  //그래픽 준비
  // const imgPathList = ['images/battle_background.png', 'images/pet_water_001_back.png', monsterDetails.path]
  const { getLevelStatus } = useAdjustStat();
  // const [imgUrlList, setImgUrlList] = useState([])
  const [enmImg, setEnmImg] = useState(null);
  const [background, setBackground] = useState(null);
  const [myPetImg, setMyPetImg] = useState(null);
  //게임 페이즈
  const [phase, setPhase] = useState("ready")
  const [isCountdown, setIsCountdown] = useState(false); // 카운트다운 활성 상태
  //상태메세지
  const [message, setMessage] = useState('')
  //문제 관련
  const intervalRef = useRef();
  const qNumRef = useRef(0)                     //문항 번호, 인터벌 반복 횟수
  useEffect(() => {
  }, [qNumRef.current])
  const [curQuiz, setCurQuiz] = useState('')
  const [curAnswer, setCurAnswer] = useState('')
  useEffect(() => {
  }, [curQuiz, curAnswer])
  const [optionList, setOptionList] = useState([]);
  const [actionBall, setActionBall] = useState(0)
  //채점
  const [marking, setMarking] = useState(null)  //현재 정오
  const [correct, setCorrect] = useState(0)     //맞춘 개수
  //내 펫몬 정보 
  const [battleTurn, setBattleTurn] = useState(0)
  useEffect(() => {
    if (battleTurn === 0 || phase === "end") return
    setPhase(battleTurn === 4 ? "quiz" : "stance");
  }, [battleTurn])
  const [myStance, setMyStance] = useState(null)
  const [myHP, setMyHP] = useState(100)
  const [myCurHP, setMyCurHP] = useState(100)
  const [myAttck, setMyAttck] = useState(20)
  const [myDef, setMyDef] = useState(3)
  //상대 펫몬 정보
  const [enemyHP, setEnemyHP] = useState(100)
  const [enemyCurHP, setEnemyCurHP] = useState(100)
  const [enemyAttck, setEmenyAttck] = useState(20)
  const [enemyDef, setEnemyDef] = useState(3)
  const [enmSpd, setEnmSpd] = useState(1)
  const [hasDone, setHasDone] = useState(false)
  //이펙트 트리거
  const [isMyAttack, setIsMyAttack] = useState(false)
  const [isMyDefense, setIsMyDefense] = useState(false)
  const [isMyRest, setIsMyRest] = useState(false)
  //상대 트리거
  const [isEnmDefense, setIsEnmDefense] = useState(false)
  const [isEnmAttack, setIsEnmAttack] = useState(false)
  const [isEnmRest, setIsEnmRest] = useState(false)
  //게임 종료
  useEffect(() => {
    if (enemyCurHP <= 0 || myCurHP <= 0) {
      setTimeout(() => { setPhase("end") }, 1000)
    } //에니메이션 플레이 위한 지연
  }, [enemyCurHP, myCurHP]) //종료 조건
  const [result, setResult] = useState(null);
  //페이즈★
  useEffect(() => {
    switch (phase) {
      case "ready":
        initGame();
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

  //----2.함수부--------------------------------
  //초기 데이터 다운로드
  const fetchInitData = () => {
    fetchImgUrl(monsterDetails.path, setEnmImg)
    fetchImgUrl('images/battle_background.png', setBackground)
    fetchImgUrl('images/pet_water_001_back.png', setMyPetImg)
    fetchDoc(quizSetId).then((quizSetInfo) => {
      setQuizList(quizSetInfo.quizList)
    });
  }

  //데이터 세팅
  const gameDataSetting = () => {
    quizListRef.current = quizList?.map((voca) => voca.split("#")[0]);
    answerListRef.current = quizList?.map((voca) => voca.split("#")[1]);
    setFrozenAnswerList(answerListRef.current)
  }

  //게임 초기화
  const initGame = () => {
    qNumRef.current = 0;
    const renewedDetails = getLevelStatus(monsterDetails)
    const { hp, atk, def, spd, desc } = renewedDetails
    setMessage(desc);
    setBattleTurn(0)
    setEnemyHP(hp)
    setEnemyCurHP(hp)
    setEmenyAttck(atk)
    setEnemyDef(def)
    setEnmSpd(spd)
    setCurQuiz('');
    setCorrect(0);
    setActionBall(0);
    setMyCurHP(myHP);
    quizListRef.current = (quizList?.map((voca) => voca.split("#")[0]));
    answerListRef.current = (quizList?.map((voca) => voca.split("#")[1]));
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
    setMessage(`${qNumRef.current}번 문제`);   // 인터벌 반복 횟수 추적->문제 번호
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
    let attempts = 0; // 무한 루프 방지용 카운터
    const MAX_ATTEMPTS = 100; // 최대 시도 횟수
    while (options.length < 4 && attempts < MAX_ATTEMPTS) { //while에서 무한루프 발생하면 브라우져 다운.
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
        setHasDone(true)
        handleCheckAnswer(index)
        break;
      case "stance":
        handleSelectStance(index)
        break;
      case "battle":
        handleBattleCommand(index)
        break;
      default:
        break;
    }
  }

  //정답 확인하기
  const handleCheckAnswer = (index) => {
    if (curAnswer === optionList[index]) {
      setMessage(`${qNumRef.current}번 문제, 정답입니다.`);
      setActionBall(prev => Math.min(prev + 1, 5));
      setMarking(true);
      setCorrect(prev => ++prev);
    } else {
      setMessage(`${qNumRef.current}번 문제, 틀렸습니다.`);
      setMarking(false);
    }
  }

  //태세 선택하기
  const handleSelectStance = (index) => {
    setMyStance(optionList[index])
    setPhase("battle")
  }

  //전투 명령
  const handleBattleCommand = (index) => {
    switch (index) {
      case 0:
        if (myStance === "공격") {
          if (actionBall === 0) { setMessage("기력이 없습니다. 방어나 휴식을 선택하세요") }
          else processCommand(attackSequence);
        } else if (myStance === "방어") { processCommand(defenseSequence); }
        else { processCommand(restSequence); }
        break;
      case 1: //기술 사용
        break;
      case 2: //취소 버튼
        setPhase("stance")
        setMyStance(null)
        break;
      default:
        break;
    }
  }

  //랜덤 태세
  const getRandomStance = () => {
    const stances = ['공격', '방어', '휴식'];
    return stances[Math.floor(Math.random() * stances.length)];
  };

  //사용자 행동 커맨드 처리
  const processCommand = async (processResult) => {
    setHasDone(true)
    let enemyNewStance = getRandomStance();
    setMessage(`상대는 ${enemyNewStance} 자세를 취했다`);
    await new Promise((resolve) => {
      setTimeout(() => {
        processResult(enemyNewStance) //태세 메세지 확인 위한 1초 지연
      }, 1000);
      resolve();
    });
    await new Promise((resolve) => {
      setTimeout(() => {
        setBattleTurn(prev => ++prev) //결과 메세지 확인 2.5초 지연
      }, 2500)
      resolve();
    })
  }

  //공격 결과 계산
  const attackSequence = async (enemyStance) => {
    setIsMyAttack(prev => !prev)
    setActionBall((prev) => Math.max(0, prev - 1))
    switch (enemyStance) {
      case "공격":
        setMessage("서로 공격해 피해를 입혔다.")
        setIsEnmAttack(prev => !prev)
        setEnemyCurHP((prev) => prev - (myAttck - enemyDef));
        setMyCurHP((prev) => prev - (enemyAttck - myDef));
        break;
      case "방어":
        setMessage("상대는 효과적으로 방어했다. 상대 다음턴 공격력 증가!!")
        setIsEnmDefense(prev => !prev);
        setEnemyCurHP((prev) => prev - Math.max((myAttck - (enemyDef * 2)), 1));
        break;
      case "휴식":
        setMessage("상대의 휴식 중에 공격하여 휴식을 방해했다")
        setEnemyCurHP((prev) => prev - myAttck * 1.2);
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
        setMyCurHP((prev) => prev - Math.max((enemyAttck - (myDef * 2)), 1))
        setActionBall(prev => Math.min(prev + 1, 5))
        break;
      case "방어":
        setMessage("서로 방어했다. 아무일도 일어나지 않았다");
        setIsEnmDefense(prev => !prev)
        break;
      case "휴식":
        setMessage("상대는 방어하는 나를 비웃으며 휴식을 취했다");
        setIsEnmRest(prev => !prev)
        setEnemyCurHP((prev) => Math.min(prev + 10, enemyHP))
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
        setMyCurHP((prev) => prev - enemyAttck * 1.2)
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
        setEnemyCurHP((prev) => Math.min(prev + 10), enemyHP)
        setMyCurHP((prev) => Math.min(prev + 10), myHP)
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

  //게임 종료
  const endGame = () => {
    setBattleTurn(0)
    clearInterval(intervalRef.current)
    setHasDone(false)
    setOptionList([])
    getResult();
  }

  return (<Container>
    {!background && <Spinner variant="primary" />}
    {background &&
      <Stage width={1200} height={900} options={{ background: "#3454d1" }} >
        {/* 배경화면 */}
        <Background src={background || qustion_icon} x={0} y={0} width={1200} height={900} />
        {/* 기본 UI */}
        <MessageUI msg={message} x={350} y={700} width={800} height={175} />
        <MessageUI x={50} y={50} msg3={`남은 문제: ${quizListRef.current.length}개`} />
        {/* 준비창 phase */}
        {(phase === "ready") && <>
          <PetSprite src={enmImg || qustion_icon} x={600} y={200} width={150} height={150} trigger={isEnmAttack} />
          <MessageUI x={450} y={300} width={300} height={300}
            msg2={`총 문제: ${quizListRef.current.length}개\n이름: ${monsterDetails.name}\n레벨: ${monsterDetails.level}\n체력: ${enemyHP}\n공격력: ${enemyAttck}\n방어력: ${enemyDef}\n스피드: ${enmSpd}`} />
        </>}
        {/* 카운트다운 phase*/}
        {(phase === "countdown") && <Countdown isCountdown={isCountdown} setIsCountdown={setIsCountdown} setPhase={setPhase} x={600} y={450} />}

        {/* 퀴즈 phase */}
        {(phase !== "ready" && phase !== "end") && <>
          {/* 내 펫몬 */}
          {<HPBarUI x={75} y={550} width={150} height={12} curHp={myCurHP} maxHp={myHP} />}
          <PetSprite src={myPetImg || qustion_icon} x={150} y={750} width={400} height={400} trigger={isMyAttack} movingPoint={35} />
          {/* 상대 펫몬 */}
          <HPBarUI x={925} y={80} width={150} height={12} curHp={enemyCurHP} maxHp={enemyHP} />
          <PetSprite src={enmImg || qustion_icon} x={1000} y={200} width={230} height={230} trigger={isEnmAttack} movingPoint={-35} />
          <ActionBallUI x={350} y={600} width={400} height={60} correctAnswer={actionBall} />
        </>}
        {/* 퀴즈 phase*/}
        {curQuiz && <QuizUI quiz={curQuiz} x={600} y={350} width={250} height={80} pivotX={125} pivotY={40} />}
        {marking === true && <MarkingUI x={600} y={350} radius={75} correct={marking} />}
        {marking === false && <MarkingUI x={600} y={350} crossSize={125} correct={marking} />}

        {/* 배틀 phase */}
        {/* 내 이펙트 */}
        <BasicAttack x={950} y={175} trigger={isMyAttack} />
        <BasicDefense x={100} y={750} radius={200} trigger={isMyDefense} />
        <BasicRest x={150} y={750} size={50} thick={15} movingPoint={900} trigger={isMyRest} />
        {/* 상대 이펙트 */}
        <BasicAttack x={200} y={750} trigger={isEnmAttack} />
        <BasicDefense x={1000} y={200} radius={100} trigger={isEnmDefense} />
        <BasicRest x={1000} y={255} size={35} thick={10} movingPoint={300} trigger={isEnmRest} />
        {/* 종료 결과 */}
        {phase === "end" && <BattleReport x={600} y={100} result={result} correct={correct} src={enmImg} />}
      </Stage>}
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
      {phase === "end" && <TransparentBtn onClick={() => { setPhase("ready") }}>다시하기</TransparentBtn>}
    </StyledCommandUI >
  </Container>)
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
}
`

export default QuizBattlePage

