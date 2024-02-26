//라이브러리
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import useLogout from '../../hooks/useLogout';
import { Badge } from 'react-bootstrap';
import styled from 'styled-components';
//컴포넌트
import TeacherRadio from '../TeacherRadio';
import CSInfoSelect from '../CSInfoSelect';
//hooks
import useStudent from '../../hooks/useStudent';
import useFileCheck from '../../hooks/useFileCheck';
import useStorage from '../../hooks/useStorage';
import useSetUser from '../../hooks/useSetUser';
//이미지
import unknown from '../../image/icon/unkown_icon.png'
import FindSchoolSelect from '../FindSchoolSelect';

const MyInfoModal = (props) => {
  const user = props.user
  //1. 변수
  //내부정보
  const [_isTeacher, setIsTeacher] = useState(user.isTeacher)
  const [_profileImg, setProfileImg] = useState(null)
  const [_profileFile, setProfileFile] = useState(null)
  const [_email, setEmail] = useState('')
  const [_phoneNumber, setPhoneNumber] = useState('')
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

  //2. useEffect
  useEffect(() => { //유저 
    setIsTeacher(user.isTeacher)
    if (user.profileImg) { setProfileImg(user.profileImg) }
  }, [user])

  useEffect(() => { //프로필 사진
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

  //3. 함수
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
        setEmail('')
        setPhoneNumber('')
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
      default: return;
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}>
      <Modal.Header>
        <Modal.Title>{user.name}님의 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StyledMyinfo>
          {/* 일반 */}
          {!isModifying && <div className="container">
            <div className="info_section">
              <div className="info_details">
                <p>고유번호: {user.uid}</p>
                <p>이메일: {user.email ? user.email : "없음"}</p>
                <p>학교명: {user.school ? user.school.schoolName : "없음"}</p>
                <p>연락처: {user.phoneNumber ? user.phoneNumber : "없음"}</p>
                <p>회원구분: {user.isTeacher ? "교사 회원" : "학생 회원"}</p>
              </div>
              <div className="profileImg">
                {_profileImg && <img src={_profileImg} alt="프로필 이미지" />}
                {!_profileImg && <img src={unknown} alt="프로필 이미지" />}
              </div>
            </div>
            <div className="d-grid gap-2">
              <Button variant="primary" onClick={() => { setIsModifying(!isModifying) }}>정보 수정</Button>
              <Button variant="primary" id="ok_btn" onClick={handleOnClick}>확인</Button>
            </div>
          </div>}
          {/* 수정 */}
          {isModifying && <fieldset>
            <div className="info_section">
              <div className="info_details">
                <p>고유번호: {user.uid}</p>
                <div className="input_div">
                  <label htmlFor="email_input">이메일:&nbsp;&nbsp;</label>
                  <input className="email_input" type="text" value={_email} onChange={(event) => { setEmail(event.target.value) }} />
                </div>
                <div className="input_div">
                  <label htmlFor="phoneNumber_input">연락처:&nbsp;&nbsp;</label>
                  <input className="phoneNumber_input" type="text" value={_phoneNumber} onChange={(event) => { setPhoneNumber(event.target.value) }} />
                </div>
                <TeacherRadio isTeacher={_isTeacher} onChange={handleRadioBtnOnChange} />
                {!_isTeacher && <CSInfoSelect grade={_grade} classNumber={_classNumber} number={_number} handleOnChange={handleOnChange} />}
                <div className="input_div">
                  <label>학교명:&nbsp;&nbsp;</label>
                  {_school ? <input type="text" value={_school.schoolName} readOnly /> : <input type="text" value={''} readOnly onClick={() => { setIsSearchSchool(true) }} />}
                </div>
                {_isSearchSchool && <FindSchoolSelect setSchool={setSchool} />}
              </div>
              <div className="profileImg">
                <label htmlFor="profile_img_btn" style={{ cursor: "pointer" }} >
                  {_profileImg && <img src={_profileImg} alt="프로필 이미지" onClick={handleOnClick} />}
                  {!_profileImg && <img src={unknown} alt="프로필 이미지" onClick={handleOnClick} />}
                </label>
                <input id="profile_img_btn" type="file" onChange={handleInputFielOnChange} accept={"image/*"} style={{ display: "none" }} />
                <Badge bg="primary" id="delete_img_btn"  onClick={handleOnClick}>사진 삭제</Badge>
              </div>
            </div>
            <div className="d-grid gap-2">
              <Button variant="primary" id="save_btn" onClick={handleOnClick}>저장</Button>
              <Button variant="primary" id="cancel_btn" onClick={handleOnClick}>취소</Button>
            </div>
          </fieldset>
          }
        </StyledMyinfo>
      </Modal.Body>
      <Modal.Footer>
        <StyledLogoutBtn type="button" onClick={() => {
          props.onHide()
          logout()
        }}>로그아웃</StyledLogoutBtn>
      </Modal.Footer>
    </Modal>
  )
}

const StyledMyinfo = styled.div`
  .container{
    padding: 0.35em 0.75em 0.625em;
  }
  .info_section {
    display: flex;
    margin-bottom: 40px;
  }
  .info_details {
    flex-grow: 1;
  }
  .input_div {
    margin: 15px 0;
  }
  .profileImg {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  img {
    width: 110px;
    height: 110px;
  }
  button {
    display: inline;
    width: 100%;
    color: #efefef;
    background-color: #3454d1;
    border-radius: 15px;
    border: 2px solid whitesmoke;
    cursor: pointer;
  }
`

const StyledLogoutBtn = styled.button`
  position: relative;
  width: 200px;
  margin: 20px auto;
  align-items: center;
  background-color: #0A66C2;
  border: 0;
  border-radius: 100px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-family: -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 20px;
  max-width: 480px;
  min-height: 40px;
  min-width: 0px;
  overflow: hidden;
  padding: 0px;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  touch-action: manipulation;
  transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;

&:hover {
    background: cornflowerblue;
    color: white;
    transition: 0.5s;
  }
&: active {
  background: #09223b;
  color: rgb(255, 255, 255, .7);
}

&:disabled { 
  cursor: not-allowed;
  background: rgba(0, 0, 0, .08);
  color: rgba(0, 0, 0, .3);
}
`

export default MyInfoModal