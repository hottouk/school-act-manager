import React, { useRef, useState } from 'react'
//CSS
import styled from 'styled-components'
import useClientHeight from '../../hooks/useClientHeight'
//컴포넌트
import MainBtn from '../../components/Btn/MainBtn'
import SmallBtn from '../../components/Btn/SmallBtn'
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData'

const WordForm = () => {
  //CSS
  const clientHeight = useClientHeight(document.documentElement)
  const [words, setWords] = useState([['', '']]);
  const [title, setTitle] = useState('')
  const inputRefs = useRef([[React.createRef(), React.createRef()]]);
  const { addWordSet } = useAddUpdFireData("words")

  //tab 키다운 인식
  const handleKeyDown = (e, index, subIndex) => {
    if (e.key === 'Tab' && subIndex === 1 && index === words.length - 1) {
      addInputs(index);
    }
  };

  //현재 단어 삭제
  const handleDelete = (index) => {
    setWords((prevInputs) => prevInputs.filter((_, i) => i !== index));
    inputRefs.current.splice(index, 1);
  };

  //변화 감지
  const handleChange = (e, index, subIndex) => {
    const newInputs = [...words];
    newInputs[index][subIndex] = e.target.value;
    setWords(newInputs);
  };

  //index 세자리 수로 만들어주는 함수
  const padNumber = (number, length) => {
    return number.toString().padStart(length, '0');
  }

  //세트 저장 버튼 클릭
  const handleBtnClick = () => {
    let userConfirmed = window.confirm("현제 세트를 저장하시겠습니까?",)
    if (userConfirmed) {
      let wordSet = words.reduce((acc, inputGroup, index) => {
        acc[index] = {
          word: inputGroup[0],
          meaning: inputGroup[1]
        };
        return acc;
      }, []);
      let dataToSave = { wordSet, title }
      addWordSet(dataToSave).then(
        window.alert("성공적으로 저장했습니다..")
      )
    }
    else {
      window.alert("저장이 취소되었습니다.")
    }
  }

  //input창의 개수를 늘린다.
  const addInputs = (index) => {
    setWords((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs.splice(index + 1, 0, ['', '']);
      return newInputs;
    });
    inputRefs.current.splice(index + 1, 0, [React.createRef(), React.createRef()]);
  };

  return (
    <StyledContainer $clientheight={clientHeight}>
      <StyledWordContainer>
        <StyledTitle type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='단어 세트 명' />
        {words.map((_, index) => (
          // flex
          <StyledRow key={index} className="input-group">
            <StyledLabel>{padNumber(index + 1, 3)}</StyledLabel>
            < StyledInput
              ref={inputRefs.current[index][0]}
              type="text"
              value={words[index][0]}
              onChange={(e) => handleChange(e, index, 0)}
              onKeyDown={(e) => handleKeyDown(e, index, 0)}
              placeholder='단어'
            />
            < StyledInput
              ref={inputRefs.current[index][1]}
              type="text"
              value={words[index][1]}
              onChange={(e) => handleChange(e, index, 1)}
              onKeyDown={(e) => handleKeyDown(e, index, 1)}
              placeholder='의미, 뜻'
            />
            <SmallBtn
              btnName={"삭제"}
              btnColor={"#3454d1"}
              btnOnClick={() => handleDelete(index)} />
          </StyledRow>
        ))}
        <MainBtn btnName="세트 저장하기" btnOnClick={() => { handleBtnClick() }} />
      </StyledWordContainer>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 20px auto;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const StyledWordContainer = styled.div`
  grid-column: 2/3;
  margin: auto;
  width: 95%;
`

const StyledTitle = styled.input`
  height: 40px;
  width: 60%;
  border: none;
  margin-bottom: 20px;
  border-bottom: 1px solid #aaa;
`

const StyledRow = styled.div`
  display: flex;
  justify-content: flex-start;
`
const StyledLabel = styled.label`
  margin-right: 8px;
  color: #3454d1;
  font-weight: bold;
`
const StyledInput = styled.input`
  height: 35px;
  border: 1px solid #aaa;
  flex-grow: 1;
  font-size: 12px;
  margin: 5px;
  &::placeholder {
    color: #999;
    font-style: italic;
  }
}
`
export default WordForm