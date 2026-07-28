import test from "node:test";
import assert from "node:assert/strict";
import {
  BATTLE_PREMIUM_PRICE,
  PremiumPurchaseRuleError,
  createBattlePremiumPurchasePlan,
  isValidPremiumPurchaseRequestId,
} from "./premiumPurchaseRules.js";
import {BATTLE_PREMIUM_DURATION_MS} from "./premiumRules.js";

const NOW = Date.UTC(2026, 6, 27, 0, 0, 0);

test("잔액이 정확히 3,300리라이면 전액 차감하고 30일을 부여한다", () => {
  const plan = createBattlePremiumPurchasePlan({
    userData: {isTeacher: true, rira: BATTLE_PREMIUM_PRICE},
    now: NOW,
  });

  assert.equal(plan.kind, "purchase");
  assert.equal(plan.balanceBefore, 3300);
  assert.equal(plan.balanceAfter, 0);
  assert.equal(plan.premiumUntilMillis, NOW + BATTLE_PREMIUM_DURATION_MS);
});

test("잔액이 3,300리라보다 적으면 구매를 거절한다", () => {
  assert.throws(
      () => createBattlePremiumPurchasePlan({
        userData: {
          isTeacher: true,
          rira: BATTLE_PREMIUM_PRICE - 1,
        },
        now: NOW,
      }),
      (error) => (
        error instanceof PremiumPurchaseRuleError &&
        error.code === "failed-precondition" &&
        error.message === "리라 잔액이 부족합니다."
      ),
  );
});

test("이용 기간이 남아 있으면 기존 만료일에서 30일을 연장한다", () => {
  const currentPremiumUntil = NOW + 5 * 24 * 60 * 60 * 1000;
  const plan = createBattlePremiumPurchasePlan({
    userData: {
      isTeacher: true,
      rira: 10000,
      battlePremiumUntil: currentPremiumUntil,
    },
    now: NOW,
  });

  assert.equal(plan.balanceAfter, 6700);
  assert.equal(
      plan.premiumUntilMillis,
      currentPremiumUntil + BATTLE_PREMIUM_DURATION_MS,
  );
});

test("같은 구매 기록이 있으면 잔액을 다시 확인하거나 차감하지 않는다", () => {
  const plan = createBattlePremiumPurchasePlan({
    userData: {rira: 0},
    existingPurchase: {
      status: "completed",
      price: 3300,
      balanceAfter: 6700,
      durationDays: 30,
      premiumUntil: NOW + BATTLE_PREMIUM_DURATION_MS,
    },
    now: NOW,
  });

  assert.equal(plan.kind, "duplicate");
  assert.deepEqual(plan.result, {
    success: true,
    duplicate: true,
    charged: 3300,
    balance: 6700,
    premiumUntilMillis: NOW + BATTLE_PREMIUM_DURATION_MS,
    durationDays: 30,
  });
});

test("학생 사용자의 구매 요청을 거절한다", () => {
  assert.throws(
      () => createBattlePremiumPurchasePlan({
        userData: {
          isTeacher: false,
          rira: BATTLE_PREMIUM_PRICE,
        },
        now: NOW,
      }),
      (error) => (
        error instanceof PremiumPurchaseRuleError &&
        error.code === "permission-denied"
      ),
  );
});

test("구매 요청 ID는 안전한 문자와 길이만 허용한다", () => {
  assert.equal(isValidPremiumPurchaseRequestId("request_1234"), true);
  assert.equal(isValidPremiumPurchaseRequestId("short"), false);
  assert.equal(isValidPremiumPurchaseRequestId("../request-id"), false);
  assert.equal(isValidPremiumPurchaseRequestId("request/id"), false);
});
