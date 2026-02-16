//라이브러리
import { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//컴포넌트
import MainContainer from '../../components/Styled/MainContainer';
import ImportExcelFileSection from '../../components/ImportExcelFile';
import CSInfoSelect from '../../components/Select/CSInfoSelect';
import SubjectSelects from '../../components/Select/SubjectSelects';
import DotTitle from '../../components/Title/DotTitle';
import MainBtn from '../../components/Btn/MainBtn';
import SubNav from '../../components/Bar/SubNav';
import BackBtn from '../../components/Btn/BackBtn';
//hooks
import useStudent from '../../hooks/useStudent';
import useFireClassData from '../../hooks/Firebase/useFireClassData';
import { ERROR_MSG } from '../../constants/errMsg';
import useFireErrData from '../../hooks/Firebase/useFireErrData';
//클래스 타입 추가,ux,css정리(241103) -> 코드 간소화(250212) -> 코드 경량화(260120)
const ClassroomFormPage = () => {
  const navigate = useNavigate();
  useEffect(() => { setIsVisible(true) }, []);
  const user = useSelector(({ user }) => { return user });
  const { addClassroom } = useFireClassData();
  const { makeStudent } = useStudent();
  const { errorHandler } = useFireErrData();
  const { state } = useLocation();
  //교실 속성 값
  const [_classTitle, setClassTitle] = useState('');
  const [_subjGroup, setSubjGroup] = useState('');
  const [_subjDetail, setSubjDetail] = useState('');
  const [_grade, setGrade] = useState('');
  const [_classNumber, setClassNumber] = useState('');
  const [_numberOfStudent, setNumberOfStudent] = useState(0);
  const [_intro, setIntro] = useState('');
  const [xlsxData, setXlsxData] = useState(null);
  //반 생성 종류
  const [how, setHow] = useState('');
  const [classType, setClassType] = useState('');
  useEffect(() => {
    setHow(state.how);
    setClassType(state.type);
  }, [state]);
  //애니메이션
  const [isVisible, setIsVisible] = useState(false);
  //**함수**
  const handleOnChange = (event) => {
    if (event.target.id === 'class_grade') {
      setGrade(event.target.value)
    } else if (event.target.id === 'class_number') {
      setClassNumber(event.target.value)
    }
  }
  //유효성 검사
  const check = () => {
    if (classType === "subject") {
      if (!_subjDetail || !_grade || !_classNumber) { alert("과목, 학년, 반을 채워주세요."); return false; }
      if (!_classTitle || !_intro) { alert("안내사항과 빈칸을 채워주세요"); return false; }
    }
    if (classType === "homeroom") {
      if (!_grade || !_classNumber) { alert("학년, 반을 채워주세요."); return false; }
    }
    if (how === "with_neis") {
      if (!xlsxData) { alert("출석부 데이터가 없거나 엑셀 파일이 아닙니다."); return false; }
    }
    if (how === "with_number") {
      if (!_numberOfStudent) { alert("학생은 0명일 수 없습니다."); return false; }
    }
    return true;
  }
  //제출
  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (!check()) return;
    const confirm = window.confirm('클래스를 생성하시겠습니까?');
    if (!confirm) return;
    makeKlass(classType);
  };
  //반 생성
  const makeKlass = async (type) => {
    let studentList;
    let klassInfo;
    switch (how) {
      case "with_neis":
        studentList = xlsxData;
        break;
      case "with_number":
        studentList = makeStudent(_numberOfStudent, _grade, _classNumber);
        break;
      case "by_hand":
        studentList = [];
        break;
      default: return;
    }
    if (type === "subject") {
      klassInfo = { uid: user.uid, classTitle: _classTitle, type, grade: _grade, classNumber: _classNumber, intro: _intro, subject: _subjGroup, subjDetail: _subjDetail, };
    } else if (type === "homeroom") {
      klassInfo = { uid: user.uid, classTitle: _classTitle, type, grade: _grade, classNumber: _classNumber, intro: _intro, };
    }
    try {
      await addClassroom(klassInfo, studentList);
      navigate("/classRooms");
    } catch (error) {
      alert(ERROR_MSG.addKlass);
      await errorHandler(error, "makeClass");
    }
  }
  return (
    <MainContainer>
      <SubNav><BackBtn /></SubNav>
      <AnimWrapper $isVisible={isVisible}>
        <FormContainer>
          <Header>
            <HeaderTitle>클래스 만들기</HeaderTitle>
          </Header>
          <Row style={{ justifyContent: "space-between" }}>
            <DotTitle title={"클래스명"} />
            <TextInput id="class_title" type="text" onChange={(event) => { setClassTitle(event.target.value) }} value={_classTitle} required />
          </Row>
          <Row style={{ justifyContent: "space-between" }}>
            <DotTitle title={"학년/반"} />
            <CSInfoSelect grade={_grade} classNumber={_classNumber} subject={_subjDetail} handleOnChange={handleOnChange} classMode={true} />
          </Row>
          {/* 클래스 타입 */}
          {classType === "subject" && <>
            <DotTitle title={"교과/과목"} />
            <SubjectSelects sort={classType} selectedGroup={_subjGroup} selectedDetail={_subjDetail} setSelectedGroup={setSubjGroup} setSelectedDetail={setSubjDetail} />
          </>}
          <DotTitle title={"안내 사항"} />
          <TextInput id="class_explanation" type="text" value={_intro} onChange={(event) => { setIntro(event.target.value) }} placeholder="강건고 1-1 공통영어1" required />
          {(how === "with_neis") && <>
            <ImportExcelFileSection getData={setXlsxData} />
          </>}
          {(how === "with_number") && <Row>
            <DotTitle title={"학생 수 입력"} />
            <TextInput id="class_number_of_studnets" type="number" min='1' max='99' value={_numberOfStudent} onChange={(event) => { setNumberOfStudent(event.target.value) }} required />
          </Row>}
          <MainBtn styles={{ margin: "10px 0 0 0" }} onClick={(event) => handleOnSubmit(event)}>생성</MainBtn>
        </FormContainer >
      </AnimWrapper>
    </MainContainer>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const AnimWrapper = styled(Column)`
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transition: opacity 0.7s ease;
`
const Header = styled.div`
  width: 100%;
  height: 35px;  
  background-color: #3454d1a1;  
  position: absolute;  
  top: -35px;
  left: 0;
  padding: 5px 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`
const HeaderTitle = styled.legend`
  width: 70%;  
  font-size: 1em;
  color: white;
  margin-bottom: 40px;
`
const FormContainer = styled(Column)`
  position: relative;
  width: 35%;
  max-width: 540px;
  margin: 55px auto;
  padding: 20px;
  gap: 10px;
  color: black;
  background-color: #efefef;
  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: rgba(52, 94, 209, 0.2) 0px 8px 24px, rgba(52, 84, 209, 0.2) 0px 16px 56px, rgba(52, 84, 209, 0.2) 0px 24px 80px;
  @media(max-width: 768px){
    width: 100%;
  }
`
const TextInput = styled.input`
  height: 35px;
  padding-left: 5px;
  border: 1px solid rgba(120,120,120,0.5);
  border-radius: 7px;
  &:disabled { color: gray; } /* 해당 input disabled 되었을 때 */
`
export default ClassroomFormPage