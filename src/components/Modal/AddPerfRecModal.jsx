import React, { useEffect, useRef, useState } from 'react'
//라이브러리
import { Modal, Spinner } from 'react-bootstrap'
//컴포넌트
import MainBtn from '../Btn/MainBtn';
import ModalBtn from '../Btn/ModalBtn';
import LongW100Btn from '../Btn/LongW100Btn';
//hooks
import useChatGpt from '../../hooks/useChatGpt';
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
import useFetchFireData from '../../hooks/Firebase/useFetchFireData';
//css
import styled from 'styled-components';

//2024.08.24(생성) -> 11.12.(개별화 틀 생성 버튼 추가)
const AddPerfRecModal = (props) => {
  //----1.변수부--------------------------------
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
  const achivList = ["상", "중", "하", "최하"]
  const [_textareaValueList, setTaValueList] = useState(['', '', '', ''])
  const textareaRef = useRef({})
  const { updateActi } = useAddUpdFireData("activities");
  //gpt
  const { askPerfRecord, gptAnswer, gptRes } = useChatGpt();
  useEffect(() => {
    let gptAnswerList = splitGptAnswers(gptAnswer)
    let newValueList = [...gptAnswerList, `${props.acti.title} 활동에 참여함.`] //상,중,하는 gpt 도움 받기, 최하는 참여했다고만 기록
    if (gptAnswer !== '') setTaValueList(newValueList)
  }, [gptAnswer])

  //----2.함수부--------------------------------
  //gpt -> 배열
  const splitGptAnswers = (gptAnswers) => {
    return gptAnswers.split('^');
  }
  //gpt 요청 버튼
  const handleGptClick = async () => {
    let acti = props.acti
    await askPerfRecord(acti.subject, acti.title, acti.record)
  }
  //각 input 필드의 변경 사항을 처리하는 함수
  const handleInputOnChange = (e, index) => {
    let newValueList = [..._textareaValueList];
    newValueList[index] = e.target.value;
    setTaValueList(newValueList);
  }
  //todo 저장해보기
  const handleConfirm = () => {
    const confirm = window.confirm("수행평가 문구를 저장하시겠습니까?")
    if (confirm) {
      let perfRecordList = [..._textareaValueList]
      props.setPerfRecList(perfRecordList)  // 외부 문구 list 셋 
      let modifiedActi = { perfRecordList }; // firedata 업데이트 위한 객체화
      updateActi(modifiedActi, "activities", props.acti.id)
    }
    props.onHide()
  }
  //개별 변경 틀 입력 버튼 클릭시
  const handleBtnOnClick = (index) => {
    let template = '{/*개별 변경 사항을 입력하세요*/}';
    let textarea = textareaRef.current[index];
    // 현재 커서 위치 가져오기
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    // 템플릿 추가
    let textBefore = textarea.value.substring(0, start); //0부터 커서 전까지 텍스트 추출
    let textAfter = textarea.value.substring(end);       //커서 뒤부터 끝까지 텍스트 추출
    textarea.value = textBefore + template + textAfter;
    // 템플릿 내 커서를 '...' 위치로 이동
    let cursorPosition = start + 3; // '{/* ... */}'에서 '...'의 시작 위치
    textarea.setSelectionRange(cursorPosition, cursorPosition + 15);
    textarea.focus();
  }

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>수행평가 문구 추가</Modal.Header>
      <Modal.Body>
        <CurWrapper>
          <AchivWrapper $top={-29}>현재 문구</AchivWrapper>
          <StyledCurRec>{props.acti.record}</StyledCurRec>
        </CurWrapper>
        <FlexWrapper>
          {achivList.map((achiv, index) => {
            return <TextareaWrapper key={achiv}>
              <AchivWrapper $top={-23}>{achiv}</AchivWrapper>
              <textarea
                ref={(ele) => textareaRef.current[index] = ele}
                placeholder={`성취도 ${achiv}에 해당하는 문구를 작성하세요`}
                title={achiv}
                value={_textareaValueList[index]}
                onChange={(e) => { handleInputOnChange(e, index) }}
              />
              <LongW100Btn styles={{ btnColor: "#3454d1", color:"#efefef" }} btnOnClick={() => { handleBtnOnClick(index) }} btnName="개별화 틀 삽입" />
            </TextareaWrapper>
          })}
        </FlexWrapper>
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
  border-top-left-radius: 0;
  padding: 10px;
  margin-bottom: 10px;
`
const CurWrapper = styled.div`
  position: relative;
  margin: 25px 0;
`
const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 35px;
`
const TextareaWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  textarea {
    display: block;
    width: 100%;
    min-width: 400px;
    min-height: 100px;
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 5px;
    border-radius: 7px;
    border-top-left-radius: 0;
  }
`
const AchivWrapper = styled.div`
  border: 1px solid gray;
  border-bottom: none;
  background-color: #efefef;
  position: absolute;
  top: ${({ $top }) => $top}px;
  padding: 2px 15px;
  border-radius: 10px 10px 0 0;
`

export default AddPerfRecModal