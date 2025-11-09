/* eslint-disable linebreak-style */
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
// --- 공통 설정 ---
initializeApp();
const REGION = "asia-northeast3";
const db = getFirestore(); // ✅ firestore는 함수 형태로 가져와야 함
const storage = new Storage();
// --- (1) openAI
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");
// --- (2) 구글 비젼
const client = new vision.ImageAnnotatorClient();
// --- (3) 결제용 Express 앱 묶음(api) ---
// express 서버
const app = express();
const cors = corsLib({ origin: true });
app.use(cors);
app.use(express.json());
// 시크릿은 이 export에만 연결
// NOTE: 토스 키는 문자열 기반 secrets를 권장(또는 defineSecret로 교체 가능)
const widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
const encryptedWidgetSecretKey = "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");
/**
 * POST /api/prepare-order
 * body: { userId, amount, name }
 * 역할: 서버에서 orderId 생성 & Firestore에 status: "ready"로 기록(금액 고정)
 */
// 결제위젯 승인
app.post("/confirm/widget", (req, res, next) => {
  console.log("Headers:", req.headers["content-type"]);
  console.log("Body type:", typeof req.body, "value:", req.body);
  next();
}, async (req, res) => {
  try {
    const { paymentKey, orderId, amount, userId } = req.body ?? {};
    if (!paymentKey || !orderId || amount == null) res.status(400).json({ code: "파라미터 오류", message: "missing params" });
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
      const checkRef = db.doc(`paymentcheck/${orderId}`)
      batch.set(userRef, { rira: FieldValue.increment(Number(amount)) }, { merge: true });
      batch.delete(checkRef);
      batch.set(payRef,
        {
          orderId: result.orderId,
          orderName: result.orderName,
          paymentKey: result.paymentKey,
          easyPay: result.easyPay,
          currency: result.currency,
          totalAmount: result.totalAmount,
          method: result.method,
          createdAt: FieldValue.serverTimestamp()
        }, { merge: true }
      );
      //한 번에 커밋
      await batch.commit();
    }
  } catch (e) {
    console.error("confirm/widget error:", e);
    return res.status(500).json({ code: "SERVER_ERROR", message: String(e?.message || e) });
  }
});
export const api = onRequest({ region: REGION }, app);

//gpt apiKey
export const askGPT = onCall(
  {
    region: REGION,
    secrets: [OPENAI_API_KEY]
  },
  async (req) => {
    const apiKey = OPENAI_API_KEY.value();
    const openai = new OpenAI({ apiKey: apiKey }); // 안전하게 사용
    console.log("요청:", req.data);
    const { messages, model = "gpt-4o-mini", temperature = 1.0 } = req.data || {};
    if (!Array.isArray(messages)) {
      throw new HttpsError("invalid-argument", "`messages`는 배열이어야 합니다.");
    }
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature,
      });
      const content = completion.choices?.[0]?.message?.content ?? "";
      return { content };
    } catch (err) {
      console.error("OpenAI error:", err?.response?.data || err?.message || err);
      // 클라이언트가 처리하기 쉽게 HttpsError로 변환
      throw new HttpsError("internal", "문장 생성 중 서버 오류가 발생했습니다.");
    }
  });

//jpg OCR
export const extractText = onRequest(
  { region: REGION },
  async (req, res) => {
    cors(req, res, async () => {
      try {
        const { filePath } = req.body;
        console.log("파일경로:", { filePath });
        const gcsSourceUri = `gs://school-act-manager.appspot.com/${filePath}`;
        console.log("Vision API 요청 URI:", `gs://school-act-manager.appspot.com/${filePath}`);
        const [result] = await client.documentTextDetection({ image: { source: { imageUri: gcsSourceUri } } });
        console.log("Vision API 응답:", JSON.stringify(result, null, 2));
        const detectedText = result.fullTextAnnotation ? result.fullTextAnnotation.text : "텍스트를 인식하지 못했습니다.";
        return res.status(200).json({ text: detectedText });
      } catch (err) {
        console.error("OCR 오류");
        return res.status(500).json({ error: "OCR 실행 중 오류 발생" });
      }
    });
  });

//pdf OCR
export const startOcrOnPdf = onRequest(
  { region: REGION },
  async (req, res) => {
    cors(req, res, async () => {
      try {
        const { fileName } = req.body;
        console.log("파일경로:", { fileName });
        const gcsSourceUri = `gs://school-act-manager.appspot.com/pdfs/${fileName}`;
        console.log("Vision API 요청 URI:", `gs://school-act-manager.appspot.com/pdfs/${fileName}`);
        const gcsDestinationUri = `gs://school-act-manager.appspot.com/ocr_results/${fileName.replace(".pdf", ".json")}`;
        const request = {
          requests: [
            {
              inputConfig: {
                gcsSource: { uri: gcsSourceUri },
                mimeType: "application/pdf",
              },
              features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
              outputConfig: {
                gcsDestination: { uri: gcsDestinationUri },
                batchSize: 1,
              },
            },
          ],
        };
        console.log("Vision API OCR 요청 전송...");
        const [operation] = await client.asyncBatchAnnotateFiles(request);
        console.log("Vision API OCR 요청 처리 중...");
        const [response] = await operation.promise();
        console.log("✅ Vision API OCR 요청 완료! 결과는 Storage에 저장됨:", gcsDestinationUri);
        return res.status(200).json({ result: "저장 성공" });
      } catch (error) {
        console.error("OCR 실행 오류:", error);
        return null;
      }
    });
  });
//pdf OCR result
export const getPdfOcrResults = onRequest(
  { region: REGION },
  async (req, res) => {
    cors(req, res, async () => {
      try {
        const bucketName = "school-act-manager.appspot.com";
        const folderPath = "ocr_results/";
        const fileNamePrefix = req.query.fileName.replace(".pdf", "");
        if (!fileNamePrefix) {
          return res.status(400).json({ error: "fileName을 입력하세요." });
        }
        //OCR 결과 폴더에서 파일 목록 가져오기
        const [files] = await storage.bucket(bucketName).getFiles({ prefix: folderPath });
        const matchedFiles = files.filter((file) => {
          console.log("개별파일", file.name);
          return file.name.includes(fileNamePrefix);
        });
        if (matchedFiles.length === 0) {
          return res.status(404).json({ error: "OCR 결과 파일을 찾을 수 없습니다." });
        }
        const ocrResults = [];
        //OCR 결과 파일들을 하나씩 다운로드하여 배열로 저장
        for (const file of matchedFiles) {
          const [fileContent] = await file.download();
          const jsonContent = JSON.parse(fileContent.toString("utf8"));
          //OCR 결과에서 텍스트만 추출하여 배열에 추가
          const textContent = jsonContent.responses.map((resp) => resp.fullTextAnnotation?.text || "텍스트 없음");
          ocrResults.push(...textContent); // ✅ 여러 응답이 있을 수 있어 spread 연산자로 추가
        }
        return res.status(200).json({ pages: ocrResults });
      } catch (error) {
        console.error("OCR 결과 가져오기 오류:", error);
        return res.status(500).json({ error: "OCR 결과를 가져오는 중 오류 발생" });
      }
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

