import { useEffect, useState } from 'react';
//컴포넌트
import Modal from 'react-bootstrap/Modal';
import ModalBtn from '../Btn/ModalBtn';
import MainBtn from '../Btn/MainBtn';
import { Spinner } from 'react-bootstrap';
//hooks
import useAddUpdFireData from '../../hooks/useAddUpdFireData';
import useFetchFireData from '../../hooks/useFetchFireData'
//gpt
import useChatGpt from '../../hooks/useChatGpt';
//이미지
import xImage from '../../image/icon/x_btn.png'
//css
import styled from 'styled-components';

//2024.07.19
const AddExtraRecModal = (props) => {
  //1. 변수
  //1) inputFiled와 내용
  const [inputFieldList, setInputFieldList] = useState(['']); // 초기 입력 필드 하나를 설정; 얘가 늘어나면 input개수 알아서 늘어남.
  //2) 데이터 통신
  const { updateActi } = useAddUpdFireData("activities");
  const { fetchDoc } = useFetchFireData();
  useEffect(() => {
    fetchDoc("activities", props.acti.id).then((acti) => {
      if (acti.extraRecordList && acti.extraRecordList.length > 1) { // 한 개는 기본 문구
        let recList = acti.extraRecordList
        let initialFieldList = recList.slice(0, -1)
        setInputFieldList(initialFieldList);
      } else { setInputFieldList(['']) }
    }
    )
  }, [props])
  //3) gpt
  const { askExtraRecord, gptAnswer, gptRes } = useChatGpt();
  useEffect(() => {
    let gptAnswerList = splitGptAnswers(gptAnswer)
    setInputFieldList(gptAnswerList);
  }, [gptAnswer]) //문구 textarea에 넣기


  //2. 함수
  const handleKeyDown = (index, event) => { //textarea 내 tab 키
    if (event.key === 'Tab' && index === inputFieldList.length - 1) {
      event.preventDefault();
      if (inputFieldList.length < 4) {
        addInputField(1);
      } else {
        window.alert("문구는 최대 4개까지 입니다.")
      }
    }
  };

  const addInputField = (number) => {
    setInputFieldList(prevFields => [
      ...prevFields,
      ...Array(number).fill('') // n개의 새로운 빈 입력 필드를 추가
    ]);
  };

  const handleChange = (index, event) => { //textarea 바꾸기
    let values = [...inputFieldList];
    values[index] = event.target.value;
    setInputFieldList(values);
  };

  const splitGptAnswers = (gptAnswers) => { //gpt -> 배열
    return gptAnswers.split('^');
  };

  const handleGptClick = async () => { //gpt 요청 버튼
    if (inputFieldList.length < 4) {
      addInputField(3);
    }
    await askExtraRecord(props.acti.record)
  }

  const handleConfirm = () => { //저장 버튼
    const confirm = window.confirm("추가 문구를 저장하시겠습니까?")
    if (confirm) {
      let extraRecordList = [...inputFieldList, props.acti.record]
      let modifiedActi = { extraRecordList };
      updateActi(modifiedActi, "activities", props.acti.id)
    }
    props.onHide()
  }

  const handleDeleteBtn = (index) => { //삭제 버튼
    const newArr = inputFieldList.filter((_, i) => { return i !== index });
    setInputFieldList(newArr)
  }


  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>돌려쓰기 문구 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>현재 문구</p>
        <StyledCurRec>{props.acti.record}</StyledCurRec>
        <p>돌려 쓸 문구를 추가해주세요. 최대 4개까지 추가 가능합니다.</p>

        <StyledUl>
          {inputFieldList.map((field, index) => {
            return <div key={index} className="cover">
              <span>{index + 1}</span>
              <textarea
                type="text"
                value={field}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
              />
              <img src={xImage} alt="삭제 버튼" onClick={() => { handleDeleteBtn(index) }} />
            </div>
          })}
        </StyledUl>
        {(gptRes === "loading") ?
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner></div> :
          <MainBtn btnName="GPT 요청하기" btnOnClick={handleGptClick} />}
      </Modal.Body>
      <Modal.Footer>
        <ModalBtn btnName="저장" btnColor="#3454d1" hoverColor="blue" onClick={handleConfirm} />
        <ModalBtn btnName="취소" btnColor="#9b0c24" hoverColor="red" onClick={() => { props.onHide(); }} />
      </Modal.Footer>
    </Modal>
  )
}

const StyledUl = styled.ul`
  width: 90%;
  margin: 0 auto;
  padding: 0;
  .cover {
    display: flex;
    align-items: center;
  }
  textarea {
    width: 100%;
    height: 60px;
    border-radius: 10px;
    display: block;
    margin: 10px;
  }
  img {
    width: 25px;
    cursor: pointer;
  }
`

const StyledCurRec = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
`

export default AddExtraRecModal