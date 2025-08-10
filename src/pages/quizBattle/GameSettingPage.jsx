//라이브러리
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
//컴포넌트
import QuizBattleSingleSection from './QuizBattleSingleSection'
import CardList from '../../components/List/CardList'
import MainBtn from '../../components/Btn/MainBtn'
import SmallBtn from '../../components/Btn/SmallBtn'
import PetImg from '../../components/PetImg'
import PlusBtn from '../../components/Btn/PlusBtn'
import GameRankModal from '../../components/Modal/GameRankModal'
import AddGameroomModal from '../../components/Modal/AddGameroomModal'
import PetSpecUI from '../../components/Game/PetSpecUI'
//hooks
import useFetchStorageImg from '../../hooks/Game/useFetchStorageImg'
import useMediaQuery from '../../hooks/useMediaQuery'
import useLevel from '../../hooks/useLevel'
import useFetchRtMyUserData from '../../hooks/RealTimeData/useFetchRtMyUserData'
import useFireClassData from '../../hooks/Firebase/useFireClassData'
import useFireGameData from '../../hooks/Firebase/useFireGameData'
import question_icon from '../../image/icon/question.png'
//UI 추가(250720) -> 페이지로 변경(250722)
const GameSettingPage = () => {
  //준비
  const user = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const location = useLocation();
  const { state: gameData } = location;
  useEffect(() => { bindQuizData(); }, [gameData]);
  //바인딩 정보
  const [klassId, setKlassId] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [quizId, setQuizId] = useState(null);
  useEffect(() => { gameroomListDataListener(setMultiroomList, quizId); }, [quizId])
  const [step, setStep] = useState(1);
  const { deleteKlassroomArrayInfo } = useFireClassData();
  const { gameroomListDataListener, enterGameroom } = useFireGameData();
  //내 펫 리스트
  const { myUserData } = useFetchRtMyUserData();
  useEffect(() => { fetchPetListData(); }, [myUserData]);
  const [myPetList, setMyPetList] = useState([]);
  const [petImgList, setPetImgList] = useState([]);
  const { fetchImgUrl, fetchImgUrlList } = useFetchStorageImg();
  useEffect(() => { downloadImgList(); }, [myPetList]);
  //선택
  const [selectedPet, setSelectedPet] = useState(null);         //내펫
  const [selectedEnm, setSelectedEnm] = useState(null);         //멀티
  useEffect(() => { bindMonImg(selectedEnm); }, [selectedEnm])
  const [selectedLv, setSeletedLv] = useState(1);               //개인전
  //개인전
  const [monImg, setMonImg] = useState(null);
  const [monsterList, setMonsterList] = useState(null);
  const { getEarnedXp, getMonsterStat } = useLevel();
  const [gameRankInfo, setGameRankInfo] = useState(null);
  //멀티플레이
  const [multiroomList, setMultiroomList] = useState([]);
  //모달
  const [isRankModal, setIsRankModal] = useState(false);
  const [isGameroomModal, setIsGameroomModal] = useState(false);
  //모바일
  const isMobile = useMediaQuery("(max-width: 767px)");
  //------함수부------------------------------------------------------ 
  const bindQuizData = () => {
    if (!gameData) return;
    const { monster, quizInfo, gameRecord, klassId, ...rest } = gameData;
    const list = [1, 2, 3, 4, 5]
      .map((level) => ({ path: monster.path, level, desc: monster.step[0].desc, spec: getMonsterStat(monster.step[0].spec, level), name: monster.step[0].name, exp: getEarnedXp(level) }))
    setMonsterList(list);                     // 개인전 몬스터 리스트
    setQuizId(quizInfo.id);                   // 퀴즈 id
    fetchImgUrl(monster.path, setMonImg);     // 몬스터 이미지
    setGameRankInfo(gameRecord);              // 랭킹
    setKlassId(klassId);                      // 클라스 id(todo 이관)
    setGameDetails(rest);                     // 그 외..
  }
  //몬스터 이미지
  const bindMonImg = (data) => {
    if (!data) return
    const { monster, pets } = data;
    fetchImgUrl(monster?.path || pets[0].path, setMonImg);
  }
  //펫 리스트 데이터
  const fetchPetListData = () => {
    if (!myUserData || myUserData?.isTeacher) return
    const { myPetList: petList } = myUserData;
    setMyPetList(petList);
  }
  //이미지 다운로드
  const downloadImgList = () => {
    if (!myPetList) return
    const petPathList = myPetList.map(pet => pet.path);
    fetchImgUrlList([...petPathList,], setPetImgList);
  }
  //체크
  const check = () => {
    if (selectedLv && selectedPet) return true
    return false;
  }
  //펫버블
  const petBubbleOnClick = (pet) => {
    setSelectedPet(pet);
    setStep(2);
  }
  //몬스터
  const monBubbleOnClick = (level) => {
    setSeletedLv(level);
    setStep("start")
  }
  //멀티 플레이 방 입장 or 만들기
  const handleEnterMultiOnClick = () => {
    const confirm = window.confirm("방에 입장하시겠습니까?");
    if (!confirm) return
    if (selectedPet && selectedEnm) {
      enterGameroom({ gameId: selectedEnm.gameId, selectedPet });
      navigate("/multiplay", { state: selectedEnm.gameId });
    }
    else { alert("대전에 사용할 펫과 상대를 선택해 주세요.") }
  }
  //등록 취소
  const deleteBtnOnClick = () => {
    const confirm = window.confirm("이 퀴즈를 클래스에서 등록 해제하시겠습니까?");
    if (confirm) { deleteKlassroomArrayInfo(klassId, "addedQuizIdList", gameDetails.id); }
    navigate(-1);
  }
  //펫 선택;
  const handlePetOnClick = (item, index) => { setSelectedPet({ ...item, index }); }
  const handleMonLvOnClick = (level) => {
    setSeletedLv(level);
    if (check()) { setStep("start"); }
    else { alert("펫과 몬스터를 모두 선택해주세요."); }
  }
  //모바일 멀티플레이어
  const handleMultiroomOnClick = (room) => {
    const { players } = room;
    if (players.length !== 1) { window.alert("정원 초과입니다."); return; }
    const confirm = window.confirm("이 플레이어와 대전하시겠습니까?")
    if (confirm) {
      enterGameroom({ gameId: room.gameId, selectedPet });
      navigate("/multiplay", { state: room.gameId });
    }
  }
  //------랜더링-------------------------------------------------------
  const PetBubble = ({ pet, index }) => {
    const { petId, level, name, spec } = pet;
    return <MonsterWrapper key={petId} onClick={() => { petBubbleOnClick(pet) }}>
      <Column style={{ margin: "0 5px" }}>
        <SmlPetImg src={petImgList[index]} alt="현재 img" />
        <BasicText>Lv{level.level} {name}</BasicText>
      </Column>
      <Row style={{ alignItems: "center" }}><PetSpecUI spec={spec} styles={{ width: "200px", height: "80%" }} /></Row>
    </MonsterWrapper>
  }
  const MonBubble = ({ mon, index }) => {
    const { level, name, spec, exp } = mon;
    return <MonsterWrapper key={index} onClick={() => { monBubbleOnClick(level) }}>
      <Column style={{ margin: "0 5px" }}>
        <SmlPetImg src={monImg} alt="현재 img" />
        <BasicText>Lv{level} {name}</BasicText>
      </Column>
      <Row style={{ alignItems: "center" }}><PetSpecUI spec={spec} styles={{ width: "200px", height: "80%" }} /></Row>
      <Row style={{ alignItems: "center" }}><Highlight>Exp {exp} </Highlight></Row>
    </MonsterWrapper>
  }
  const MultiBubble = ({ room }) => {
    const { pets, players } = room;
    const number = players?.length;
    const pet = pets[0];
    const player = players[0];
    return <MonsterWrapper onClick={() => { handleMultiroomOnClick(room) }}>
      <Column style={{ margin: "0 5px" }}>
        <SmlPetImg src={player?.profileImg} alt="플레이어 펫 img" />
        <BasicText>{player?.name}</BasicText>
      </Column>
      <Row style={{ alignItems: "center" }}><PetSpecUI spec={pet.spec} styles={{ width: "200px", height: "80%" }} /></Row>
      <Column style={{ justifyContent: "center" }}>
        <Highlight>인원</Highlight>
        <Highlight>{number}/2</Highlight>
      </Column>
    </MonsterWrapper>
  }
  return (<>
    <Container>
      {/* 준비 */}
      {(step !== "start") && <>
        {(isMobile && step === 1) && myPetList.map((pet, index) => <PetBubble key={pet.petId} pet={pet} index={index} />)}
        {(isMobile && step === 2) &&
          <Column style={{ gap: "10px" }}>
            <MobileTitle>개인전</MobileTitle>
            {monsterList.map((mon, index) => <MonBubble key={index} mon={mon} index={index} />)}
            <MobileTitle>멀티플레이</MobileTitle>
            {multiroomList?.map((room) => <MultiBubble key={room.gameId} room={room} />)}
            {multiroomList.length === 0 && <p style={{ textAlign: "center", color: "#949192" }}> 현재 만들어진 방이 없습니다.</p>}
            <MainBtn onClick={() => { setIsGameroomModal(true); }}>멀티플레이 방만들기</MainBtn>
          </Column>}
        {!isMobile && <Column>
          <VsWrapper>
            <HalfWrapper><BigPetImg src={petImgList[selectedPet?.index] || question_icon} alt="내 펫" /></HalfWrapper>
            <p style={{ fontSize: "120px", fontWeight: "bold" }}>VS</p>
            <HalfWrapper><BigPetImg src={monImg || question_icon} alt='몬스터' /></HalfWrapper>
          </VsWrapper>
          <Row style={{ borderBottom: "1px solid rgba(120,120,120,0.5" }}>
            <HalfWrapper style={{ flexDirection: "column", borderRight: "1px solid rgba(120,120,120,0.5" }}><TitleText>펫 선택</TitleText>
              <CardList dataList={myPetList} onClick={handlePetOnClick} selected={selectedPet} type={"pet"} />
            </HalfWrapper>
            <HalfWrapper style={{ flexDirection: "column" }}>
              <TitleText>개인 플레이</TitleText>
              <Row style={{ gap: "10px", margin: "0 auto" }}>{monsterList?.map((item, index) => <SmallBtn key={index} onClick={() => { handleMonLvOnClick(item.level) }} >Lv{item.level}</SmallBtn>)}</Row>
              <TitleText>멀티플레이</TitleText>
              <Row style={{ gap: "10px", padding: "10px" }}>
                {multiroomList?.map((item) => {
                  const { pets, title, players, gameId } = item;
                  const pet = pets[0];
                  const player = players[0];
                  return <Column key={gameId} onClick={() => { setSelectedEnm(item) }} style={{ cursor: "pointer" }}  >
                    <PetImg path={pet?.path} styles={{ width: "100px", height: "100px", border: "1px solid gray", borderRadius: "50px" }} />
                    <p>{player?.name}님의{title}</p>
                  </Column>
                })}
                <PlusBtn onClick={() => { setIsGameroomModal(true); }} />
              </Row>
            </HalfWrapper>
          </Row>
        </Column>}
        <Row style={{ justifyContent: "center", marginTop: "20px", gap: "30px" }}>
          {user.isTeacher ? <>
            <MainBtn onClick={() => { setIsRankModal(true); }}>순위 보기</MainBtn>
            <MainBtn onClick={() => { deleteBtnOnClick(); }}>등록 취소</MainBtn>
          </> : <>{selectedEnm && <MainBtn onClick={handleEnterMultiOnClick}>대전 시작</MainBtn>}</>}
        </Row></>}
      {/* 시작 */}
      {(step === "start") && <QuizBattleSingleSection quizSetId={quizId} selectedPet={selectedPet} monsterDetails={monsterList[selectedLv - 1]} gameDetails={gameDetails} />}
    </Container>
    {/* 게임 순위 */}
    {gameRankInfo && <GameRankModal
      show={isRankModal}
      onHide={() => setIsRankModal(false)}
      result={gameRankInfo}
    />}
    {/* 게임방 만들기 */}
    <AddGameroomModal
      show={isGameroomModal}
      onHide={() => { setIsGameroomModal(false); }}
      selectedPet={selectedPet}
      quizId={quizId}
    />
  </>
  )
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)`
  flex-direction: column;
`
const Container = styled(Column)`
  box-sizing: border-box;
`
const VsWrapper = styled(Row)`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 600px;
  margin: 0 auto;
  border-bottom: solid black 25px;
  border-top: solid black 25px;
  align-items: center;
  background: linear-gradient(to right, #3454d1, #efefef, #9b0c24);
  overflow: hidden;
`
const HalfWrapper = styled(Row)`
  width: 50%;
  justify-content: center;
`
const MonsterWrapper = styled(Row)`
  justify-content: space-around;
  padding: 5px;
  border: 1px solid rgba(120,120,120,0.5);
  border-radius: 10px;
  gap: 2px;
  cursor: pointer;
`
const SmlPetImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 10px;
`
const BigPetImg = styled.img`
  width: 60%;
  overflow: hidden;
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
const MobileTitle = styled.h5`
  margin: 0;
  padding: 5px;
  text-align: center;
  background-color: #3454d1;
  color: white;
`
export default GameSettingPage