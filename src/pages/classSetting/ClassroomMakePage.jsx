//라이브러리
import { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
//컴포넌트
import ImportExcelFile from '../../components/ImportExcelFile';
import LongW100Btn from '../../components/Btn/LongW100Btn';
import CSInfoSelect from '../../components/Select/CSInfoSelect';
import SubjectSelects from '../../components/Select/SubjectSelects';
import DotTitle from '../../components/Title/DotTitle';
//hooks
import useStudent from '../../hooks/useStudent';
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
import useClientHeight from '../../hooks/useClientHeight';
//css
import styled from 'styled-components';

//2024.11.23 3차 수정(클래스 타입 추가, css정리), ux 향상
const ClassroomMakePage = () => {
  //----1.변수부--------------------------------
  //인증
  useEffect(() => { setIsVisible(true) }, [])
  const user = useSelector(({ user }) => { return user })
  //교실에 필요한 속성 값
  const [_classTitle, setClassTitle] = useState('');
  const [_subjGroup, setSubjGroup] = useState('default');
  const [_subjDetail, setSubjDetail] = useState('default');
  const [_grade, setGrade] = useState('default');
  const [_classNumber, setClassNumber] = useState('default');
  const [_numberOfStudent, setNumberOfStudent] = useState(0);
  const [_intro, setIntro] = useState('');
  const [xlsxData, setXlsxData] = useState(null) //가공된 학생 정보 from Excel
  //hooks
  const navigate = useNavigate()
  const { makeStudent } = useStudent()
  //데이터 통신 변수
  const { addClassroom } = useAddUpdFireData("classRooms");
  //반 생성 종류에 따라 
  const { state } = useLocation()
  const [how, setHow] = useState('')             //만드는 방법
  const [classType, setClassType] = useState('') //만드는 반 종류
  useEffect(() => {
    setHow(state.how)
    setClassType(state.type)
  }, [state])
  //8. css 및 에니
  const clientHeight = useClientHeight(document.documentElement)
  const [isVisible, setIsVisible] = useState(false)

  //----2.함수부--------------------------------
  //내부 변수 꺼내는 함수
  const handleOnChange = (event) => {
    if (event.target.id === "class_title") {
      setClassTitle(event.target.value)
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
  //제출 버튼: 유효성 검사
  const handleSubmit = (event) => {
    event.preventDefault();
    let confirm = window.confirm('클래스를 생성하시겠습니까?')
    if (confirm) {
      switch (classType) {
        case "subject":
          if (_subjDetail !== 'default' && _grade !== 'default' && _classNumber !== 'default') { makeClass(classType); }
          else { window.alert("학년, 반, 과목은 필수 값입니다.") }
          break;
        case "homeroom":
          if (_grade !== 'default' && _classNumber !== 'default') { makeClass(classType); }
          else { window.alert("학년, 반은 필수 값입니다.") }
          break;
        default: return;
      }
    }
  }
  //반 생성 함수
  const makeClass = (type) => {
    let uid = user.uid;
    let studentList //학생 데이터 생성
    switch (how) {
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
    let classInfo //교실 정보 생성
    if (type === "subject") {
      classInfo = { uid, classTitle: _classTitle, type, subject: _subjGroup, subjDetail: _subjDetail, grade: _grade, classNumber: _classNumber, intro: _intro }
    } else if (type === "homeroom") {
      classInfo = { uid, classTitle: _classTitle, type, grade: _grade, classNumber: _classNumber, intro: _intro }
    }
    addClassroom(classInfo, studentList)
    navigate("/classRooms")
  }

  return (
    <Container $clientheight={clientHeight} $isVisible={isVisible}>
      <StyledForm onSubmit={handleSubmit}>
        <StyledHeader>
          <legend>클래스 만들기</legend>
        </StyledHeader>
        <fieldset>
          <DotTitle title={"클래스 이름"} styles={{ dotColor: "#3454d1;" }} />
          <input id="class_title" type="text" onChange={handleOnChange} value={_classTitle} required />
          <InputWrapper>
            <DotTitle title={"학년/반"} styles={{ dotColor: "#3454d1;" }} />
            <SelectWrapper>
              <CSInfoSelect grade={_grade} classNumber={_classNumber} subject={_subjDetail} handleOnChange={handleOnChange} classMode={true} />
            </SelectWrapper>
          </InputWrapper>
          {/* 클래스 타입 */}
          {classType === "subject" && <InputWrapper>
            <DotTitle title={"교과/과목"} styles={{ dotColor: "#3454d1;" }} />
            <SubjectSelects subjGroup={_subjGroup} subjDetail={_subjDetail} subjGrpOnChange={setSubjGroup} subjOnChange={setSubjDetail} />
          </InputWrapper>}
          <label htmlFor="class_explanation">간단한 설명을 작성하세요</label>
          <input id="class_explanation" type="text" value={_intro} onChange={handleOnChange} placeholder="ex)25 건강고 1-1 강건쌤" required />
          {(how === "with_neis") && <>
            <p>나이스 출석부 엑셀 파일을 등록하세요.</p>
            <ImportExcelFile getData={setXlsxData} />
          </>}
          {(how === "with_number") && <><label htmlFor="class_number_of_studnets">학생 수를 입력하세요. (최대 99명)</label>
            <input id="class_number_of_studnets" type="number" min='1' max='99' value={_numberOfStudent} onChange={handleOnChange} required /></>}
          {(how === "by_hand") && <label htmlFor="class_number_of_studnets">학생 이름과 학번을 모두 수동 입력하여 반을 생성합니다.</label>}
          <BtnWrapper>
            <LongW100Btn type="submit" btnName="생성" />
            <LongW100Btn id="cancel" btnName="취소" btnOnClick={() => { navigate('/classRooms') }} />
          </BtnWrapper>
        </fieldset>
      </StyledForm >
    </Container>
  )
}
const Container = styled.div`
  opacity: ${(({ $isVisible }) => $isVisible ? 1 : 0)};
  transition: opacity 0.7s ease;
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    margin: 0;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const StyledHeader = styled.div`
  width: 100%;
  height: 35px;  
  background-color: #3454d1;  
  position: absolute;  
  top: -35px;
  left: 0;
  padding: 5px 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  legend {
    width: 70%;  
    font-size: 1em;
    color: white;
    margin-bottom: 40px;
  }
`
const StyledForm = styled.form`
  position: relative;
  width: 35%;
  max-width: 540px;
  margin: 80px auto 30px;
  padding: 20px;
  color: black;
  background-color: #efefef;
  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: rgba(52, 94, 209, 0.2) 0px 8px 24px, rgba(52, 84, 209, 0.2) 0px 16px 56px, rgba(52, 84, 209, 0.2) 0px 24px 80px;
  label {
    display: block;
    color: black;
  }
  input#class_title, input#class_explanation, input#class_number_of_studnets {
    width: 100%;
    height: 2.2em;
    margin: 5px 0 15px;
    border-radius: 7px;
  }
  textarea {
    margin: 5px 0 15px;
    width: 100%;
    border-radius: 7px;
  }
  
`
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  input {
    max-width: 280px;
    height: 35px;
    border-radius: 7px;
    padding-left: 5px;
    &:disabled {             /* 해당 input disabled 되었을 때 */
      color: #efefef;       /* 글자 색을 white로 설정 */
    }
  }
`
const SelectWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`
const BtnWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 20px;
`
export default ClassroomMakePage