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

//2024.1.7 수정
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
  //반 생성 종류에 따라 
  const { state } = useLocation()
  const [classKind, setClassKind] = useState('')

  //2. UseEffect
  useEffect(() => {
    setClassKind(state)
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

  //제출 버튼
  const handleSubmit = (event) => {
    event.preventDefault();
    if (subject !== 'default' && grade !== 'default' && classNumber !== 'default') {
      makeClass();
    } else { window.alert("학년 반 번호를 각각 입력하십시오.") }
  }

  //반 생성 함수
  const makeClass = () => {
    const confirm = window.confirm('클래스를 생성하시겠습니까?')
    if (confirm) {
      const uid = user.uid;
      const newClassroom = { uid, classTitle, subject, grade, classNumber, intro }
      let studentList
      switch (classKind) {
        case "with_neis":
          console.log(xlsxData)
          if (xlsxData) {
            studentList = xlsxData //내부 컴포넌트에서 꺼내온 데이터
          } else {
            window.alert('출석부 데이터를 업로드해주세요.')
            return
          }
          break;
        case "with_number":
          studentList = makeStudent(numberOfStudent, grade, classNumber)
          break;
        case "by_hand":
          studentList = []
          break;
        default: return
      }
      addClassroom(newClassroom, studentList)
      navigate('/classRooms')
      console.log(response)
    }
  }

  //일반 버튼
  const handleBtnClick = (event) => {
    switch (event.target.id) {
      case "cancel":
        navigate('/classRooms')
        break;
      default: return
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <fieldset>
        <legend>클래스 만들기</legend>
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
            <option value="13">13반</option>
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
        {(classKind === "with_neis") && <>
          <label htmlFor='class_number_of_studnets'>나이스에서 내려 받은 출석부 엑셀 파일을 등록하세요.</label>
          <ImportExcelFile getData={getData} />
          <button type='submit'>나이스 출석부 파일로 반 생성</button></>}
        {(classKind === "with_number") && <> <label htmlFor='class_number_of_studnets'>학생 수를 입력하여 학번을 자동생성 할까요? 고정반일 경우 선택</label>
          <input type="number" id='class_number_of_studnets' required min='1' value={numberOfStudent} onChange={handleChange} />
          <button type='submit'>예_자동 반 생성</button> </>}
        {(classKind === "by_hand") && <><label htmlFor='class_number_of_studnets'>학생 이름과 학번을 모두 수동 입력하여 반을 생성합니다.</label>
          <button type='submit'>확인</button></>}
        <button type='button' id='cancel' onClick={handleBtnClick}>취소</button>
      </fieldset>
    </StyledForm >
  )
}
const StyledForm = styled.form`
  max-width: 540px;
  margin: 60px auto;
  padding: 20px;
  color: #efefef;
  background-color: #3454d1;
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
    margin: 5px 0 15px;
  }
  select {
    margin: 15px 0px;
    padding: 5px;
  }
  textarea {
    margin: 5px 0 15px;
    width: 100%;
  }
  button {
    display: inline;
    width: 100%;
    margin-top: 15px;
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
export default ClassRoomMakeForm