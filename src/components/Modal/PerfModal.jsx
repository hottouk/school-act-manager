//라이브러리
import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import Select from 'react-select'
//컴포넌트
import ModalBtn from '../Btn/ModalBtn';
import MidBtn from '../Btn/MidBtn';
//hooks
import useGetByte from '../../hooks/useGetByte';
import useAcc from '../../hooks/useAcc';
//css
import styled from 'styled-components';

//2024.11.13 생성
const PerfModal = ({ show, onHide, studentList, classId }) => {
  //----1.변수부--------------------------------
  useEffect(() => { initData() }, [studentList])
  const actiList = useSelector(({ allActivities }) => allActivities)
  //acti중에서 수행평가를 찾는다.
  useEffect(() => {
    let options = []
    let perfList = actiList.filter(acti => acti.perfRecordList && acti.perfRecordList.length > 0)
    perfList.map(perf => {
      return options.push({ //찾아서 필요한 속성들만 재구성
        label: perf.title, value: perf.record, title: perf.title, perfRecordList: perf.perfRecordList, id: perf.id,
        uid: perf.uid, record: perf.record, subject: perf.subject, scores: perf.scores, money: perf.money, monImg: perf.monImg
      })
    })
    setOptionList([...options])
  }, [actiList])
  const [selectedPerf, setSelectedPerf] = useState(null)
  const [optionList, setOptionList] = useState([])
  const [achivList] = useState(["상", "중", "하", "최하"])
  const radioRef = useRef({})
  const inputRef = useRef({})
  const { getByteLengthOfString } = useGetByte()
  const { writePerfRecDataOnDB } = useAcc()
  //수행 문구
  const [perfTempRecord, setPerfTempRecord] = useState()
  const [perfRecord, setPerfRecord] = useState()
  const [extractResult, setExtractResult] = useState()
  //개별화 대체
  const [replaceList, setReplaceList] = useState({})

  //----2.함수부--------------------------------
  //초기화
  const initData = () => {
    setPerfRecord(createMatrix(studentList, ''))
    setPerfTempRecord(createMatrix(studentList, ''))
    setExtractResult(createMatrix(studentList, []))
    setSelectedPerf(null)
  }
  //이중 객체 생성
  const createMatrix = (list, initVal) => {
    let matrix = {}
    list?.forEach((key, index) => matrix[index] = initVal);
    return matrix
  }
  //성취도 selector 변경 시
  const handleAchivOnChange = (event) => {
    let achivIndex = event.value
    let achivRec = selectedPerf?.perfRecordList[achivIndex] ?? ''
    let lastNumber = Object.keys(perfRecord).length
    for (let i = 0; i < lastNumber; i++) {
      setPerfRecord((prev) => { return { ...prev, [i]: achivRec } })
      setPerfTempRecord((prev) => { return { ...prev, [i]: achivRec } })
      extractContent(achivRec, i)
    }
  }
  //라디오 버튼 변경 시
  const handleRadioOnChange = (index, subIndex) => {
    if (selectedPerf) {
      let record = selectedPerf?.perfRecordList[subIndex]
      setPerfRecord((prev) => { return { ...prev, [index]: record } })
      setPerfTempRecord((prev) => { return { ...prev, [index]: record } })
      extractContent(record, index)
    } else {
      window.alert("수행 평가를 먼저 선택하세요.")
    }
  }
  //개별화 부분 text 변경 시
  const handleInputOnChange = (event, index, subIndex) => {
    let { value } = event.target;
    setReplaceList((prev) => {
      let updated = { ...prev }
      if (!updated[index]) { updated[index] = []; } //없다면 생성
      updated[index][subIndex] = value;             //값 넣기
      return updated
    })
  }
  //변경 버튼
  const handleAltBtnOnClick = (index) => {
    let text = perfTempRecord[index]
    let altList = (replaceList[index])
    let replaced = replacePlaceholders(text, altList)
    setPerfRecord((prev) => { return { ...prev, [index]: replaced } })
  }
  //개별화 부분 대체
  const replacePlaceholders = (text, replaceList) => {
    if (!replaceList) { window.alert("빈칸을 채워주세요.") } else {
      let index = 0;
      return text.replace(/\{\/\*.*?\*\/\}/g, () => replaceList[index++] || '');
    }
  }
  //특정 기호, {/*  */} 사이의 문자열 추출
  const extractContent = (text, index) => {
    let matches = text.match(/\{\/\*\s*(.*?)\s*\*\/\}/g); //정규식
    let result = matches?.map(match => match.slice(3, -3).trim()) ?? []
    setExtractResult((prev) => { return { ...prev, [index]: result } })
  }
  //성취도 selector option 만들기
  const createAchivOptionList = () => {
    let achivOptionList = achivList.map((achiv, index) => {
      return { label: achiv, value: index }
    })
    return achivOptionList
  }
  //최종 바이트 get
  const getPerfRecByte = (index) => {
    let text = perfRecord[index]
    if (typeof (text) == "string") {
      return getByteLengthOfString(text)
    } else { return 0 }
  }
  //최종 저장 확인 버튼
  const saveBtnOnClick = () => {
    if (selectedPerf) {
      if (window.confirm("저장하시겠습니까?")) {
        writePerfRecDataOnDB(studentList, classId, selectedPerf, perfRecord)
        initData();
        onHide();
      }
    } else { window.alert("선택된 수행평가가 없습니다.") }
  }
  //취소 버튼
  const cancelBtnOnClick = () => {
    initData();
    onHide();
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      fullscreen={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>수행 평가 관리</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SelectWrapper>
          <Select
            onChange={(event) => { setSelectedPerf(event) }}
            options={optionList}
            placeholder="수행평가를 선택해주세요."
          />
          {selectedPerf && <Select
            placeholder="성취도를 선택해주세요."
            options={createAchivOptionList()}
            onChange={(event) => { handleAchivOnChange(event) }}
          />}
        </SelectWrapper>
        <GridContainer>
          <TableHeaderWrapper>
            <StyledHeader>연번</StyledHeader>
            <StyledHeader>학번</StyledHeader>
            <StyledHeader>이름</StyledHeader>
            <StyledHeader>수행 성취도</StyledHeader>
            <StyledHeader>개별화 부분</StyledHeader>
            <StyledHeader>수행 문구</StyledHeader>
            <StyledHeader>바이트</StyledHeader>
          </TableHeaderWrapper>
          {(studentList?.length > 0) && studentList.map((student, index) => {
            let key = student.id
            let studentNumber = student.studentNumber
            let name = (student.writtenName || "미등록")
            return <React.Fragment key={key}>
              <StyledGridItem>{index + 1}</StyledGridItem>     {/* 연번 */}
              <StyledGridItem>{studentNumber}</StyledGridItem> {/* 학번 */}
              <StyledGridItem>{name}</StyledGridItem>
              <StyledGridItem>
                <FormWrapper>
                  {achivList.map((val, subIndex) => {

                    return <label key={`${index}${subIndex}`}>
                      <input
                        type="radio"
                        ref={(ele) => radioRef.current[`${index}-${val}`] = ele}
                        name="achivement"
                        value={val}
                        onChange={() => { handleRadioOnChange(index, subIndex) }} />
                      {val}</label>
                  })}
                </FormWrapper>
              </StyledGridItem>
              <StyledGridItem>
                <ExtractWrapper>
                  {extractResult[index]?.length > 0 && extractResult[index].map((result, subIndex) => {

                    //place홀더 개수에 따라 input 생성
                    return (<React.Fragment key={`${result}${subIndex}`}>
                      <p>{result}</p>
                      <input
                        type="text"
                        ref={(ele) => inputRef.current[`${index}-${subIndex}`] = ele}
                        onChange={(event) => { handleInputOnChange(event, index, subIndex) }}
                      />
                    </React.Fragment>)
                  })}
                  {extractResult[index]?.length > 0 && <MidBtn btnName="변경" btnOnClick={() => { handleAltBtnOnClick(index) }} />}
                </ExtractWrapper>
              </StyledGridItem>
              <StyledGridItem className="left-align">{perfRecord[index]}</StyledGridItem>
              <StyledGridItem>{getPerfRecByte(index)}</StyledGridItem>
            </React.Fragment>
          })}
        </GridContainer>
      </Modal.Body>
      <Modal.Footer>
        <BtnWrapper>
          <ModalBtn btnName="취소" btnColor="#9b0c24" hoverColor="red" onClick={() => { cancelBtnOnClick(); }} />
          <ModalBtn btnName="저장" btnColor="#3454d1" hoverColor="blue" onClick={() => { saveBtnOnClick(); }} />
        </BtnWrapper>
      </Modal.Footer>
    </Modal>
  )
}

const GridContainer = styled.div`
  margin: 20px auto;
  display: grid;
  grid-template-columns: 70px 100px 100px 120px 300px 600px 70px;
  justify-content: center;
`
const SelectWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;  
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
  font-weight: bold;
  justify-content: center;
  &: first-child {
    border-top-left-radius: 5px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
`
const StyledGridItem = styled.div`
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  
  &.left-align {
    text-align: left;
  }
`
const FormWrapper = styled.form`
  display: flex;
  gap: 10px;
`
const ExtractWrapper = styled.div`
  display: flex;
  flex-direction: column;
  p {
   margin-bottom: 0;
   margin-top: 5px;
  }
  input {
    width: 90%;
    margin: 0 auto;
    height: 30px;
    border-radius: 5px;
  }
  button {
    margin-top: 10px;
    &:focus {
      border: 3px solid black;
    }
  }
`
const BtnWrapper = styled.div`
  display: flex;
  gap: 20px;
`

export default PerfModal