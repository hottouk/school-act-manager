//라이브러리
import { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
//컴포넌트
import ImportExcelFile from '../../components/ImportExcelFile';
//hooks
import useAddUpdFireData from '../../hooks/useAddUpdFireData';
import useStudent from '../../hooks/useStudent';
import useClientHeight from '../../hooks/useClientHeight';
//css
import styled from 'styled-components';
import CSInfoSelect from '../../components/CSInfoSelect';

//2024.2.23 수정
const ClassRoomMakeForm = () => {
  //1. 변수
  //인증
  const user = useSelector(({ user }) => { return user })
  //교실에 필요한 속성 값
  const [_classTitle, setClassTitle] = useState('');
  const [_subject, setSubject] = useState('default');
  const [_grade, setGrade] = useState('default');
  const [_classNumber, setClassNumber] = useState('default');
  const [_numberOfStudent, setNumberOfStudent] = useState(0);
  const [_intro, setIntro] = useState('');
  const [xlsxData, setXlsxData] = useState(null) //가공된 학생 정보 from Excel

  //hooks
  const navigate = useNavigate()
  const { makeStudent } = useStudent()
  //데이터 통신 변수s
  const { addClassroom, response } = useAddUpdFireData('classRooms');
  //반 생성 종류에 따라 
  const { state } = useLocation()
  const [classKind, setClassKind] = useState('')
  const clientHeight = useClientHeight(document.documentElement)
  //2. UseEffect
  useEffect(() => {
    setClassKind(state)
  }, [state])

  //3. 함수
  //내부 변수 꺼내는 함수
  const getData = (data) => {
    setXlsxData(data)
  }

  const handleOnChange = (event) => {
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
    if (_subject !== 'default' && _grade !== 'default' && _classNumber !== 'default') {
      makeClass();
    } else { window.alert("학년 반 과목은 필수 값입니다.") }
  }


  //반 생성 함수
  const makeClass = () => {
    const confirm = window.confirm('클래스를 생성하시겠습니까?')
    if (confirm) {
      const uid = user.uid;
      const classInfo = { uid, classTitle: _classTitle, subject: _subject, grade: _grade, classNumber: _classNumber, intro: _intro }
      let studentList
      switch (classKind) {
        case "with_neis":
          if (xlsxData) {
            studentList = xlsxData //내부 컴포넌트에서 꺼내온 데이터
          } else {
            window.alert('출석부 데이터가 없거나 엑셀 파일이 아닙니다.')
            return
          }
          break;
        case "with_number":
          studentList = makeStudent(_numberOfStudent, _grade, _classNumber)
          break;
        case "by_hand":
          studentList = []
          break;
        default: return
      }
      addClassroom(classInfo, studentList)
      navigate("/classRooms")
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
    <StyledForm $clientheight={clientHeight} onSubmit={handleSubmit}>
      <fieldset>
        <legend>클래스 만들기</legend>
        <label htmlFor="class_title">클래스 이름</label>
        <input id="class_title" type="text" required onChange={handleOnChange} value={_classTitle} />
        <CSInfoSelect grade={_grade} classNumber={_classNumber} subject={_subject} handleOnChange={handleOnChange} classMode={true} />
        <label>간단한 설명을 작성하세요(ex: 24 경기고 1-1 영어)</label>
        <input type="text" id='class_explanation' required value={_intro} onChange={handleOnChange} />
        {(classKind === "with_neis") && <>
          <label htmlFor='class_number_of_studnets'>나이스 출석부 엑셀 파일을 등록하세요.</label>
          <ImportExcelFile getData={getData} />
          <button type="submit">나이스 출석부 파일로 반 생성</button></>}
        {(classKind === "with_number") && <> <label htmlFor='class_number_of_studnets'>학생 수를 입력하세요. (최대 99명)</label>
          <input type="number" id='class_number_of_studnets' required min='1' max='99' value={_numberOfStudent} onChange={handleOnChange} />
          <button type="submit">생성</button> </>}
        {(classKind === "by_hand") && <><label htmlFor='class_number_of_studnets'>학생 이름과 학번을 모두 수동 입력하여 반을 생성합니다.</label>
          <button type="submit">생성</button></>}
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
    color: #efefef;
  }
  input {
    width: 100%;
    height: 2.2em;
    margin: 5px 0 15px;
    border-radius: 7px;
  }
  select {
    margin: 15px 0px;
    padding: 5px;
    border-radius: 7px;
  }
  textarea {
    margin: 5px 0 15px;
    width: 100%;
    border-radius: 7px;
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
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    margin: 0;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
export default ClassRoomMakeForm