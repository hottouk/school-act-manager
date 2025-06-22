//라이브러리
import { Stage, Text } from '@pixi/react';
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
//이미지
import qustion_icon from '../../image/icon/question.png'

//250427 분리 확인
const PixiResponsiveStage = ({ isMobile, phase, background, message, quizListRef, curQuiz, marking, score, actionBall,
	myPetImg, myPetInfo, myHP, myCurHP, isMyAttack, isMyDefense, isMyRest, myPetBackImg, isMySkillAttack,
	enmImg, monsterInfo, enmLevel, enemyHP, enemyCurHP, enemyAttck, enemyDef, enmSpd, isEnmAttack, isEnmDefense, isEnmRest,
	isCountdown, setIsCountdown, setPhase, result, correctNumber, rewardPoint, countWinRecord, exp }) => {

	return (<>
		{!isMobile && <Stage width={1200} height={900} options={{ background: "#3454d1" }} >
			{/* 배경화면 */}
			<Background src={background || qustion_icon} x={0} y={0} width={1200} height={900} />
			{/* 기본 UI */}
			<MessageUI msg={message} x={350} y={700} width={800} height={175} />
			<Text text={`남은 문제: ${quizListRef.current.length}개`} x={150} y={50} anchor={0.5} style={{ fontSize: 24, fontWeight: 'bold', }} ></Text>
			<Text text={`현재 점수: ${score}점`} x={1050} y={50} anchor={0.5} style={{ fontSize: 24, fontWeight: 'bold', }} ></Text>
			{/* 준비창 phase */}
			{(phase === "ready") && <>
				<PetSprite src={myPetImg || qustion_icon} x={350} y={200} width={150} height={150} trigger={isEnmAttack} />
				<MessageUI x={200} y={300} width={300} height={275}
					msg2={`이름: ${myPetInfo?.name || "??"}\n레벨: ${myPetInfo?.level?.level || 1}\n체력: ${myPetInfo?.spec.hp || "??"}\n공격력: ${myPetInfo?.spec.atk || "??"}\n방어력: ${myPetInfo?.spec.def ?? "??"}\n스피드: ${myPetInfo?.spec.spd || "??"}`} />
				<Text text='vs' x={600} y={450} anchor={0.5} style={{ fontSize: 60, fontWeight: 'bold', }} ></Text>
				<PetSprite src={enmImg || qustion_icon} x={850} y={200} width={150} height={150} trigger={isEnmAttack} />
				<MessageUI x={700} y={300} width={300} height={275}
					msg2={`이름: ${monsterInfo.name}\n레벨: ${enmLevel}\n체력: ${enemyHP}\n공격력: ${enemyAttck}\n방어력: ${enemyDef}\n스피드: ${enmSpd}`} />
			</>}
			{/* 카운트다운 phase*/}
			{(phase === "countdown") && <Countdown isCountdown={isCountdown} setIsCountdown={setIsCountdown} setPhase={setPhase} x={600} y={450} />}

			{/* 퀴즈 phase */}
			{(phase !== "ready" && phase !== "end") && <>
				{/* 내 펫몬 */}
				{<HPBarUI x={75} y={575} width={150} height={12} curHp={myCurHP} maxHp={myHP} />}
				<PetSprite src={myPetBackImg || qustion_icon} x={150} y={750} width={400} height={400} trigger={isMyAttack} movingPoint={35} />
				{/* 상대 펫몬 */}
				<HPBarUI x={925} y={120} width={150} height={12} curHp={enemyCurHP} maxHp={enemyHP} />
				<PetSprite src={enmImg || qustion_icon} x={1000} y={230} width={230} height={230} trigger={isEnmAttack} movingPoint={-35} />
				<ActionBallUI x={350} y={600} width={400} height={60} correctAnswer={actionBall} />
			</>}
			{/* 퀴즈 phase*/}
			{(curQuiz && phase !== "end") && <QuizUI quiz={curQuiz} x={600} y={350} width={250} height={80} pivotX={125} pivotY={40} />}
			{marking === true && <MarkingUI x={600} y={350} radius={75} correct={marking} />}
			{marking === false && <MarkingUI x={600} y={350} crossSize={125} correct={marking} />}

			{/* 배틀 phase */}
			{/* 내 이펙트 */}
			<BasicAttack x={950} y={175} width={75} height={75} trigger={isMyAttack} />
			<BasicDefense x={100} y={750} radius={200} trigger={isMyDefense} />
			<BasicRest x={150} y={750} size={50} thick={15} movingPoint={900} trigger={isMyRest} />
			<SkillAttack x={950} y={175} width={300} height={300} trigger={isMySkillAttack} />
			{/* 상대 이펙트 */}
			<BasicAttack x={200} y={750} width={150} height={150} trigger={isEnmAttack} />
			<BasicDefense x={1000} y={200} radius={100} trigger={isEnmDefense} />
			<BasicRest x={1000} y={255} size={35} thick={10} movingPoint={300} trigger={isEnmRest} />
			{/* 종료 phase */}
			{phase === "end" && <BattleReport x={350} y={100} result={result} correct={correctNumber} src={enmImg} score={score} winCount={rewardPoint - countWinRecord()} exp={exp} />}
		</Stage>}
		{isMobile && <Stage width={window.innerWidth} height={window.innerHeight} options={{ background: "#3454d1" }} >
			{/* 배경화면 */}
			<Background src={background || qustion_icon} x={0} y={0} width={window.innerWidth} height={window.innerHeight} />

			<Text text={`문제: ${quizListRef.current.length}개`} x={window.innerWidth * 0.15} y={window.innerHeight * 0.035} anchor={0.5} style={{ fontSize: 16, fontWeight: 'bold', }} ></Text>
			<Text text={`점수: ${score}점`} x={window.innerWidth * 0.85} y={window.innerHeight * 0.035} anchor={0.5} style={{ fontSize: 16, fontWeight: 'bold', }} ></Text>
			{/* 준비창 phase */}
			{(phase === "ready") && <>
				<PetSprite src={enmImg || qustion_icon} x={window.innerWidth * 0.5} y={window.innerHeight * 0.2} width={window.innerHeight * 0.2} height={window.innerHeight * 0.2} trigger={isEnmAttack} />
				<MessageUI x={window.innerWidth * 0.25} y={window.innerHeight * 0.32} width={200} height={215} styles={{ fontSize: 16, lineHeight: 30 }}
					msg2={`이름: ${monsterInfo.name}\n레벨: ${enmLevel}\n체력: ${enemyHP}\n공격력: ${enemyAttck}\n방어력: ${enemyDef}\n스피드: ${enmSpd}`} />
			</>}
			{/* 카운트다운 phase*/}
			{(phase === "countdown") && <Countdown isCountdown={isCountdown} setIsCountdown={setIsCountdown} setPhase={setPhase} x={window.innerWidth * 0.5} y={window.innerHeight * 0.5} />}

			{/* 퀴즈 phase*/}
			{(curQuiz && phase !== "end") && <QuizUI quiz={curQuiz} x={window.innerWidth * 0.5} y={window.innerHeight * 0.5} width={250} height={80} pivotX={125} pivotY={40} />}
			{marking === true && <MarkingUI x={window.innerWidth * 0.5} y={window.innerHeight * 0.5} radius={75} correct={marking} />}
			{marking === false && <MarkingUI x={window.innerWidth * 0.5} y={window.innerHeight * 0.5} crossSize={125} correct={marking} />}
			{/* 배틀 phase */}
			{/* 내 이펙트 */}
			<BasicDefense x={window.innerWidth * 0.5} y={window.innerHeight * 0.69} radius={200} trigger={isMyDefense} />
			{/* 상대 이펙트 */}
			<BasicDefense x={window.innerWidth * 0.5} y={window.innerHeight * 0.35} radius={100} trigger={isEnmDefense} />
			<BasicRest x={window.innerWidth * 0.5} y={window.innerHeight * 0.35} size={35} thick={10} movingPoint={300} trigger={isEnmRest} />
			{/* 기본 UI */}
			<MessageUI msg={message} x={0} y={window.innerHeight * 0.78} width={window.innerWidth} height={175} styles={{ fontSize: 16 }} />
			{/* 퀴즈 phase */}
			{(phase !== "ready" && phase !== "end") && <>
				{<HPBarUI x={0} y={window.innerHeight * 0.65} width={window.innerWidth} height={12} curHp={myCurHP} maxHp={myHP} />}
				<ActionBallUI x={0} y={window.innerHeight * 0.69} width={window.innerWidth} height={60} correctAnswer={actionBall} />
				{/* 상대 펫몬 */}
				<HPBarUI x={window.innerWidth * 0.32} y={window.innerHeight * 0.25} width={150} height={12} curHp={enemyCurHP} maxHp={enemyHP} />
				<PetSprite src={enmImg || qustion_icon} x={window.innerWidth * 0.5} y={window.innerHeight * 0.35} width={175} height={175} trigger={isEnmAttack} movingPoint={-35} />
			</>}
			{/* 상대 이펙트 중 공격 */}
			<BasicAttack x={window.innerWidth * 0.5} y={window.innerHeight * 0.69} width={200} height={200} trigger={isEnmAttack} />
			{/* 내 이펙트 중 휴식, 공격 */}
			<SkillAttack x={window.innerWidth * 0.5} y={window.innerHeight * 0.35} width={300} height={300} trigger={isMySkillAttack} />
			<BasicAttack x={window.innerWidth * 0.5} y={window.innerHeight * 0.35} width={150} height={150} trigger={isMyAttack} />
			<BasicRest x={window.innerWidth * 0.5} y={window.innerHeight * 0.69} size={50} thick={15} movingPoint={900} trigger={isMyRest} />

			{/* 종료 phase */}
			{phase === "end" && <BattleReport x={0} y={100} result={result} correct={correctNumber} src={enmImg} score={score} winCount={rewardPoint - countWinRecord()} exp={exp} />}
		</Stage>}
	</>
	)
}

export default PixiResponsiveStage
