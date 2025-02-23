import { useEffect, useState } from 'react';
//컴포넌트
import Modal from 'react-bootstrap/Modal';
import ModalBtn from '../Btn/ModalBtn';
import MainBtn from '../Btn/MainBtn';
import { Spinner } from 'react-bootstrap';
//hooks
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
import useFetchFireData from '../../hooks/Firebase/useFetchFireData'
//gpt
import useChatGpt from '../../hooks/useChatGpt';
//이미지
import xImage from '../../image/icon/x_btn.png'
//css
import styled from 'styled-components';
import ByteCalculator from '../Etc/ByteCalculator';

//2024.07.19 --> 11.23 6개로 수정 --> 디자인정리(250210)
const AddExtraRecModal = (props) => {
  //ex record
  const [extraRecList, setExtraRecList] = useState(['']); // 초기 입력 필드 하나를 설정; 얘가 늘어나면 input text개수 알아서 늘어남.
  //데이터 통신
  const { updateActi } = useAddUpdFireData("activities");
  const { fetchDoc } = useFetchFireData();
  useEffect(() => {
    fetchDoc("activities", props.acti.id).then((acti) => {
      if (acti.extraRecordList && acti.extraRecordList.length > 1) { // 한 개는 기본 문구
        let recList = acti.extraRecordList
        let initialFieldList = recList.slice(0, -1)
        setExtraRecList(initialFieldList);
      } else { setExtraRecList(['']) }
    }
    )
  }, [props])
  //gpt
  const { askExtraRecord, gptAnswer, gptRes } = useChatGpt();
  useEffect(() => {
    let gptAnswerList = splitGptAnswers(gptAnswer)
    setExtraRecList(gptAnswerList);
  }, [gptAnswer]) //문구 textarea에 넣기

  //------함수부------------------------------------------------  
  const handleKeyDown = (index, event) => { //textarea 내 tab 키
    if (event.key === 'Tab' && index === extraRecList.length - 1) {
      event.preventDefault();
      if (extraRecList.length < 6) {
        addInputField(1);
      } else {
        window.alert("문구는 최대 6개까지 입니다.")
      }
    }
  };
  // n개의 새로운 빈 입력 필드를 추가
  const addInputField = (number) => {
    setExtraRecList(prevFields => [
      ...prevFields,
      ...Array(number).fill('')
    ]);
  };
  //textarea 바꾸기
  const handleChange = (index, event) => {
    let values = [...extraRecList];
    values[index] = event.target.value;
    setExtraRecList(values);
  };
  //gpt -> 배열
  const splitGptAnswers = (gptAnswers) => {
    return gptAnswers.split('^');
  };
  //gpt 요청 버튼
  const handleGptClick = async () => {
    await askExtraRecord(props.acti.record)
  }
  //저장 버튼
  const handleConfirm = () => {
    const confirm = window.confirm("추가 문구를 저장하시겠습니까?")
    if (confirm) {
      let extraRecordList = [...extraRecList, props.acti.record]
      props.setExtraRecList(extraRecordList)  // 외부 문구 list 셋 
      let modifiedActi = { extraRecordList }; // firedata 업데이트 위한 객체화
      updateActi(modifiedActi, "activities", props.acti.id)
    }
    props.onHide()
  }

  const handleDeleteBtn = (index) => { //삭제 버튼
    const newArr = extraRecList.filter((_, i) => { return i !== index });
    setExtraRecList(newArr)
  }

  return (
    <Modal
      size='lg'
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>돌려쓰기 문구 추가</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        <CurWrapper>
          <AchivTap $top={-28}>현재 문구</AchivTap>
          <StyledCurRec>{props.acti.record}</StyledCurRec>
        </CurWrapper>
        <GridContainer>
          <TableHeaderWrapper>
            <StyledHeader>순번</StyledHeader>
            <StyledHeader>내용</StyledHeader>
            <StyledHeader>바이트</StyledHeader>
            <StyledHeader>삭제</StyledHeader>
          </TableHeaderWrapper>
          {extraRecList.map((record, index) => {

            return <GridRowWrapper key={index} >
              <GridItem $columns={"1/2"}><span>{index + 1}</span></GridItem>
              <GridItem $columns={"2/3"}>
                <textarea
                  type="text"
                  value={record}
                  onChange={(event) => handleChange(index, event)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                /></GridItem>
              <GridItem $columns={"3/4"}><ByteCalculator str={record} styles={{ isTotalByteHide: true }} /></GridItem>
              <GridItem $columns={"4/5"}><img src={xImage} alt="삭제 버튼" onClick={() => { handleDeleteBtn(index) }} /></GridItem>
            </GridRowWrapper>
          })}
        </GridContainer>
        {(gptRes === "loading")
          ? <Row style={{ justifyContent: "center", marginTop: "20px" }}><Spinner animation="border" role="status" /></Row>
          : <Row style={{ justifyContent: "center", marginTop: "20px" }}><MainBtn onClick={handleGptClick}>ChatGPT</MainBtn></Row>}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }} >
        <ModalBtn onClick={() => { props.onHide() }}>취소</ModalBtn>
        <ModalBtn styles={{ btnColor: "rgba(52, 84, 209, 0.8)", hoverColor: "#3454d1" }} onClick={handleConfirm}>저장</ModalBtn>
      </Modal.Footer>
    </Modal >
  )
}
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr 100px 70px;
  grid-template-rows: 40px;
  margin: 0 auto;
  padding: 0;
`
const Row = styled.div`
  display: flex;
`
// lastChild의 범위를 명확하게 하기 위함.
const TableHeaderWrapper = styled.div` 
  display: contents;
`
const StyledHeader = styled.div`
  display: flex;
  background-color: #3454d1;
  color: white;
  padding: 10px;
  justify-content: center;
  &: first-child {
    border-top-left-radius: 5px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
`
const GridRowWrapper = styled.div`
  display: contents;
`
const GridItem = styled.div`
  grid-column: ${(props) => props.$columns};
  background-color: #ddd;
  color: black;
  border: 1px solid rgba(120, 120, 120, 0.3);
  border-radius: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  textarea {
    width: 100%;
    height: 75px;
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
  border-top-left-radius: 0;
  padding: 10px;
  margin-bottom: 10px;
`
const CurWrapper = styled.div`
  position: relative;
  margin: 25px 0;
`
const AchivTap = styled.div`
  border-bottom: none;
  background-color: #3454d1;
  color: white;
  position: absolute;
  top: ${({ $top }) => $top}px;
  padding: 2px 15px;
  border-radius: 10px 10px 0 0;
`

export default AddExtraRecModal