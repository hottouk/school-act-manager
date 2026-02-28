/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable block-spacing */
/* eslint-disable brace-style */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-spacing */
/* eslint-disable spaced-comment */
import { getAuth } from "firebase-admin/auth";
import { onCall, HttpsError } from "firebase-functions/v2/https";
const REGION = "asia-northeast3";
// 1. 카카오 auth 발급
export const signInWithKakaoCustomToken = onCall(
  { region: REGION },
  async (req) => {
    const accessToken = req.data?.accessToken;
    console.log("3단계 토큰 전달 여부:", accessToken);
    if (!accessToken) throw new HttpsError("invalid-argument", "missing accessToken");
    //유저 정보 불러오기
    const kakaoRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    if (!kakaoRes.ok) {
      throw new HttpsError("unauthenticated", "invalid kakao token");
    }
    const kakaoUserData = await kakaoRes.json();
    console.log("4단계 유저데이터:", kakaoUserData);
    const kakaoId = String(kakaoUserData?.id || "");
    if (!kakaoId) throw new HttpsError("unauthenticated", "kakao id not found");
    try {
      const customToken = await getAuth().createCustomToken(kakaoId, { provider: "kakao" });
      console.log("5단계 커스텀 토큰:", customToken);
      return { customToken, kakaoUserData };
    } catch (error) {
      console.log(error);
    }
  },
);
// 2. 유저 탈퇴
export const deleteMyAccount = onCall({ region: REGION }, async (req) => {
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
  }
  const uid = req.auth.uid;
  try {
    // Firebase Auth 계정 삭제 (requires-recent-login 우회)
    await getAuth().deleteUser(uid);
    return { ok: true };
  } catch (e) {
    console.error("deleteMyAccount error:", e);
    throw new HttpsError("internal", "회원 탈퇴 처리 중 오류가 발생했습니다.");
  }
});
