import React, { useEffect, useRef, useState } from 'react'
//라이브러리
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import useClientHeight from '../../hooks/useClientHeight'
//컴포넌트
import MainBtn from '../../components/Btn/MainBtn'
import DotTitle from '../../components/Title/DotTitle'
import SubjectSelects from '../../components/Select/SubjectSelects'
import SubNav from '../../components/Bar/SubNav'
import BackBtn from '../../components/Btn/BackBtn'
import TwoRadios from '../../components/Radio/TwoRadios'
import Pagenation from '../../components/Pagenation'
//hooks
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity'
import GptAddVocabModal from '../../components/Modal/gptModal/GptAddVocabModal'
import CircularBtn from '../../components/Btn/CircularBtn'
//생성(250114)->
const QuizFormPage = () => {
  const navigate = useNavigate();
  const [_quizList, setQuizList] = useState([{ word: '', meaning: '' }]);
  const [_title, setTitle] = useState('')
  const [_selectedSubjGroup, setSelectedSubjGroup] = useState('default');
  const [_selectedSubjDetail, setSelectedSubjDetail] = useState('default');
  const inputRefs = useRef([[React.createRef(), React.createRef()]]);
  const { addData, setData, deleteData } = useFireBasic("quiz")
  //기존 카드 클릭 
  const { state: quizSetInfo } = useLocation();
  useEffect(() => { renderStateData(); }, [quizSetInfo]);
  //모드
  const [isModifying, setIsModifying] = useState(!quizSetInfo);
  const [isVocabShow, setIsVocabShow] = useState(false);
  //공개
  const [_isPrivate, setIsPrivate] = useState(false);
  //페이지네이션
  const itemsPerPage = 30;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDataList, setPageDataList] = useState(_quizList?.slice(0, itemsPerPage));
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    setPageDataList(_quizList?.slice(start, end));
  }, [currentPage, _quizList]);
  //모달
  const [isGptModal, setIsGptModal] = useState(false);
  //todo 모바일
  const clientHeight = useClientHeight(document.documentElement);

  //------함수부------------------------------------------------  
  //초기화
  const initData = () => {
    setQuizList([{ word: '', meaning: '' }])
    setTitle('')
    setSelectedSubjGroup('default')
    setSelectedSubjDetail('default')
    inputRefs.current = [[React.createRef(), React.createRef()]]
  }
  //기존 데이터 state 랜더링
  const renderStateData = () => {
    if (!quizSetInfo) return
    setTitle(quizSetInfo.title);
    setSelectedSubjGroup(quizSetInfo.subject);
    setSelectedSubjDetail(quizSetInfo.subjDetail);
    const list = quizSetInfo.quizList.map((item) => {
      const wordMeaning = item.split("#");
      return { word: wordMeaning[0], meaning: wordMeaning[1] }
    });
    setQuizList(list);
  }
  //index 세자리 수로 만들어주는 함수
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
    return result
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
      return newList
    });
  };
  //input 삭제
  const deleteInputs = (index) => { setQuizList((prev) => prev.filter((_, i) => i !== index)); };
  //입력 확인
  const check = () => {
    if (_selectedSubjGroup !== "default" && _selectedSubjDetail !== "default") { return true }
    alert("과목과 교과를 선택하세요.")
    return false
  }
  //저장 버튼 클릭
  const handleSaveOnClick = (event) => {
    event.preventDefault();
    if (!check()) return
    const result = checkVacant(_quizList);
    if (!result) return
    let userConfirmed = window.confirm("현제 세트를 저장하시겠습니까?")
    if (userConfirmed) {
      if (!quizSetInfo) {
        addData(dataToSave()).then(
          () => {
            navigate(-1)
            alert("성공적으로 저장했습니다.")
          }, (err) => { alert(`에러 ${err}가 발생했습니다. 본 현상이 반복되면 관리자에게 문의하세요.`) })
      } else {
        setData(dataToSave(), quizSetInfo.id).then(() => {
          navigate(-1)
          alert("성공적으로 변경했습니다.")
        }, (err) => { alert(`에러 ${err}가 발생했습니다. 본 현상이 반복되면 관리자에게 문의하세요.`) })
      }
    } else { alert("저장이 취소되었습니다.") }
  }
  //데이터 형태 정리
  const dataToSave = () => {
    const quizList = _quizList.reduce((acc, item, index) => {
      acc[index] = `${item.word}#${item.meaning}`;
      return acc;
    }, []);
    return { quizList, title: _title, subject: _selectedSubjGroup, subjDetail: _selectedSubjDetail, isPrivate: _isPrivate }
  }
  //수정 취소
  const handleCancelModiOnClick = () => {
    initData();
    renderStateData();
    setIsModifying(false);
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
    <SubNav><BackBtn /></SubNav>
    <Container $clientheight={clientHeight}>
      <QuizContainer onSubmit={handleSaveOnClick}>
        <fieldset>
          <StyledTitle type="text" value={_title} onChange={(e) => setTitle(e.target.value)} placeholder='단어 세트 명' required disabled={!isModifying} />
          <Row style={{ margin: "13px 0" }}>
            <DotTitle title="교과/과목" styles={{ dotColor: "#3454d1" }} />
            <SubjectSelects sort={"subject"}
              selectedGroup={_selectedSubjGroup} selectedDetail={_selectedSubjDetail}
              setSelectedGroup={setSelectedSubjGroup} setSelectedDetail={setSelectedSubjDetail}
              disabled={!isModifying} />
          </Row>
          {/* 공개/비공개 */}
          <Row style={{ justifyContent: "space-between", marginBottom: "22px" }}>
            <DotTitle title={"공개 여부"} styles={{ dotColor: "#3454d1;" }} />
            <TwoRadios name="isPrivate_radio"
              id={["private_radio", "public_radio"]}
              value={_isPrivate} label={["비공개 활동", "공개 활동"]}
              onChange={() => { setIsPrivate(!_isPrivate) }}
              disabled={!isModifying}
            />
          </Row>
          <Row style={{ justifyContent: "space-between", marginBottom: "10px" }}>
            <DotTitle title={"단어 목록▼"} styles={{ dotColor: "#3454d1;" }} pointer="pointer" onClick={() => { setIsVocabShow(!isVocabShow); }} />
          </Row>
          <AnimMaxHightOpacity isVisible={isVocabShow}>
            {pageDataList?.map((item, index) => {
              const quizIndex = itemsPerPage * (currentPage - 1) + index;
              return <Row key={index}>
                <NumberLabel>{padNumber(quizIndex + 1, 3)}</NumberLabel>
                <StyledInput
                  id="word"
                  type="text"
                  value={_quizList[quizIndex]?.word ?? ''}
                  onChange={(event) => handleInputOnChange(event, quizIndex)}
                  placeholder='단어'
                  disabled={!isModifying}
                  required
                />
                <StyledInput
                  id="meaning"
                  type="text"
                  value={_quizList[quizIndex]?.meaning ?? ''}
                  onChange={(event) => handleInputOnChange(event, quizIndex)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  placeholder='의미'
                  disabled={!isModifying}
                  required
                />
                {isModifying && <Row style={{ gap: "5px", paddingTop: "3px" }}>
                  <CircularBtn type="button" onClick={() => { addInputs(index); }}>+</CircularBtn>
                  <CircularBtn styles={{ color: "#9b0c24" }} onClick={() => { deleteInputs(quizIndex) }}>-</CircularBtn>
                </Row>
                }
              </Row>
            }
            )}
            <Row style={{ justifyContent: "center" }}><Pagenation totalItems={_quizList?.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} /></Row>
          </AnimMaxHightOpacity>
        </fieldset>
        {!quizSetInfo && <Row style={{ justifyContent: "center" }}><MainBtn type="submit">세트 저장</MainBtn></Row>}
        {quizSetInfo && <Row style={{ justifyContent: "center", gap: "40px", margin: "10px 0" }}>
          {!isModifying && <MainBtn type="button" onClick={() => { setIsModifying(true) }}>세트 수정</MainBtn>}
          {!isModifying && <MainBtn type="button" onClick={handleDeleteOnClick}>세트 삭제</MainBtn>}
          {isModifying && <MainBtn type="submit">변경 저장</MainBtn>}
          {isModifying && <MainBtn type="button" onClick={() => { setIsGptModal(true); }}>스마트 단어 추가</MainBtn>}
          {isModifying && <MainBtn type="button" onClick={handleCancelModiOnClick}>수정 취소</MainBtn>}
        </Row>}
      </QuizContainer>
    </Container>
    <GptAddVocabModal
      show={isGptModal}
      onHide={() => { setIsGptModal(false); }}
      padNumber={padNumber}
      setQuizList={setQuizList} />
  </>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  width: 100%;
  box-sizing: border-box;
  margin: 20px auto;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const QuizContainer = styled.form`
  grid-column: 2/3;
  margin: auto;
  width: 95%;
`
const StyledTitle = styled.input`
  height: 40px;
  width: 100%;
  border: none;
  margin-bottom: 20px;
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
const StyledInput = styled.input`
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