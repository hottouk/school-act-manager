import React, { useEffect, useRef, useState } from 'react'
//라이브러리
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import useClientHeight from '../../hooks/useClientHeight'
//컴포넌트
import MainBtn from '../../components/Btn/MainBtn'
import SmallBtn from '../../components/Btn/SmallBtn'
import DotTitle from '../../components/Title/DotTitle'
import SubjectSelects from '../../components/Select/SubjectSelects'
import SubNav from '../../components/Bar/SubNav'
import BackBtn from '../../components/Btn/BackBtn'
//hooks
import useFireBasic from '../../hooks/Firebase/useFireBasic'
//25.01.14 생성
const QuizFormPage = () => {
  const navigate = useNavigate();
  const [_quizList, setQuizList] = useState([['', '']]);
  const [_title, setTitle] = useState('')
  const [_selectedSubjGroup, setSelectedSubjGroup] = useState('default');
  const [_selectedSubjDetail, setSelectedSubjDetail] = useState('default');
  const inputRefs = useRef([[React.createRef(), React.createRef()]]);
  const { addData, setData, deleteData } = useFireBasic("quiz")
  //기존 카드 클릭 
  const { state: quizSetInfo } = useLocation();
  useEffect(() => { //state 랜더링
    if (!quizSetInfo) return
    renderStateData();
  }, [quizSetInfo])
  //모드
  const [isModifying, setIsModifying] = useState(!quizSetInfo)
  //todo 모바일
  const clientHeight = useClientHeight(document.documentElement)

  //------함수부------------------------------------------------  
  //초기화
  const initData = () => {
    setQuizList([['', '']])
    setTitle('')
    setSelectedSubjGroup('default')
    setSelectedSubjDetail('default')
    inputRefs.current = [[React.createRef(), React.createRef()]]
  }
  //기존 데이터 state 랜더링
  const renderStateData = () => {
    setTitle(quizSetInfo.title)
    setSelectedSubjGroup(quizSetInfo.subject)
    setSelectedSubjDetail(quizSetInfo.subjDetail)
    quizSetInfo.quizList.map((quizSet) => addInputs(-1, quizSet.split("#")) //-1을 줘야 첫 index에 추가됨.
    )
  }

  //input창의 개수를 증가
  const addInputs = (index, quizSet = ['', '']) => {
    setQuizList((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs.splice(index + 1, 0, quizSet);
      return newInputs;
    });
    inputRefs.current.splice(index + 1, 0, [React.createRef(), React.createRef()]);
  };

  //index 세자리 수로 만들어주는 함수
  const padNumber = (number, length) => {
    return number.toString().padStart(length, '0');
  }

  //tab 키다운 인식
  const handleTabKeyDown = (e, index, subIndex) => {
    if (e.key === 'Tab' && subIndex === 1 && index === _quizList.length - 1) {
      addInputs(index);
    }
  };

  //현재 단어 삭제
  const handleDelete = (index) => {
    setQuizList((prevInputs) => prevInputs.filter((_, i) => i !== index));
    inputRefs.current.splice(index, 1);
  };

  //변화 감지
  const handleChange = (e, index, subIndex) => {
    const newInputs = [..._quizList];
    newInputs[index][subIndex] = e.target.value;
    setQuizList(newInputs);
  };

  //입력 확인
  const check = () => {
    if (_selectedSubjGroup !== "default" && _selectedSubjDetail !== "default") { return true }
    window.alert("과목과 교과를 선택하세요.")
    return false
  }

  //저장 버튼 클릭
  const handleSaveOnClick = (event) => {
    event.preventDefault()
    if (!check()) return
    let userConfirmed = window.confirm("현제 세트를 저장하시겠습니까?")
    if (userConfirmed) {
      if (!quizSetInfo) {
        addData(dataToSave()).then(
          () => {
            navigate(-1)
            window.alert("성공적으로 저장했습니다.")
          }, (err) => { window.alert(`에러 ${err}가 발생했습니다. 본 현상이 반복되면 관리자에게 문의하세요.`) })
      } else {
        setData(dataToSave(), quizSetInfo.id).then(() => {
          navigate(-1)
          window.alert("성공적으로 변경했습니다.")
        }, (err) => { window.alert(`에러 ${err}가 발생했습니다. 본 현상이 반복되면 관리자에게 문의하세요.`) })
      }
    } else { window.alert("저장이 취소되었습니다.") }
  }

  //데이터 형태 정리
  const dataToSave = () => {
    let quizList = _quizList.reduce((acc, inputGroup, index) => {
      acc[index] = `${inputGroup[0]}#${inputGroup[1]}`;
      return acc;
    }, []);
    return { quizList, title: _title, subject: _selectedSubjGroup, subjDetail: _selectedSubjDetail }
  }

  //수정 취소
  const handleCancelModiOnClick = () => {
    initData();
    renderStateData();
    setIsModifying(false);
  }
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
          {_quizList.map((_, index) => (
            <Row key={index} className="input-group">
              <StyledLabel>{padNumber(index + 1, 3)}</StyledLabel>
              <StyledInput
                ref={inputRefs.current[index][0]}
                type="text"
                value={_quizList[index][0]}
                onChange={(e) => handleChange(e, index, 0)}
                onKeyDown={(e) => handleTabKeyDown(e, index, 0)}
                placeholder='단어, 문제'
                disabled={!isModifying}
                required
              />
              <StyledInput
                ref={inputRefs.current[index][1]}
                type="text"
                value={_quizList[index][1]}
                onChange={(e) => handleChange(e, index, 1)}
                onKeyDown={(e) => handleTabKeyDown(e, index, 1)}
                placeholder='의미/뜻, 정답'
                disabled={!isModifying}
                required
              />
              {isModifying && <SmallBtn
                btnName={"삭제"}
                btnColor={"#3454d1"}
                btnOnClick={() => handleDelete(index)} />
              }
            </Row>
          ))}
        </fieldset>
        {!quizSetInfo && <Row style={{ justifyContent: "center" }}><MainBtn type="submit">세트 저장</MainBtn></Row>}
        {quizSetInfo && <Row style={{ justifyContent: "center", gap: "40px", margin: "10px 0" }}>
          {!isModifying && <MainBtn type="button" onClick={() => { setIsModifying(true) }}>세트 수정</MainBtn>}
          {!isModifying && <MainBtn type="button" onClick={handleDeleteOnClick}>세트 삭제</MainBtn>}
          {isModifying && <MainBtn type="submit">변경 저장</MainBtn>}
          {isModifying && <MainBtn type="button" onClick={handleCancelModiOnClick}>수정 취소</MainBtn>}
        </Row>}
      </QuizContainer>
    </Container>
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
const Row = styled.div`
  display: flex;
`
const StyledLabel = styled.label`
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