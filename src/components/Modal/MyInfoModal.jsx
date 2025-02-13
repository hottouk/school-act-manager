//라이브러리
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import useLogout from '../../hooks/useLogout';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
//컴포넌트
import TeacherRadio from '../Radio/TeacherRadio';
import CSInfoSelect from '../Select/CSInfoSelect';
import LongW100Btn from '../Btn/LongW100Btn';
//hooks
import useStudent from '../../hooks/useStudent';
import useFileCheck from '../../hooks/useFileCheck';
import useStorage from '../../hooks/useStorage';
import useSetUser from '../../hooks/useSetUser';
//이미지
import unknown from '../../image/icon/unkown_icon.png'
import FindSchoolSelect from '../FindSchoolSelect';

//241124 1차 수정(코드 정리)
const MyInfoModal = (props) => {
  //----1.변수부--------------------------------
  const user = props.user
  useEffect(() => { //유저 
    setIsTeacher(user.isTeacher)
    setSchool(user.school)
    if (user.profileImg) { setProfileImg(user.profileImg) }
  }, [user])
  //내부 정보
  const [_isTeacher, setIsTeacher] = useState(user.isTeacher)
  const [_profileImg, setProfileImg] = useState(null)
  const [_profileFile, setProfileFile] = useState(null)
  useEffect(() => { //프로필 사진 변경
    if (_profileFile) {
      if (getIsImageCheck(_profileFile.name)) {
        let reader = new FileReader();
        reader.readAsDataURL(_profileFile)
        reader.onloadend = () => {
          setProfileImg(reader.result);
        };
      } else { window.alert("이미지 파일만 가능합니다.") }
    }
  }, [_profileFile])
  const [_email, setEmail] = useState(user.email ? user.email : '')
  const [_phoneNumber, setPhoneNumber] = useState(user.phoneNumber ? user.phoneNumber : '')
  const [_grade, setGrade] = useState("1")
  const [_classNumber, setClassNumber] = useState("01")
  const [_number, setNumber] = useState(1);
  const [_school, setSchool] = useState(null)
  const [_isSearchSchool, setIsSearchSchool] = useState(false) //학교 검색창 보이기
  //수정 모드
  const [isModifying, setIsModifying] = useState(false);
  //학번
  const { createStudentNumber } = useStudent();
  const { getIsImageCheck } = useFileCheck();
  //통신
  const { saveProfileImgStorage, getProfileImgUrl } = useStorage();
  const { updateUserInfo } = useSetUser();
  const { logout } = useLogout();

  //----2.함수부--------------------------------
  //학번
  const handleOnChange = (event) => { //input text
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

  //라디오 버튼
  const handleRadioBtnOnChange = (event) => {
    switch (event.target.value) {
      case "teacher":
        setIsTeacher(true)
        break;
      case "student":
        setIsTeacher(false)
        break;
      default: return
    }
  }
  //프로필 사진 변경
  const handleInputFielOnChange = (event) => {
    let file = event.target.files[0];
    setProfileFile(file) //유저가 파일 변경
  }
  //버튼
  const handleOnClick = (event) => {
    switch (event.target.id) {
      case "ok_btn":
        props.onHide()
        setIsModifying(false)
        break;
      case "cancel_btn":
        setIsModifying(false)
        setIsSearchSchool(false)
        setProfileFile(null)
        setProfileImg(user.profileImg)
        setEmail(user.email ? user.email : '')
        setPhoneNumber(user.phoneNumber ? user.phoneNumber : '')
        break;
      case "save_btn":
        if (window.confirm("이대로 회원정보를 저장하시겠습니까?")) {
          let studentNumber = createStudentNumber(_number - 1, _grade, _classNumber)
          let userInfo
          if (_profileFile) {//이미지 변경 시
            saveProfileImgStorage(_profileFile).then(() => { //스토리지에 저장
              getProfileImgUrl().then((profileUrl) => { //스토리지 저장 주소 받아서 userInfo 저장
                userInfo = { email: _email, phoneNumber: _phoneNumber, studentNumber, profileImg: profileUrl, isTeacher: _isTeacher, school: _school }
                updateUserInfo(userInfo)
              })
              setProfileFile(null)
            })
          } else {
            userInfo = { email: _email, phoneNumber: _phoneNumber, studentNumber, profileImg: _profileImg, isTeacher: _isTeacher, school: _school }
            updateUserInfo(userInfo)
          }//이미지 변경 x
          setIsModifying(false)
        }
        break;
      case "delete_img_btn":
        setProfileImg(null)
        break;
      case "leave_btn":
        window.alert("25년 초에 구현 예정입니다.")
        break;
      default: return;
    }
  }
  //로그아웃
  const handleLogoutOnClick = () => {
    props.onHide()
    logout()
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>{user.name}님의 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 일반 */}
        {!isModifying && <Container>
          <div>
            <p>고유번호: {user.uid}</p>
            <p>이메일: {user.email ? user.email : "없음"}</p>
            <p>학교명: {user.school ? user.school.schoolName : "없음"}</p>
            <p>연락처: {user.phoneNumber ? user.phoneNumber : "없음"}</p>
            <p>회원구분: {user.isTeacher ? "교사 회원" : "학생 회원"}</p>
          </div>
          <ProfileImgWrapper>
            {_profileImg && <img src={_profileImg} alt="프로필 이미지" />}
            {!_profileImg && <img src={unknown} alt="프로필 이미지" />}
          </ProfileImgWrapper>
        </Container>}
        {/* 수정 */}
        {isModifying && <fieldset>
          <UpperSection>
            <div>
              <p>고유번호: {user.uid}</p>
              <InputWrapper>
                <label htmlFor="email_input">이메일:&nbsp;&nbsp;</label>
                <input className="email_input" type="text" value={_email} onChange={(event) => { setEmail(event.target.value) }} />
              </InputWrapper>
              <InputWrapper>
                <label htmlFor="phoneNumber_input">연락처:&nbsp;&nbsp;</label>
                <input className="phoneNumber_input" type="text" value={_phoneNumber} onChange={(event) => { setPhoneNumber(event.target.value) }} />
              </InputWrapper>
            </div>
            <ProfileImgWrapper>
              <label htmlFor="profile_img_btn" style={{ cursor: "pointer" }} >
                {_profileImg && <img src={_profileImg} alt="프로필 이미지" onClick={handleOnClick} />}
                {!_profileImg && <img src={unknown} alt="프로필 이미지" onClick={handleOnClick} />}
              </label>
              <input id="profile_img_btn" type="file" onChange={handleInputFielOnChange} accept={"image/*"} style={{ display: "none" }} />
              <Badge bg="primary" id="delete_img_btn" onClick={handleOnClick}>사진 삭제</Badge>
            </ProfileImgWrapper>
          </UpperSection>
          <LowerSection>
            <TeacherRadio isTeacher={_isTeacher} onChange={handleRadioBtnOnChange} />
            {!_isTeacher && <CSInfoSelect grade={_grade} classNumber={_classNumber} number={_number} handleOnChange={handleOnChange} />}
            <InputWrapper>
              <label>학교명:&nbsp;&nbsp;</label>
              <input type="text" value={_school?.schoolName ?? ''} readOnly onClick={() => { setIsSearchSchool(true) }} />
            </InputWrapper>
            {_isSearchSchool && <FindSchoolSelect setSchool={setSchool} />}
          </LowerSection>
        </fieldset>
        }
        <LongW100Btn id="leave_btn" btnName="회원 탈퇴" btnOnClick={handleOnClick}
          styles={{ btnColor: "#9b0c24", border: "none", color: "white", hoverBtnColor: "rgb(155,12,36,0.5)" }} />
      </Modal.Body>
      <Modal.Footer>
        <FlexWrapper>
          {!isModifying && <LongW100Btn id="ok_btn" btnName="정보 수정" btnOnClick={() => { setIsModifying(!isModifying) }}
            styles={{ btnColor: "#3454d1", border: "none", color: "white" }} />}
          {!isModifying && <LongW100Btn id="ok_btn" btnName="닫기" btnOnClick={handleOnClick} styles={{ btnColor: "#3454d1", border: "none", color: "white" }} />}
          {isModifying && <LongW100Btn id="save_btn" btnName="저장" btnOnClick={handleOnClick} styles={{ btnColor: "#3454d1", border: "none", color: "white" }} />}
          {isModifying && <LongW100Btn id="cancel_btn" btnName="취소" btnOnClick={handleOnClick} styles={{ btnColor: "#3454d1", border: "none", color: "white" }} />}
          <LongW100Btn id="logout_btn" btnName="로그아웃" btnOnClick={handleLogoutOnClick} styles={{ btnColor: "#3454d1", border: "none", color: "white" }} />
        </FlexWrapper>
      </Modal.Footer>
    </Modal>
  )
}

const Container = styled.div`
  display: flex;
  padding: 0.35em 0.75em 0.625em;
`
const UpperSection = styled.div`
  display: flex;
`
const ProfileImgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  img {
    width: 110px;
    height: 110px;
  }
`
const LowerSection = styled.div`
`
const FlexWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  gap: 10px;
`
const InputWrapper = styled.div`
  margin: 15px 0; 
  input { 
    height: 35px;
    border-radius: 7px;
  }
`

export default MyInfoModal