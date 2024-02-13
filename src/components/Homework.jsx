import { useEffect, useRef, useState } from 'react'
import useStorage from '../hooks/useStorage';
import styled from 'styled-components';
import useDoActivity from '../hooks/useDoActivity';
import { useSelector } from 'react-redux';
import crying_cat from '../image/cat.png'
import { useLocation } from 'react-router-dom';
import EmptyResult from './EmptyResult';

const Homework = (props) => {
  const user = useSelector(({ user }) => { return user })
  const activityInfo = props.activity
  const [_file, setFile] = useState(null)         //사용자 선택한 파일
  const [_fileName, setFileName] = useState(null) //기존 파일명 from DB통신
  const [_fromWhere, setFromWhere] = useState(null) //과제의 class정보
  const [_prevImgSrc, setPrevImgSrc] = useState(crying_cat)
  const [_isHomeworkDone, setIsHomeworkDone] = useState(false)
  const [_thisHomework, setThisHomework] = useState(null)
  //교사전용
  const [_studentInfo, setStudentInfo] = useState(null)
  const [_actInfo, setActInfo] = useState(null)
  const { submitHomeworkStorage, modifyHomeworkStorage, cancelHomeworkStorage, getImgUrl, getDownloadHomeworkFile } = useStorage()
  const { submitHomework, cancelSubmission, approveHomework, denyHomework } = useDoActivity()
  const prevImgRef = useRef(null)
  const { state } = useLocation() //state는 교사 전용 속성

  useEffect(() => {
    if (user.myHomeworkList) { //학생
      let thisHomework = user.myHomeworkList.find((item) => {
        let itemId = item.id.split('/')[1]
        return itemId === activityInfo.id
      })
      if (thisHomework) {
        setFromWhere(thisHomework.fromWhere)
        getImgUrl(thisHomework.fileName, activityInfo.id, prevImgRef)
        setIsHomeworkDone(true)
      }
    }
    if (user.homeworkList) { //교사
      setActInfo(state.acti)
      setStudentInfo(state.student) //학생 정보 꺼내기
      let thisHomework = user.homeworkList.find((item) => { return item.id === `${state.student.uid}/${state.acti.id}` })
      if (thisHomework) {
        setThisHomework(thisHomework) //todo 정리하기
        setFileName(thisHomework.fileName);
        setFromWhere(thisHomework.fromWhere);
        getImgUrl(thisHomework.fileName, state.acti.id, prevImgRef, state.student.uid)
        setIsHomeworkDone(true)
      }
    }
  }, [user])

  useEffect(() => {
    if (_file) {
      if (getIsImageCheck(_file.name)) {//이미지인 경우
        let reader = new FileReader();
        reader.readAsDataURL(_file)
        reader.onloadend = () => {
          setPrevImgSrc(reader.result);
        };
      }
    }
  }, [_file])

  const getExtension = (filename) => {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  const getIsImageCheck = (fileName) => {
    let ext = getExtension(fileName)
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
      case 'jpeg':
        return true;
      default: return false
    }
  }

  const handleOnChange = (event) => {
    let file = event.target.files[0];
    setFile(file)
  }

  const handleBtnClick = (event) => {
    switch (event.target.id) {
      case "confirm_btn":
        if (window.confirm("과제를 승인하시겠습니까?")) {
          approveHomework(_studentInfo, _actInfo, _fromWhere)
        }
        break;
      case "deny_btn":
        let feedback = window.prompt("과제 반려하시겠습니까? 피드백을 간단히 적어주세요", "완성도 부족")
        if (feedback) {
          denyHomework(_thisHomework, feedback)
        }
        break;
      case "download_btn":
        if (window.confirm("과제파일을 다운로드 하시겠습니까?")) {
          getDownloadHomeworkFile(_fileName, state.actId, state.studentId)
        }
        break;
      case "submit_homework_btn":
        if (!_file) {
          window.alert("파일을 선택해주세요.")
        } else {
          if (window.confirm("과제를 제출 하시겠습니까?")) {
            submitHomeworkStorage(_file, activityInfo) //storage에 파일 저장
            submitHomework(_file, activityInfo, false) //db에 파일 정보 저장
          }
        }
        break;
      case "submit_modification_btn":
        if (!_file) {
          window.alert("파일을 선택해주세요.")
        } else {
          if (window.confirm("과제를 수정 제출 하시겠습니까?")) {
            modifyHomeworkStorage(_file, _fileName, activityInfo) //storage에 파일 수정
            submitHomework(_file, activityInfo, true) //db에 파일 정보 수정
          }
        }
        break;
      case "cancel_submit_btn":
        if (window.confirm("과제 제출을 취소하시겠습니까?")) {
          setPrevImgSrc(null); //화면변경
          setIsHomeworkDone(false);
          cancelHomeworkStorage(_fileName, activityInfo); //Storage
          cancelSubmission(activityInfo); //DB통신
        }
        break;
      default: return
    }
  }

  return (
    <StyledForm>
      {user.isTeacher && <>
        <legend>{state.student.name}학생의 과제 확인</legend>
        {!_isHomeworkDone && <EmptyResult comment={"제출된 과제가 없습니다."}></EmptyResult>}
        {_isHomeworkDone && <><p>{state.student.studentNumber}: {state.student.name}</p>
          <p>{state.acti.title}: {state.acti.content}</p>
          <p>결과물</p>
          <StyledImgDiv $prevImgSrc={_prevImgSrc}><img src={_prevImgSrc} ref={prevImgRef} alt="미리보기" /></StyledImgDiv>
          <StyledBtn type="button" id="confirm_btn" onClick={handleBtnClick}>승인</StyledBtn>
          <StyledBtn type="button" id="deny_btn" onClick={handleBtnClick}>반려</StyledBtn>
          <StyledBtn type="button" id="download_btn" onClick={handleBtnClick}>다운로드</StyledBtn></>}
      </>}
      {!user.isTeacher && <>
        <legend>{!_isHomeworkDone ? "과제 제출" : "과제 제출됨"}</legend>
        <input type="file" onChange={handleOnChange} />
        <StyledImgDiv $prevImgSrc={_prevImgSrc}><img src={_prevImgSrc} ref={prevImgRef} alt="미리보기" /></StyledImgDiv>
        {!_isHomeworkDone
          ? <><p>제출된 과제가 없습니다.</p>
            <StyledBtn type="button" id="submit_homework_btn" onClick={handleBtnClick}>과제 제출</StyledBtn></>
          : <><StyledBtn type="button" id="submit_modification_btn" onClick={handleBtnClick}>수정 제출</StyledBtn>
            <StyledBtn type="button" id="cancel_submit_btn" onClick={handleBtnClick}>제출 취소</StyledBtn></>}
      </>}
    </StyledForm>
  )
}
const StyledForm = styled.form`
  max-width: 540px;
  margin: 0 auto 30px;
  padding: 20px;
  color: #efefef;
  background-color: #3454d1;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  
  legend {
    width: 70%;  
    font-size: 1.5em;
    margin-bottom: 40px;
  }

  p {
    text-align: center;
  }

  @media screen and (max-width: 767px){
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    max-width: 100%;
    margin: 0;
    padding: 15px;
    color: #efefef;
    background-color: #3454d1;
    border: none;
    border-radius: 0;
    box-shadow: none;
    overflow-y: scroll;
  }
`

const StyledBtn = styled.button`
  margin: 8px auto;
  margin-top: 25px;
  width: 80%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #efefef;
  background-color: transparent;
  border-radius: 15px;
  border: 2px solid #efefef;
  padding: 25px;
  @media screen and (max-width: 767px){
    margin-top: 20px;
  }
`

const StyledImgDiv = styled.div`
  display: flex;
  justify-content: center;
  img {
    width: 500px;
    margin: 15px auto;
    border-radius: 10px;
  }
`
export default Homework