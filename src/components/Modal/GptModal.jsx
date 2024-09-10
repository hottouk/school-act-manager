//라이브러리
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
//컴포넌트
import Button from 'react-bootstrap/esm/Button';
import MainBtn from '../Btn/MainBtn'
import DotTitle from '../Title/DotTitle';
import GptPersonalRow from '../Row/GptPersonalRow';
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity';
//hooks
import useChatGpt from '../../hooks/useChatGpt';
//data
import personalKeywordList from '../../data/personalKeywordList';
//css
import styled from 'styled-components';

//2024.09.04(수정)
const GptModal = (props) => {
  const [acadList, setAcadList] = useState([])      //학업
  const [careerList, setCareerList] = useState([])  //진로
  const [coopList, setCoopList] = useState([])      //공동체
  useEffect(() => {
    personalKeywordList.map((keywordObj, i) => {
      let prop = (Object.keys(keywordObj)[0])
      let wordList = (Object.values(keywordObj)[0])
      let propWithKeyword = { prop, wordList }
      if (i < 4) {
        setAcadList((prevList) => [...prevList, propWithKeyword])
      } else if (i > 3 && i < 7) {
        setCareerList((prevList) => [...prevList, propWithKeyword])
      } else {
        setCoopList((prevList) => [...prevList, propWithKeyword])
      }
      return null;
    })
  }, [personalKeywordList])
  const [inputValues, setInputValues] = useState(null);
  const { askGptPersonalize, gptAnswer, gptBytes, gptRes } = useChatGpt()
  //보이기
  const [isAcadShown, setIsAcadShown] = useState(false)
  const [isCareerShown, setIsCareerShown] = useState(false)
  const [isCoopShown, setIsCoopShown] = useState(false)
  //2. 함수
  const handleInputChange = (event, type) => { //input 변경
    if (type === "input") {
      let { id, value } = event.target;
      setInputValues({ ...inputValues, [id]: value });
    } else {
      let { id, value } = event
      setInputValues({ ...inputValues, [id]: value });
    }
  };

  const handleSubmit = (event) => { //제출
    event.preventDefault();
    let resultArray = convertObjectToArray(inputValues)
    askGptPersonalize(props.acti, resultArray)
  };

  const convertObjectToArray = (obj) => { //inputValues중 값이 있는 항목만 배열로 변경
    return Object.entries(obj)
      .filter(([key, value]) => value) // 값이 있는 항목만 필터링
      .map(([key, value]) => ({ [key]: value }));
  };

  return (
    <Modal size="lg"
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>GPT 개별화</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(gptRes === "loading") ?
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div> : <StyledForm onSubmit={handleSubmit}>
            <p className="cur_record">{props.acti.record}</p>
            <StyledSpan>학생의 특성을 간단히 적어주세요</StyledSpan>
            <DotTitleWrapper>
              <DotTitle title={"학업 역량 ▼"} onClick={() => { setIsAcadShown((prev) => !prev) }} pointer="pointer"
                styles={{ dotColor: "black", width: "50%", marginBot: "0" }} />
              <AnimMaxHightOpacity isVisible={isAcadShown}
                content={<RowWrapper>
                  {acadList && acadList.map((obj) => {
                    return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} />
                  })}
                </RowWrapper>
                } />
              <DotTitle title={"진로 역량 ▼"} onClick={() => { setIsCareerShown((prev) => !prev) }} pointer="pointer"
                styles={{ dotColor: "black", width: "50%", marginBot: "0" }} />
              <AnimMaxHightOpacity isVisible={isCareerShown}
                content={<RowWrapper>
                  {careerList && careerList.map((obj) => {
                    return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} />
                  })}
                </RowWrapper>
                } />
              <DotTitle title={"공동체 역량 ▼"} onClick={() => { setIsCoopShown((prev) => !prev) }} pointer="pointer"
                styles={{ dotColor: "black", width: "50%", marginBot: "0" }} />
              <AnimMaxHightOpacity isVisible={isCoopShown}
                content={<RowWrapper>
                  {coopList && coopList.map((obj) => {
                    return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} />
                  })}
                </RowWrapper>
                } />
            </DotTitleWrapper>
            <textarea
              defaultValue={gptAnswer || ''}
              placeholder="모든 역량을 다 눌러쓰시기보다 필수 역량 2~3개의 역량만 채우시는게 바람직합니다..from gpt"
              disabled
            >
            </textarea>
            <StyledByteP className="byte">{gptBytes || 0}Byte</StyledByteP>
            <MainBtn type="submit" btnName="GPT 요청하기" ></MainBtn>
          </StyledForm>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          props.onHide()
        }}>취소</Button>
        <Button variant="primary" onClick={() => {
          props.setPersonalRecord(gptAnswer)
          props.onHide()
        }}>확인</Button>
      </Modal.Footer>
    </Modal>)
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  p.cur_record {
    width: 100%;
    border: 1px solid black;
    border-radius: 10px;
    padding: 5px;
  }
  textarea {
    border-radius: 10px;
    height: 100px;
  }
  p.byte { 
    widht: 80px;
    align-self: flex-end;
  }
`
const StyledSpan = styled.span`
  font-size: 18px;
  margin: 7px;
`
const DotTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px;
  gap: 5px;
`
const RowWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: -10px;
  margin-top: 5px;
  margin-bottom: 5px;
`
const StyledByteP = styled.p`
 p { 
    display: inline-block;
    width: 100px;
    margin: 0;
  }
`

export default GptModal