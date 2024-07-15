import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import React, { useState } from 'react'
import MainBtn from '../Btn/MainBtn'
import useChatGpt from '../../hooks/useChatGpt';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';

//2024.07.13 제작완료
const GptModal = (props) => {
  const { askGptPersonalize, gptAnswer, gptBytes, gptRes } = useChatGpt()
  const personalPropList = ["리더십", "진로 역량", "공동체 역량", "학업 역량", "성실성"]
  const [inputValues, setInputValues] = useState({
    "리더십": '',
    "진로 역량": '',
    "공동체 역량": '',
    "학업 역량": '',
    "성실성": '',
  });

  //2. 함수
  const handleInputChange = (event) => { //input 변경
    const { id, value } = event.target;
    setInputValues({ ...inputValues, [id]: value });
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
    <Modal
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
            <ul>
              <span>학생의 특성을 간단히 적어주세요</span>
              {personalPropList.map(personalProp => {
                return <div key={personalProp}>
                  <p>{personalProp}</p>
                  <input type="text" onChange={handleInputChange} id={personalProp} />
                </div>
              })}
            </ul>
            <textarea
              defaultValue={gptAnswer || ''}
              placeholder="GPT 요청 결과"
              disabled
            >
            </textarea>
            <p className="byte">{gptBytes || 0}Byte</p>
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
  ul {
    margin-top: 20px;
  }
  p { display: inline-block;
    width: 100px;
    margin: 0;
  }
  div {
    display: flex;
    align-items: center;
    margin: 8px 0;
  }
  input {
    width: 65%;
    height: 35px;
    border-radius: 10px;
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

export default GptModal