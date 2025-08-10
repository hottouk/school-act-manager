//라이브러리
import React from 'react'
import { Stage, Text } from '@pixi/react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
//컴포넌트
import Background from '../../components/Game/Background'
import PetSprite from '../../components/Game/PetSprite'
import Countdown from '../../components/Game/Countdown'
import MessageUI from '../../components/Game/MessageUI'
import QuizUI from '../../components/Game/QuizUI'
import ActionBallUI from '../../components/Game/ActionBallUI'
import MarkingUI from '../../components/Game/MarkingUI'
import BasicAttack from '../../components/Game/Skills/BasicAttack'
import BasicDefense from '../../components/Game/Skills/BasicDefense'
import BasicRest from '../../components/Game/Skills/BasicRest'
import DamageText from '../../components/Game/Skills/DamageText'
import HPBarUI from '../../components/Game/HPBarUI'
import SkillAttack from '../../components/Game/Skills/SkillAttack'
import BattleReport from '../../components/Game/BattleReport'
//이미지
import qustion_icon from '../../image/icon/question.png'
//생성(250809)
const PixiMobileStage = ({ background, phase, quizListRef, correctNumber, actionBall, messageList,
  myCurHp, mySpec, enmCurHp, enmSpec, enmImg, countdown, endCountCallback, curQuiz, marking,
  myActionEff, enmActionEff, enmDmg, skillEffMap, mySkillEff, enmSkillEff,
  result, rewardPoint, loser, countWinRecord, exp, isMulti }) => {
  const user = useSelector(({ user }) => user);
  const score = correctNumber * 100;
  const multiPlayResult = loser === user.uid ? "Lose" : "Win"
  const winCount = !isMulti ? rewardPoint - countWinRecord() : null;
  return (
    <Container>
      <Stage width={window.innerWidth} height={window.innerHeight} options={{ background: "#3454d1" }} >
        {/* 기본UI */}
        {background && <Background src={background || qustion_icon} x={0} y={0} width={window.innerWidth} height={window.innerHeight} />}
        <Text text={`문제: ${quizListRef.current.length}개`} x={window.innerWidth * 0.15} y={window.innerHeight * 0.035} anchor={0.5} style={{ fontSize: 16, fontWeight: 'bold', }} ></Text>
        <Text text={`점수: ${score}점`} x={window.innerWidth * 0.85} y={window.innerHeight * 0.035} anchor={0.5} style={{ fontSize: 16, fontWeight: 'bold', }} ></Text>
        <ActionBallUI x={0} y={window.innerHeight * 0.65} width={window.innerWidth} height={60} correctAnswer={actionBall} />
        <MessageUI messages={messageList} x={0} y={window.innerHeight * 0.75} width={window.innerWidth} height={175} styles={{ fontSize: 18 }} />
        <HPBarUI x={0} y={window.innerHeight * 0.63} width={window.innerWidth} height={12} curHp={myCurHp || 0} maxHp={mySpec?.hp || 0} />
        {/* 상대 pet */}
        <PetSprite src={enmImg || qustion_icon} x={window.innerWidth * 0.5} y={window.innerHeight * 0.2} width={window.innerHeight * 0.2} height={window.innerHeight * 0.2} />
        {!isMulti && <HPBarUI x={window.innerWidth * 0.29} y={window.innerHeight * 0.1} width={150} height={12} curHp={enmCurHp || 0} maxHp={enmSpec?.hp || 0} />}
        {/* 카운트다운 phase*/}
        {(countdown > 0) && <Countdown isCountdown={countdown > 0} count={countdown} endCountCallback={endCountCallback} x={window.innerWidth * 0.5} y={window.innerHeight * 0.5} />}
        {/* 퀴즈 phase*/}
        {(phase === "quiz") && <>
          <QuizUI quiz={curQuiz} x={window.innerWidth * 0.5} y={window.innerHeight * 0.5} width={250} height={80} pivotX={125} pivotY={40} />
          {marking === true && <MarkingUI x={window.innerWidth * 0.5} y={window.innerHeight * 0.5} radius={75} correct={marking} />}
          {marking === false && <MarkingUI x={window.innerWidth * 0.5} y={window.innerHeight * 0.5} crossSize={125} correct={marking} />}
        </>}
        {/* 배틀 phase */}
        {/* 내 펫 AddOn Eff: 내 데미지는 디자인상 제거 */}
        {(myActionEff && !mySkillEff) && <>
          <BasicAttack x={window.innerWidth * 0.5} y={window.innerHeight * 0.69} width={200} height={200} trigger={myActionEff === "atk"} />
          <BasicDefense x={window.innerWidth * 0.5} y={window.innerHeight * 0.80} radius={200} trigger={myActionEff === "def"} />
          <BasicRest x={window.innerWidth * 0.5} y={window.innerHeight * 0.69} size={50} thick={15} movingPoint={900} trigger={myActionEff === "rest"} />
        </>}
        {mySkillEff && <SkillAttack x={window.innerWidth * 0.5} y={window.innerHeight * 0.69} width={500} height={500} effect={mySkillEff} skillEffMap={skillEffMap} />}
        {/* 상대방 AddOn Eff */}
        {enmDmg && <DamageText x={window.innerWidth * 0.5} y={window.innerHeight * 0.2} value={enmDmg} type={"dmg"} />}
        {(enmActionEff && !enmSkillEff) && <>
          <BasicAttack x={window.innerWidth * 0.5} y={window.innerHeight * 0.2} width={150} height={150} trigger={enmActionEff === "atk"} />
          <BasicDefense x={window.innerWidth * 0.5} y={window.innerHeight * 0.2} radius={100} trigger={enmActionEff === "def"} />
          <BasicRest x={window.innerWidth * 0.5} y={window.innerHeight * 0.2} size={35} thick={10} movingPoint={300} trigger={enmActionEff === "rest"} />
        </>}
        {enmSkillEff && <SkillAttack x={window.innerWidth * 0.5} y={window.innerHeight * 0.2} width={250} height={250} effect={enmSkillEff} skillEffMap={skillEffMap} />}
        {/* 종료 phase */}
        {phase === "end" && <BattleReport x={0} y={0} result={isMulti ? multiPlayResult : result} correct={correctNumber} winCount={winCount} exp={exp} isMulti={isMulti} />}
      </Stage>
    </Container>
  )
}
const Container = styled.div`
	height: 100%;
	box-sizing: border-box;
	grid-row: 2/3;
`
export default PixiMobileStage
