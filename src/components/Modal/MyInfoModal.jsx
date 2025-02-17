//라이브러리
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import useLogout from '../../hooks/useLogout';
import { Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//컴포넌트
import CSInfoSelect from '../Select/CSInfoSelect';
import ModalBtn from '../Btn/ModalBtn';
import FindSchoolSelect from '../FindSchoolSelect';
//hooks
import useStudent from '../../hooks/useStudent';
import useFileCheck from '../../hooks/useFileCheck';
import useStorage from '../../hooks/useStorage';
import useSetUser from '../../hooks/useSetUser';
//이미지
import unknown from '../../image/icon/unkown_icon.png'

//241124 1차 수정(코드 정리)
const MyInfoModal = ({ show, onHide, isMobile }) => {
  const user = useSelector(({ user }) => user)
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

  //------함수부------------------------------------------------ 
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

  //프로필 사진 변경
  const handleInputFielOnChange = (event) => {
    let file = event.target.files[0];
    setProfileFile(file) //유저가 파일 변경
  }

  //버튼
  const handleOnClick = (event) => {
    switch (event.target.id) {
      case "cancel_btn":

        break;
      case "delete_img_btn":
        setProfileImg(null)
        break;
      default: return;
    }
  }

  //확인
  const handleConfirmOnClick = () => {
    onHide();
    setIsModifying(false)
  }

  //저장
  const handleSaveOnClick = () => {
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
  }

  //취소
  const handleCancelOnClick = () => {
    setIsModifying(false)
    setIsSearchSchool(false)
    setProfileFile(null)
    setProfileImg(user.profileImg)
    setEmail(user.email ? user.email : '')
    setPhoneNumber(user.phoneNumber ? user.phoneNumber : '')
  }

  //회원 탈퇴
  const handleLeaveOnClick = () => { window.alert("25년 초에 구현 예정입니다.") }

  //로그아웃
  const handleLogoutOnClick = () => {
    onHide();
    logout();
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>{user.name}님의 정보</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        {/* 일반 */}
        {!isModifying && <Container>
          <div>
            <p>고유번호: {user.uid}</p>
            <p>이메일: {user.email ? user.email : "없음"}</p>
            <p>학교명: {user.school ? user.school.schoolName : "없음"}</p>
            <p>연락처: {user.phoneNumber ? user.phoneNumber : "없음"}</p>
            <p>회원구분: {user.isTeacher ? "교사 회원" : "학생 회원"}</p>
          </div>
          {!isMobile && <ProfileImgWrapper>
            {_profileImg && <img src={_profileImg} alt="프로필 이미지" />}
            {!_profileImg && <img src={unknown} alt="프로필 이미지" />}
          </ProfileImgWrapper>}
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
            {!isMobile && <ProfileImgWrapper>
              <label htmlFor="profile_img_btn" style={{ cursor: "pointer" }} >
                {_profileImg && <img src={_profileImg} alt="프로필 이미지" onClick={handleOnClick} />}
                {!_profileImg && <img src={unknown} alt="프로필 이미지" onClick={handleOnClick} />}
              </label>
              <input id="profile_img_btn" type="file" onChange={handleInputFielOnChange} accept={"image/*"} style={{ display: "none" }} />
              <Badge bg="primary" id="delete_img_btn" onClick={handleOnClick}>사진 삭제</Badge>
            </ProfileImgWrapper>}
          </UpperSection>
          <div>
            {!_isTeacher && <CSInfoSelect grade={_grade} classNumber={_classNumber} number={_number} handleOnChange={handleOnChange} />}
            <InputWrapper>
              <label>학교명:&nbsp;&nbsp;</label>
              <input type="text" value={_school?.schoolName ?? ''} readOnly onClick={() => { setIsSearchSchool(true) }} />
            </InputWrapper>
            {_isSearchSchool && <FindSchoolSelect setSchool={setSchool} />}
          </div>
        </fieldset>
        }
        {!isModifying && <Row style={{ justifyContent: "flex-end", gap: "10px" }}>
          <ClickableText onClick={handleLeaveOnClick} >회원 탈퇴</ClickableText>
          <ClickableText onClick={() => { setIsModifying(true) }}>정보 수정</ClickableText>
        </Row>}
        {isModifying && <Row style={{ justifyContent: "flex-end", gap: "10px" }}>
          <ClickableText onClick={handleSaveOnClick} >저장</ClickableText>
          <ClickableText onClick={handleCancelOnClick} >취소</ClickableText>
        </Row>}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }}>
        <ModalBtn onClick={handleLogoutOnClick} >로그아웃</ModalBtn>
        <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfirmOnClick}>확인</ModalBtn>
      </Modal.Footer>
    </Modal>
  )
}

const Container = styled.div`
  display: flex;
  padding: 0.35em 0.75em 0.625em;
`
const Row = styled.div`
  display: flex;
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
const ClickableText = styled.p`
  margin: 0;
  text-decoration: underLine;
  cursor: pointer;
  &:hover {
    color: #3454d1;
  }
`
const InputWrapper = styled.div`
  margin: 15px 0; 
  input {
    height: 35px;
    border-radius: 7px;
    border: 1px solid rgba(120, 120, 120, 0.5)
  }
`

export default MyInfoModal