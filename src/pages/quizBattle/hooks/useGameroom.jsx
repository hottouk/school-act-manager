import React, { useEffect, useRef, useState } from 'react'
import { appDatabase, } from "../../../firebase/config";
import { onValue, ref } from 'firebase/database';
import useFireBasic from '../../../hooks/Firebase/useFireBasic';
//생성(260220)
const useGameroom = (roomId) => {
	const { fetchDoc } = useFireBasic("quiz");
	useEffect(() => {
		const db = appDatabase;
		if (!roomId) return;
		//방
		const offRoom = onValue(ref(db, `rooms/${roomId}`),
			(snap) => { setRoom(snap.val() || null); });
		//플레이어
		const offPlayers = onValue(ref(db, `roomPlayers/${roomId}`),
			(snap) => { setPlayers(snap.val() || {}); },
			(err) => { console.error("onValue error:", err); }
		);
		return () => {
			offPlayers();
			offRoom();
		}
	}, [roomId]);
	//room
	const [players, setPlayers] = useState(null);
	const [room, setRoom] = useState(null);
	const [quizList, setQuizList] = useState([]);
	const [pets, setPets] = useState(null);
	const [boss, setBoss] = useState(null);
	const [bossStance, setBossStance] = useState(null);
	useEffect(() => {
		if (!room) return;
		const bindQuizList = async () => {
			const quiz = await fetchDoc(room.quizId);
			setQuizList(quiz.quizList);
			quizListRef.current = quiz.quizList;
		}
		if (!boss) { //초기 한번만
			console.log("초기값 로딩")
			bindQuizList();
		}
		setPets(room.pet);
		setBoss(room.boss);
		setPhase(room.status);
		setBossStance(room.bossStance || null);
	}, [room, fetchDoc, boss])
	const [phase, setPhase] = useState("waiting");
	const quizListRef = useRef({});
	return ({ players, room, phase, pets, boss, bossStance, quizList, quizListRef })
}

export default useGameroom
