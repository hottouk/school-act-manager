import { Graphics, Sprite, Stage } from '@pixi/react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import React, { useCallback, useEffect, useState } from 'react';
import VocaUI from '../../components/Game/VocaUI';
import HPBar from '../../components/Game/HPBar';
import AnswerUI from '../../components/Game/AnswerUI';
import vocaList from '../../data/vocaList';
import ActionBall from '../../components/Game/ActionBall';
//컴포넌트
const WordBattle = () => {
  //준비
  const storage = getStorage();
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
  //게임 페이즈
  const [phase, setPhase] = useState('')
  // 2단계: 단어 게임 페이즈
  //단어, 의미 List
  const wordList = vocaList.map((voca) => voca.split("#")[0])
  const answerList = vocaList.map((voca) => voca.split("#")[1])
  //문제 관련
  const [qNumber, setQNumber] = useState(0)
  const [curWord, setCurWord] = useState('')
  const [curAnswer, setCurAnswer] = useState('')
  const [randomIndex, setRandomIndex] = useState(null);
  const [optionList, setOptionList] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [intervalId, setIntervalId] = useState(null)
  useEffect(() => {
    if (!wordList) return
    let interval = setInterval(() => {
      setQNumber((prev) => prev + 1)
      generateQuestion();
    }, 3000); //3초마다 새로운 문제 출제

    // interval ID를 상태로 저장
    setIntervalId(interval);

    return () => clearInterval(interval)
  }, [vocaList, phase])

  const imgPathList = ['images/battle_background.png', 'images/pet_water_001_back.png', 'images/pet_grass_001.png']
  const [imgUrlList, setImgUrlList] = useState([])
  const [isVocaShown, setIsVocaShown] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  //문제 출제
  const generateQuestion = () => {
    let index = Math.floor(Math.random() * wordList.length);
    setRandomIndex(index)
    setCurWord(wordList[index])
    setCurAnswer(answerList[index]);
    //정답 + 랜덤 선택지 구성
    const options = [answerList[index]]
    while (options.length < 4) {
      const randomOption = answerList[Math.floor(Math.random() * answerList.length)];
      if (!options.includes(randomOption)) options.push(randomOption);                    //정답 선택지 중복 생성 방지
      setOptionList(options.sort(() => Math.random() - 0.5));
    }
  }
  //정답 확인하기
  const handleCheckAnswer = (index) => {
    if (curAnswer === optionList[index]) {
      setCorrectAnswer((prev) => prev + 1)
      window.alert("정답")
    } else {
      window.alert("오답")
    }
  }
  //화살표 키로 optionIndex 선택
  const handleKeyDown = useCallback((event) => {
    if (!optionList || optionList.length === 0) return;
    if (event.key === "ArrowRight") {
      setSelectedIndex((prev) => (prev + 1) % optionList.length)
    } else if (event.key === "ArrowLeft") {
      setSelectedIndex((prev) => (prev - 1 + optionList.length) % optionList.length)
    } else if (event.key === "Enter") {
      handleCheckAnswer(selectedIndex)
    }
  }, [optionList.length, selectedIndex])
  //이벤트 리스너 추가 및 제거
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 임시 그리드 그리기 (50px 간격) 
  const drawGrid = (g) => {
    const gridSize = 50;
    const stageWidth = 1200;
    const stageHeight = 900;
    g.clear();
    g.lineStyle(1, 0xaaaaaa, 0.5);  // 회색 선, 투명도 0.5

    // 세로선 그리기
    for (let x = 0; x <= stageWidth; x += gridSize) {
      g.moveTo(x, 0);
      g.lineTo(x, stageHeight);
    }

    // 가로선 그리기
    for (let y = 0; y <= stageHeight; y += gridSize) {
      g.moveTo(0, y);
      g.lineTo(stageWidth, y);
    }
  };

  return (
    <Stage width={1200} height={900} options={{ background: "#3454d1" }}>
      {imgUrlList.length !== 0 && <>
        {/* 배경화면 */}
        {/* <Sprite image={imgUrlList[0]} x={0} y={0} width={1200} height={900} /> */}
        <Graphics draw={drawGrid} />
        {/* 내 포켓몬 */}
        <Sprite image={imgUrlList[1]} x={150} y={750} width={400} height={400} anchor={{ x: 0.5, y: 0.5 }} />
        <HPBar x={100} y={330} width={150} height={10} curHp={80} maxHp={100} />
        {/* 상대 포켓몬 */}
        <Sprite image={imgUrlList[2]} x={600} y={270} width={230} height={230} anchor={{ x: 0.5, y: 0.5 }} />
        <HPBar x={500} y={80} width={150} height={10} curHp={60} maxHp={100} />

        <ActionBall x={350} y={500} width={400} height={60} correctAnswer={correctAnswer} />
        {/* VOCA 박스 */}
        {isVocaShown && <VocaUI word={curWord} x={400} y={300} width={150} height={50} pivotX={75} pivotY={25} />}
        <AnswerUI x={350} y={750} width={800} height={80} optionList={optionList} selected={selectedIndex} />
      </>}
    </Stage>)
}

export default WordBattle

