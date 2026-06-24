import React, { useState } from 'react'
import { appAuth, callJoinByBattleCode } from "../../../firebase/config";
import { signInAnonymously } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
// components
import MainBtn from '../../../components/Btn/MainBtn';
import MainContainer from '../../../components/Styled/MainContainer';
import GptIngModal from '../../../components/Modal/gptModal/GptIngModal';
// img
import water_pet from '../../../image/pets/pet_water_001_2.png';
import fire_pet from '../../../image/pets/pet_fire_001_2.png';
import grass_pet from '../../../image/pets/pet_grass_001_2.png';
import question_icon from '../../../image/icon/question.png'
// data
import { petData } from '../../../data/petData';
// create(260317)
const EnterroomPage = () => {
	const navigate = useNavigate();
	const [selectedPet, setSelectedPet] = useState(null);
	const [battleCode, setBattleCode] = useState('');
	const [nickname, setNickname] = useState('');
	// loading
	const [isLoading, setIsLoading] = useState(false);
	const [isInputMode, setIsInputMode] = useState(false);
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
			navigate("/quiz_game_stu", { state: { roomId, pet } });
		} catch (error) {
			console.log(error);
			window.alert(error?.message);
		}
		setIsLoading(false);
	};

	if (isInputMode) {
		return (
			<>
				<InputModeWrapper>
					<InputModeContainer>
						<BackButton onClick={() => setIsInputMode(false)}>← 뒤로가기</BackButton>
						<InputTitle>배틀 정보 입력</InputTitle>
						<InputLabel>배틀코드</InputLabel>
						<FullWidthInput
							value={battleCode}
							onChange={(e) => setBattleCode(e.target.value)}
							placeholder="배틀코드를 입력하세요"
						/>
						<InputLabel>닉네임</InputLabel>
						<FullWidthInput
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							placeholder="닉네임을 입력하세요"
						/>
						<SubmitButton onClick={handleJoin}>입장하기</SubmitButton>
					</InputModeContainer>
				</InputModeWrapper>
				<GptIngModal
					show={isLoading}
					status={"방에 입장중 입니다."}
				/>
			</>
		);
	}

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
					<PetInfoWrapper>
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
					</PetInfoWrapper>
				</SelectSection>}
				<Column style={{ backgroundColor: "#ddd", padding: "20px", alignItems: "center", gap: "20px", flexGrow: "1" }}>
					<MainBtn
						styles={{ margin: "20px 0 0 0" }}
						onClick={() => setIsInputMode(true)}>다음</MainBtn>
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
const PetInfoWrapper = styled(Row)`
	gap: 20px;
	@media screen and (max-width: 768px) {
		flex-direction: column;
	}
`
const StatusWrapper = styled(Column)`
	margin: 0 auto;
	background-color: white;
	width: 100%;
	border-radius: 20px;
	padding: 10px;
	box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.25);
`
const StatText = styled.p`
	font-size: 1.1rem;
	font-weight: 400;
	margin: 5px;
`
const PetImg = styled.img`
	width: 100px;
	height: 100px;
	border: 3px solid #787878;
	border-radius: 50px;
	cursor: pointer;
	&:hover { background-color: orange;	}
`
const InputModeWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	background: linear-gradient(125deg, #3454d1, #efefef, #9b0c24);
`
const InputModeContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	width: 90%;
	max-width: 500px;
	padding: 40px 30px;
	background: white;
	border-radius: 20px;
	box-shadow: 0 14px 36px rgba(25, 35, 60, 0.2);
	position: relative;
`
const BackButton = styled.button`
	position: absolute;
	top: 15px;
	left: 15px;
	padding: 8px 12px;
	background: #f0f0f0;
	border: 1px solid #ddd;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 600;
	color: #333;
	&:hover {
		background: #e0e0e0;
	}
`
const InputTitle = styled.h2`
	margin: 0 0 20px 0;
	font-size: 28px;
	font-weight: 700;
	color: #171b24;
	text-align: center;
`
const InputLabel = styled.label`
	width: 100%;
	font-size: 16px;
	font-weight: 600;
	color: #333;
	margin-top: 10px;
`
const FullWidthInput = styled.input`
	width: 100%;
	height: 50px;
	border: 2px solid #d9e1f2;
	border-radius: 10px;
	font-size: 16px;
	padding: 0 15px;
	box-sizing: border-box;
	outline: none;
	transition: border-color 0.3s;
	&:focus {
		border-color: #3454d1;
	}
`
const SubmitButton = styled.button`
	width: 100%;
	height: 50px;
	margin-top: 20px;
	border: 0;
	border-radius: 10px;
	background: #3454d1;
	color: #fff;
	cursor: pointer;
	font-size: 16px;
	font-weight: 700;
	transition: background 0.3s;
	&:hover {
		background: #243fba;
	}
	&:focus-visible {
		outline: 3px solid #171b24;
		outline-offset: 3px;
	}
`
export default EnterroomPage
