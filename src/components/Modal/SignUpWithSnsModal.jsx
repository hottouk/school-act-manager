//라이브러리
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setUser } from '../../store/userSlice';
//컴포넌트
import CSInfoSelect from '../Select/CSInfoSelect';
import FindSchoolSelect from '../FindSchoolSelect';
import TwoRadios from '../Radio/TwoRadios';
import LongW100Btn from '../Btn/LongW100Btn';
import DotTitle from '../Title/DotTitle';
//hooks
import useLogin from '../../hooks/useLogin';
import useFireSchoolData from '../../hooks/Firebase/useFireSchoolData';


//24.07.30(디자인 수정, 코드 경량화)
const SignUpWithSnsModal = (props) => {
  const tempUser = useSelector(({ tempUser }) => { return tempUser }) //회원 가입 전 구글 전역 변수
  const dispatcher = useDispatch()
  //userInfo 설정
  const [_isTeacher, setIsTeacher] = useState(true);
  const [_grade, setGrade] = useState("default");
  const [_classNumber, setClassNumber] = useState("default");
  const [_number, setNumber] = useState(1);
  const [_isPublic, setIsPublic] = useState(true);
  useEffect(() => {
    setSchool(null);
    if (!_isPublic) { setSchool({ schoolName: "대안, 위탁, 사설 단체" }); }
  }, [_isPublic])
  const [_school, setSchool] = useState(null);
  const [_isSearchSchool, setIsSearchSchool] = useState(false) //학교 검색창 보이기
  console.log(_school)

  //hooks
  const { classifyUserInfo, addUser } = useLogin()
  const { signUpSchool } = useFireSchoolData();
  //2. 함수
  //취소
  const handleCancelOnClick = () => {
    props.onHide();
    setIsSearchSchool(false);
    setSchool(null);
  }

  //유효성 검사
  const check = () => {
    // 조건 1: 학교를 선택했는가?
    if (!_school) {
      return { valid: false, message: "학교를 입력하지 않았습니다!" };
    }
    // 조건 2: 학생이 학번을 입력헀는가?
    if (!_isTeacher) {
      if (_grade === "default" || _classNumber === "default" || !_number) { return { valid: false, message: "학생의 학년, 반, 번호를 입력하지 않았습니다!" }; }
    }
    // 모든 조건 통과
    return { valid: true, message: "유효 입력!" };
  }

  //제출
  const handleSubmit = async (event) => {
    event.preventDefault(); //새로고침 방지
    const isValid = check();
    if (isValid.valid) {
      let userInfo = { ...tempUser, isTeacher: _isTeacher, school: _school, grade: _grade, classNumber: _classNumber, number: _number } //유저 정보
      userInfo = classifyUserInfo(userInfo)
      if (!userInfo) return;
      addUser(userInfo);
      dispatcher(setUser(userInfo));
      if (userInfo.school.schoolCode) { signUpSchool(userInfo.school.schoolCode, userInfo) };
    } else {
      window.alert(isValid.message);
    }
  }

  //학생 학번 변경
  const handleStudentNumber = (event) => {
    switch (event.target.id) {
      case "class_grade":
        setGrade(event.target.value)
        break;
      case "class_number":
        setClassNumber(event.target.value)
        break;
      case "number_input":
        setNumber(event.target.value)
        break;
      default: return
    }
  }

  return (
    <Modal
      show={props.show}
      backdrop={props.backdrop}
      onHide={props.onHide}>
      <Modal.Header closeButton />
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        <StyledForm onSubmit={handleSubmit}>
          <fieldset>
            <Row>
              <DotTitle title="이름" styles={{ fontWeight: "400", dotColor: "#3454d1" }} />
              <BasicText>{tempUser.name}</BasicText>
            </Row>
            <Row>
              <DotTitle title="email" styles={{ fontWeight: "400", dotColor: "#3454d1" }} />
              <BasicText>{tempUser.email}</BasicText>
            </Row>
            <Row>
              <DotTitle title="구분" styles={{ fontWeight: "400", dotColor: "#3454d1" }} />
              <TwoRadios
                name="회원 구분"
                id={["isTeacher_radio_btn", "isStudent_radio_btn"]}
                label={["교사 회원", "학생 회원"]}
                value={_isTeacher}
                onChange={() => { setIsTeacher((prev) => !prev) }} />
            </Row>
            {_isTeacher === false &&
              <Row>
                <DotTitle title="학번" styles={{ fontWeight: "400", dotColor: "#3454d1" }} />
                <CSInfoSelect grade={_grade} classNumber={_classNumber} number={_number} handleOnChange={handleStudentNumber} />
              </Row>
            }<Row>
              <DotTitle title="학교 구분" styles={{ fontWeight: "400", dotColor: "#3454d1" }} />
              <TwoRadios
                name="학교 구분"
                id={["isPublic_radio_btn", "isOther_radio_btn"]}
                label={["나이스 등재", "대안,위탁,사설"]}
                value={_isPublic}
                onChange={() => { setIsPublic((prev) => !prev) }} />
            </Row>

            {_isPublic && <InputWrapper>
              <DotTitle title="학교" styles={{ fontWeight: "400", dotColor: "#3454d1" }} />
              {_school ? <input type="text" value={_school.schoolName} readOnly /> : <input type="text" value={''} readOnly onClick={() => { setIsSearchSchool(true) }} placeholder="학교를 등록해주세요" />}
            </InputWrapper>}
            {(_isSearchSchool && _isPublic) && <FindSchoolSelect setSchool={setSchool} />}
            {!_isPublic && <DotTitle title="가입 후, 단체 등록을 해주셔야 온전히 사용 가능합니다." styles={{ width: "100%", fontWeight: "400", dotColor: "#3454d1" }} />}

          </fieldset>
          <BtnWrapper>
            <LongW100Btn type="submit" btnName="회원가입" />
            <LongW100Btn type="button" btnOnClick={handleCancelOnClick} btnName="취소" />
          </BtnWrapper>
        </StyledForm>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  )
}

const StyledForm = styled.form`
  max-width: 540px;
  color: #3a3a3a;
  background-color: #efefef;
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 18px;
    border: none;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-top: 0;
  }
`
const BasicText = styled.p`
  margin: 0;
`
const Row = styled.div`
  display: flex;
`
const InputWrapper = styled(Row)`
  display: flex;
  input {
    width: 73%;
    height: 35px;
    border: 1px solid rgba(120,120,120,0.5);
    border-radius: 5px;
  }
`
const BtnWrapper = styled(Row)`
  gap: 10px;
  margin-top: 20px;
`

export default SignUpWithSnsModal