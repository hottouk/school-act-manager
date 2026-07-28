import { useCallback, useMemo, useState } from 'react'
const useQuizLogic = (quizList = [],) => {
  const [marking, setMarking] = useState(null);
  //문항
  const [curQuiz, setCurQuiz] = useState('')
  const [curAnswer, setCurAnswer] = useState('');
  //맞춘 개수
  const [correctNumber, setCorrectNumber] = useState(0);
  const [wrongList, setWrongList] = useState([]);
  //선택지 구성 풀
  const frozenAnswerList = useMemo(() => {
    const meanings = quizList.map((voca) => voca.split("#")[1]);
    return meanings;
  }, [quizList]);
  //선택지
  const optionList = useMemo(() => {
    if (!curAnswer || frozenAnswerList?.length === 0) return [];
    const formQuizOptionList = (answer, meaningList) => {
      const options = [answer];
      let attempts = 0;                                               // 무한 루프 방지용 카운터
      const MAX_ATTEMPTS = 100;                                       // 최대 시도 횟수
      while (options.length < 4 && attempts < MAX_ATTEMPTS) {         // while에서 무한루프 발생하면 브라우져 다운됨.
        const distractor = meaningList[Math.floor(Math.random() * meaningList.length)];
        if (!options.includes(distractor)) options.push(distractor);  // 정답 선택지 중복 생성 방지
        options.sort(() => Math.random() - 0.5)                       // 배열 섞기
        attempts++;
      }
      return options;
    }
    return formQuizOptionList(curAnswer, frozenAnswerList);
  }, [curAnswer, frozenAnswerList]);

  //**함수**/
  //랜덤 문제
  const pickRandomQuizSet = (list) => {
    if (!list || list?.length === 0) return;
    const randomIndex = Math.floor(Math.random() * list.length);
    const picked = list[randomIndex];
    return { idx: randomIndex, quizSet: picked }
  }
  //문제 생성
  const generateQuestion = useCallback((listRef) => {
    if (listRef?.current.length === 0) return;
    const { quizSet, idx } = pickRandomQuizSet(listRef.current);
    setCurQuiz(quizSet?.split("#")[0]);
    setCurAnswer(quizSet?.split("#")[1]);
    return { idx };
  }, []);
  //채점
  const checkAnswer = (index, setActionBall) => {
    if (curAnswer === optionList[index]) {
      setMarking(true);
      setCorrectNumber(prev => prev + 1); //점수
      setActionBall(prev => Math.min(prev + 1, 5));
    }
    else {
      setMarking(false);
      setWrongList(prev => [...prev, { quiz: curQuiz, answer: curAnswer }]);
    }
  }
  const resetQuizResults = useCallback(() => {
    setCorrectNumber(0);
    setWrongList([]);
    setMarking(null);
  }, []);
  return (
    { curQuiz, curAnswer, optionList, marking, correctNumber, wrongList, setCurQuiz, setCurAnswer, setMarking, generateQuestion, checkAnswer, resetQuizResults, setCorrectNumber }
  )
}

export default useQuizLogic
