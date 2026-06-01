import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
//components
import MainContainer from '../../components/Styled/MainContainer'
import StyledForm from '../../components/Styled/StyledForm'
import DotTitle from '../../components/Title/DotTitle'
import SubjectSelects from '../../components/Select/SubjectSelects'
import SubNav from '../../components/Bar/SubNav'
import TwoRadios from '../../components/Radio/TwoRadios'
import Pagenation from '../../components/Pagenation'
import MainBtn from '../../components/Btn/MainBtn'
import BackBtn from '../../components/Btn/BackBtn'
import LongW100Btn from '../../components/Btn/LongW100Btn'
import CircularBtn from '../../components/Btn/CircularBtn'
import SmartAddVocabModal from '../../components/Modal/gptModal/SmartAddVocabModal'
//hooks
import useFireBasic from '../../hooks/Firebase/useFireBasic'
//anim
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity'
//data
import { ERROR_MSG } from '../../constants/errMsg'
//creation(250114)-> design modifed(260217)
const QuizFormPage = () => {
  const user = useSelector(({ user }) => { return user });
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState([{ word: '', meaning: '' }]);
  const [title, setTitle] = useState('');
  const [selectedSubjGroup, setSelectedSubjGroup] = useState('');
  const [selectedSubjDetail, setSelectedSubjDetail] = useState('');
  const inputRefs = useRef([[React.createRef(), React.createRef()]]);
  const { addData, setData, deleteData } = useFireBasic("quiz");
  //기존 퀴즈
  const { state: quizSetInfo } = useLocation();
  const bindQuizData = useCallback(() => {
    if (!quizSetInfo) return;
    setTitle(quizSetInfo.title);
    setSelectedSubjGroup(quizSetInfo.subject);
    setSelectedSubjDetail(quizSetInfo.subjDetail);
    const list = quizSetInfo.quizList.map((item) => {
      const wordMeaning = item.split("#");
      return { word: wordMeaning[0], meaning: wordMeaning[1] }
    });
    setQuizList(list);
  }, [quizSetInfo]);
  useEffect(() => {
    bindQuizData();
  }, [quizSetInfo, bindQuizData]);
  //모드
  const [isEdit, setisEdit] = useState(!quizSetInfo);
  const [isVocabShow, setIsVocabShow] = useState(false);
  //공개
  const [isPrivate, setIsPrivate] = useState(false);
  //페이지네이션
  const itemsPerPage = 30;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDataList, setPageDataList] = useState(quizList?.slice(0, itemsPerPage));
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    setPageDataList(quizList?.slice(start, end));
  }, [currentPage, quizList]);
  //모달
  const [isGptModal, setIsGptModal] = useState(false);

  //**함수부**
  //index 세자리화
  const padNumber = (index, length) => {
    return index.toString().padStart(length, '0');
  }
  //빈칸 체크
  const checkVacant = (list) => {
    let result = true;
    list.forEach((item, index) => {
      if (item.word === '' || item.meaning === '') {
        const quizIndex = itemsPerPage * (currentPage - 1) + index;
        alert(`${quizIndex + 1}번째 칸이 비어있습니다. 삭제하거나 채워주세요.`)
        result = false;
      }
    });
    return result;
  }
  //input 감지
  const handleInputOnChange = (event, index) => {
    const { id, value } = event.target;
    setQuizList((prev) => {
      const newList = [...prev];
      if (id === "word") { newList[index].word = value } else { newList[index].meaning = value }
      return newList
    });
  };
  //tab 키다운 인식
  const handleTabKeyDown = (e, index,) => { if (e.key === 'Tab') { addInputs(index); } };
  //input 추가
  const addInputs = (index, quizSet = { word: '', meaning: '' }) => {
    const result = checkVacant(pageDataList);
    if (!result) return
    setQuizList((prev) => {
      const newList = [...prev];
      if (index === 29) { newList.splice(currentPage * 30 - 1, 0, quizSet); }
      else { newList.splice((currentPage - 1) * 30 + index + 1, 0, quizSet); }
      return newList;
    });
  };
  //input 삭제
  const deleteInputs = (index) => {
    if (quizList.length === 1) { alert("마지막 단어입니다."); return; }
    setQuizList((prev) => prev.filter((_, i) => i !== index));
  };
  //입력 확인
  const check = () => {
    if (!title) { alert("단어장 이름을 입력하세요"); return; }
    if (selectedSubjGroup === '' || selectedSubjDetail === '') { alert("과목과 교과를 선택하세요."); return; }
    return true;
  }
  //저장 버튼 클릭
  const handleSaveOnClick = async (event, userType) => {
    event.preventDefault();
    if (!check()) return;
    const result = checkVacant(quizList);
    if (!result) return;
    const confirm = window.confirm("현재 세트를 저장하시겠습니까?");
    if (!confirm) return;
    const info = dataToSave();
    try {
      if (!quizSetInfo && !userType) await addData(info);
      if (quizSetInfo && !userType) await setData(info, quizSetInfo.id);
      if (!quizSetInfo && userType === "master") await addData(info, "quiz_public");
      if (quizSetInfo && userType === "master") await setData(info, quizSetInfo.id, "quiz_public");
      navigate(-1);
      alert("성공적으로 저장했습니다.");
    }
    catch (err) {
      alert(ERROR_MSG.addQuizSet);
      console.log(err);
    }
  }
  //데이터 직렳화
  const dataToSave = () => {
    const list = quizList.reduce((acc, item, index) => {
      acc[index] = `${item.word}#${item.meaning}`;
      return acc;
    }, []);
    return { quizList: list, title: title, subject: selectedSubjGroup, subjDetail: selectedSubjDetail, isPrivate: isPrivate };
  }
  //수정 취소
  const handleCancelOnClick = () => {
    bindQuizData();
    setisEdit(false);
  }
  //삭제
  const handleDeleteOnClick = () => {
    let confirm = window.confirm("현재 단어 세트를 삭제하시겠습니까?")
    if (confirm) {
      deleteData(quizSetInfo.id)
      navigate(-1)
    }
  }
  return (<>
    <MainContainer>
      <SubNav><BackBtn /></SubNav>
      <StyledForm title={"단어장 생성"}>
        <TextInput type="text" placeholder='단어 세트 명'
          value={title} onChange={(e) => setTitle(e.target.value)}
          disabled={!isEdit} />
        {/* 교과 */}
        <Column style={{ gap: "10px" }}>
          <DotTitle title="교과/과목" />
          <SubjectSelects sort={"subject"}
            selectedGroup={selectedSubjGroup} selectedDetail={selectedSubjDetail}
            setSelectedGroup={setSelectedSubjGroup} setSelectedDetail={setSelectedSubjDetail}
            disabled={!isEdit} />
        </Column>
        {/* 공개/비공개 */}
        <Row style={{ justifyContent: "space-between", }}>
          <DotTitle title={"공개 여부"} />
          <TwoRadios name="isPrivate_radio"
            id={["private_radio", "public_radio"]}
            value={isPrivate} label={["비공개", "공개"]}
            onChange={() => { setIsPrivate(!isPrivate) }}
            disabled={!isEdit}
          />
        </Row>
        <Row style={{ justifyContent: "space-between", marginBottom: "10px" }}>
          <DotTitle title={"단어 목록 ▼"} pointer="pointer" onClick={() => { setIsVocabShow(!isVocabShow); }} />
        </Row>
        <AnimMaxHightOpacity isVisible={isVocabShow}>
          {pageDataList?.map((item, index) => {
            const quizIndex = itemsPerPage * (currentPage - 1) + index;
            return <Row key={index} style={{ width: "100%" }}>
              <NumberLabel>{padNumber(quizIndex + 1, 3)}</NumberLabel>
              <WordInput
                ref={inputRefs[0]}
                id="word"
                type="text"
                value={quizList[quizIndex]?.word ?? ''}
                onChange={(event) => handleInputOnChange(event, quizIndex)}
                placeholder='단어'
                disabled={!isEdit}
                required
              />
              <WordInput
                ref={inputRefs[1]}
                id="meaning"
                type="text"
                value={quizList[quizIndex]?.meaning ?? ''}
                onChange={(event) => handleInputOnChange(event, quizIndex)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                placeholder='의미'
                disabled={!isEdit}
                required
              />
              {isEdit && <Row style={{ gap: "5px", alignSelf: "center" }}>
                {quizList.length - 1 === index && <CircularBtn CircularBtn type="button" onClick={() => { addInputs(index); }}>+</CircularBtn>}
                {quizList.length - 1 !== index && <CircularBtn styles={{ color: "#9b0c24" }} onClick={() => { deleteInputs(quizIndex) }}>-</CircularBtn>}
              </Row>
              }
            </Row>
          }
          )}
          <Row style={{ justifyContent: "center" }}><Pagenation totalItems={quizList?.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} /></Row>
        </AnimMaxHightOpacity>
        {!quizSetInfo && <Column style={{ gap: "10px" }}>
          <MainBtn onClick={handleSaveOnClick}>세트 저장</MainBtn>
          <MainBtn onClick={() => setIsGptModal(true)}>스마트 단어 추가</MainBtn>
          {user.isMaster && <LongW100Btn onClick={(event) => handleSaveOnClick(event, "master")}>관리자 단어장 저장</LongW100Btn>}

        </Column>}
        {quizSetInfo && <Column style={{ gap: "10px", }}>
          {!isEdit && <MainBtn onClick={() => { setisEdit(true) }}>세트 수정</MainBtn>}
          {!isEdit && <LongW100Btn onClick={handleDeleteOnClick}>세트 삭제</LongW100Btn>}
          {isEdit && <MainBtn onClick={handleSaveOnClick}>변경 저장</MainBtn>}
          {isEdit && <MainBtn onClick={() => setIsGptModal(true)}>스마트 단어 추가</MainBtn>}
          {isEdit && <LongW100Btn onClick={handleCancelOnClick}>수정 취소</LongW100Btn>}
          {user.isMaster && <LongW100Btn onClick={(event) => handleSaveOnClick(event, "master")}>관리자 단어장 저장</LongW100Btn>}
        </Column>}
      </StyledForm>
    </MainContainer >
    <SmartAddVocabModal
      show={isGptModal}
      onHide={() => { setIsGptModal(false); }}
      padNumber={padNumber}
      setQuizList={setQuizList}
      setIsVocabShow={setIsVocabShow} />
  </>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const TextInput = styled.input`
  height: 40px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #aaa;
  &:disabled {
    background-color: #ddd;
  }
`
const NumberLabel = styled.label`
  margin-right: 8px;
  color: #3454d1;
  font-weight: bold;
`
const WordInput = styled.input`
  height: 35px;
  border: 1px solid #aaa;
  flex-grow: 1;
  font-size: 12px;
  margin: 5px;
  &:disabled {
    background-color: #ddd;
  }
  &::placeholder {
    color: #999;
    font-style: italic;
  }
}
`
export default QuizFormPage