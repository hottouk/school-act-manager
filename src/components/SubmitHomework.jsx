import { useEffect, useRef, useState } from 'react'
import useStorage from '../hooks/useStorage';
import styled from 'styled-components';
import useDoActivity from '../hooks/useDoActivity';
import { useSelector } from 'react-redux';
import crying_cat from '../image/cat.png'


//학생 전용
const SubmitHomework = (props) => {
  const user = useSelector(({ user }) => { return user })
  const activityInfo = props.activity
  const [_file, setFile] = useState(null)
  const [_fileName, setFileName] = useState(null)
  const [_prevImgSrc, setPrevImgSrc] = useState(crying_cat)
  const [_isHomeworkDone, setIsHomeworkDone] = useState(false)
  const { submitHomeworkStorage, cancelHomeworkStorage, getImgUrl } = useStorage()
  const { noticeHomeworkSubmission, cancelSubmission } = useDoActivity()
  const prevImgRef = useRef(null)

  useEffect(() => {
    if (user.myHomeworkList) {
      let thisHomework = user.myHomeworkList.find((ele) => { return ele.id === activityInfo.id })
      if (thisHomework) {
        setFileName(thisHomework.fileName);
        getImgUrl(thisHomework.fileName, activityInfo.id, prevImgRef)
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

  const handleBtnClick = () => { //취소버튼
    if (window.confirm("과제 제출을 취소하시겠습니까?")) {
      setPrevImgSrc(null);
      setIsHomeworkDone(false);
      cancelSubmission(activityInfo);
      cancelHomeworkStorage(_fileName, activityInfo);
    }
  }

  const handleFileUpload = () => {
    if (!_file) {
      window.alert("파일을 선택해주세요.")
    } else {
      if (window.confirm("과제를 제출 하시겠습니까?")) {
        submitHomeworkStorage(_file, activityInfo) //storage에 파일 저장
        noticeHomeworkSubmission(_file, activityInfo) //db에 파일 정보 저장
      }
    }
  }

  return (
    <StyledForm>
      <legend>
        {!_isHomeworkDone ? "과제 제출" : "과제 제출됨"}
      </legend>
      <input type="file" onChange={handleOnChange} />
      <StyledImgDiv $prevImgSrc={_prevImgSrc}><img src={_prevImgSrc} ref={prevImgRef} alt="미리보기" /></StyledImgDiv>
      {!_isHomeworkDone && <p>제출된 과제가 없습니다.</p>}
      <StyledBtn type="button" id="submit_assignment_btn" onClick={handleFileUpload}>
        {!_isHomeworkDone ? "과제 제출" : "수정 제출"}
      </StyledBtn>
      {_isHomeworkDone && <StyledBtn type="button" id="cancel_submit__btn" onClick={handleBtnClick}>제출 취소</StyledBtn>}
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
export default SubmitHomework