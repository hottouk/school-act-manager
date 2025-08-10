import React from 'react'
import { useSelector } from 'react-redux';
import useFireUserData from '../../hooks/Firebase/useFireUserData';
import useFireGameData from '../../hooks/Firebase/useFireGameData';

const GameListener = ({ setMessageList, setOptionList }) => {
  const user = useSelector(({ user }) => user);
  const { updateUserArrayInfo } = useFireUserData();
  //퇴장 정보
  const exitInfoListener = (exitList) => {
    if (exitList.length === 0) return;
    const leftUserList = exitList.filter((left) => left.uid !== user.uid);
    if (leftUserList.length === 0 || !leftUserList) return;
    setMessageList((prev) => [...prev, `${exitList[exitList.length - 1].name}님이 퇴장하셨습니다.`]);
  }
  //스탠스 리스너
  const stanceListener = ({ stance, phase, battleActions, hasDone, battleTurn, stances }) => {
    if (phase !== "stance") return;
    if (stance) {
      setOptionList(battleActions[stance]);
      let text;
      if (stance === "atk") text = "공격";
      else if (stance === "def") text = "방어";
      else text = "휴식";
      setMessageList((prev) => [...prev, `당신의 펫이 ${text} 자세를 취합니다.`]);
      if (hasDone) setMessageList((prev) => [...prev, `${battleTurn}턴 ${text} 준비 완료`]);
    }
    else {
      setOptionList(stances);
      setMessageList((prev) => [...prev, `${battleTurn}턴에 어떤 행동을 할까요?`]);
    }
  }
  //내 이펙트 리스너
  const myActionEffListener = ({ myActionEff, stance, setActionBall }) => {
    if (myActionEff !== "atk") return;
    if (stance === "atk") setMessageList((prev) => [...prev, "상대와 공격을 주고받았다."]);
    if (stance === "def") {
      setActionBall((prev) => Math.min(prev + 1, 5));
      setMessageList((prev) => [...prev, "상대의 공격을 효과적으로 방어했다. 기력을 회복했다."]);
    }
    if (stance === "rest") {
      setActionBall((prev) => Math.max(prev - 1, 0));
      setMessageList((prev) => [...prev, "휴식 중에 훅 들어온 상대의 치명적인 공격!! 크흙!"]);
    }
  }
  //적 이펙트 리스너
  const enmActionEffListener = ({ enmActionEff, stance, setActionBall }) => {
    if (!stance) return;
    switch (stance) {
      case "atk":
        if (enmActionEff === "def") { setMessageList((prev) => [...prev, "상대가 내 공격을 방어했다. 상대가 기력을 회복했다."]); }
        else if (enmActionEff === "rest") {
          setMessageList((prev) => [...prev, "상대가 방심한 틈을 타 공격했다. 치명적 피해를 입혔다."]);
          setActionBall((prev) => Math.min(prev + 1, 5));
        }
        break;
      case "def":
        if (enmActionEff === "def") { setMessageList((prev) => [...prev, "서로 무의미한 방어를 했다. 아무일도 일어나지 않았다."]); }
        else if (enmActionEff === "rest") { setMessageList((prev) => [...prev, "무의미한 방어를 하는 나를 조롱하며 상대는 휴식을 취했다."]); }
        break;
      case "rest":
        if (enmActionEff === "def") { setMessageList((prev) => [...prev, "상대는 방어하느라 긴장하고있다. 그 와중에 나는 평화롭게 휴식을 취했다."]); }
        else if (enmActionEff === "rest") { setMessageList((prev) => [...prev, "서로 사이좋게 휴식했다. 평화는 좋은것!"]); }
        break;
      default:
        break;
    }
  }

  //결과 리스너
  const loserListener = ({ phase, loser, enmUserData, correctNumber }) => {
    if (phase !== "end") return;
    if (!loser || !enmUserData) return;
    const isLost = loser.uid !== user.uid;
    const score = isLost ? correctNumber * 100 / 2 : correctNumber * 100 * 2;
    const info = { enmId: enmUserData.uid, enmName: enmUserData.uid, result: isLost ? "Win" : "Lose", score }
    updateUserArrayInfo(user.uid, "rankGameRecord", info);
  }

  return { exitInfoListener, myActionEffListener, enmActionEffListener, loserListener, stanceListener }
}

export default GameListener
