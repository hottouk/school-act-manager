// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Timestamp, getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appAuth = getAuth(app);
const appFireStore = getFirestore(app);
const appDatabase = getDatabase(
  app,
  "https://school-act-manager-default-rtdb.asia-southeast1.firebasedatabase.app"
);
const storage = getStorage(app, "gs://school-act-manager.appspot.com");
const timeStamp = Timestamp;
export const functions = getFunctions(app, "asia-northeast3");
// 에뮬레이터 연결 (개발에서만)
if (window.location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "localhost", 5001);
}
export const callAskGPT = httpsCallable(functions, "askGPT");
export const callAskGptOnly = httpsCallable(functions, "askGptOnly");
export const callCalculateRira = httpsCallable(functions, "calculateRira");
export const callEnrollCoupon = httpsCallable(functions, "enrollCoupon");
// 단어 게임
export const callCreateRoom = httpsCallable(functions, "createBattleRoom");
export const callJoinByBattleCode = httpsCallable(functions, "joinByBattleCode");
export const callLeaveBattleRoom = httpsCallable(functions, "leaveBattleRoom");
export const callKickBattlePlayer = httpsCallable(functions, "kickBattlePlayer");
export const callStartGame = httpsCallable(functions, "startGame");
export const callPhaseManager = httpsCallable(functions, "phaseManager");
export const callSetBossStance = httpsCallable(functions, "setBossStance");
export const callSubmitMyStance = httpsCallable(functions, "submitMyStance");
export const callCloseStanceCollection = httpsCallable(functions, "closeStanceCollection");
export const callResolveBattleTurn = httpsCallable(functions, "resolveBattleTurn");
export const callRestartBattleRoom = httpsCallable(functions, "restartBattleRoom");
export const callFinalizeGame = httpsCallable(functions, "finalizeGame");
//회원 
export const callSignInWithKakaoCustomToken = httpsCallable(functions, "signInWithKakaoCustomToken");
export const callDeleteMyAccount = httpsCallable(functions, "deleteMyAccount");

export { app, appDatabase, appFireStore, appAuth, storage, timeStamp }
