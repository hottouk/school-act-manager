import React from 'react'
import useFireGameData from '../Firebase/useFireGameData';

const useQuizLogic = ({ gameId, setPhase, setHasDone, setMarking, setCurQuiz, setCurAnswer, setCorrectNumber, setActionBall, setWrongList, setMessageList }) => {
  const { updateGameroom } = useFireGameData();
  //랜덤 문제
  const pickRandomQuizSet = (list) => {
    if (!list || list?.length === 0) return
    const randomIndex = Math.floor(Math.random() * list.length);
    const picked = list[randomIndex];
    return { index: randomIndex, quizSet: picked }
  }
  //문제 생성
  const generateQuestion = ({ quizListRef, quizNumberRef, isMulti }) => {
    if (quizListRef.current.length === 0) {
      setMessageList(prev => [...prev, "모든 문제가 출제되었습니다. 게임이 종료됩니다!"]);
      if (isMulti) updateGameroom({ gameId, info: { phase: "end" } });
      else (setPhase("end"));
      return; // 단어가 소진되면 종료
    }
    setHasDone(false);
    setMarking(null);
    if (quizListRef.current.length === 0) return
    ++quizNumberRef.current;
    const { quizSet, index } = pickRandomQuizSet(quizListRef.current); //hooks
    quizListRef.current.splice(index, 1);
    setCurQuiz(quizSet?.split("#")[0]);
    setCurAnswer(quizSet?.split("#")[1]);
  }
  //정답 확인하기
  const checkAnswer = ({ index, curQuiz, curAnswer, optionList, quizNumberRef }) => {
    if (curAnswer === optionList[index]) {
      setMessageList((prev) => [...prev, `${quizNumberRef.current}번 문제, 정답입니다.`]);
      setMarking(true);
      setCorrectNumber(prev => ++prev); //점수
      setActionBall(prev => Math.min(prev + 1, 5));
    }
    else {
      setMessageList((prev) => [...prev, `${quizNumberRef.current}번 문제, 틀렸습니다.`]);
      setMarking(false);
      setWrongList(prev => [...prev, { quiz: curQuiz, answer: curAnswer }]);
    }
  }
  //선택지 구성
  const formQuizOptionList = ({ answer, meaningList }) => {
    if (!answer || !meaningList) return
    const options = [answer]
    let attempts = 0;                                               // 무한 루프 방지용 카운터
    const MAX_ATTEMPTS = 100;                                       // 최대 시도 횟수
    while (options.length < 4 && attempts < MAX_ATTEMPTS) {         // while에서 무한루프 발생하면 브라우져 다운됨.
      const distractor = meaningList[Math.floor(Math.random() * meaningList.length)];
      if (!options.includes(distractor)) options.push(distractor);  // 정답 선택지 중복 생성 방지
      options.sort(() => Math.random() - 0.5)                       // 배열 섞기
      attempts++;
    }
    return options
  }

  return ({ pickRandomQuizSet, formQuizOptionList, generateQuestion, checkAnswer })
}

export default useQuizLogic
