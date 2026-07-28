import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {
  PremiumPurchaseRuleError,
  createBattlePremiumPurchasePlan,
  isValidPremiumPurchaseRequestId,
} from "./premiumPurchaseRules.js";

const REGION = "asia-northeast3";

const toCallableError = (error) => {
  if (error instanceof PremiumPurchaseRuleError) {
    return new HttpsError(error.code, error.message);
  }
  return error;
};

export const runBattlePremiumPurchaseTransaction = async ({
  db,
  uid,
  requestId,
  nowMillis = Date.now(),
}) => {
  const userRef = db.doc(`user/${uid}`);
  const purchaseRef = db.doc(
      `premium_purchases/${uid}/orders/${requestId}`,
  );
  const ledgerRef = db.doc(`rira_ledger/${uid}_${requestId}`);

  return db.runTransaction(async (transaction) => {
    const purchaseSnap = await transaction.get(purchaseRef);
    if (purchaseSnap.exists) {
      const duplicatePlan = createBattlePremiumPurchasePlan({
        existingPurchase: purchaseSnap.data(),
        now: nowMillis,
      });
      return duplicatePlan.result;
    }

    const userSnap = await transaction.get(userRef);
    const plan = createBattlePremiumPurchasePlan({
      userData: userSnap.exists ? userSnap.data() : null,
      now: nowMillis,
    });
    const premiumUntil = Timestamp.fromMillis(plan.premiumUntilMillis);
    const createdAt = Timestamp.fromMillis(nowMillis);

    transaction.update(userRef, {
      rira: plan.balanceAfter,
      battlePremiumUntil: premiumUntil,
    });
    transaction.set(purchaseRef, {
      uid,
      requestId,
      productId: plan.productId,
      status: "completed",
      price: plan.price,
      durationDays: plan.durationDays,
      balanceBefore: plan.balanceBefore,
      balanceAfter: plan.balanceAfter,
      previousPremiumUntil: plan.previousPremiumUntilMillis == null ?
        null :
        Timestamp.fromMillis(plan.previousPremiumUntilMillis),
      premiumUntil,
      createdAt,
    });
    transaction.set(ledgerRef, {
      uid,
      requestId,
      productId: plan.productId,
      kind: "battle_premium_purchase",
      status: "completed",
      amount: plan.price,
      balanceBefore: plan.balanceBefore,
      balanceAfter: plan.balanceAfter,
      createdAt,
    });

    return {
      success: true,
      duplicate: false,
      charged: plan.price,
      balance: plan.balanceAfter,
      premiumUntilMillis: plan.premiumUntilMillis,
      durationDays: plan.durationDays,
    };
  });
};

export const purchaseBattlePremium = onCall(
    {region: REGION},
    async (req) => {
      const uid = req.auth?.uid;
      if (!uid) {
        throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
      }

      const requestId = String(req.data?.requestId || "").trim();
      if (!isValidPremiumPurchaseRequestId(requestId)) {
        throw new HttpsError(
            "invalid-argument",
            "올바른 구매 요청 ID가 필요합니다.",
        );
      }

      const db = getFirestore();
      const nowMillis = Date.now();

      try {
        return await runBattlePremiumPurchaseTransaction({
          db,
          uid,
          requestId,
          nowMillis,
        });
      } catch (error) {
        throw toCallableError(error);
      }
    },
);
