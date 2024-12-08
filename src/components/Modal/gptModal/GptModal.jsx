//라이브러리
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
//컴포넌트
import Button from 'react-bootstrap/esm/Button';
import MainBtn from '../../Btn/MainBtn'
import DotTitle from '../../Title/DotTitle';
import GptPersonalRow from './GptPersonalRow';
import AnimMaxHightOpacity from '../../../anim/AnimMaxHightOpacity';
//hooks
import useChatGpt from '../../../hooks/useChatGpt';
//data
import { academicAbility, subjectCareerAbility, subjectCoopAbility } from '../../../data/AbilityList';
//css
import styled from 'styled-components';
//img
import plusIcon from '../../../image/icon/plus.png'
import arrowsIcon from '../../../image/icon/arrows_icon.png'
import { gptPersonalonReportMsg } from '../../../data/gptMsgDataList';
//2024.09.04(수정) => 12.03(보고서 탭 추가)
const GptModal = (props) => {
  //----1.변수부--------------------------------
  //역량
  const [acadList, setAcadList] = useState([])      //학업
  const [careerList, setCareerList] = useState([])  //진로
  const [coopList, setCoopList] = useState([])      //공동체
  useEffect(() => {
    sortAbilityList(academicAbility, "academic")
    sortAbilityList(subjectCareerAbility, "career")
    sortAbilityList(subjectCoopAbility, "coop")
  }, [academicAbility, subjectCareerAbility, subjectCoopAbility])
  const [inputValues, setInputValues] = useState(null);
  const { askGptPersonalize, askPersonalizeOnReport, gptAnswer, gptBytes, gptRes } = useChatGpt()
  //탭 
  const [tab, setTab] = useState(1)
  //숨기기 토글
  const [isAcadShown, setIsAcadShown] = useState(false)
  const [isCareerShown, setIsCareerShown] = useState(false)
  const [isCoopShown, setIsCoopShown] = useState(false)
  //자기 보고서
  const [report, setReport] = useState("")

  //----2.함수부--------------------------------
  //능력 분류
  const sortAbilityList = (list, type) => {
    list.forEach((obj) => {
      let prop = (Object.keys(obj)[0])
      let wordList = (Object.values(obj)[0])
      let propWithKeyword = { prop, wordList }
      switch (type) {
        case "academic":
          setAcadList((prevList) => [...prevList, propWithKeyword])
          break;
        case "career":
          setCareerList((prevList) => [...prevList, propWithKeyword])
          break;
        case "coop":
          setCoopList((prevList) => [...prevList, propWithKeyword])
          break;
        default:
          return;
      }
    })
  }
  //input 변경
  const handleInputChange = (event, type) => {
    if (type === "input") {
      let { id, value } = event.target;
      setInputValues({ ...inputValues, [id]: value });
    } else {
      let { id, value } = event
      setInputValues({ ...inputValues, [id]: value });
    }
  };
  //제출
  const handleSubmit = (event) => {
    event.preventDefault();
    //탭1: 특성 기반 개별화
    if (tab === 1) {
      let resultArray = convertObjectToArray(inputValues)
      askGptPersonalize(props.acti, resultArray)
    }
    //탭2: 보고서 기반 개별화
    else if (tab === 2) {
      let check = report !== ""
      if (check) {
        askPersonalizeOnReport(props.acti.record, report)
      } else {
        window.alert("학생 활동 보고서를 입력해주세요.")
      }
    }
  };
  //inputValues중 값이 있는 항목만 배열로 변경
  const convertObjectToArray = (obj) => {
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
        {(gptRes === "loading")
          ? <div className="text-center">
            <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>
          </div>
          : <StyledForm onSubmit={handleSubmit}>
            <StyledSpan>현재 문구</StyledSpan>
            <StyledP>{props.acti.record}</StyledP>
            <StyledImg src={plusIcon} alt="plus_icon" />
            <DotTitleWrapper>
              <StyledTab $tab={tab} onClick={() => { setTab(1) }}>특성</StyledTab>
              <StyledTab className='tab2' $tab={tab} onClick={() => { setTab(2) }}>보고서</StyledTab>
              {tab === 1 && <>
                <StyledSpan>학생의 특성을 간단히 적어주세요</StyledSpan>
                <DotTitle title={"학업 역량 ▼"} onClick={() => { setIsAcadShown((prev) => !prev) }} pointer="pointer"
                  styles={{ dotColor: "#3454d1", width: "50%", marginBot: "0" }} />
                <AnimMaxHightOpacity isVisible={isAcadShown}
                  content={<RowWrapper>
                    {acadList?.map((obj) => { return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} /> })}
                  </RowWrapper>
                  } />
                <DotTitle title={"진로 역량 ▼"} onClick={() => { setIsCareerShown((prev) => !prev) }} pointer="pointer"
                  styles={{ dotColor: "#3454d1", width: "50%", marginBot: "0" }} />
                <AnimMaxHightOpacity isVisible={isCareerShown}
                  content={<RowWrapper>
                    {careerList?.map((obj) => { return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} /> })}
                  </RowWrapper>
                  } />
                <DotTitle title={"공동체 역량 ▼"} onClick={() => { setIsCoopShown((prev) => !prev) }} pointer="pointer"
                  styles={{ dotColor: "#3454d1", width: "50%", marginBot: "0" }} />
                <AnimMaxHightOpacity isVisible={isCoopShown}
                  content={<RowWrapper>
                    {coopList?.map((obj) => { return <GptPersonalRow key={obj.prop} itemObj={obj} onInputChange={handleInputChange} /> })}
                  </RowWrapper>
                  } />
              </>}
              {tab === 2 && <>
                <StyledSpan>위 활동에 참여한 학생이 작성한 보고서 또는 소감문을 넣어주세요.</StyledSpan>
                <textarea
                  value={report}
                  placeholder="복사/붙여넣기 하시면 됩니다."
                  onChange={(e) => { setReport(e.target.value) }} />
              </>}
            </DotTitleWrapper>
            <StyledImg src={arrowsIcon} alt="arrows_icon" />
            <StyledSpan>생성 결과</StyledSpan>
            <textarea
              defaultValue={gptAnswer || ''}
              placeholder="모든 역량을 다 눌러쓰시기보다 2~3개만 채우시는게 바람직합니다...from gpt"
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
  margin-top: -15px;
  textarea {
    border-radius: 10px;
    padding: 5px;
    height: 100px;
  }
  p.byte { 
    widht: 80px;
    align-self: flex-end;
  }
`
const StyledP = styled.p`
  width: 100%;
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
`
const StyledImg = styled.img`
  width: 27px;
  margin: 0 auto;
`
const StyledSpan = styled.span`
  margin: 7px;
`
const DotTitleWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid #919294;
  border-radius: 10px;
  padding: 13px;
  margin: 15px 0;
  gap: 5px;
`
const StyledTab = styled.p`
  position: absolute;
  top: -35px;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  background-color: ${(props) => { return (props.$tab === 1 ? "#3454d1" : "#919294") }};
  color: white;
  padding: 5px 15px;
  cursor: pointer;
  &.tab2 {
    background-color: ${(props) => { return (props.$tab === 1 ? "#919294" : "#3454d1") }};
    left: 75px;
  }
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