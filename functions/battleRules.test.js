import test from "node:test";
import assert from "node:assert/strict";
import {
  consumeQuestionsForTurn,
  determineBattleOutcome,
} from "./battleRules.js";

test("마지막 문제를 사용하고 보스가 살아 있으면 학생 팀이 패배한다", () => {
  const questionProgress = consumeQuestionsForTurn(3);
  const outcome = determineBattleOutcome({
    nextBossHp: 10,
    nextPetHp: 20,
    nextTurn: 2,
    maxTurn: 5,
    questionsExhausted: questionProgress.questionsExhausted,
  });

  assert.equal(questionProgress.nextRemainingQuestions, 0);
  assert.deepEqual(outcome, {
    endReason: "questions_exhausted",
    winner: "boss",
  });
});

test("마지막 문제의 공격으로 보스를 쓰러뜨리면 학생 팀이 승리한다", () => {
  const questionProgress = consumeQuestionsForTurn(1);
  const outcome = determineBattleOutcome({
    nextBossHp: 0,
    nextPetHp: 20,
    nextTurn: 2,
    maxTurn: 5,
    questionsExhausted: questionProgress.questionsExhausted,
  });

  assert.deepEqual(outcome, {endReason: "boss_dead", winner: "team"});
});

test("문제가 남고 최대 턴 전이면 게임을 계속한다", () => {
  const questionProgress = consumeQuestionsForTurn(8);
  const outcome = determineBattleOutcome({
    nextBossHp: 10,
    nextPetHp: 20,
    nextTurn: 2,
    maxTurn: 5,
    questionsExhausted: questionProgress.questionsExhausted,
  });

  assert.equal(questionProgress.nextRemainingQuestions, 3);
  assert.deepEqual(outcome, {endReason: null, winner: null});
});
