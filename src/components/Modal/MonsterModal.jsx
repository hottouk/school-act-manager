//라이브러리
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';
//hooks
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
//데이터
import { monsterEvilList } from "../../data/monsterList"
//이미지
import question_icon from "../../image/icon/question.png"
import ModalBtn from '../Btn/ModalBtn';

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
      size='lg'>
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }} closeButton>상대 몬스터 선택</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#efefef" }}>
        <MonImgWrapper>
          {/* 상단 선택창 */}
          {(imgUrlList.length !== 0) && imgUrlList.map((item, index) => <React.Fragment key={item}>
            {monster?.path === monsterEvilList[index]?.path
              ? <Selected src={item} />
              : <UnSelected id="mon" src={item} alt={`mon${index + 1}`} onClick={(event) => { handleImgOnClick(event, index) }} />}
          </React.Fragment>)
          }
        </MonImgWrapper>
        {/* 하단 상세 정보 */}
        <Row style={{ margin: "30px 0", justifyContent: "space-evenly" }}>
          {/* 선택 전 */}
          {detailImgUrlList.length === 0 && <>
            <UnSelected src={question_icon} style={{ width: "125px", height: "125px", border: "1px solid rgba(120, 120, 120, 0.5)", borderRadius: "10px", cursor: "default" }} />
            <UnSelected src={question_icon} style={{ width: "125px", height: "125px", border: "1px solid rgba(120, 120, 120, 0.5)", borderRadius: "10px", cursor: "default" }} />
            <UnSelected src={question_icon} style={{ width: "125px", height: "125px", border: "1px solid rgba(120, 120, 120, 0.5)", borderRadius: "10px", cursor: "default" }} />
          </>}
          {/* 로딩 중 */}
          {(monster && detailImgUrlList.length === 0) && <Spinner />}
          {/* 선택 후 */}
          {detailImgUrlList.length !== 0 &&
            detailImgUrlList.map((item, index) =>
              <UnSelected id='details' key={item} src={item} alt={"details"}
                style={{ width: "125px", height: "125px", border: "1px solid rgba(120, 120, 120, 0.5)", borderRadius: "10px" }}
                onClick={(event) => { handleImgOnClick(event, index) }} />)}
        </Row>
        {monsterDetails && <MonsterInfoWrapper>
          <h4 style={{ color: "#3454d1", fontWeight: "bold", textAlign: "center" }}> {monsterDetails.name}</h4>
          <Row style={{ gap: "10px" }}>
            <SpecWrapepr>
              <h6>체력: {monsterDetails.spec?.hp ?? "??"}</h6>
              <h6>공격력: {monsterDetails.spec?.atk ?? "??"}</h6>
              <h6>방어력: {monsterDetails.spec?.def ?? "??"}</h6>
              <h6>스피드: {monsterDetails.spec?.spd ?? "??"}</h6>
            </SpecWrapepr>
            <StyledText>{monsterDetails?.desc || "각 몬스터를 클릭하세요"}</StyledText>
          </Row>
        </MonsterInfoWrapper>}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#efefef" }}>
        <ModalBtn onClick={handleCancelOnClick}>취소</ModalBtn>
        <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfirmOnClick}>확인</ModalBtn>
      </Modal.Footer>
    </Modal>
  );
}
const MonImgWrapper = styled.div`
  display: flex;
  background-color: white;
  border: 1px solid rgba(120, 120, 120, 0.5);
  border-radius: 15px;
  overflow-x: scroll;
`
const Row = styled.div`
  display: flex;
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
const SpecWrapepr = styled.div`
  width: 50%;
  padding: 10px;
  border: 1px dotted rgba(120, 120, 120, 0.5);
  border-radius: 10px;
`
const MonsterInfoWrapper = styled.div`
  width: 100%;
  padding: 15px;
  border: 1px solid rgba(120, 120, 120, 0.5);
  border-radius: 8px;
`
const StyledText = styled.p`
  padding: 10px;
  border: 1px dotted rgba(120, 120, 120, 0.5);
  border-radius: 5px;
  margin: 0;
`
export default MonsterModal;