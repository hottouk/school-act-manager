/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable comma-dangle */
/* eslint-disable padded-blocks */
/* eslint-disable no-empty */
/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable spaced-comment */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import * as functions from "firebase-functions";
import { Storage } from "@google-cloud/storage";
import vision from "@google-cloud/vision";
import corsLib from "cors";
import { initializeApp } from "firebase-admin/app";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { compareActions, processEffect } from "./gameLogic.js";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import OpenAI from "openai";
import express from "express";
import { v4 as uuidv4 } from "uuid";
// --- 공통 설정 ---
initializeApp();
const REGION = "asia-northeast3";
const db = getFirestore(); // ✅ firestore는 함수 형태로 가져와야 함
//보안 키
const TOSS_WIDGET_SECRET_KEY = defineSecret("TOSS_WIDGET_SECRET_KEY");
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");
// --- gpt 인앱 재화 결제(GPT) model pricing (server-side only)
const GPT_MODEL_PRICING = Object.freeze({
  "gpt-5.1": { basic: 70 },
  "gpt-5-mini": { basic: 20 },
  "gpt-5-nano": { basic: 10 },
});
const getGptPrice = (model, type = "basic") => GPT_MODEL_PRICING[model]?.[type] || 0;
// --- (4) 결제용 Express 앱 묶음(api) ---
// express 서버
const app = express();
const cors = corsLib({ origin: true });
app.use(cors);
app.use(express.json());
// 시크릿은 이 export에만 연결
// NOTE: 토스 키는 문자열 기반 secrets를 권장(또는 defineSecret로 교체 가능)
/**
 * POST /api/prepare-order
 * body: { userId, amount, name }
 * 역할: 서버에서 orderId 생성 & Firestore에 status: "ready"로 기록(금액 고정)
 */
// 결제위젯 승인
app.post("/confirm/widget", (req, _res, next) => {
  console.log("Headers:", req.headers["content-type"]);
  console.log("Body type:", typeof req.body, "value:", req.body);
  next();
}, async (req, res) => {
  try {
    const encryptedWidgetSecretKey = "Basic " + Buffer.from(TOSS_WIDGET_SECRET_KEY.value() + ":").toString("base64");
    const { paymentKey, orderId, amount, userId } = req.body ?? {};
    if (!paymentKey || !orderId || amount == null) return res.status(400).json({ code: "파라미터 오류", message: "missing params" });
    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        "Authorization": encryptedWidgetSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, amount, paymentKey })
    });
    const result = await response.json();
    if (!response.ok) {
      //결제 승인 실패 비즈니스 로직
      return res.status(response.status).json(result);
    } else {
      //결제 완료 비즈니스 로직
      res.status(200).json(result);
      const batch = db.batch();
      const payRef = db.doc(`purchases/${orderId}`);
      const userRef = db.doc(`user/${userId}`);
      const checkRef = db.doc(`paymentcheck/${orderId}`);
      //서버에서 리라 충전, 결제기록 생성, 임시 기록 삭제
      batch.set(userRef, { rira: FieldValue.increment(Number(amount)) }, { merge: true });
      batch.set(payRef,
        {
          orderId: result.orderId,
          orderName: result.orderName,
          paymentKey: result.paymentKey,
          easyPay: result.easyPay,
          currency: result.currency,
          totalAmount: result.totalAmount,
          method: result.method,
          uid: userId,
          createdAt: FieldValue.serverTimestamp()
        }, { merge: true }
      );
      batch.delete(checkRef);
      //한 번에 커밋
      await batch.commit();
    }
  } catch (e) {
    console.error("confirm/widget error:", e);
    return res.status(500).json({ code: "서버_오류", message: String(e?.message || e) });
  }
});


async function processTossWebhook(body, headers) {
  const eventType = body?.eventType || "UNKNOWN";
  const transmissionId = headers["transmission-id"] || headers["tosspayments-webhook-transmission-id"] || null;

  console.log("[TossWebhook] received", {
    eventType,
    transmissionId,
  });

  // 중복 추적 / 디버깅용 저장
  if (transmissionId) {
    await db.collection("tossWebhookEvents").doc(String(transmissionId)).set({
      eventType,
      receivedAt: FieldValue.serverTimestamp(),
      payload: body,
    }, { merge: true });
    return;
  }

  await db.collection("tossWebhookEvents").add({
    eventType,
    receivedAt: FieldValue.serverTimestamp(),
    payload: body,
  });
}

app.post("/webhooks/tosspayments", async (req, res) => {
  try {
    const body = req.body || {};
    res.status(200).json({ ok: true });

    void processTossWebhook(body, req.headers).catch((error) => {
      console.error("[TossWebhook] async processing error:", error);
    });
  } catch (error) {
    console.error("[TossWebhook] handler error:", error);
    return res.status(500).json({ message: "webhook handler error" });
  }
});

export const api = onRequest({ region: REGION, secrets: [TOSS_WIDGET_SECRET_KEY] }, app);
//쿠폰 등록
export const enrollCoupon = onCall(
  { region: REGION },
  async (req) => {
    const { couponCode, uid } = req.data || {};
    const batch = db.batch();
    const userRef = db.doc(`user/${uid}`);
    const payRef = db.collection(`purchases`).doc();
    await db.runTransaction(async (tx) => {
      if (couponCode !== "26신학기준비맞이연수쿠폰") throw new HttpsError("invalid-argument", "유효하지 않은 쿠폰 코드입니다.");
      const userSnap = await tx.get(userRef);
      if (!userSnap.exists) throw new HttpsError("not-found", "사용자 정보를 찾을 수 없습니다.");
      const userData = userSnap.data() || {};
      const usedCouponList = userData.usedCouponList || [];
      if (usedCouponList.includes(couponCode)) throw new HttpsError("already-used", "이미 사용한 쿠폰입니다.");
      usedCouponList.push(couponCode);
      tx.update(userRef, { usedCouponList });
      const newRira = Number(userData.rira || 0) + 3000;
      tx.update(userRef, { rira: newRira });
      tx.set(payRef,
        {
          orderId: payRef.id,
          orderName: "3,000리라 쿠폰",
          paymentKey: null,
          easyPay: null,
          currency: "KRW",
          totalAmount: 3000,
          method: "coupon",
          uid: uid,
          createdAt: FieldValue.serverTimestamp()
        }, { merge: true });
    });
  });
//gpt 호출 
export const askGPT = onCall(
  { region: REGION, secrets: [OPENAI_API_KEY] },
  async (req) => {
    const apiKey = OPENAI_API_KEY.value();
    const openai = new OpenAI({ apiKey: apiKey }); // 안전하게 사용
    const { type = "basic", uid, messages, model, verbosity, thinkEffort, leftRira: expected } = req.data || {};
    const requestId = uuidv4();
    //유효성 검사
    if (!uid) throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
    if (!Array.isArray(messages)) throw new HttpsError("invalid-argument", "`messages`는 배열이어야 합니다.");
    //사용자 정보 조회
    const userRef = db.doc(`user/${uid}`);
    const ledgerRef = db.collection("rira_ledger").doc(requestId);
    //1. 비용 차감
    const charged = getGptPrice(model, type);
    console.log(`Log1: User ${uid} - Model: ${model}, Type: ${type}, `);
    await db.runTransaction(async (tx) => {
      const ledgerSnap = await tx.get(ledgerRef);
      const userSnap = await tx.get(userRef);
      if (ledgerSnap.exists) return; // 이미 처리된 요청이면 바로 종료(중복 방지)
      if (!userSnap.exists) throw new HttpsError("not-found", "사용자 정보를 찾을 수 없습니다.");
      const userData = userSnap.data() || {};
      const userRira = Number(userData.rira || 0);
      console.log(`Log2: UserRira_S:${userRira}, Charged_S: ${charged}, LeftRira_C: ${expected}`);
      //잔액 부족
      if (userRira - charged !== expected) throw new HttpsError("failed-precondition", "예상 차액과 서버 응답이 다릅니다. 재로그인해주세요.");
      if (charged > userRira) throw new HttpsError("failed-precondition", "리라 잔액이 부족합니다.");
      tx.update(userRef, { rira: userRira - charged });
      tx.set(ledgerRef, { uid, model, type, amount: charged, kind: "charge", status: "pending", createdAt: FieldValue.serverTimestamp(), });
    });
    //2. OpenAI API 호출
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        reasoning_effort: thinkEffort,
        verbosity
      });
      const content = completion.choices?.[0]?.message?.content ?? "";
      const usage = completion.usage || "gpt 사용량 정보 없음";
      // 성공 처리: 장부 status 업데이트
      await ledgerRef.set({ status: "success", completedAt: FieldValue.serverTimestamp() }, { merge: true });
      return { content, usage };
    } catch (err) {
      // 3. 오류시 환불 처리
      console.error("OpenAI error:", err?.response?.data || err?.message || err);
      await db.runTransaction(async (tx) => {
        const ledgerSnap = await tx.get(ledgerRef); //1차 check
        if (!ledgerSnap.exists) return;
        const status = ledgerSnap.data()?.status;
        if (status === "refunded") return; //2차 check
        const userSnap = await tx.get(userRef);
        if (!userSnap.exists) throw new HttpsError("not-found", "환불에 필요한 사용자 정보를 찾을 수 없습니다, 관리자에게 문의하세요.");
        const currentRira = Number(userSnap.data()?.rira ?? 0);
        tx.update(userRef, { rira: currentRira + charged });
        tx.set(ledgerRef, { uid, status: "refunded", refundedAt: FieldValue.serverTimestamp(), reason: "gpt_error" },
        );
      });
      // 클라이언트가 처리하기 쉽게 HttpsError로 변환
      throw new HttpsError("internal", "문장 생성 중 서버 오류가 발생했습니다., 차감된 리라는 환불 처리됩니다.");
    }
  });
//gpt만 호출
export const askGptOnly = onCall(
  { region: REGION, secrets: [OPENAI_API_KEY] },
  async (req) => {
    const apiKey = OPENAI_API_KEY.value();
    const openai = new OpenAI({ apiKey: apiKey });
    const { messages, model, thinkEffort, verbosity } = req.data || {};
    const completion = await openai.chat.completions.create(
      { model, messages, reasoning_effort: thinkEffort, verbosity }
    );
    const content = completion.choices?.[0]?.message?.content ?? "";
    const usage = completion.usage || { completion_tokens: 0, prompt_tokens: 0 };
    return { content, usage };
  });
//리라 증감
export const calculateRira = onCall({ region: REGION }, async (req) => {
  const { uid, model = "gpt-5-mini", type = "basic", status, times = 1, expectedRira, } = req.data || {};
  if (!uid) throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
  const requestId = uuidv4();
  const charged = getGptPrice(model, type) * times;
  const userRef = db.doc(`user/${uid}`);
  const ledgerRef = db.collection("rira_ledger").doc(requestId);
  return await db.runTransaction(async (tx) => {
    const ledgerSnap = await tx.get(ledgerRef);
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) throw new HttpsError("not-found", "사용자 정보를 찾을 수 없습니다.");
    if (status !== "refunded" && ledgerSnap.exists) return; // 중복 방지
    if (status === "refunded" && !ledgerSnap.exists) return;
    console.log(`Log1. 중복 증감 없음. ${charged} 증감 실시`);
    const userData = userSnap.data() || {};
    const userRira = Number(userData.rira || 0);
    //잔액 오류
    if (status === "pending") {
      if (userRira - charged !== expectedRira) throw new HttpsError("failed-precondition", "예상 차액과 서버 응답이 다릅니다. 재로그인해주세요.");
    }
    if (charged > userRira) throw new HttpsError("failed-precondition", "리라 잔액이 부족합니다.");
    tx.update(userRef, { rira: userRira - charged });
    tx.set(ledgerRef, { uid, model, amount: charged, status, times, createdAt: FieldValue.serverTimestamp() });
    return { success: true, charged };
  });
});

//게임방 리스너
export const resolveGameTurn = onDocumentUpdated({
  document: "game/{gameId}",
  region: REGION,
},
  async (event) => {
    //쓰기, 
    const before = event.data?.before?.data() || null;
    const after = event.data?.after?.data() || null;
    if (JSON.stringify(before.actions) === JSON.stringify(after.actions)) return;
    if (!after.actions || after.actions?.length !== 2) return;
    if (after.phase === "end") return;
    if (after.battleTurn >= 200) return;
    const players = after.players || [];
    const battleTurn = after.battleTurn || Number(1);
    const newActions = after.actions || [];
    const docRef = event.data.after.ref;
    const petCurStat = after.petCurStat || [];
    console.log("정렬 전", newActions);
    newActions.sort((a, b) => a.spd - b.spd);
    console.log("정렬 후", newActions);
    const effects = compareActions(newActions);
    console.log("index 1차 행동", effects[0]);
    const firsResult = await processEffect({ effect: effects[0], petCurStat, docRef, players });
    console.log("index 1차 결과", firsResult);
    await processEffect({ effect: effects[1], petCurStat: firsResult, docRef, battleTurn, players });
  });

export {
  createBattleRoom,
  joinByBattleCode,
  startGame,
  phaseManager,
  setBossStance,
  submitMyStance,
  closeStanceCollection,
  resolveBattleTurn,
  finalizeGame,
  cleanupExpiredRooms,
} from "./battle.js";

export { extractText, startOcrOnPdf, getPdfOcrResults } from "./pdfOcr.js";
