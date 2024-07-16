import React, { useEffect, useState } from 'react'
//전역변수
import { useSelector } from 'react-redux';
//컴포넌트
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
//hooks
import useAddUpdFireData from '../../hooks/useAddUpdFireData';
import useFetchFireData from '../../hooks/useFetchFireData';
//css
import styled from 'styled-components';

const NoticeModal = ({ show, onHide, onDismissed }) => {
  const user = useSelector(({ user }) => user)
  const isMaster = user.isMaster //관리자 권한
  //수정
  const [isModi, setIsModi] = useState(false) 
  const [notice, setNotice] = useState('')
  //데이터 통신
  const { addNotice } = useAddUpdFireData("notice") //서버 기록
  const { fetchNotice } = useFetchFireData()        //기록 불러오기
  const [noticeList, setNoticeList] = useState(null)  //불러온 기록 배열
  useEffect(() => { fetchNotice().then((noticeList) => { setNoticeList(noticeList) }) }, [])

  //2. 함수
  const splitTxtToArr = (txt) => { //"/"구분자로 txt to 배열
    return txt.split("^")
  }

  const handleBtnClick = (event) => {
    switch (event.target.id) {
      case "close_btn":
        onHide();
        break;
      case "modi_btn":
        setIsModi(true)
        break;
      case "save_btn":
        addNotice(splitTxtToArr(notice))
        setIsModi(false)
        break;
      default:
        return;
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>공지사항</Modal.Header>
      <Modal.Body>
        <StyledContainer>
          {!isModi && (noticeList ? noticeList.map((notice, index) => {
            return <p key={index}>{index + 1}. {notice}</p>
          }) : "공지 없음")}
          {isModi && <textarea placeholder="구분자 '^'로 공지사항 나누어 작성하기" value={notice} onChange={(event) => { setNotice(event.target.value) }} />}
        </StyledContainer>
      </Modal.Body>
      <Modal.Footer>
        <input type="checkbox" onChange={() => { onDismissed() }} />오늘 하루 그만 보기
        <Button id="close_btn" onClick={handleBtnClick}>닫기</Button>
        {(isMaster && !isModi) && <Button id="modi_btn" onClick={handleBtnClick}>공지 수정하기</Button>}
        {(isMaster && isModi) && <Button id="save_btn" onClick={handleBtnClick}>저장하기</Button>}
      </Modal.Footer>
    </Modal>
  )
}

const StyledContainer = styled.div`
  textarea {
    width: 100%;
    height: 200px;
    padding: 5px;
  }
`
export default NoticeModal