//라이브러리
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import styled from 'styled-components'
//컴포넌트
import QuizBattlePage from '../../pages/quizBattle/QuizBattlePage'
import CardList from '../List/CardList'
import AnimMaxHightOpacity from '../../anim/AnimMaxHightOpacity'
import MainBtn from '../Btn/MainBtn'
//hooks
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg'
import useMediaQuery from '../../hooks/useMediaQuery'
import useLevel from '../../hooks/useLevel'
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData'

const GameModal = ({ show, onHide, quizSetId, gameDetails }) => {
  useEffect(() => { bindEnmData(); }, [gameDetails])
  const [step, setStep] = useState(1);
  //내 펫 리스트
  const { myUserData } = useFetchRtMyUserData();
  useEffect(() => { fetchPetListData(); }, [myUserData])
  const [myPetList, setMyPetList] = useState([]);
  const [petImgList, setPetImgList] = useState([]);
  const { fetchImgUrl, fetchImgUrlList } = useFetchStorageImg();
  useEffect(() => { downloadImgList(); }, [myPetList, gameDetails]);
  const [selectedPet, setSelectedPet] = useState(null);
  //몬스터 리스트
  const [monImg, setMonImg] = useState(null);
  const [monsterList, setMonsterList] = useState(null);
  const { getEarnedXp, getMonsterStat } = useLevel();
  const [selectedLv, setSeletedLv] = useState(1);     //적 레벨
  useEffect(() => { bindEnmData(); }, [selectedLv]);
  const isMobile = useMediaQuery("(max-width: 767px)");
  //------함수부------------------------------------------------------ 
  //펫 리스트 데이터
  const fetchPetListData = () => {
    if (!myUserData || myUserData?.isTeacher) return
    const { myPetList: petList } = myUserData;
    setMyPetList(petList);
  }
  //적 리스트 데이터
  const bindEnmData = () => {
    if (!gameDetails) return
    const { monster } = gameDetails;
    const list = [1, 2, 3, 4, 5].map((level) => {
      return {
        path: monster.path, level,
        desc: monster.step[0].desc,
        spec: getMonsterStat(monster.step[0].spec, level),
        name: monster.step[0].name,
        exp: getEarnedXp(level)
      }
    })
    setMonsterList(list);
  }
  //이미지 다운로드
  const downloadImgList = () => {
    if (!myPetList || !gameDetails) return
    const { monster } = gameDetails;
    const petPathList = myPetList.map(pet => pet.path);
    fetchImgUrlList([...petPathList,], setPetImgList);
    fetchImgUrl(monster.path, setMonImg);
  }
  //체크
  const check = () => {
    if (selectedLv && selectedPet) return true
    return false;
  }
  //펫버블 클릭
  const petBubbleOnClick = (pet) => {
    setSelectedPet(pet);
    setStep(2);
  }
  const monBubbleOnClick = (level) => {
    setSeletedLv(level);
    setStep("start")
  }
  //버튼 클릭
  const startBtnOnClick = () => {
    if (check()) { setStep("start"); }
    else { alert("펫과 몬스터를 모두 선택해주세요."); }
  }
  //------랜더링-------------------------------------------------------
  const SpecSection = ({ spec, style }) => {
    return <SpecWrapper>
      <Column style={{ justifyContent: "space-around" }}>
        <Highlight>Status</Highlight>
        <Row style={{ gap: "35px" }}>
          <Column>
            <BasicText>체력: {spec?.hp ?? "??"}</BasicText>
            <BasicText>공격: {spec?.atk ?? "??"}</BasicText>
            <BasicText>방어: {spec?.def ?? "??"}</BasicText>
          </Column>
          <Column>
            <BasicText>마력: {spec?.mat ?? "??"}</BasicText>
            <BasicText>지력: {spec?.mdf ?? "??"}</BasicText>
            <BasicText>민첩: {spec?.spd ?? "??"}</BasicText>
          </Column>
        </Row>
      </Column>
    </SpecWrapper>
  }
  const PetBubble = ({ pet, index }) => {
    const { petId, level, name, spec } = pet;
    console.log(petImgList)
    return <MonsterWrapper key={petId} onClick={() => { petBubbleOnClick(pet) }}>
      <Column style={{ margin: "0 15px" }}>
        <PetImg src={petImgList[index]} alt="현재 img" />
        <BasicText>Lv{level.level} {name}</BasicText>
      </Column>
      <SpecSection spec={spec} />
    </MonsterWrapper>
  }
  const MonBubble = ({ mon, index }) => {
    const { level, name, spec, exp } = mon;
    return <MonsterWrapper key={index} onClick={() => { monBubbleOnClick(level) }}>
      <Column style={{ margin: "0 15px" }}>
        <PetImg src={monImg} alt="현재 img" />
        <BasicText>Lv{level} {name}</BasicText>
      </Column>
      <SpecSection spec={spec} />
      <Row style={{ alignItems: "center" }}><Highlight>Exp {exp} </Highlight></Row>
    </MonsterWrapper>
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      fullscreen={true}>
      <Modal.Body>
        {/* 준비 */}
        {(step !== "start") && <><TitleText>펫 선택</TitleText>
          {(isMobile && step === 1) && myPetList.map((pet, index) => <PetBubble key={pet.petId} pet={pet} index={index} />)}
          {(isMobile && step === 2) && monsterList.map((mon, index) => <MonBubble key={index} mon={mon} index={index} />)}
          {!isMobile && <>
            <CardList dataList={myPetList} onClick={setSelectedPet} selected={selectedPet} type={"pet"} />
            <AnimMaxHightOpacity isVisible={selectedPet}>
              <h1 style={{ fontWeight: "bold", textAlign: "center" }}>VS</h1>
              <TitleText>적 레벨 선택</TitleText>
              <CardList dataList={monsterList} onClick={setSeletedLv} selected={selectedLv} type={"monster"} />
            </AnimMaxHightOpacity>
          </>}
          <Row style={{ justifyContent: "center", marginTop: "20px" }}>
            <MainBtn onClick={startBtnOnClick}>게임 시작</MainBtn>
          </Row></>}
        {/* 시작 */}
        {(step === "start") && <QuizBattlePage quizSetId={quizSetId} selectedPet={selectedPet} monsterDetails={monsterList[selectedLv - 1]} gameDetails={gameDetails} onHide={onHide} />}
      </Modal.Body>
    </Modal>
  )
}

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const MonsterWrapper = styled(Row)`
  margin-top: 10px;
  padding: 5px;
  border: 1px solid rgba(120,120,120,0.5);
  border-radius: 10px;
  gap: 20px;
  cursor: pointer;
`
const SpecWrapper = styled(Row)`
  width: 100%;
  justify-content: space-around;
`
const PetImg = styled.img`
  width: 100px;
  height: 100px;
`
const BasicText = styled.p`
  margin: 0;
  text-align: center;
`
const TitleText = styled.h3`
  text-align: center;
`
const Highlight = styled(BasicText)`
  color: #3454d1;
  font-weight: 700;
  font-size: larger;
`
export default GameModal
