import React, { useState } from 'react'
import styled from 'styled-components';

const WordBattle = () => {
  // 단어와 보기 상태 설정
  const [words] = useState({
    "Apple": "사과",
    "Banana": "바나나",
    "Orange": "오렌지",
    "Grape" : "포도"
  });

  // 현재 보여지는 단어 설정
  const [currentWord, setCurrentWord] = useState('');
  // 현재 보기 설정
  const [currentChoices, setCurrentChoices] = useState([]);
  // 단어와 보기를 무작위로 선택하는 함수

  const showWord = () => {
    const wordList = Object.keys(words);
    const meaningList = Object.values(words)
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(randomWord);
    const choices = [...meaningList];
    // 무작위로 선택된 보기 순서 섞기
    choices.sort(() => Math.random() - 0.5);
    setCurrentChoices(choices);
  };
  // 사용자가 답을 선택했을 때 처리하는 함수
  const checkAnswer = (choice) => {
    if (choice === words[currentWord]) {
      alert("정답입니다!");
    } else {
      alert("틀렸습니다!");
    }
    // 다음 단어 보여주기
    showWord();
  };

  return (
    <>
      <h1>단어 시험</h1>
      <div>
        <h2>{currentWord}</h2>
        <div>
          {currentChoices.map((choice, index) => (
            <StyledBtn key={index} onClick={() => checkAnswer(choice)}>{choice}</StyledBtn>
          ))}
        </div>
        <StyledBtn onClick={showWord}>다음 단어</StyledBtn>
      </div>
      <div>
        <h2>단어 파베에 추가</h2>
        <form action="submit">
          <input type="text" />
        </form>
      </div>
    </>
  );
}

const StyledBtn = styled.button`
  margin: 5px;
  padding: 10px;
  font-size: 16px;
`

export default WordBattle