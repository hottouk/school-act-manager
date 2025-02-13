//라이브러리
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';
//hooks
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
//데이터
import { monsterEvilList } from "../../data/monsterList"
//이미지
import question_icon from "../../image/icon/question.png"

//25.01.16 변경
const MonsterModal = ({ show, onHide, monster, setMonster, setMonImg }) => {
  //준비
  const { getPathList, fetchImgUrlList } = useFetchStorageImg(); //이미지 불러오기
  const [imgUrlList, setImgUrlList] = useState([])              //상단 선택 이미지
  const [monsterDetails, setMonsterDetails] = useState(null);   //하단 선택
  useEffect(() => {
    const pathList = getPathList(monsterEvilList)
    fetchImgUrlList(pathList, setImgUrlList)
  }, [])
  const [detailImgUrlList, setDetailImgUrlList] = useState([])  //하단 세부 진화 이미지
  useEffect(() => { //상단 선택 시
    if (!monster) return;
    const pathList = getPathList(monster.step)
    setDetailImgUrlList([])
    fetchImgUrlList(pathList, setDetailImgUrlList)
  }, [monster])

  //이미지 클릭 
  const handleImgOnClick = (event, index) => {
    switch (event.target.id) {
      case "mon": //상단부
        setMonster(monsterEvilList[index])
        setMonImg(imgUrlList[index])          //modal 외부 이미지 설정
        break;
      case "details": //하단부
        setMonsterDetails(monster.step[index])
        break;
      default:
        break;
    }
  }
  const handleConfirmOnClick = () => {
    onHide();
  }
  const handleCancelOnClick = () => {
    setMonster(null);
    setMonImg(null);
    onHide();
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      size='lg'
    >
      <Modal.Header closeButton>
        <Modal.Title>상대 몬스터 선택</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StyledImageWrapper>
          {/* 상단 선택창 */}
          {(imgUrlList.length !== 0) && imgUrlList.map((item, index) => <React.Fragment key={item}>
            {monster?.path === monsterEvilList[index]?.path
              ? <Selected src={item} />
              : <UnSelected id="mon" src={item} alt={`mon${index + 1}`} onClick={(event) => { handleImgOnClick(event, index) }} />}
          </React.Fragment>)
          }
        </StyledImageWrapper>
        {/* 하단 상세 정보 */}
        <Row style={{ margin: "30px 0" }}>
          {/* 선택 전 */}
          {detailImgUrlList.length === 0 && <>
            <UnSelected src={question_icon} style={{ width: "150px", height: "150px", border: "1px gray solid", borderRadius: "10px", cursor: "default" }} />
            <UnSelected src={question_icon} style={{ width: "150px", height: "150px", border: "1px gray solid", borderRadius: "10px", cursor: "default" }} />
            <UnSelected src={question_icon} style={{ width: "150px", height: "150px", border: "1px gray solid", borderRadius: "10px", cursor: "default" }} />
          </>}
          {/* 로딩 중 */}
          {(monster && detailImgUrlList.length === 0) && <Spinner />}
          {/* 선택 후 */}
          {detailImgUrlList.length !== 0 &&
            detailImgUrlList.map((item, index) =>
              <UnSelected id='details' key={item} src={item} alt={"details"}
                style={{ width: "150px", height: "150px", border: "1px gray solid", borderRadius: "10px" }}
                onClick={(event) => { handleImgOnClick(event, index) }} />)}
        </Row>
        <MonsterInfoWrapper>
          {monsterDetails && <>
            <Row style={{ color: "#3454d1", fontWeight: "bold" }}><h4> {monsterDetails.name}</h4></Row>
            <h6>체력: {monsterDetails.spec?.hp ?? "??"}</h6>
            <h6>공격력: {monsterDetails.spec?.atk ?? "??"}</h6>
            <h6>방어력: {monsterDetails.spec?.def ?? "??"}</h6>
            <h6>스피드: {monsterDetails.spec?.spd ?? "??"}</h6>
          </>}
          <StyledText>{monsterDetails?.desc || "각 몬스터를 클릭하세요"}</StyledText>
        </MonsterInfoWrapper>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancelOnClick}>취소</Button>
        <Button variant="primary" onClick={handleConfirmOnClick}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
}
const StyledImageWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
`
const Row = styled.div`
  display: flex;
  justify-content: space-evenly;
`
const UnSelected = styled.img`
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  cursor: pointer;
  padding: 8px;
`
const Selected = styled.img`
  box-sizing: border-box; 
  width: 100px;
  height: 100px;
  background-color: orange;
  border-radius: 10px;
  border: 1px solid black;
  padding: 8px;
`
const MonsterInfoWrapper = styled.div`
  width: 608px;
  background-color: #ddd;
  margin-left: 79px;
  padding: 15px;
  border-radius: 8px;
}
`
const StyledText = styled.p`
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
`
export default MonsterModal;