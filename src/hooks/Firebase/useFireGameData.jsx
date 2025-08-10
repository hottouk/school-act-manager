import React from 'react'
import { useSelector } from 'react-redux';
import { appFireStore } from '../../firebase/config';
import { addDoc, arrayUnion, collection, deleteDoc, deleteField, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';

const useFireGameData = () => {
	const user = useSelector(({ user }) => user);
	const db = appFireStore;
	const col = collection(db, "game");
	const TIMEOUT = 20000;
	//1. 게임방 생성
	const createGameroom = async ({ title, quizId, selectedPet, }) => {
		const { classId, level, spec, path, path_back, skills } = selectedPet;
		const userInfo = { uid: user.uid, name: user.name, isReady: false, profileImg: user.profileImg };
		const petInfo = { petId: user.uid, classId, level, spec, path, path_back: path_back || null, skills: skills || null };
		const petCurStat = { petId: user.uid, curHp: spec.hp, type: null };
		const docRef = await addDoc(col, {
			players: arrayUnion(userInfo), pets: arrayUnion(petInfo), petCurStat: arrayUnion(petCurStat),
			phase: "waiting", master: user.uid, quizId, title, battleTurn: Number(0)
		}).catch((error) => {
			alert(`관리자에게 문의하세요(useFireGameData_01), ${error}`);
			console.log(error);
		})
		return docRef.id;
	}
	//1-1. 게임 목록 실시간 구독
	const gameroomListDataListener = (callback, quizId) => {
		if (!quizId) return
		const q = query(collection(db, 'game'), where("quizId", "==", quizId));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const rooms = snapshot.docs.map((doc) => ({ gameId: doc.id, ...doc.data() }));
			if (rooms.length !== 0) { callback(rooms); }
			else { callback([]); }
		})
		return () => unsubscribe
	}
	//2. 게임방 들어가기
	const enterGameroom = async ({ gameId, selectedPet }) => {
		const gameroomDocRef = doc(col, gameId);
		const { classId, level, spec, path, path_back, skills } = selectedPet;
		const userInfo = { uid: user.uid, name: user.name, isReady: false, profileImg: user.profileImg };
		const petInfo = { petId: user.uid, classId, level, spec, path, path_back: path_back || null, skills: skills || null };
		const petCurStat = { petId: user.uid, curHp: selectedPet.spec.hp, type: null };
		await setDoc(gameroomDocRef, {
			players: arrayUnion(userInfo), pets: arrayUnion(petInfo),
			petCurStat: arrayUnion(petCurStat), phase: "waiting", exit: deleteField()
		}, { merge: true })
			.catch((error) => {
				alert(`관리자에게 문의하세요(useFireGameData_02), ${error}`);
				console.log(error);
			})
	}
	//3. 게임방 실시간 구독
	const gameroomListener = ({ gameId, callback }) => {
		if (!gameId) return
		const gameroomDocRef = doc(col, gameId);
		const unsubscribe = onSnapshot(gameroomDocRef, (snapshot) => {
			if (snapshot.exists()) { callback(snapshot.data()); } else { callback(null); }
		})
		return () => unsubscribe();
	}
	//4. 게임방 업데이트
	const updateGameroom = ({ gameId, info }) => {
		const gameroomDocRef = doc(col, gameId);
		updateDoc(gameroomDocRef, { ...info }).catch((error) => {
			alert(`관리자에게 문의하세요(useFireGameData_04), ${error}`);
			console.log(error);
		})
	}
	//5. 게임방 나가기
	const exitGameroom = async ({ gameId, petList, petCurList, playerList, exitList, enmUserData }) => {
		const gameroomDocRef = doc(col, gameId);
		const pets = petList.filter((pet) => pet.petId !== user.uid);
		const petCurStat = petCurList.filter((cur) => cur.petId !== user.uid);
		const players = playerList.filter((player) => player.uid !== user.uid);
		const exitInfo = { uid: user.uid, name: user.name };
		updateGameroom({ gameId, info: { pets, petCurStat, players, exit: [...exitList, exitInfo], master: enmUserData.uid } });
		const playerDocRef = doc(gameroomDocRef, "players", user.uid);
		await deleteDoc(playerDocRef).catch((error) => {
			alert(`관리자에게 문의하세요(useFireGameData_05), ${error}`);
			console.log(error);
		})
	}
	//6. 게임방 삭제
	const deleteGameRooom = (gameId) => {
		const gameroomDocRef = doc(col, gameId);
		const playerDocRef = doc(gameroomDocRef, "players", user.uid);
		deleteDoc(gameroomDocRef).catch((error) => {
			alert(`관리자에게 문의하세요(useFireGameData_06), ${error}`);
			console.log(error);
		});
		deleteDoc(playerDocRef).catch((error) => {
			alert(`관리자에게 문의하세요(useFireGameData_06), ${error}`);
			console.log(error);
		})
	}
	//5. 접속 신호 보내기
	const sendConnectSign = (gameId) => {
		if (!user.uid) return;
		const gameroomSubColDocRef = doc(col, `${gameId}/players/${user.uid}`);
		setDoc(gameroomSubColDocRef, { name: user.name, lastActive: serverTimestamp() }, { merge: true });
	}
	//6. 상대 접속 체크
	const gameroomSubColListener = (gameId, callback) => {
		const gameroomSubColRef = collection(col, `${gameId}/players`);
		onSnapshot(gameroomSubColRef, async (snapshot) => {
			const now = Date.now();
			let otherPlayer = null;
			snapshot.forEach(docSnap => { if (docSnap.id !== user.uid) otherPlayer = docSnap.data(); });
			const isActive = (now - otherPlayer?.lastActive?.toMillis()) < TIMEOUT;
			if (isActive) callback((true));
			else callback(false);
		})
	}

	return { createGameroom, gameroomListDataListener, enterGameroom, gameroomListener, updateGameroom, exitGameroom, deleteGameRooom, sendConnectSign, gameroomSubColListener }
}
export default useFireGameData
