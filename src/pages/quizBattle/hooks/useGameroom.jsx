import { useEffect, useRef, useState } from 'react'
import { appDatabase, } from "../../../firebase/config";
import { onValue, ref } from 'firebase/database';
import useFireBasic from '../../../hooks/Firebase/useFireBasic';
//생성(260220)
const useGameroom = (roomId) => {
	const { fetchDoc } = useFireBasic("quiz");
	useEffect(() => {
		const db = appDatabase;
		if (!roomId) return;
		setIsRoomResolved(false);
		//방
		const offRoom = onValue(ref(db, `rooms/${roomId}`),
			(snap) => {
				setRoom(snap.val() || null);
				setIsRoomResolved(true);
			});
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
	const [isRoomResolved, setIsRoomResolved] = useState(false);
	const [quizList, setQuizList] = useState([]);
	const [pets, setPets] = useState(null);
	const [boss, setBoss] = useState(null);
	const [bossStance, setBossStance] = useState(null);
	const [phase, setPhase] = useState("waiting");
	const quizListRef = useRef([]);
	const quizId = room?.quizId;
	const isRoomLoaded = room !== null;

	useEffect(() => {
		if (!room) return;
		setPets(room.pet);
		setBoss(room.boss);
		setPhase(room.status);
		setBossStance(room.bossStance || null);
	}, [room])

	useEffect(() => {
		if (!isRoomLoaded) return;
		let isActive = true;

		const bindQuizList = async () => {
			if (!quizId) {
				console.error("퀴즈 목록 로딩 실패: 게임방에 quizId가 없습니다.");
				setQuizList([]);
				quizListRef.current = [];
				return;
			}

			try {
				const quiz = await fetchDoc(quizId);
				const nextQuizList = Array.isArray(quiz?.quizList) ? quiz.quizList : [];

				if (!quiz) {
					console.error(`퀴즈 목록 로딩 실패: quiz/${quizId} 문서가 없습니다.`);
				} else if (!Array.isArray(quiz.quizList)) {
					console.error(`퀴즈 목록 로딩 실패: quiz/${quizId}의 quizList가 배열이 아닙니다.`);
				}

				if (!isActive) return;
				setQuizList(nextQuizList);
				quizListRef.current = [...nextQuizList];
			} catch (error) {
				console.error("퀴즈 목록 로딩 중 오류가 발생했습니다.", error);
				if (!isActive) return;
				setQuizList([]);
				quizListRef.current = [];
			}
		}

		bindQuizList();
		return () => { isActive = false; };
	}, [isRoomLoaded, quizId, fetchDoc])

	return ({ players, room, isRoomResolved, phase, pets, boss, bossStance, quizList, quizListRef })
}

export default useGameroom
