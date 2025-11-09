//라이브러리
import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../store/userSlice';
import styled from 'styled-components'
//컴포넌트
import CSInfoSelect from '../Select/CSInfoSelect';
import FindSchoolSelect from '../FindSchoolSelect';
import TwoRadios from '../Radio/TwoRadios';
import LongW100Btn from '../Btn/LongW100Btn';
import DotTitle from '../Title/DotTitle';
//hooks
import useLogin from '../../hooks/useLogin';
//데이터
import useFireSchoolData from '../../hooks/Firebase/useFireSchoolData';
import TermsModal from './TermsModal';
import MainBtn from '../Btn/MainBtn';
//디자인 수정, 코드 경량화(240730) -> 약관 모달 추가(251026)
const SignUpWithSnsModal = ({ show, onHide, backdrop }) => {
  const tempUser = useSelector(({ tempUser }) => tempUser); //회원 가입 전 구글 전역 변수
  const dispatcher = useDispatch();
  //userInfo 설정
  const [_isTeacher, setIsTeacher] = useState(true);
  const [_grade, setGrade] = useState("default");
  const [_classNumber, setClassNumber] = useState("default");
  const [_number, setNumber] = useState(1);
  const [_isPublic, setIsPublic] = useState(true);
  useEffect(() => { setSchool(null); }, [_isPublic])
  const [_school, setSchool] = useState(null);
  //학교 검색창
  const [_isSearchSchool, setIsSearchSchool] = useState(false)
  //이용약관
  const [_isFirstAgree, setIsFirstAgree] = useState(false);
  const [isTermsModal, setIsTermsModal] = useState(false);
  //hooks
  const { classifyUserInfo, addUser } = useLogin();
  const { signUpSchool } = useFireSchoolData();
  //스타일
  const dotTitleStyle = { fontWeight: "400", dotColor: "#3454d1" };
  //------함수부------------------------------------------------  
  //체크
  const check = () => {
    // 학번 입력?
    if (!_isTeacher) { if (_grade === "default" || _classNumber === "default" || !_number) { return { valid: false, message: "학생의 학년, 반, 번호를 입력하지 않았습니다!" }; } }
    if (!_isFirstAgree) { return { valid: false, message: "약관에 동의하지 않으시면 회원가입이 불가합니다." } }
    // 학교 선택?
    if (!_school) {
      if (!_isPublic) { return { valid: true, message: "위탁, 대안학교" } }
      else { return { valid: false, message: "학교를 입력하지 않았습니다!" }; }
    }
    return { valid: true, message: "유효 입력!" };
  }
  //제출
  const handleOnSubmit = async (event) => {
    event.preventDefault(); //새로고침 방지
    const isValid = check();
    if (isValid.valid) {
      let userInfo = { ...tempUser, isTeacher: _isTeacher, school: _school, grade: _grade, classNumber: _classNumber, number: _number, isMyTermAgree: _isFirstAgree }; //유저 정보
      userInfo = classifyUserInfo(userInfo);
      if (!userInfo) return;
      addUser(userInfo);
      dispatcher(setUser(userInfo));
      //회원 가입 시 학교 자동 가입
      if (_school?.schoolCode) { signUpSchool(_school, userInfo) };
    } else {
      window.alert(isValid.message);
      console.log(isValid.message);
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
  //취소
  const handleCancelOnClick = () => {
    onHide();
    setIsSearchSchool(false);
    setSchool(null);
    setIsFirstAgree(false);
  }
  return (<>
    <Modal
      show={show}
      backdrop={backdrop}
      onHide={onHide}>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>sns 회원가입</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef", borderBottomLeftRadius: "10px", WebkitBorderBottomRightRadius: "10px" }}>
        <StyledForm onSubmit={handleOnSubmit}>
          <fieldset>
            <Row>
              <DotTitle title="이름" styles={dotTitleStyle} />
              <BasicText>{tempUser.name}</BasicText>
            </Row>
            <Row>
              <DotTitle title="email" styles={dotTitleStyle} />
              <BasicText>{tempUser.email}</BasicText>
            </Row>
            <Row>
              <DotTitle title="구분" styles={dotTitleStyle} />
              <TwoRadios
                name="회원 구분"
                id={["isTeacher_radio_btn", "isStudent_radio_btn"]}
                label={["교사 회원", "학생 회원"]}
                value={_isTeacher}
                onChange={() => { setIsTeacher((prev) => !prev) }} />
            </Row>
            {!_isTeacher && <Row>
              <DotTitle title="학번" styles={dotTitleStyle} />
              <CSInfoSelect grade={_grade} classNumber={_classNumber} number={_number} handleOnChange={handleStudentNumber} />
            </Row>}
            <Row>
              <DotTitle title="학교 구분" styles={dotTitleStyle} />
              <TwoRadios
                name="학교 구분"
                id={["isPublic_radio_btn", "isOther_radio_btn"]}
                label={["나이스 등재", "대안,위탁,사설"]}
                value={_isPublic}
                onChange={() => { setIsPublic((prev) => !prev) }} />
            </Row>
            {_isPublic && <InputWrapper>
              <DotTitle title="학교" styles={dotTitleStyle} />
              {_school
                ? <input type="text" value={_school.schoolName} readOnly />
                : <input type="text" value={''} readOnly onClick={() => { setIsSearchSchool(true) }} placeholder="학교를 등록해주세요" />}
            </InputWrapper>}
            {(_isSearchSchool && _isPublic) &&
              <FindSchoolSelect setSchool={setSchool} />}
            {!_isPublic &&
              <DotTitle title="가입 후, 단체 등록을 해주셔야 온전히 사용 가능합니다." styles={{ width: "100%", fontWeight: "400", dotColor: "#3454d1" }} />}
            <Row>
              <DotTitle title="약관 동의" styles={dotTitleStyle} />
              <Row style={{ gap: "2px" }}>
                <input
                  type="checkbox"
                  id="term_agree_check"
                  checked={_isFirstAgree}
                  onClick={() => setIsTermsModal(true)} />
                <label htmlFor="term_agree_check">동의함</label>
              </Row>
            </Row>
          </fieldset>
          <BtnWrapper>
            <MainBtn type="submit">회원가입</MainBtn>
            <LongW100Btn type="button" btnOnClick={handleCancelOnClick} btnName="취소" />
          </BtnWrapper>
        </StyledForm>
      </Modal.Body>
    </Modal>
    <TermsModal
      show={isTermsModal}
      onHide={() => setIsTermsModal(false)}
      setIsFirstAgree={setIsFirstAgree}
    />
  </>
  )
}
const Row = styled.div`
  display: flex;
`
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
const InputWrapper = styled(Row)`
  input {
    width: 73%;
    height: 35px;
    border: 1px solid rgba(120,120,120,0.5);
    border-radius: 5px;
  }
`
const BtnWrapper = styled(Row)`
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`

export default SignUpWithSnsModal