//라이브러리
import { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import { useNavigate } from 'react-router-dom';
//컴포넌트
import ImportExcelFile from '../../components/ImportExcelFile';
//hooks
import useFirestore from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import useStudent from '../../hooks/useStudent';
//css
import styled from 'styled-components';

const StyledForm = styled.form`
  max-width: 480px;
  margin: 60px auto;
  padding: 20px;
  color: whitesmoke;
  background-color: #6495ed;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;

  filedset {
    border: none;
  }
  legend {
    font-size: 1.5em;
    margin-bottom: 20px;
  }
  label {
    display: block;
    color: whitesmoke;
  }
  input {
    width: 100%;
    height: 2.2em;
    margin: 15px 0px;
  }
  select {
    margin: 15px 0px;
    padding: 5px;
  }
  textarea {
    margin: 15px 0px;
    width: 100%;
  }
  button {
    display: inline;
    width: 100%;
    padding: 10px 15px;
    border-radius: 15px;
    border: 2px solid whitesmoke;
    background-color: transparent;
    color: whitesmoke;
    cursor: pointer;
  }
  button + button {
    margin-top: 20px;
  }
`
const StyledSelectDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
const ClassRoomMakeForm = () => {
  //1. 변수
  //인증
  const { user } = useAuthContext();
  //교실에 필요한 속성 값
  const [classTitle, setClassTitle] = useState('');
  const [subject, setSubject] = useState('default');
  const [grade, setGrade] = useState('default');
  const [classNumber, setClassNumber] = useState('default');
  const [numberOfStudent, setNumberOfStudent] = useState(0);
  const [intro, setIntro] = useState('');
  const [xlsxData, setXlsxData] = useState(null) //가공된 학생 정보 from Excel
  //hooks
  const navigate = useNavigate()
  const { makeStudent } = useStudent()
  //데이터 통신 변수
  const { addClassroom, response } = useFirestore('classRooms');
  //이동 단계에 따라 
  const { state } = useLocation()
  const [step, setStep] = useState('first');

  //2. UseEffect
  useEffect(() => {
    setStep(state)
  }, [state])

  //3. 함수
  //내부 변수 꺼내는 함수
  const getData = (data) => {
    setXlsxData(data)
  }

  const handleChange = (event) => {
    if (event.target.id === 'class_title') {
      setClassTitle(event.target.value)
    } else if (event.target.id === 'class_subject') {
      setSubject(event.target.value)
    } else if (event.target.id === 'class_number_of_studnets') {
      setNumberOfStudent(event.target.value)
    } else if (event.target.id === 'class_explanation') {
      setIntro(event.target.value)
    } else if (event.target.id === 'class_grade') {
      setGrade(event.target.value)
    } else if (event.target.id === 'class_number') {
      setClassNumber(event.target.value)
    }
  }

  const handleSubmit = (event) => {
    switch (event.target.id) {
      case 'firstStep':
        event.preventDefault();
        if (subject !== 'default' && grade !== 'default' && classNumber !== 'default') {
          navigate('/classrooms_setting_details', { state: "second" })
        } else { console.log("학년 반 번호를 각각 입력하십시오.") }
        break;
      case 'secondStep':
        event.preventDefault();
        makeClass(1);
        break;
      case 'thirdStep':
        event.preventDefault(2);
        makeClass(2);
        break;
      case 'fourthStep':
        event.preventDefault();
        makeClass(3);
        break;
      default: return
    }
  }

  //반 생성 함수
  const makeClass = (step) => {
    const confirm = window.confirm('클래스를 생성하시겠습니까?')
    if (confirm) {
      const uid = user.uid;
      const newClassroom = { uid, classTitle, subject, grade, classNumber, intro }
      let studentList
      switch (step) {
        case 1:
          studentList = xlsxData
          break;
        case 2:
          studentList = makeStudent(numberOfStudent, grade, classNumber)
          break;
        case 3:
          studentList = []
          break;
        default: return
      }
      addClassroom(newClassroom, studentList)
      navigate('/classRooms')
      console.log(response)
    }
  }

  const handleBtnClick = (event) => {
    switch (event.target.id) {
      case "no":
        if (step === "second") {
          navigate('/classrooms_setting_details', { state: "third" })
        } else if (step === "third") {
          navigate('/classrooms_setting_details', { state: "fourth" })
        }
        break;
      case "cancel":
        navigate('/classRooms')
        break;
      default: return
    }
  }

  return (
    <>
      {(step === "first") && <>
        <StyledForm id='firstStep' onSubmit={handleSubmit}>
          <fieldset>
            <legend>클래스 만들기 1단계</legend>
            <label htmlFor='class_title'>클래스 이름</label>
            <input id='class_title' type="text" required onChange={handleChange} value={classTitle} />
            <StyledSelectDiv>
              <select id='class_subject' required value={subject} onChange={handleChange}>
                <option value="default" disabled >과목을 선택하세요</option>
                <option value="kor">국어과</option>
                <option value="eng">영어과</option>
                <option value="math">수학과</option>
                <option value="soc">사회과</option>
                <option value="sci">과학과</option>
              </select>
              <select id='class_grade' required value={grade} onChange={handleChange}>
                <option value="default" disabled >학년</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
              </select>
              <select id='class_number' required value={classNumber} onChange={handleChange}>
                <option value="default" disabled >반</option>
                <option value="01">1반</option>
                <option value="02">2반</option>
                <option value="03">3반</option>
                <option value="04">4반</option>
                <option value="05">5반</option>
                <option value="06">6반</option>
                <option value="07">7반</option>
                <option value="08">8반</option>
                <option value="09">9반</option>
                <option value="10">10반</option>
                <option value="11">11반</option>
                <option value="12">12반</option>
                <option value="14">14반</option>
                <option value="15">15반</option>
                <option value="16">16반</option>
                <option value="17">17반</option>
                <option value="18">18반</option>
                <option value="19">19반</option>
                <option value="20">이동반</option>
              </select>
            </StyledSelectDiv>
            <label>간단한 설명을 작성하세요</label>
            <textarea type="text" id='class_explanation' required value={intro} onChange={handleChange} />
            <button type='submit'>다음 단계로</button>
            <button type='button' id='cancel' onClick={handleBtnClick}>취소</button>
          </fieldset>
        </StyledForm >
      </>}
      {(step === "second") && <>
        <StyledForm id='secondStep' onSubmit={handleSubmit}>
          <fieldset>
            <legend>클래스 만들기 2_1단계</legend>
            <label htmlFor='class_number_of_studnets'>나이스에서 내려받은 출석부 엑셀 파일이 있나요?</label>
            <ImportExcelFile getData={getData} />
            <button type='submit'>나이스 출석부 파일로 반 생성</button>
            <button type='button' id='no' onClick={handleBtnClick}>아니오_다음 단계로</button>
            <button type='button' id='cancel' onClick={handleBtnClick}>취소</button>
          </fieldset>
        </StyledForm >
      </>}
      {(step === "third") && <>
        <StyledForm id='thirdStep' onSubmit={handleSubmit}>
          <fieldset>
            <legend>클래스 만들기 2_2단계</legend>
            <label htmlFor='class_number_of_studnets'>학생 수를 입력하여 학번을 자동생성 할까요? 고정반일 경우 선택</label>
            <input type="number" id='class_number_of_studnets' required min='1' value={numberOfStudent} onChange={handleChange} />
            <button type='submit'>예_자동 반 생성</button>
            <button type='button' id='no' onClick={handleBtnClick}>아니오_다음 단계로</button>
            <button type='button' id='cancel' onClick={handleBtnClick}>취소</button>
          </fieldset>
        </StyledForm>
      </>}
      {(step === "fourth") && <>
        <StyledForm id='fourthStep' onSubmit={handleSubmit}>
          <fieldset>
            <legend>클래스 만들기 2_3단계</legend>
            <label htmlFor='class_number_of_studnets'>학생 이름과 학번을 모두 수동 입력하여 반을 생성합니다.</label>
            <button type='submit'>확인</button>
            <button type='button' id='cancel' onClick={handleBtnClick}>취소</button>
          </fieldset>
        </StyledForm>
      </>}
    </>
  )
}

export default ClassRoomMakeForm