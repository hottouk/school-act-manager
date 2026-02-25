import React, { useEffect, useState } from 'react'
import { appAuth, callJoinByBattleCode } from "../../firebase/config";
import { signInAnonymously } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import water_pet from '../../image/pets/pet_water_001_2_back.png';

const EnterroomPage = () => {
	const navigate = useNavigate();
	const [selectedPet, setSelectedPet] = useState(null);
	const petData = [{ atk: 10, def: 2, rest: 5, hp: 100 }]
	const [battleCode, setBattleCode] = useState('');
	const [nickname, setNickname] = useState('');
	const handleJoin = async () => {
		if (!selectedPet) { alert("펫 선택"); return; }
		console.log(battleCode, nickname)
		if (!battleCode || !nickname) { return; }
		if (!appAuth.currentUser) {
			try {
				await signInAnonymously(appAuth);
				// 토큰 강제 발급 확인
				await appAuth.currentUser?.getIdToken(true);
				const res = await callJoinByBattleCode({ battleCode: battleCode.trim(), nickname: nickname.trim(), pet: selectedPet });
				console.log("join ok:", res?.data);
				navigate("/battleroom", { state: { roomId: res?.data.roomId } });
			} catch (e) {
				console.error("auth code:", e.code, "message:", e.message);
			}
		} else {
			const res = await callJoinByBattleCode({ battleCode: battleCode.trim(), nickname: nickname.trim(), pet: selectedPet });
			console.log("join ok:", res?.data);
			navigate("/battleroom", { state: { roomId: res?.data.roomId } });
		}
	};

	return (
		<Column>
			<label>펫 선택</label>
			<PetImg src={water_pet} alt='물'
				onClick={() => { setSelectedPet(petData[0]); }} />
			<label>배틀코드</label>
			<input value={battleCode} onChange={(e) => setBattleCode(e.target.value)} />
			<label>닉네임</label>
			<input value={nickname} onChange={(e) => setNickname(e.target.value)} />
			<button onClick={handleJoin}>코드로 입장</button>
		</Column>
	)
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
const PetImg = styled.img`
	width: 150px;
	hegith: 150px;
	border: 1px solid #ddd;
	cursor: pointer;
`
export default EnterroomPage
