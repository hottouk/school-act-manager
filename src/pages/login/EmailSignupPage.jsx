import React, { useEffect, useState } from 'react'
//컴포넌트
import TwoRadios from '../../components/Radio/TwoRadios'
import CSInfoSelect from '../../components/Select/CSInfoSelect'
import FindSchoolSelect from '../../components/FindSchoolSelect'
//css
import styled from 'styled-components'
import LongW100Btn from '../../components/Btn/LongW100Btn'
import { useNavigate } from 'react-router-dom'
import { isSignInWithEmailLink } from 'firebase/auth'
import { appAuth } from '../../firebase/config'
import useLogin from '../../hooks/useLogin'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/userSlice'

//2024.07.30 생성
const EmailSignupPage = () => {
  const auth = appAuth
  const [emailId, setEmailId] = useState('')                  //id
  useEffect(() => {
    setEmailId(window.localStorage.getItem("emailForSignIn"))
    if (!isSignInWithEmailLink(auth, window.location.href)) {//현재 페이지가 이메일 인증으로부터 리디렉션된 페이지인지 검사
      window.alert("이메일 인증된 페이지가 아닙니다.")
      navigate("/login")                                     //아니라면 로그인 페이지 이동     
    }
    window.localStorage.removeItem("emailForSignIn")         //후에 제거
  }, [])
  const [_password, setPassword] = useState('')            //비번
  const [_samePassword, setSamePassword] = useState('')    //비번확인
  const [_name, setName] = useState('')
  const [_isTeacher, setIsTeacher] = useState(true);
  const [_school, setSchool] = useState(null)
  const [_isSearchSchool, setIsSearchSchool] = useState(false) //학교 검색창
  //학생 정보
  const [_grade, setGrade] = useState("default");
  const [_classNumber, setClassNumber] = useState("default");
  const [_number, setNumber] = useState(1)
  //hooks
  const dispatcher = useDispatch()
  const navigate = useNavigate()
  const { classifyUserInfo, getEmailUserCredential, addUser, emailMsg } = useLogin()

  //2. 함수
  //취소
  const handleCancelBtnClick = () => {
    navigate("/login")
  }

  //학년반
  const handleOnChange = (event) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    let userInfo = {
      uid: emailId, password: _password, samePassword: _samePassword, email: emailId, name: _name, profileImg: null, phoneNumber: null,
      isTeacher: _isTeacher, school: _school, grade: _grade, classNumber: _classNumber, number: _number
    }
    let classifiedInfo = classifyUserInfo(userInfo) //유저 정보 분류
    if (classifiedInfo) {
      getEmailUserCredential(emailId, _password).then((userCredential) => {
        let emailUser = userCredential.user;
        let newUserInfo = { ...classifiedInfo, uid: emailUser.uid }
        addUser(newUserInfo)
        dispatcher(setUser(newUserInfo))
      })
    }
  }

  return (
    <>
      <div>{emailId}이 인증되었습니다.</div>
      <StyledForm onSubmit={handleSubmit}>
        <InputWrapper>
          <StyledTitle>id</StyledTitle>
          <input
            type="email"
            value={emailId}
            disabled
          />
        </InputWrapper>
        <InputWrapper>
          <StyledTitle>비밀번호 설정</StyledTitle>
          <input
            type="password"
            placeholder="비밀번호"
            value={_password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </InputWrapper>
        <InputWrapper>
          <StyledTitle>비밀번호 확인</StyledTitle>
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={_samePassword}
            onChange={(e) => setSamePassword(e.target.value)}
            required />
          <ErrWrapper>{emailMsg}</ErrWrapper>
        </InputWrapper>
        <InputWrapper>
          <StyledTitle>이름</StyledTitle>
          <input
            type="text"
            placeholder="이름"
            value={_name}
            onChange={(e) => setName(e.target.value)}
            required />
        </InputWrapper>
        <Wrapper>
          <StyledTitle>회원구분</StyledTitle>
          <TwoRadios
            name="회원구분"
            id={["isTeacher_radio_btn", "isStudent_radio_btn"]}
            label={["교사 회원", "학생 회원"]}
            value={_isTeacher}
            onChange={() => { setIsTeacher((prev) => !prev) }} />
        </Wrapper>
        {_isTeacher === false &&
          <Wrapper>
            <StyledTitle>학번</StyledTitle>
            <CSInfoSelect grade={_grade} classNumber={_classNumber} number={_number} handleOnChange={handleOnChange} />
          </Wrapper>
        }
        <InputWrapper>
          <StyledTitle>학교</StyledTitle>
          {_school ? <input type="text" value={_school.schoolName} readOnly /> : <input type="text" value={''} readOnly onClick={() => { setIsSearchSchool(true) }} />}
        </InputWrapper>
        {_isSearchSchool && <FindSchoolSelect setSchool={setSchool} />}
        <BtnWrapper>
          <LongW100Btn type="submit" btnName="회원가입" />
          <LongW100Btn type="button" btnOnClick={handleCancelBtnClick} btnName="취소" />
        </BtnWrapper>
      </StyledForm>
    </>
  )
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 540px;
  margin: 0 auto;
  padding: 20px;
  color: #efefef;
  background-color: #3454d1;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-top: 0;
  }
`
const InputWrapper = styled.div`
  display: flex;
  position: relative;
  input {
    height: 35px;
    border: 1px solid black;
    border-radius: 5px;
  }
`
const StyledTitle = styled.p`
  position: relative;
  display: flex;
  align-items: center;
  width: 30%; 
  margin: 0;
  padding: 0 20px;  /* 텍스트가 동그라미와 겹치지 않도록 왼쪽 여백 추가 */
  &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 20px;
      background-color: white;  /* 동그라미 색상 */
      border-radius: 2px;
    }
`
const Wrapper = styled.div`
  display: flex;
`
const BtnWrapper = styled.div`
  display: flex;
  gap: 10px;
`
const ErrWrapper = styled.p`
  margin: 0; 
  font-size: 12px;
  position: absolute;
  bottom: -15px;
  left: 30%;
`
export default EmailSignupPage