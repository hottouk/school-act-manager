/* eslint-disable require-jsdoc */
import test from "node:test";
import assert from "node:assert/strict";
import {runBattlePremiumPurchaseTransaction} from "./premiumPurchase.js";
import {BATTLE_PREMIUM_DURATION_MS} from "./premiumRules.js";

const NOW = Date.UTC(2026, 6, 27, 0, 0, 0);
const UID = "teacher-uid";
const REQUEST_ID = "request_1234";

class FakeSnapshot {
  constructor(data) {
    this.storedData = data;
    this.exists = data !== undefined;
  }

  data() {
    return this.storedData;
  }
}

class FakeTransaction {
  constructor(store) {
    this.store = store;
  }

  async get(ref) {
    return new FakeSnapshot(this.store.get(ref.path));
  }

  update(ref, data) {
    const current = this.store.get(ref.path);
    if (!current) throw new Error(`문서 없음: ${ref.path}`);
    this.store.set(ref.path, {...current, ...data});
  }

  set(ref, data) {
    this.store.set(ref.path, data);
  }
}

class FakeFirestore {
  constructor(initialEntries) {
    this.store = new Map(initialEntries);
  }

  doc(path) {
    return {path};
  }

  async runTransaction(callback) {
    return callback(new FakeTransaction(this.store));
  }
}

test("구매 트랜잭션이 잔액, 만료일, 구매 기록, 원장을 함께 저장한다", async () => {
  const db = new FakeFirestore([
    [`user/${UID}`, {isTeacher: true, rira: 10000}],
  ]);

  const result = await runBattlePremiumPurchaseTransaction({
    db,
    uid: UID,
    requestId: REQUEST_ID,
    nowMillis: NOW,
  });

  const user = db.store.get(`user/${UID}`);
  const purchase = db.store.get(
      `premium_purchases/${UID}/orders/${REQUEST_ID}`,
  );
  const ledger = db.store.get(`rira_ledger/${UID}_${REQUEST_ID}`);

  assert.deepEqual(result, {
    success: true,
    duplicate: false,
    charged: 3300,
    balance: 6700,
    premiumUntilMillis: NOW + BATTLE_PREMIUM_DURATION_MS,
    durationDays: 30,
  });
  assert.equal(user.rira, 6700);
  assert.equal(
      user.battlePremiumUntil.toMillis(),
      NOW + BATTLE_PREMIUM_DURATION_MS,
  );
  assert.equal(purchase.status, "completed");
  assert.equal(purchase.balanceBefore, 10000);
  assert.equal(purchase.balanceAfter, 6700);
  assert.equal(ledger.kind, "battle_premium_purchase");
  assert.equal(ledger.amount, 3300);
});

test("같은 요청 ID를 다시 실행해도 리라와 기간을 다시 변경하지 않는다", async () => {
  const db = new FakeFirestore([
    [`user/${UID}`, {isTeacher: true, rira: 10000}],
  ]);
  const input = {
    db,
    uid: UID,
    requestId: REQUEST_ID,
    nowMillis: NOW,
  };

  await runBattlePremiumPurchaseTransaction(input);
  const duplicateResult =
    await runBattlePremiumPurchaseTransaction(input);
  const user = db.store.get(`user/${UID}`);

  assert.equal(duplicateResult.duplicate, true);
  assert.equal(user.rira, 6700);
  assert.equal(
      user.battlePremiumUntil.toMillis(),
      NOW + BATTLE_PREMIUM_DURATION_MS,
  );
});
