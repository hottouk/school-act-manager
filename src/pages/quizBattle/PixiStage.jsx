//라이브러리
import React from 'react';
import { Container as PixiContainer, Graphics, Stage, Text } from '@pixi/react';
import styled from 'styled-components';
//컴포넌트
import Background from '../../components/Game/Background';
import PetSprite from '../../components/Game/PetSprite';
import Countdown from '../../components/Game/Countdown';
import HPBarUI from '../../components/Game/HPBarUI';
import ActionBallUI from '../../components/Game/ActionBallUI';
import QuizUI from '../../components/Game/QuizUI';
import BasicAttack from '../../components/Game/Skills/BasicAttack';
import BasicDefense from '../../components/Game/Skills/BasicDefense';
import BasicRest from '../../components/Game/Skills/BasicRest';
import MarkingUI from '../../components/Game/MarkingUI';
import BattleReport from '../../components/Game/BattleReport';
//이미지
import qustion_icon from '../../image/icon/question.png'
import monster from '../../image/monsters/mon_evil_002_3.png'
import monster_back from '../../image/monsters/mon_evil_002_3_back.png'
import waterPet from '../../image/pets/pet_water_001_2_back.png'
//250427 분리 확인
const DEFENSE_EFFECT_DURATION = 1800;
const STUDENT_NAME_MAX_LENGTH = 7;

const formatStudentNickname = (nickname) => {
	const safeNickname = String(nickname || '학생').trim() || '학생';
	return safeNickname.length > STUDENT_NAME_MAX_LENGTH
		? `${safeNickname.slice(0, STUDENT_NAME_MAX_LENGTH)}...`
		: safeNickname;
};

const StudentNameTag = ({ nickname, x, y }) => {
	const displayName = formatStudentNickname(nickname);
	const paddingX = 12;
	const badgeHeight = 26;
	const badgeWidth = Math.max(64, Math.min(118, displayName.length * 12 + paddingX * 2));
	const badgeX = -badgeWidth / 2;
	const badgeY = -badgeHeight / 2;

	const drawBadge = (g) => {
		g.clear();
		g.beginFill(0x111827, 0.18);
		g.drawRoundedRect(badgeX + 2, badgeY + 3, badgeWidth, badgeHeight, 10);
		g.endFill();
		g.lineStyle(2, 0x3454d1, 0.9);
		g.beginFill(0xffffff, 0.9);
		g.drawRoundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 10);
		g.endFill();
	};

	return (
		<PixiContainer x={x} y={y}>
			<Graphics draw={drawBadge} />
			<Text
				text={displayName}
				anchor={0.5}
				style={{
					fontSize: 14,
					fontWeight: 'bold',
					fill: 0x1f2937,
					stroke: 0xffffff,
					strokeThickness: 2,
				}}
			/>
		</PixiContainer>
	);
};

const BattleCodePanel = ({ battleCode, x, y }) => {
	const safeCode = String(battleCode || '없음').trim() || '없음';
	const panelWidth = 430;
	const panelHeight = 170;
	const panelX = -panelWidth / 2;
	const panelY = -panelHeight / 2;

	const drawPanel = (g) => {
		g.clear();
		g.beginFill(0x111827, 0.22);
		g.drawRoundedRect(panelX + 6, panelY + 8, panelWidth, panelHeight, 18);
		g.endFill();
		g.lineStyle(3, 0x3454d1, 0.95);
		g.beginFill(0xffffff, 0.94);
		g.drawRoundedRect(panelX, panelY, panelWidth, panelHeight, 18);
		g.endFill();
	};

	return (
		<PixiContainer x={x} y={y}>
			<Graphics draw={drawPanel} />
			<Text
				text="배틀 코드"
				x={0}
				y={-46}
				anchor={0.5}
				style={{
					fontSize: 28,
					fontWeight: 'bold',
					fill: 0x3454d1,
				}}
			/>
			<Text
				text={safeCode}
				x={0}
				y={24}
				anchor={0.5}
				style={{
					fontSize: 56,
					fontWeight: 'bold',
					fill: 0x111827,
					letterSpacing: 8,
					stroke: 0xffffff,
					strokeThickness: 3,
				}}
			/>
		</PixiContainer>
	);
};

const PixiStage = ({
	background, studentList,
	countdown = 0,
	onDoneCountdown,
	curQuiz = null,
	marking = null,
	actionBall,
	phase,
	pets,
	boss,
	teamCurHp,
	bossCurHp,
	animEvent,
	battleCode,
	isTeacherView = false,
	result, correctNumber, battleStats, battleRankings, isMobile, }) => {
	//학생
	const MAX_VISIBLE_STUDENTS = 16;
	const visibleStudents = studentList?.slice(0, MAX_VISIBLE_STUDENTS) || [];
	const overflowCount = Math.max((studentList?.length || 0) - MAX_VISIBLE_STUDENTS, 0);
	const activeEvents = Array.isArray(animEvent?.events) ? animEvent.events : animEvent ? [animEvent] : [];
	const hasEvent = (actor, action) => activeEvents.some((event) => event.actor === actor && event.action === action);
	const findEvent = (effect) => activeEvents.find((event) => event.effect === effect);
	const damageToTeamEvent = findEvent("damageToTeam");
	const damageToBossEvent = findEvent("damageToBoss");
	const defenseToTeamEvent = findEvent("defenseToTeam");
	const defenseToBossEvent = findEvent("defenseToBoss");
	const healToTeamEvent = findEvent("healToTeam");
	const healToBossEvent = findEvent("healToBoss");
	const isStudentAttack = hasEvent("student", "atk");
	const isStudentDefense = hasEvent("student", "def");
	const isStudentRest = hasEvent("student", "rest");
	const isBossAttack = hasEvent("boss", "atk");
	const isBossDefense = hasEvent("boss", "def");
	const isBossRest = hasEvent("boss", "rest");
	const studentRestEffect = isTeacherView
		? { size: 70, thick: 20, movingPoint: 1050 }
		: { size: 50, thick: 15, movingPoint: 900 };
	const bossRestEffect = isTeacherView
		? { size: 55, thick: 16, movingPoint: 420 }
		: { size: 35, thick: 10, movingPoint: 300 };
	// 학생 위치
	const getStudentPos = (i) => {
		const cols = 4;
		const col = i % cols;
		const row = Math.floor(i / cols);
		// 1) 간격 좁히기
		const gapX = 125;
		const gapY = 115;
		// 2) 대각선 느낌 주기 (행이 내려갈수록 오른쪽으로 이동)
		const diagonalOffsetX = row * 28;
		const baseX = isTeacherView ? 800 : 120;
		const baseY = isTeacherView ? 330 : 540;
		return {
			x: baseX + col * gapX + diagonalOffsetX,
			y: baseY + row * gapY,
		};
	};
	const getStudentPetImg = (student) => {
		if (isTeacherView) {
			return student.pet?.petImg || waterPet;
		}
		return student.pet?.backImg || waterPet;
	};
	const bossX = isTeacherView ? 350 : 900;
	return (<Container $isMobile={isMobile}>
		{!isMobile && <Stage width={1200} height={900}
			options={{ background: "#3454d1" }}
			onMount={(app) => {
				if (app.renderer?.events) { app.renderer.events.autoPreventDefault = false; }
				app.view.style.touchAction = 'pan-y';
			}}>
			{/* 배경화면 */}
			<Background src={background || qustion_icon} x={0} y={0} width={1200} height={900} />
			{/* ActionBall */}
			<ActionBallUI x={775} y={820} width={400} height={60} correctAnswer={actionBall} />
			{/* 펫 */}
			{visibleStudents?.map((s, idx) => {
				const { x, y } = getStudentPos(idx, studentList.length);
				return (
					<React.Fragment key={s.uid || idx}>
						<PetSprite
							src={getStudentPetImg(s)}
							x={x}
							y={y}
							width={120}
							height={120}
							trigger={isStudentAttack}
							movingPoint={20}
						/>
						<StudentNameTag nickname={s.nickname} x={x} y={y + 56} />
					</React.Fragment>
				);
			})}
			{overflowCount > 0 && (
				<Text
					text={`+${overflowCount}`}
					x={120}
					y={850}
					anchor={0.5}
					style={{ fontSize: 44, fontWeight: 'bold', fill: "black" }}
				/>
			)}
			{/* 보스 */}
			<PetSprite src={isTeacherView ? monster_back : monster} x={bossX} y={isTeacherView ? 630 : 330} width={600} height={600} trigger={isBossAttack} movingPoint={isTeacherView ? 35 : -35} />
			{/* HP */}
			{pets && <HPBarUI x={isTeacherView ? 800 : 120} y={isTeacherView ? 80 : 455} width={250} height={20} curHp={teamCurHp || pets.curHp} maxHp={pets.hp} />}
			{boss && <HPBarUI x={isTeacherView ? 120 : 800} y={isTeacherView ? 455 : 80} width={250} height={20} curHp={bossCurHp || boss.curHp} maxHp={boss.hp} />}
			{/* 카운트다운*/}
			{(countdown > 0) && <Countdown isCountdown={countdown > 0} count={countdown} endCountCallback={onDoneCountdown} x={600} y={450} />}
			{/* 퀴즈 phase*/}
			{(curQuiz && phase !== "ended") && <QuizUI quiz={curQuiz} x={600} y={350} width={250} height={80} pivotX={125} pivotY={40} />}
			{curQuiz && phase === "quiz" && marking === true && <MarkingUI x={600} y={350} radius={75} correct={marking} />}
			{curQuiz && phase === "quiz" && marking === false && <MarkingUI x={600} y={350} crossSize={125} correct={marking} />}
			{phase === "waiting" && battleCode && <BattleCodePanel battleCode={battleCode} x={600} y={330} />}
			{/* 이펙트 */}
			{animEvent && <>
				<BasicAttack x={isTeacherView ? 950 : 200} y={isTeacherView ? 175 : 750} width={150} height={150} trigger={isBossAttack} value={damageToTeamEvent?.value} />
				<BasicDefense x={isTeacherView ? 900 : 320} y={isTeacherView ? 330 : 650} radius={230} trigger={isStudentDefense} value={defenseToTeamEvent?.value} durationMs={DEFENSE_EFFECT_DURATION} />
				<BasicRest x={isTeacherView ? 1000 : 150} y={isTeacherView ? 255 : 750} size={studentRestEffect.size} thick={studentRestEffect.thick} movingPoint={studentRestEffect.movingPoint} trigger={isStudentRest} value={healToTeamEvent?.value} />
			</>}
			{animEvent && <>
				<BasicAttack x={isTeacherView ? 200 : 950} y={isTeacherView ? 750 : 175} width={150} height={75} trigger={isStudentAttack} value={damageToBossEvent?.value} />
				<BasicDefense x={isTeacherView ? 320 : 900} y={isTeacherView ? 650 : 330} radius={260} trigger={isBossDefense} value={defenseToBossEvent?.value} durationMs={DEFENSE_EFFECT_DURATION} />
				<BasicRest x={isTeacherView ? 150 : 1000} y={isTeacherView ? 750 : 235} size={bossRestEffect.size} thick={bossRestEffect.thick} movingPoint={bossRestEffect.movingPoint} trigger={isBossRest} value={healToBossEvent?.value} />
			</>}
			{/* 종료 phase */}
			{phase === "ended" && <BattleReport x={350} y={100} result={result} correct={correctNumber} battleStats={battleStats} battleRankings={battleRankings} winCount={10} exp={1} />}
		</Stage>}
	</Container>
	)
}

const Container = styled.div`
	width: 100%;
	height: 100%;
	box-sizing: border-box;
`
export default PixiStage
