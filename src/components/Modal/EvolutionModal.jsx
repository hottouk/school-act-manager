import Modal from 'react-bootstrap/Modal';
import { monsterList } from '../../data/monsterList';
import { useEffect, useState } from 'react';
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg';
import styled from 'styled-components';
import ArrowBtn from '../Btn/ArrowBtn';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import ModalBtn from '../Btn/ModalBtn';

//250130 수정 -> 250427 스펙 추가
const EvolutionModal = ({ show, onHide, info }) => {
  useEffect(() => { findMonseters(); }, [info])
  const [curMonster, setCurMonster] = useState(null);
  const [nextMonster, setNextMonster] = useState(null);
  const [monImgList, setMonImgList] = useState([]);
  const { fetchImgUrlList } = useFetchStorageImg();
  const { updateUserPetInfo } = useFireUserData();
  useEffect(() => { downloadImgList() }, [curMonster, nextMonster])

  //확인
  const handleConfirmOnClick = () => {
    updateUserPetInfo(info.petId, nextMonster, info.submitItem).then(() => alert("진화 완료"))
    onHide();
  }

  //몬스터 찾기
  const findMonseters = () => {
    if (!info) return;
    const monster = monsterList.find((item) => { return item.monId === info.monId });
    const curMon = monster?.step[info.ev - 1];
    const nextMon = monster?.step[info.ev];
    setCurMonster(curMon);
    setNextMonster(nextMon);
  }

  //몬스터 이미지 다운로드
  const downloadImgList = () => {
    if (!curMonster || !nextMonster) return
    fetchImgUrlList([curMonster.path, nextMonster.path], setMonImgList);
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header style={{ backgroundColor: "#3454d1", height: "40px", color: "white" }}>진화</Modal.Header>
      <Modal.Body>
        <MonsterWrapper>
          <StyledItem>
            <StyledImg src={monImgList[0]} alt="현재 img" />
            <StyledText>Lv{curMonster?.level.nextStepLv} {curMonster?.name}</StyledText>
            <SpecWrapper>
              <StyledText>체력: {curMonster?.spec.hp}</StyledText>
              <StyledText>공격: {curMonster?.spec.atk}</StyledText>
              <StyledText>방어: {curMonster?.spec.def}</StyledText>
              <StyledText>마력: {curMonster?.spec.mat}</StyledText>
              <StyledText>지력: {curMonster?.spec.mdf}</StyledText>
              <StyledText>민첩: {curMonster?.spec.spd}</StyledText>
            </SpecWrapper>
          </StyledItem>
          <StyledItem><ArrowBtn /></StyledItem>
          <StyledItem>
            <StyledImg src={monImgList[1]} alt="진화 img" />
            <StyledText>Lv{nextMonster?.level.level} {nextMonster?.name} </StyledText>
            <SpecWrapper style={{ flexDirection: "column" }}>
              <StyledText>체력: {nextMonster?.spec.hp}</StyledText>
              <StyledText>공격: {nextMonster?.spec.atk}</StyledText>
              <StyledText>방어: {nextMonster?.spec.def}</StyledText>
              <StyledText>마력: {nextMonster?.spec.mat}</StyledText>
              <StyledText>지력: {nextMonster?.spec.mdf}</StyledText>
              <StyledText>민첩: {nextMonster?.spec.spd}</StyledText>
            </SpecWrapper>
          </StyledItem>
        </MonsterWrapper>
        <SkillWrapper>
          {nextMonster?.skills.map((item) =>
            <StyledText>스킬 습득: {item.name}</StyledText>
          )}
        </SkillWrapper>
      </Modal.Body>
      <Modal.Footer>
        <ModalBtn onClick={() => onHide()}>취소</ModalBtn>
        <ModalBtn styles={{ btnColor: "royalblue", hoverColor: "#3454d1" }} onClick={handleConfirmOnClick} >확인</ModalBtn>
      </Modal.Footer>
    </Modal>
  )
}

const Row = styled.div`
  display: flex;
`
const MonsterWrapper = styled(Row)`
  justify-content: center;
  gap: 20px;
`
const SpecWrapper = styled(Row)`
  flex-direction: column;
  margin-top: 10px;
  border: 1px solid rgba(120,120,120,0.5);
  border-radius: 10px;
  padding: 22px;
`
const SkillWrapper = styled(Row)`
  margin-top: 15px;
  border: 1px solid rgba(120,120,120,0.5);
  border-radius: 10px;
  padding: 10px;
`
const StyledItem = styled(Row)`
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