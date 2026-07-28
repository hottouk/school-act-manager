import {
  BATTLE_PREMIUM_DURATION_DAYS,
  BATTLE_PREMIUM_DURATION_MS,
  calculateNextPremiumUntil,
  getPremiumUntilMillis,
} from "./premiumRules.js";

export const BATTLE_PREMIUM_PRICE = 3300;
export const BATTLE_PREMIUM_PRODUCT_ID = "battle-premium-30-days";

/**
 * 구매 규칙 위반을 Callable Function 오류로 변환하기 위한 오류입니다.
 */
export class PremiumPurchaseRuleError extends Error {
  /**
   * @param {string} code Firebase Functions 오류 코드
   * @param {string} message 사용자에게 전달할 오류 메시지
   */
  constructor(code, message) {
    super(message);
    this.name = "PremiumPurchaseRuleError";
    this.code = code;
  }
}

export const isValidPremiumPurchaseRequestId = (requestId) => (
  typeof requestId === "string" &&
  /^[A-Za-z0-9_-]{8,80}$/.test(requestId)
);

const getDuplicatePurchaseResult = (purchaseData) => {
  if (purchaseData?.status !== "completed") {
    throw new PremiumPurchaseRuleError(
        "failed-precondition",
        "완료되지 않은 구매 요청입니다. 관리자에게 문의해주세요.",
    );
  }

  const premiumUntilMillis =
    getPremiumUntilMillis(purchaseData.premiumUntil);
  const balanceAfter = Number(purchaseData.balanceAfter);

  if (premiumUntilMillis == null || !Number.isFinite(balanceAfter)) {
    throw new PremiumPurchaseRuleError(
        "data-loss",
        "기존 구매 기록을 확인할 수 없습니다.",
    );
  }

  return {
    success: true,
    duplicate: true,
    charged: Number(purchaseData.price || BATTLE_PREMIUM_PRICE),
    balance: balanceAfter,
    premiumUntilMillis,
    durationDays: Number(
        purchaseData.durationDays || BATTLE_PREMIUM_DURATION_DAYS,
    ),
  };
};

export const createBattlePremiumPurchasePlan = ({
  userData,
  existingPurchase = null,
  now = Date.now(),
}) => {
  if (existingPurchase) {
    return {
      kind: "duplicate",
      result: getDuplicatePurchaseResult(existingPurchase),
    };
  }

  if (!userData) {
    throw new PremiumPurchaseRuleError(
        "not-found",
        "사용자 정보를 찾을 수 없습니다.",
    );
  }

  if (userData.isTeacher !== true) {
    throw new PremiumPurchaseRuleError(
        "permission-denied",
        "교사 사용자만 배틀 프리미엄을 구매할 수 있습니다.",
    );
  }

  const balanceBefore = Number(userData.rira ?? 0);
  if (!Number.isFinite(balanceBefore) || balanceBefore < 0) {
    throw new PremiumPurchaseRuleError(
        "failed-precondition",
        "리라 잔액 정보가 올바르지 않습니다.",
    );
  }

  if (balanceBefore < BATTLE_PREMIUM_PRICE) {
    throw new PremiumPurchaseRuleError(
        "failed-precondition",
        "리라 잔액이 부족합니다.",
    );
  }

  const previousPremiumUntilMillis =
    getPremiumUntilMillis(userData.battlePremiumUntil);
  const premiumUntilMillis = calculateNextPremiumUntil(
      previousPremiumUntilMillis,
      now,
  );
  const balanceAfter = balanceBefore - BATTLE_PREMIUM_PRICE;

  return {
    kind: "purchase",
    balanceBefore,
    balanceAfter,
    previousPremiumUntilMillis,
    premiumUntilMillis,
    price: BATTLE_PREMIUM_PRICE,
    durationDays: BATTLE_PREMIUM_DURATION_DAYS,
    durationMillis: BATTLE_PREMIUM_DURATION_MS,
    productId: BATTLE_PREMIUM_PRODUCT_ID,
  };
};
