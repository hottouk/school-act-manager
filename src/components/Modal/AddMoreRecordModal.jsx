//라이브러리
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
//컴포넌트
import Modal from 'react-bootstrap/Modal';
import ModalBtn from '../Btn/ModalBtn';
import DotTitle from '../Title/DotTitle';
import InnerOverlay from '../Styled/InnerOverlay';
//hooks
import useGetByte from '../../hooks/useGetByte';
//이미지
import xImage from '../../image/icon/x_btn.png';
import plusImg from '../../image/icon/plus.png';
//생성(240719) --> 6개로 수정(241123) --> 디자인정리(250210) --> 리라 결제 및 통합(260108)
const AddMoreRecordModal = ({ show, onHide, record, list, setList, isInnerModal, setIsRiraModal, from, type, setType }) => {
  useEffect(() => bindData(), [list, show, type]);
  const { getByteLengthOfString } = useGetByte();
  //성취도
  const achivList = ["상", "중", "하", "최하"];
  const [_perfRecList, setPerfRecList] = useState(['', '', '', '']);
  const textareaRef = useRef({});
  //돌려쓰기
  const [_extraRecList, setExtraRecList] = useState(['']); // 초기 입력 필드 하나를 설정; 늘어나면 input text개수 알아서 늘어남.
  //반복
  const [_repeatInfoList, setRepeatInfoList] = useState([{ times: 2, record: '' }]);
  //------함수부------------------------------------------------
  const bindData = () => {
    if (!list || !type) return;
    if (list?.length > 0) {
      if (type === "extra") setExtraRecList(list);
      else if (type === "perf") setPerfRecList(list);
      else setRepeatInfoList(list);
    }
  }
  //n개의 새로운 빈 입력 필드를 추가
  const addInputField = (number = 1) => {
    if (type === "extra") {
      if (_extraRecList.length < 6) {
        setExtraRecList(prevFields => [
          ...prevFields,
          ...Array(number).fill('')
        ]);
      } else {
        window.alert("문구는 최대 6개까지 입니다.");
      }
    } else {
      if (_repeatInfoList.length < 3) {
        setRepeatInfoList(prev => [
          ...prev,
          ...Array(number).fill({ times: 2, record: '' })
        ]);
      }
      else { window.alert("문구는 최대 3개까지 입니다."); }
    }
  };
  //tab 키 입력시 새 입력 필드 추가
  const handleKeyDown = (event, list, index) => {
    if (event.key === 'Tab' && index === list.length - 1) addInputField();
  };
  //개별화 틀 클릭
  const handleTemplateOnClick = (index) => {
    const template = '{/*개별 변경 사항을 입력하세요*/}';
    const textarea = textareaRef.current[index];
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
  //textarea 변경
  const handleOnChange = (list, event, index) => {
    const newList = [...list];
    newList[index] = event.target.value;
    if (type === "extra") setExtraRecList(newList);
    else if (type === "perf") setPerfRecList(newList);
  }
  //info 변경
  const handleInfoOnChange = (attr, event, index) => {
    setRepeatInfoList((prev) => {
      const value = attr === "times" ? Number(event.target.value) : event.target.value;
      return prev.map((item, i) => i === index ? { ...item, [attr]: value } : item);
    })
  }
  //gpt 요청 버튼
  const handleGptOnClick = async () => setIsRiraModal(true);
  //삭제 버튼
  const handleDeleteOnClick = (index, list, setList) => {
    const newList = list.filter((_, i) => { return i !== index });
    setList(newList);
  };
  const check = (arr) => {
    return new Set(arr).size === arr.length;
  }
  //저장 버튼
  const handleSaveOnClick = () => {
    const confirm = window.confirm("추가 문구를 저장하시겠습니까?");
    if (confirm) {
      if (type === "extra") setList(_extraRecList);
      else if (type === "perf") setList(_perfRecList);
      else {
        const list = _repeatInfoList.map(item => Number(item.times));
        if (!check(list)) { alert("횟수는 모두 달라야합니다."); return; }
        setList(_repeatInfoList);
      }
      //부모 컴포넌트에 변경 data 반영
      onHide();
      setType(from);
    }
  };
  return (
    <Modal
      size='lg'
      show={show}
      onHide={onHide}
      backdrop="static"
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }}>{(type === "extra") ? "돌려쓰기" : "수행평가"} 문구 관리</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef", borderRadius: "5px" }}>
        <Column style={{ gap: "10px", marginBottom: "10px" }}>
          <DotTitle>현재 문구</DotTitle>
          <Wrapper>{record}</Wrapper>
        </Column>
        <GridContainer>
          <TableHeaderWrapper>
            <Header>{(type === "perf") ? "성취도" : (type === "extra") ? "연번" : "횟수"}</Header>
            <Header>내용</Header>
            <Header>바이트</Header>
            <Header>{(type === "perf") ? "개별 틀" : "삭제"}</Header>
          </TableHeaderWrapper>
          {/* 성취도 */}
          {type === "perf" && <>
            {achivList?.map((achiv, index) => {
              return <GridRowWrapper key={index} >
                <GridItem $columns={"1/2"}><span>{achiv}</span></GridItem>
                <GridItem $columns={"2/3"}>
                  <textarea style={{ borderRadius: "5px" }}
                    ref={(el) => textareaRef.current[index] = el}
                    type="text"
                    value={_perfRecList[index]}
                    onChange={(event) => handleOnChange(_perfRecList, event, index)}
                  />
                </GridItem>
                <GridItem $columns={"3/4"}>{getByteLengthOfString(_perfRecList[index])} byte</GridItem>
                <GridItem $columns={"4/5"}><img src={plusImg} alt="템플릿 추가" onClick={() => handleTemplateOnClick(index)} /></GridItem>
              </GridRowWrapper>
            })}</>}
          {/* 돌려 쓰기 */}
          {type === "extra" && <>
            {_extraRecList?.length === 0 && <GridItem $columns={"1/6"} style={{ height: "35px" }}><span>설정된 문구가 없습니다.</span></GridItem>}
            {_extraRecList?.map((record, index) => {
              return <GridRowWrapper key={index} >
                <GridItem $columns={"1/2"}><span>{index + 1}</span></GridItem>
                <GridItem $columns={"2/3"}>
                  <textarea style={{ borderRadius: "5px" }}
                    type="text"
                    value={record}
                    onChange={(event) => handleOnChange(_extraRecList, event, index)}
                    onKeyDown={(event) => handleKeyDown(event, _extraRecList, index)}
                  /></GridItem>
                <GridItem $columns={"3/4"}>{getByteLengthOfString(record)} byte</GridItem>
                <GridItem $columns={"4/5"}><img src={xImage} alt="삭제 버튼" onClick={() => handleDeleteOnClick(index, _extraRecList, setExtraRecList)} /></GridItem>
              </GridRowWrapper>
            })}</>}
          {/* 반복 */}
          {type === "repeat" && <>
            {_repeatInfoList?.length === 0 && <GridItem $columns={"1/6"} style={{ height: "35px" }}><span>설정된 문구가 없습니다.</span></GridItem>}
            {_repeatInfoList?.map((item, index) => {
              return <GridRowWrapper key={index} >
                <GridItem $columns={"1/2"}>
                  <NumberInput
                    id="numberInput"
                    type='number'
                    value={item.times}
                    onChange={(event) => handleInfoOnChange("times", event, index)}
                    min={2} max={10} />
                  <p style={{ margin: 0 }}>회</p>
                </GridItem>
                <GridItem $columns={"2/3"} style={{ gap: "5px" }}>
                  <textarea
                    id="recTextarea"
                    type="text"
                    value={item.record}
                    onChange={(event) => handleInfoOnChange("record", event, index)}
                    onKeyDown={(event) => handleKeyDown(event, _repeatInfoList, index)}
                  />
                </GridItem>
                <GridItem $columns={"3/4"}>{getByteLengthOfString(item.record)} byte</GridItem>
                <GridItem $columns={"4/5"}><img src={xImage} alt="삭제 버튼" onClick={() => handleDeleteOnClick(index, _repeatInfoList, setRepeatInfoList)} /></GridItem>
              </GridRowWrapper>
            })}
          </>}
        </GridContainer>
        <Row style={{ justifyContent: "flex-end", marginTop: "10px", gap: "10px" }}>
          {["extra", "repeat"].includes(type) &&
            <i className="fa-solid fa-plus" style={{ cursor: "pointer", color: "#3454d1" }} onClick={addInputField} />}
          <i className="fa-solid fa-brain" style={{ cursor: "pointer", color: "#3454d1" }} onClick={handleGptOnClick} />
        </Row>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }} >
        <ModalBtn onClick={() => { onHide(); setType(from); }}>취소</ModalBtn>
        <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleSaveOnClick}>반영</ModalBtn>
      </Modal.Footer>
      {isInnerModal && <InnerOverlay />}
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
const Column = styled(Row)`
  flex-direction: column;
`
// lastChild의 범위를 명확하게 하기 위함.
const TableHeaderWrapper = styled.div` 
  display: contents;
`
const Header = styled.div`
  display: flex;
  background-color: #3453d190;
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
    border: none;
    border-radius: 10px;
    display: block;
    margin: 10px;
  }
  img {
    width: 25px;
    cursor: pointer;
  }
`
const Wrapper = styled.div`
  background-color: white;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`
const NumberInput = styled.input`
	width: 40px;
	height: 30px;
	border: none;
	text-algin: center;
	border-radius: 5px
`

export default AddMoreRecordModal