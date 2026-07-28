export const QUESTIONS_PER_TURN = 5;

export const consumeQuestionsForTurn = (remainingQuestions) => {
  const remaining = Number(remainingQuestions);
  if (!Number.isInteger(remaining) || remaining < 0) {
    return {
      isTracked: false,
      usedQuestions: 0,
      nextRemainingQuestions: null,
      questionsExhausted: false,
    };
  }

  const usedQuestions = Math.min(QUESTIONS_PER_TURN, remaining);
  const nextRemainingQuestions = remaining - usedQuestions;

  return {
    isTracked: true,
    usedQuestions,
    nextRemainingQuestions,
    questionsExhausted: nextRemainingQuestions === 0,
  };
};

export const determineBattleOutcome = ({
  nextBossHp,
  nextPetHp,
  nextTurn,
  maxTurn,
  questionsExhausted,
}) => {
  if (nextBossHp <= 0) {
    return {endReason: "boss_dead", winner: "team"};
  }
  if (nextPetHp <= 0) {
    return {endReason: "team_dead", winner: "boss"};
  }
  if (questionsExhausted) {
    return {endReason: "questions_exhausted", winner: "boss"};
  }
  if (nextTurn > maxTurn) {
    return {
      endReason: "max_turn",
      winner: nextBossHp < nextPetHp ? "team" : "boss",
    };
  }
  return {endReason: null, winner: null};
};
