import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';
//컴포넌트
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import ModalBtn from '../Btn/ModalBtn';
//hooks
import useAddUpdFireData from '../../hooks/Firebase/useAddUpdFireData';
import useFetchFireData from '../../hooks/Firebase/useFetchFireData';

//디자인 수정(250213)
const NoticeModal = ({ show, onHide, onDismissed }) => {
  const user = useSelector(({ user }) => user)
  const isMaster = user.isMaster //관리자 권한
  //수정
  const [isModi, setIsModi] = useState(false)
  const [notice, setNotice] = useState('')
  //데이터 통신
  const { addNotice } = useAddUpdFireData("notice") //서버 기록
  const { fetchDoc } = useFetchFireData()        //기록 불러오기
  const [noticeList, setNoticeList] = useState(null)  //불러온 기록 배열
  useEffect(() => { fetchDoc("notice", "notice").then((data) => { setNoticeList(data.noticeList) }) }, [])

  //------함수부------------------------------------------------  
  const splitTxtToArr = (txt) => { //"/"구분자로 txt to 배열
    return txt.split("^")
  }

  const handleBtnClick = (event) => {
    switch (event.target.id) {
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
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>공지사항</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        <Wrapper>
          {!isModi && (noticeList ? noticeList.map((notice, index) => {
            return <p key={index}>{index + 1}. {notice}</p>
          }) : "공지 없음")}
          {isModi && <textarea placeholder="구분자 '^'로 공지사항 나누어 작성하기" value={notice} onChange={(event) => { setNotice(event.target.value) }} />}
        </Wrapper>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }}>
        <input type="checkbox" onChange={() => { onDismissed() }} />오늘 하루 그만 보기
        <ModalBtn onClick={() => { onHide(); }}>닫기</ModalBtn>
        {(isMaster && !isModi) && <Button id="modi_btn" onClick={handleBtnClick}>공지 수정하기</Button>}
        {(isMaster && isModi) && <Button id="save_btn" onClick={handleBtnClick}>저장하기</Button>}
      </Modal.Footer>
    </Modal>
  )
}

const Wrapper = styled.div`
  textarea {
    width: 100%;
    height: 200px;
    padding: 5px;
  }
`
export default NoticeModal