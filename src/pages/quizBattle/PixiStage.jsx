//라이브러리
import { Stage, Text } from '@pixi/react';
import styled from 'styled-components';
//섹션
import PixiMobileStage from './PixiMobileStage';
//컴포넌트
import Background from '../../components/Game/Background';
import MessageUI from '../../components/Game/MessageUI';
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
import SkillAttack from '../../components/Game/Skills/SkillAttack';
import DamageText from '../../components/Game/Skills/DamageText';
//이미지
import qustion_icon from '../../image/icon/question.png'
import monster from '../../image/monsters/mon_evil_002_3.png'
import waterPet from '../../image/pets/pet_water_001_2_back.png'
import { useEffect, useState } from 'react';
//250427 분리 확인
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
	score, myPetBackImg, bossImg,
	enmSpec, myActionEff, enmActionEff, skillEffMap, enmSkillEff, myDmg, enmDmg,
	result, correctNumber, rewardPoint, countWinRecord, exp, isMobile, }) => {
	//학생
	const MAX_VISIBLE_STUDENTS = 16;
	const visibleStudents = studentList?.slice(0, MAX_VISIBLE_STUDENTS) || [];
	const overflowCount = Math.max((studentList?.length || 0) - MAX_VISIBLE_STUDENTS, 0);
	const getStudentPos = (i) => {
		const cols = 4;
		const col = i % cols;
		const row = Math.floor(i / cols);
		// 1) 간격 좁히기
		const gapX = 125;
		const gapY = 115;
		// 2) 대각선 느낌 주기 (행이 내려갈수록 오른쪽으로 이동)
		const diagonalOffsetX = row * 28;
		const baseX = 120;
		const baseY = 540;
		return {
			x: baseX + col * gapX + diagonalOffsetX,
			y: baseY + row * gapY,
		};
	};
	return (<Container $isMobile={isMobile}>
		{!isMobile && <Stage width={1200} height={900}
			options={{ background: "#3454d1" }}
			onMount={(app) => {
				if (app.renderer?.events) { app.renderer.events.autoPreventDefault = false; }
				app.view.style.touchAction = 'pan-y';
			}}>
			{/* 배경화면 */}
			<Background src={background || qustion_icon} x={0} y={0} width={1200} height={900} />
			{/* 기본 UI */}
			<ActionBallUI x={775} y={820} width={400} height={60} correctAnswer={actionBall} />
			{/* 펫 */}
			{visibleStudents?.map((s, idx) => {
				console.log(s);
				const { x, y } = getStudentPos(idx, studentList.length);
				return (
					<>
						<PetSprite
							key={idx}
							src={s.petInfo?.backImg || waterPet}
							x={x}
							y={y}
							width={100}
							height={100}
							trigger={false}
							movingPoint
							={0}
						/>
						<Text
							text={`<${s.nickname}>`}
							style={{ fontSize: 15, fill: "black" }}
							x={x - 20}
							y={y + 50}
						/>
					</>
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
			<PetSprite src={bossImg || monster} x={900} y={330} width={600} height={600} trigger={myActionEff === "atk"} movingPoint={-35} />
			{/* HP */}
			{pets && <HPBarUI x={120} y={455} width={250} height={20} curHp={teamCurHp || pets.curHp} maxHp={pets.hp} />}
			{boss && <HPBarUI x={800} y={80} width={250} height={20} curHp={bossCurHp || boss.curHp} maxHp={boss.hp} />}
			{/* 카운트다운*/}
			{(countdown > 0) && <Countdown isCountdown={countdown > 0} count={countdown} endCountCallback={onDoneCountdown} x={600} y={450} />}
			{/* 퀴즈 phase*/}
			{(curQuiz && phase !== "ended") && <QuizUI quiz={curQuiz} x={600} y={350} width={250} height={80} pivotX={125} pivotY={40} />}
			{marking === true && <MarkingUI x={600} y={350} radius={75} correct={marking} />}
			{marking === false && <MarkingUI x={600} y={350} crossSize={125} correct={marking} />}
			{/* 내 펫 AddOn 이펙트 */}
			{animEvent?.type === "damageToTeam" && <DamageText x={250} y={500} value={animEvent?.value} />}
			{animEvent && <>
				<BasicAttack x={200} y={750} width={150} height={150} trigger={animEvent?.type === "damageToTeam"} />
				<BasicDefense x={100} y={750} radius={200} trigger={animEvent?.type === "damageToTeam"} />
				<BasicRest x={150} y={750} size={50} thick={15} movingPoint={900} trigger={animEvent?.type === "healToTeam"} />
			</>}
			{/* 상대 addOn 이펙트 */}
			{animEvent?.type === "damageToBoss" && <DamageText x={875} y={175} value={animEvent?.value} />}
			{animEvent && <>
				<BasicAttack x={950} y={175} width={75} height={75} trigger={animEvent?.type === "damageToBoss"} />
				<BasicDefense x={1000} y={200} radius={100} trigger={animEvent?.type === "damageToBoss"} />
				<BasicRest x={1000} y={255} size={35} thick={10} movingPoint={300} trigger={animEvent?.type === "healToBoss"} />
			</>}
			{/* 종료 phase */}
			{phase === "ended" && <BattleReport x={350} y={100} result={result} correct={correctNumber} score={0} winCount={10} exp={1} />}
		</Stage>}
		{/* {isMobile && <PixiMobileStage background={background} phase={phase} quizListRef={quizListRef} correctNumber={correctNumber} actionBall={actionBall} messageList={messageList}
			myCurHp={myCurHP} mySpec={mySpec} enmCurHp={enemyCurHP} enmSpec={enmSpec} enmImg={enmImg} countdown={countdown} endCountCallback={endCountdown} curQuiz={curQuiz} marking={marking}
			myActionEff={myActionEff} enmActionEff={enmActionEff} myDmg={myDmg} enmDmg={myDmg} skillEffMap={skillEffMap} enmSkillEff={enmSkillEff}
			result={result} rewardPoint={rewardPoint} countWinRecord={countWinRecord} exp={exp} isMulti={false}
		/>} */}
	</Container>
	)
}

const Container = styled.div`
	width: 100%;
	height: 100%;
	box-sizing: border-box;
`
export default PixiStage
