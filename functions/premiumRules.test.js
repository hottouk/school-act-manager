import test from "node:test";
import assert from "node:assert/strict";
import {
  BATTLE_PREMIUM_DURATION_MS,
  calculateNextPremiumUntil,
  getPremiumUntilMillis,
  isBattlePremiumActive,
  isUserBattlePremium,
} from "./premiumRules.js";

const NOW = Date.UTC(2026, 6, 27, 0, 0, 0);

test("프리미엄 만료일이 없거나 잘못된 값이면 무료 사용자로 판단한다", () => {
  assert.equal(isBattlePremiumActive(null, NOW), false);
  assert.equal(isBattlePremiumActive("잘못된 날짜", NOW), false);
});

test("만료일이 현재 시각보다 뒤에 있을 때만 프리미엄으로 판단한다", () => {
  assert.equal(isBattlePremiumActive(NOW + 1, NOW), true);
  assert.equal(isBattlePremiumActive(NOW, NOW), false);
  assert.equal(isBattlePremiumActive(NOW - 1, NOW), false);
});

test("사용자 문서의 프리미엄 만료일로 권한을 판단한다", () => {
  assert.equal(
      isUserBattlePremium({battlePremiumUntil: NOW + 1}, NOW),
      true,
  );
  assert.equal(isUserBattlePremium({}, NOW), false);
  assert.equal(isUserBattlePremium(null, NOW), false);
});

test("Firestore Timestamp 형태의 값을 밀리초로 변환한다", () => {
  const timestamp = {
    seconds: Math.floor(NOW / 1000),
    nanoseconds: 123000000,
  };

  assert.equal(getPremiumUntilMillis(timestamp), NOW + 123);
  assert.equal(
      getPremiumUntilMillis({toMillis: () => NOW + 456}),
      NOW + 456,
  );
});

test("프리미엄이 만료됐으면 현재 시각부터 30일을 부여한다", () => {
  const expiredAt = NOW - 1000;

  assert.equal(
      calculateNextPremiumUntil(expiredAt, NOW),
      NOW + BATTLE_PREMIUM_DURATION_MS,
  );
});

test("프리미엄이 유효하면 기존 만료일 뒤에 30일을 더한다", () => {
  const currentPremiumUntil = NOW + 5 * 24 * 60 * 60 * 1000;

  assert.equal(
      calculateNextPremiumUntil(currentPremiumUntil, NOW),
      currentPremiumUntil + BATTLE_PREMIUM_DURATION_MS,
  );
});

test("현재 시각이 잘못되면 기간을 계산하지 않는다", () => {
  assert.throws(
      () => calculateNextPremiumUntil(null, "잘못된 날짜"),
      TypeError,
  );
});
