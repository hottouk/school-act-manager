//라이브러리
import { Stage } from '@pixi/react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
//데이터
import vocaList from '../../data/vocaList';
//컴포넌트
import ActionBallUI from '../../components/Game/ActionBallUI';
import BasicAttack from '../../components/Game/Skills/BasicAttack';
import BasicDefense from '../../components/Game/Skills/BasicDefense';
import BasicRest from '../../components/Game/Skills/BasicRest';
import Background from '../../components/Game/Background';
import HPBarUI from '../../components/Game/HPBarUI';
import PetSprite from '../../components/Game/PetSprite';
import MessageUI from '../../components/Game/MessageUI';
import MidBtn from '../../components/Btn/MidBtn';
import VocaUI from '../../components/Game/VocaUI';
import Countdown from '../../components/Game/Countdown';
import { Spinner } from 'react-bootstrap';
import BattleReport from '../../components/Game/BattleReport';

//2025.01.11 생성
const WordBattle = () => {
  //----1.변수부--------------------------------
  //준비
  const storage = getStorage();
  const [frozenAnswerList] = useState(vocaList.map((voca) => voca.split("#")[1]))
  const wordListRef = useRef(vocaList.map((voca) => voca.split("#")[0]))
  const answerListRef = useRef(vocaList.map((voca) => voca.split("#")[1]))
  useEffect(() => {
    // 이미지 가져오기
    (async () => {
      try {
        let urls = await Promise.all(
          imgPathList.map(async (path) => {
            let imgRef = ref(storage, path);
            return await getDownloadURL(imgRef)
          })
        )
        setImgUrlList(urls)
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    })();
  }, [])
  const imgPathList = ['images/battle_background.png', 'images/pet_water_001_back.png', 'images/pet_grass_001.png']
  const [imgUrlList, setImgUrlList] = useState([])
  //게임 페이즈
  const [phase, setPhase] = useState("ready")
  const [isCountdown, setIsCountdown] = useState(false); // 카운트다운 활성 상태
  //상태메세지
  const [message, setMessage] = useState('')
  //문제 관련
  const intervalRef = useRef();
  const qNumRef = useRef(0)                     //문항 번호, 인터벌 반복 횟수
  const [correct, setCorrect] = useState(0)     //맞춘 개수
  const [curWord, setCurWord] = useState('')
  const [curAnswer, setCurAnswer] = useState('')
  const [optionList, setOptionList] = useState([]);
  const [actionBall, setActionBall] = useState(0)
  //내 펫몬 정보
  const [battleTurn, setBattleTurn] = useState(1)
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
  useEffect(() => { if (enemyCurHP <= 0 || myCurHP <= 0) setPhase("end") }, [enemyCurHP]) //종료 조건
  const [result, setResult] = useState(null);
  //페이즈★
  useEffect(() => {
    switch (phase) {
      case "ready":
        initGame();
        break;
      case "countdown":
        setMessage("게임이 곧 시작됩니다. 준비하세요")
        setIsCountdown(true)
        break;
      case "quiz":
        if (!wordListRef.current) return
        generateQuestion();             //1번 바로 출제
        let interval = setInterval(() => {
          generateQuestion();
          if (qNumRef.current % 5 === 0) {
            clearInterval(intervalRef.current)
            setTimeout(() => setPhase("stance"), 3000)
          }
        }, 3000);                       // 2번부터 3초마다 새 문제 출제
        intervalRef.current = interval; // interval ID를 상태로 저장
        break;
      case "stance":
        setCurWord('')
        setHasDone(false)
        setMessage(`3턴 중 ${battleTurn}턴에 어떤 행동을 할까요?`)
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
  //게임 초기화
  const initGame = () => {
    qNumRef.current = 0;
    setCurWord('');
    setCorrect(0);
    setActionBall(0);
    setMessage("준비되면 시작하기를 클릭하세요");
    setMyCurHP(myHP);
    setEnemyCurHP(enemyHP);
    wordListRef.current = (vocaList.map((voca) => voca.split("#")[0]));
    answerListRef.current = (vocaList.map((voca) => voca.split("#")[1]));
  }

  //During
  //문제 출제★
  const generateQuestion = () => {
    setHasDone(false)
    if (phase !== "quiz") return
    if (wordListRef.current.length === 0) {
      setMessage("모든 문제가 출제되었습니다. 게임이 종료됩니다!");
      setPhase("end")
      return; // 단어가 소진되면 종료
    }
    ++qNumRef.current
    setMessage(`${qNumRef.current}번 문제`);   // 인터벌 반복 횟수 추적->문제 번호
    //문제 랜덤 선택
    const index = Math.floor(Math.random() * wordListRef.current.length);
    const selectedWord = wordListRef.current[index];
    const selectedAnswer = answerListRef.current[index];
    //문제와 답 출제
    setCurWord(selectedWord)
    setCurAnswer(selectedAnswer);
    //출제된 단어 제거
    let newWordList = [...wordListRef.current];
    newWordList.splice(index, 1);
    wordListRef.current = newWordList
    //출제된 정답 제거
    let newAnswerList = [...answerListRef.current];
    newAnswerList.splice(index, 1)
    answerListRef.current = (newAnswerList)
    //정답 + 랜덤 선택지 구성
    const options = [selectedAnswer]
    while (options.length < 4) {
      const randomOption = frozenAnswerList[Math.floor(Math.random() * frozenAnswerList.length)];
      if (!options.includes(randomOption)) options.push(randomOption);  //정답 선택지 중복 생성 방지
      setOptionList(options.sort(() => Math.random() - 0.5));           //배열 섞기
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
      setMessage(`${qNumRef.current}번 문제, 정답입니다.`)
      setActionBall(prev => Math.min(prev + 1, 5))
      setCorrect(prev => ++prev)
    } else { setMessage(`${qNumRef.current}번 문제, 틀렸습니다.`) }
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
          else processSequence(processAttack);
        } else if (myStance === "방어") { processSequence(processDefense); }
        else { processSequence(processRest); }
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
  //시퀀스 처리
  const processSequence = async (processResult) => {
    setHasDone(true)
    setBattleTurn(prev => ++prev)
    let enemyNewStance = getRandomStance();
    setMessage(`상대는 ${enemyNewStance} 자세를 취했다`);
    await new Promise((resolve) => {
      setTimeout(() => {
        processResult(enemyNewStance)
      }, 1000);
      resolve();
    });
  }
  //공격 결과 계산
  const processAttack = async (enemyStance) => {
    setIsMyAttack(prev => !prev)
    setActionBall((prev) => Math.max(0, prev - 1))
    switch (enemyStance) {
      case "공격":
        setIsEnmAttack(prev => !prev)
        setEnemyCurHP((prev) => prev - (myAttck - enemyDef));
        setMyCurHP((prev) => prev - (enemyAttck - myDef));
        setMessage("서로 공격해 피해를 입혔다.");
        break;
      case "방어":
        setIsEnmDefense(prev => !prev);
        setEnemyCurHP((prev) => prev - Math.max((myAttck - (enemyDef * 2)), 1));
        setMessage("상대는 효과적으로 방어했다. 상대 다음턴 공격력 증가!!");
        break;
      case "휴식":
        setEnemyCurHP((prev) => prev - myAttck * 1.2);
        setMessage("상대의 휴식 중에 공격하여 휴식을 방해했다");
        break;
      default:
        break;
    }
    await new Promise((resolve) => setTimeout(() => {
      processPhase();
      resolve();
    }, 1000));
  }
  //방어 결과 계산
  const processDefense = async (enemyStance) => {
    setIsMyDefense(prev => !prev)
    switch (enemyStance) {
      case "공격":
        setIsEnmAttack(prev => !prev)
        setMyCurHP((prev) => prev - Math.max((enemyAttck - (myDef * 2)), 1))
        setActionBall(prev => Math.min(prev + 1, 5))
        setMessage("상대의 공격을 효과적으로 막아냈다. 전투 의욕이 상승한다");
        break;
      case "방어":
        setIsEnmDefense(prev => !prev)
        setMessage("서로 방어했다. 아무일도 일어나지 않았다")
        break;
      case "휴식":
        setIsEnmRest(prev => !prev)
        setEnemyCurHP((prev) => Math.min(prev + 10, enemyHP))
        setMessage("상대는 방어하는 나를 비웃으며 휴식을 취했다")
        break;
      default:
        break;
    }
    await new Promise((resolve) => setTimeout(() => {
      processPhase();
      resolve();
    }, 1000));
  }
  //휴식 결과 계산
  const processRest = async (enemyStance) => {
    switch (enemyStance) {
      case "공격":
        setIsEnmAttack(prev => !prev)
        setMyCurHP((prev) => prev - enemyAttck * 1.2)
        setMessage("휴식 중에 공격당해 제대로 방비하지 못했다");
        break;
      case "방어":
        setIsMyRest(prev => !prev)
        setIsEnmDefense(prev => !prev)
        setMyCurHP((prev) => prev + 15)
        setActionBall(prev => Math.min(prev + 1, 5))
        setMessage("상대는 무의미한 방어를 했다.")
        break;
      case "휴식":
        setIsEnmRest(prev => !prev)
        setEnemyCurHP((prev) => Math.min(prev + 10), enemyHP)
        setMyCurHP((prev) => Math.min(prev + 10), myHP)
        setActionBall(prev => Math.min(prev + 1, 5))
        setMessage("서로 휴식을 취했다.")
        break;
      default:
        break;
    }
    await new Promise((resolve) => setTimeout(() => {
      processPhase();
      resolve();
    }, 1000));
  }
  //페이즈 계산
  const processPhase = async () => {
    setHasDone(false)
    if (battleTurn === 3) {
      setPhase("quiz")
      setBattleTurn(1)
    } else { setPhase("stance"); }
  }

  //End
  //종료 결과 계산
  const getResult = () => {
    if (enemyCurHP <= 0) {
      setResult("Win")
      setMessage("분하다! 내가 지다니")
    } else if (myCurHP <= 0) {
      setResult("Lose")
      setMessage("실력좀 더 쌓고 오지?")
    } else {
      setResult("Draw")
      setMessage("내가 이길 수 있었는데..")
    }
  }
  //게임 종료
  const endGame = () => {
    clearInterval(intervalRef.current)
    setBattleTurn(1)
    setHasDone(false)
    setOptionList([])
    getResult();
  }

  return (<Container>
    {imgUrlList.length === 0 && <Spinner variant="primary" />}
    {imgUrlList.length !== 0 &&
      <Stage width={1200} height={900} options={{ background: "#3454d1" }} >
        {/* 배경화면 */}
        <Background src={imgUrlList[0]} x={0} y={0} width={1200} height={900} />
        <MessageUI msg={message} x={350} y={700} width={800} height={175} />
        {/* 카운트다운 */}
        {(phase === "countdown") && <Countdown isCountdown={isCountdown} setIsCountdown={setIsCountdown} setPhase={setPhase} x={600} y={450} />}
        {(phase !== "ready" && phase !== "end") && <>
          {/* 내 펫몬 */}
          {<HPBarUI x={75} y={550} width={150} height={12} curHp={myCurHP} maxHp={myHP} />}
          <PetSprite src={imgUrlList[1]} x={150} y={750} width={400} height={400} trigger={isMyAttack} movingPoint={35} />
          {/* 상대 펫몬 */}
          <HPBarUI x={925} y={80} width={150} height={12} curHp={enemyCurHP} maxHp={enemyHP} />
          <PetSprite src={imgUrlList[2]} x={1000} y={200} width={230} height={230} trigger={isEnmAttack} movingPoint={-35} />
          <ActionBallUI x={350} y={600} width={400} height={60} correctAnswer={actionBall} />
        </>}
        {/* 퀴즈 phase*/}
        {curWord && <VocaUI word={curWord} x={600} y={350} width={250} height={80} pivotX={125} pivotY={40} />}
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
        {phase === "end" && <BattleReport x={600} y={100} result={result} correct={correct} src={imgUrlList[2]} />}
      </Stage>}
    {/* 컨트롤러 */}
    <StyledCommandUI>
      {phase === "ready" && <MidBtn onClick={() => { setPhase("countdown") }}>시작하기</MidBtn>}
      {phase !== "ready" && <>{optionList.map((option, index) => {
        return (<MidBtn key={`${index}${option}`} onClick={() => { handleOptionOnClick(index) }}>{option}</MidBtn>)
      })}</>}
      {phase === "end" && <MidBtn onClick={() => { setPhase("ready") }}>다시하기</MidBtn>}
    </StyledCommandUI >
  </Container>)
}

const Container = styled.div`
`
const StyledCommandUI = styled.div`
  background-color: #ddd;
  width: 1200px;
  display: flex;
  margin-top: -6px;
  height: 64px;
  padding: 6px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
`

export default WordBattle

