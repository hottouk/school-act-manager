/* eslint-disable no-trailing-spaces */
/* eslint-disable spaced-comment */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const { Storage } = require("@google-cloud/storage");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const vision = require("@google-cloud/vision");
const cors = require("cors")({ origin: true });
const storage = new Storage();
admin.initializeApp();
const client = new vision.ImageAnnotatorClient();

//jpg OCR
exports.extractText = functions.https.onRequest(async (req, res) => {
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
exports.startOcrOnPdf = functions.https.onRequest(async (req, res) => {
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
exports.getPdfOcrResults = functions.https.onRequest(async (req, res) => {
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

