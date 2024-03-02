import { useEffect, useRef, useState } from 'react'
import useStorage from '../hooks/useStorage';
import styled from 'styled-components';
import useDoActivity from '../hooks/useDoActivity';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import EmptyResult from './EmptyResult';
import nonPreview from "../image/non_preview.png"
import InputFile from './InputFile';

//todo 문서쓰기
const Homework = ({ activity, homeworkSubmit }) => {
  const user = useSelector(({ user }) => { return user })
  const activityInfo = activity
  const [_file, setFile] = useState(null)         //사용자 선택한 파일
  const [_fileName, setFileName] = useState(null) //기존 파일명 from DB
  const [_newFileName, setNewFileName] = useState(null) //과제 수정시 새 파일명
  const [_fromWhere, setFromWhere] = useState(null) //과제의 class정보
  const [_prevImgSrc, setPrevImgSrc] = useState(null)
  const [_noImgPrev, setNoImgPrev] = useState("")
  const [_isHomeworkDone, setIsHomeworkDone] = useState(false)
  const [_thisHomework, setThisHomework] = useState(null)
  const prevImgRef = useRef(null)
  //교사전용
  const [_studentInfo, setStudentInfo] = useState(null)
  const [_actInfo, setActInfo] = useState(null)
  const { submitHomeworkStorage, modifyHomeworkStorage, cancelHomeworkStorage, getImgUrl, getDownloadHomeworkFile } = useStorage()
  const { submitHomework, cancelSubmission, approveHomework, denyHomework } = useDoActivity()
  const { state } = useLocation() //state는 교사 전용 속성

  //2.useEffect
  useEffect(() => { //입장 시
    if (!user.isTeacher) { //학생
      if (user.myHomeworkList) { //학생 숙제 제출시
        let thisHomework = user.myHomeworkList.find((item) => {
          let itemId = item.id.split('/')[1]
          return itemId === activityInfo.id
        })
        if (thisHomework) {
          setThisHomework(thisHomework)
          setFileName(thisHomework.fileName);
          if (getIsImageCheck(thisHomework.fileName)) {
            getImgUrl(thisHomework.fileName, state.acti.id, prevImgRef, state.student.uid)
            setNoImgPrev('')
          } else {
            setPrevImgSrc(nonPreview)
            setNoImgPrev("미리 볼 수 없는 형식의 파일입니다.")
          }
          setFromWhere(thisHomework.fromWhere)
          setIsHomeworkDone(true)
          homeworkSubmit(true)
        }
      }
    } else {
      if (user.homeworkList) { //교사
        setActInfo(state.acti)        //acti 정보
        setStudentInfo(state.student) //학생 정보
        let thisHomework = user.homeworkList.find((item) => { return item.id === `${state.student.uid}/${state.acti.id}` })
        if (thisHomework) {
          setThisHomework(thisHomework) //todo 정리하기
          setFileName(thisHomework.fileName);
          if (getIsImageCheck(thisHomework.fileName)) {
            getImgUrl(thisHomework.fileName, state.acti.id, prevImgRef, state.student.uid)
            setNoImgPrev('')
          } else {
            setPrevImgSrc(nonPreview)
            setNoImgPrev("미리 볼 수 없는 형식의 파일입니다.")
          }
          setFromWhere(thisHomework.fromWhere);
          setIsHomeworkDone(true)
        }
      }
    }
  }, [user])

  useEffect(() => { //과제 파일 업로드시
    if (_file) {
      setNewFileName(_file.name)
      if (getIsImageCheck(_file.name)) {//이미지인 경우
        let reader = new FileReader();
        reader.readAsDataURL(_file)
        reader.onloadend = () => {
          setPrevImgSrc(reader.result);
        };
        setNoImgPrev('')
      } else { //이미지가 아닌 경우
        setPrevImgSrc(nonPreview)
        setNoImgPrev("미리 볼 수 없는 형식의 파일입니다.")
      }
    }
  }, [_file])

  //3. 함수
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
        let feedback = window.prompt("과제를 반려하시겠습니까? 피드백을 간단히 적어주세요", "완성도 부족")
        if (feedback) {
          denyHomework(_thisHomework, feedback)
        }
        break;
      case "download_btn":
        if (window.confirm("과제파일을 다운로드 하시겠습니까?")) {
          getDownloadHomeworkFile(_fileName, state.acti.id, state.student.uid)
        }
        break;
      case "submit_homework_btn":
        if (!_file) {
          window.alert("파일을 선택해주세요.")
        } else {
          if (window.confirm("과제를 제출 하시겠습니까?")) {
            submitHomeworkStorage(_file, activityInfo) //storage에 파일 저장
            submitHomework(_file, activityInfo, false) //db에 파일 정보 저장
            homeworkSubmit(true)
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
            homeworkSubmit(true)
          }
        }
        break;
      case "cancel_submit_btn":
        if (window.confirm("과제 제출을 취소하시겠습니까?")) {
          setPrevImgSrc(null); //화면변경
          setIsHomeworkDone(false);
          cancelHomeworkStorage(_fileName, activityInfo); //Storage에서 삭제
          cancelSubmission(activityInfo); //DB통신
          setFile(null)
          setFileName(null)
          setNewFileName(null)
          homeworkSubmit(false)
        }
        break;
      default: return
    }
  }

  return (
    <StyledForm>
      {/* 교사 */}
      {user.isTeacher && <>
        <legend>{state.student.name} 학생의 과제 확인</legend>
        {_isHomeworkDone && <StyledStudentInfo>
          <p>학번: {state.student.studentNumber}</p>
          <p>이름: {state.student.name}</p>
          <p>활동명: {state.acti.title}</p>
          <p>결과물:<strong> {_fileName}</strong></p>
          {(_prevImgSrc === nonPreview) && <StyledImgDiv $height="200px"><img src={_prevImgSrc} ref={prevImgRef} alt="미리보기 없음" /></StyledImgDiv>}
          {(_prevImgSrc !== nonPreview) && <StyledImgDiv><img src={_prevImgSrc} ref={prevImgRef} alt="미리보기" /></StyledImgDiv>}
          <p>{_noImgPrev}</p>
          <StyledBtn type="button" id="confirm_btn" onClick={handleBtnClick}>승인</StyledBtn>
          <StyledBtn type="button" id="deny_btn" onClick={handleBtnClick}>반려</StyledBtn>
          <StyledBtn type="button" id="download_btn" onClick={handleBtnClick}>다운로드</StyledBtn></StyledStudentInfo>}
        {!_isHomeworkDone && <><legend>과제 제출</legend>
          {!_prevImgSrc && <EmptyResult comment="제출된 과제가 없습니다." color="#efefef" />}
        </>}
      </>}
      {/* 학생 */}
      {!user.isTeacher && <>
        {_isHomeworkDone && <><p>{_thisHomework && _thisHomework.feedback ? "과제 반려됨" : `과제 제출됨: ${_fileName}`}</p>
          {(_prevImgSrc === nonPreview) && <StyledImgDiv $height="200px"><img src={_prevImgSrc} ref={prevImgRef} alt="미리보기 없음" /></StyledImgDiv>}
          {(_prevImgSrc !== nonPreview) && <StyledImgDiv><img src={_prevImgSrc} ref={prevImgRef} alt="미리보기" /></StyledImgDiv>}
          <p>{_noImgPrev}</p>
          {_thisHomework && _thisHomework.feedback && <p>선생님의 피드백을 참고하여 과제를 보완해주세요. <br />반려 사유: <strong>{_thisHomework.feedback}</strong> </p>}
          <InputFile handleOnChange={(event) => { handleOnChange(event) }} fileName={_newFileName}></InputFile>
          <StyledBtn type="button" id="submit_modification_btn" onClick={handleBtnClick}>수정 제출</StyledBtn>
          <StyledBtn type="button" id="cancel_submit_btn" onClick={handleBtnClick}>제출 취소</StyledBtn>
        </>}
        {!_isHomeworkDone && <><p>과제 제출</p>
          {!_prevImgSrc && <EmptyResult comment="제출된 과제가 없습니다." color="#efefef" />}
          {_prevImgSrc &&
            <>{(_prevImgSrc === nonPreview) && <StyledImgDiv $height="200px"><img src={_prevImgSrc} ref={prevImgRef} alt="미리보기 없음" /></StyledImgDiv>}
              {(_prevImgSrc !== nonPreview) && <StyledImgDiv><img src={_prevImgSrc} ref={prevImgRef} alt="미리보기" /></StyledImgDiv>}</>}
          <p>{_noImgPrev}</p>
          <InputFile handleOnChange={(event) => { handleOnChange(event) }} fileName={_newFileName}></InputFile>
          <StyledBtn type="button" id="submit_homework_btn" onClick={handleBtnClick}>과제 제출</StyledBtn>
        </>}
      </>}
    </StyledForm>
  )
}

const StyledStudentInfo = styled.div`
  p {
    text-align: left;
    margin-bottom: 10px;
  }
`
const StyledForm = styled.form`
  max-width: 540px;
  margin: 60px auto 30px;
  padding: 20px;
  color: #efefef;
  background-color: #3454d1;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  @media screen and (max-width: 767px){
    width: 100%;
    height: ${(props) => props.$clientheight}px;
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
    width: ${(props) => { return props.$height ? props.$height : "450px" }};
    margin: 15px auto;
    border-radius: 10px;
  }
`
export default Homework