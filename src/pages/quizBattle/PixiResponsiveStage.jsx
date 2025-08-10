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
//250427 분리 확인
const PixiResponsiveStage = ({ isMobile, phase, background, messageList, quizListRef,
	countdown, endCountdown, curQuiz, marking, score, actionBall, mySpec, myCurHP, myPetBackImg, enmImg,
	enemyHP, enmSpec, enemyCurHP, myActionEff, enmActionEff, skillEffMap, enmSkillEff, myDmg, enmDmg,
	result, correctNumber, rewardPoint, countWinRecord, exp, }) => {
	return (<Container $isMobile={isMobile}>
		{!isMobile && <Stage width={1200} height={900} options={{ background: "#3454d1" }} >
			{/* 배경화면 */}
			<Background src={background || qustion_icon} x={0} y={0} width={1200} height={900} />
			{/* 기본 UI */}
			<Text text={`남은 문제: ${quizListRef.current.length}개`} x={150} y={50} anchor={0.5} style={{ fontSize: 24, fontWeight: 'bold', }} ></Text>
			<Text text={`현재 점수: ${score}점`} x={1050} y={50} anchor={0.5} style={{ fontSize: 24, fontWeight: 'bold', }} ></Text>
			<ActionBallUI x={350} y={600} width={400} height={60} correctAnswer={actionBall} />
			<MessageUI messages={messageList} x={350} y={700} width={800} height={175} />
			{/* 펫 */}
			<PetSprite src={myPetBackImg || qustion_icon} x={150} y={750} width={400} height={400} trigger={enmActionEff === "atk"} movingPoint={35} />
			<PetSprite src={enmImg || qustion_icon} x={1000} y={230} width={230} height={230} trigger={myActionEff === "atk"} movingPoint={-35} />
			<HPBarUI x={75} y={575} width={150} height={12} curHp={myCurHP} maxHp={mySpec?.hp || 0} />
			<HPBarUI x={925} y={120} width={150} height={12} curHp={enemyCurHP} maxHp={enemyHP || 0} />
			{/* 카운트다운*/}
			{(countdown > 0) && <Countdown isCountdown={countdown > 0} count={countdown} endCountCallback={endCountdown} x={600} y={450} />}
			{/* 퀴즈 phase*/}
			{(curQuiz && phase !== "end") && <QuizUI quiz={curQuiz} x={600} y={350} width={250} height={80} pivotX={125} pivotY={40} />}
			{marking === true && <MarkingUI x={600} y={350} radius={75} correct={marking} />}
			{marking === false && <MarkingUI x={600} y={350} crossSize={125} correct={marking} />}
			{/* 내 펫 AddOn 이펙트 */}
			{myDmg && <DamageText x={250} y={500} value={myDmg} />}
			{myActionEff && <>
				<BasicAttack x={200} y={750} width={150} height={150} trigger={myActionEff === "atk"} />
				<BasicDefense x={100} y={750} radius={200} trigger={myActionEff === "def"} />
				<BasicRest x={150} y={750} size={50} thick={15} movingPoint={900} trigger={myActionEff === "rest"} />
			</>}
			{/* 상대 addOn 이펙트 */}
			{enmDmg && <DamageText x={875} y={175} value={enmDmg} />}
			{(enmActionEff && !enmSkillEff) && <>
				<BasicAttack x={950} y={175} width={75} height={75} trigger={enmActionEff === "atk"} />
				<BasicDefense x={1000} y={200} radius={100} trigger={enmActionEff === "def"} />
				<BasicRest x={1000} y={255} size={35} thick={10} movingPoint={300} trigger={enmActionEff === "rest"} />
			</>}
			{enmSkillEff && <SkillAttack x={950} y={175} width={300} height={300} effect={enmSkillEff} skillEffMap={skillEffMap} />}
			{/* 종료 phase */}
			{phase === "end" && <BattleReport x={350} y={100} result={result} correct={correctNumber} src={enmImg} score={score} winCount={rewardPoint - countWinRecord()} exp={exp} />}
		</Stage>}
		{isMobile && <PixiMobileStage background={background} phase={phase} quizListRef={quizListRef} correctNumber={correctNumber} actionBall={actionBall} messageList={messageList}
			myCurHp={myCurHP} mySpec={mySpec} enmCurHp={enemyCurHP} enmSpec={enmSpec} enmImg={enmImg} countdown={countdown} endCountCallback={endCountdown} curQuiz={curQuiz} marking={marking}
			myActionEff={myActionEff} enmActionEff={enmActionEff} myDmg={myDmg} enmDmg={myDmg} skillEffMap={skillEffMap} enmSkillEff={enmSkillEff}
			result={result} rewardPoint={rewardPoint} countWinRecord={countWinRecord} exp={exp} isMulti={false}
		/>}
	</Container>
	)
}

const Container = styled.div`
	height: 100%;
	box-sizing: border-box;
	${({ $isMobile }) => $isMobile && "grid-row: 2/3"};
`
export default PixiResponsiveStage
