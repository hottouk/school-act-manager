import React, { useEffect, useState } from 'react'
//라이브러리
import { Modal, Spinner } from 'react-bootstrap'
//컴포넌트
import MainBtn from '../Btn/MainBtn';
import ModalBtn from '../Btn/ModalBtn';
import DyTextarea from '../Input/DyTextarea';
//hooks
import useChatGpt from '../../hooks/useChatGpt';
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
import useFetchFireData from '../../hooks/Firebase/useFetchFireData';
//css
import styled from 'styled-components';

//2024.08.24(생성)
const AddPerfRecModal = (props) => {
  const { fetchDoc } = useFetchFireData();
  useEffect(() => {
    fetchDoc("activities", props.acti.id).then((acti) => {
      if (acti.perfRecordList && acti.perfRecordList.length > 0) {
        let perfRecList = acti.perfRecordList
        setTaValueList(perfRecList)
      } else { setTaValueList(['', '', '', '']) }
    }
    )
  }, [props])

  const [_textareaValueList, setTaValueList] = useState(['', '', '', ''])
  const { updateActi } = useAddUpdFireData("activities");

  //gpt
  const { askPerfRecord, gptAnswer, gptRes } = useChatGpt();
  useEffect(() => {
    let gptAnswerList = splitGptAnswers(gptAnswer)
    let newValueList = [...gptAnswerList, `${props.acti.title} 활동에 참여함.`] //상,중,하는 gpt 도움 받기, 최하는 참여했다고 기록
    if (gptAnswer !== '') setTaValueList(newValueList)
  }, [gptAnswer])

  const splitGptAnswers = (gptAnswers) => { //gpt -> 배열
    return gptAnswers.split('^');
  };

  const handleGptClick = async () => { //gpt 요청 버튼
    let acti = props.acti
    await askPerfRecord(acti.subject, acti.title, acti.record)
  }

  // 각 input 필드의 변경 사항을 처리하는 함수
  const handleInputChange = (e, index) => {
    const newValueList = [..._textareaValueList];
    newValueList[index] = e.target.value;
    setTaValueList(newValueList);
  };

  const handleConfirm = () => { //todo 저장해보기
    const confirm = window.confirm("수행평가 문구를 저장하시겠습니까?")
    if (confirm) {
      let perfRecordList = [..._textareaValueList]
      props.setPerfRecList(perfRecordList)  // 외부 문구 list 셋 
      let modifiedActi = { perfRecordList }; // firedata 업데이트 위한 객체화
      updateActi(modifiedActi, "activities", props.acti.id)
    }
    props.onHide()
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>수행평가 문구 추가</Modal.Header>
      <Modal.Body>
        <p>현재 문구</p>
        <StyledCurRec>{props.acti.record}</StyledCurRec>
        <p>1. 수행평가 성취 단계를 결정해주세요.</p>
        <TextareaWrapper>
          <DyTextarea className="dy_input" number={4} titleList={["상", "중", "하", "최하"]} valueList={_textareaValueList} onChange={handleInputChange} />
        </TextareaWrapper>
        {(gptRes === "loading")
          ? <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner></div>
          : <MainBtn btnName="GPT 요청하기" btnOnClick={handleGptClick} />
        }
      </Modal.Body>
      <Modal.Footer>
        <ModalBtn btnName="저장" btnColor="#3454d1" hoverColor="blue" onClick={handleConfirm} />
        <ModalBtn btnName="취소" btnColor="#9b0c24" hoverColor="red" onClick={() => { props.onHide(); }} />
      </Modal.Footer>
    </Modal>
  )
}

const StyledCurRec = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
`
const TextareaWrapper = styled.div`
  display: flex;
  margin: 0;
  justify-content: center;
`
const RadioWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
`
export default AddPerfRecModal