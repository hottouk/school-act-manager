import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import { monsterList } from '../../data/monsterList';
import { useEffect, useState } from 'react';
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
import styled from 'styled-components';
import ArrowBtn from '../Btn/ArrowBtn';
import useFireUserData from '../../hooks/Firebase/useFireUserData';

//20250130 수정
const EvolutionModal = ({ show, onHide, info }) => {
  useEffect(() => { findMonseters(info) }, [info])
  const [curMonster, setCurMonster] = useState(null);
  const [nextMonster, setNextMonster] = useState(null);
  const [monImgList, setMonImgList] = useState([]);
  const { fetchImgUrlList } = useFetchStorageImg();
  const { updateUserPetInfo } = useFireUserData();
  useEffect(() => { downloadImgList() }, [curMonster, nextMonster])

  //닫기
  const handleConfirmOnClick = () => {
    updateUserPetInfo(info.petId, nextMonster);
    onHide();
  }

  //몬스터 찾기
  const findMonseters = (rewardInfo) => {
    if (!info) return;
    const mon = monsterList.find((item) => { return item.monId === rewardInfo.monId });
    const curIndex = mon?.step.findIndex((item) => item.name === rewardInfo.name);
    const curMon = mon?.step[curIndex];
    const nextMon = mon?.step[curIndex + 1];
    setCurMonster(curMon)
    setNextMonster(nextMon)
  }

  //몬스터 이미지 다운로드
  const downloadImgList = () => {
    if (!curMonster || !nextMonster) return;
    fetchImgUrlList([curMonster.path, nextMonster.path], setMonImgList)
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>진화</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MonsterWrapper>
          <StyledItem>
            <StyledImg src={monImgList[0]} alt="현재 img" />
            <StyledText>Lv{curMonster?.level.nextStepLv} {curMonster?.name}</StyledText>
          </StyledItem>
          <StyledItem><ArrowBtn /></StyledItem>
          <StyledItem>
            <StyledImg src={monImgList[1]} alt="진화 img" />
            <StyledText>Lv{nextMonster?.level.level} {nextMonster?.name} </StyledText>
          </StyledItem>
        </MonsterWrapper>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onHide()}>취소</Button>
        <Button type="button" onClick={handleConfirmOnClick} variant="primary" id="confirm_btn" >확인</Button>
      </Modal.Footer>
    </Modal>
  )
}

const MonsterWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`
const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const StyledImg = styled.img`
  width: 100px;
  height: 100px;
  border: 1px solid rgba(120,120,120,0.5);
  border-radius: 15px;
`
const StyledText = styled.p`
  margin: 0;
`

export default EvolutionModal