import React, { useState } from 'react'
import { appAuth, callJoinByBattleCode } from "../../firebase/config";
import { signInAnonymously } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
// components
import MainBtn from '../../components/Btn/MainBtn';
import MainContainer from '../../components/Styled/MainContainer';
// img
import water_pet from '../../image/pets/pet_water_001_2.png';
import fire_pet from '../../image/pets/pet_fire_001_2.png';
import grass_pet from '../../image/pets/pet_grass_001_2.png';
import question_icon from '../../image/icon/question.png'
import GptIngModal from '../../components/Modal/gptModal/GptIngModal';
// data
import { petData } from '../../data/petData';
// create(260317)
const EnterroomPage = () => {
	const navigate = useNavigate();
	const [selectedPet, setSelectedPet] = useState(null);
	const [battleCode, setBattleCode] = useState('');
	const [nickname, setNickname] = useState('');
	// loading
	const [isLoading, setIsLoading] = useState(false);
	const handleJoin = async () => {
		if (!selectedPet) { alert("펫을 선택해주세요"); return; }
		if (!battleCode) { alert("배틀 코드를 입력해주세요"); return; }
		if (!nickname) { alert("닉네임을 입력해주세요"); return; }
		//todo 배틀 코드 틀렸을 때,
		console.log(battleCode, nickname)
		setIsLoading(true);
		try {
			if (!appAuth.currentUser) { // 익명 토큰 발급 확인
				await signInAnonymously(appAuth);
				await appAuth.currentUser?.getIdToken(true);
			}
			const res = await callJoinByBattleCode({
				battleCode: battleCode.trim(),
				nickname: nickname.trim(),
				pet: selectedPet
			});
			console.log("join ok:", res?.data);
			const data = res?.data;
			if (!data) { alert("방 정보를 얻어오지 못했습니다."); return; }
			const { roomId, pet } = data;
			navigate("/battleroom", { state: { roomId, pet } });
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	return (
		<>
			<MainContainer>
				<VsSection>
					<HalfWrapper>
						<BigPetImg
							key={selectedPet?.petImg || question_icon}
							src={selectedPet ? selectedPet.petImg : question_icon} alt="내 펫" />
					</HalfWrapper>
					<p style={{ fontSize: "120px", fontWeight: "bold" }}>VS</p>
					<HalfWrapper>
						<BigPetImg src={question_icon} alt='몬스터' />
					</HalfWrapper>
				</VsSection>
				<SelectSection>
					<h1 style={{ margin: "0 0 20px 0" }}>Select Your Partner</h1>
					<Row style={{ gap: "10px" }}>
						<PetImg src={water_pet} alt='물' onClick={() => { setSelectedPet(petData[0]); }} />
						<PetImg src={fire_pet} alt='불' onClick={() => { setSelectedPet(petData[1]); }} />
						<PetImg src={grass_pet} alt='풀' onClick={() => { setSelectedPet(petData[2]); }} />
					</Row>
				</SelectSection>
				{selectedPet && <SelectSection>
					<Row>
						<StatusWrapper>
							<StatText> {selectedPet.name}</StatText>
							<StatText>체력: {selectedPet.hp}</StatText>
							<StatText>공격력: {selectedPet.atk}</StatText>
							<StatText>방어력: {selectedPet.def}</StatText>
							<StatText>회복력: {selectedPet.rest}</StatText>
						</StatusWrapper>
						<StatusWrapper>
							<StatText> {selectedPet.des}</StatText>
						</StatusWrapper>
					</Row>
				</SelectSection>}
				<Column style={{ backgroundColor: "#ddd", padding: "20px", alignItems: "center", gap: "20px", flexGrow: "1" }}>
					<h2>배틀코드</h2>
					<TextInput value={battleCode} onChange={(e) => setBattleCode(e.target.value)} />
					<h2>닉네임</h2>
					<TextInput value={nickname} onChange={(e) => setNickname(e.target.value)} />
					<MainBtn
						styles={{ margin: "20px 0 0 0" }}
						onClick={handleJoin}>코드로 입장</MainBtn>
				</Column>
			</MainContainer>
			<GptIngModal
				show={isLoading}
				status={"방에 입장중 입니다."}
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
const VsSection = styled(Row)`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  margin: 0 auto;
	padding: 20px 0;
  border-bottom: solid black 25px;
  border-top: solid black 25px;
  align-items: center;
  background: linear-gradient(125deg, #3454d1, #efefef, #9b0c24);
  overflow: hidden;
`
const SelectSection = styled(Column)`
	background-color: #ddd;
	padding: 20px;
	border-bottom: solid #787878 1px;
`
// 애니메이션
const slideInFromLeft = keyframes`
  from {
    transform: translateX(-300px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`
const BigPetImg = styled.img`
  width: 60%;
  overflow: hidden;
	animation: ${slideInFromLeft} 0.4s ease;
`
const HalfWrapper = styled(Row)`
  width: 50%;
  justify-content: center;
`
const StatusWrapper = styled(Column)`
	margin: 0 auto;
	background-color: white;
	width: 30%;
	border-radius: 20px;
	padding: 10px;
	box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.25);
`
const StatText = styled.p`
	font-size: 22px;
	font-weight: 400;
	margin: 5px;
`
const TextInput = styled.input`
	width: 50%;
	height: 50px;
	border: none;
	border-radius: 10px;
	font-size: 33px;
	padding: 10px;
`
const PetImg = styled.img`
	width: 100px;
	hegith: 100px;
	border: 3px solid #787878;
	border-radius: 50px;
	cursor: pointer;
	&: hover { background-color: orange;	}
`
export default EnterroomPage
