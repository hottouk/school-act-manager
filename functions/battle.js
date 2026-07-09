/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { onSchedule } from "firebase-functions/scheduler";
if (!getApps().length) initializeApp();
const REGION = "asia-northeast3";
const db = getDatabase();
const now = () => Date.now();
const makeCode = () => String(Math.floor(100000 + Math.random() * 900000));
/**
 * 유일한 배틀 코드를 생성합니다.
 * @async
 * @param {number} [maxTry=10] - 코드 생성 시도 횟수
 * @return {Promise<string>} 6자리 유일 배틀 코드
 * @throws {HttpsError} 최대 시도 횟수 초과 시 'resource-exhausted' 에러 발생
 */
async function createUniqueCode(maxTry = 10) {
  for (let i = 0; i < maxTry; i += 1) {
    const code = makeCode();
    const snap = await db.ref(`battleCodes/${code}`).get();
    if (!snap.exists()) return code;
  }
  throw new HttpsError("resource-exhausted", "배틀코드 생성 실패");
}
// 체크
const hostCheck = async (req) => {
  const uid = req.data?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "로그인 필요");
  const roomId = String(req.data?.roomId || "");
  if (!roomId) throw new HttpsError("invalid-argument", "roomId 필요");
  const roomRef = db.ref(`rooms/${roomId}`);
  const roomSnap = await roomRef.get();
  if (!roomSnap.exists()) throw new HttpsError("not-found", "방 없음");
  const room = roomSnap.val();
  if (room.hostUid !== uid) throw new HttpsError("permission-denied", "교사(호스트)만 시작 가능");
  return { roomId, roomRef, room };
};
// 1) 방 생성 (교사용)
export const createBattleRoom = onCall({ region: REGION }, async (req) => {
  const uid = req.data?.uid || null;
  if (!uid) throw new HttpsError("unauthenticated", "로그인 필요");
  const title = String(req.data?.title || "단어 배틀");
  const maxTurn = Number(req.data?.maxRounds || 5);
  const quizId = req.data?.quizId || "";
  const roomRef = db.ref("rooms").push();
  const roomId = roomRef.key;
  const battleCode = await createUniqueCode();
  const createdAt = now();
  await db.ref().update({
    [`rooms/${roomId}`]: {
      hostUid: uid,
      title,
      status: "waiting", // waiting|playing|ended
      turn: 1,
      quizId,
      maxTurn,
      createdAt,
      startedAt: null,
      endedAt: null,
    },
    [`battleCodes/${battleCode}`]: {
      roomId,
      expiresAt: createdAt + 6 * 60 * 60 * 1000, // 6시간
    }
  });
  console.log("코드", battleCode);
  return { roomId, battleCode };
});

// 2) 코드로 입장 (학생, 익명 로그인 가능)
export const joinByBattleCode = onCall({ region: REGION }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "익명 로그인 필요");

  const battleCode = String(req.data?.battleCode || "").trim();
  const nickname = String(req.data?.nickname || "").trim().slice(0, 20);
  const pet = req.data?.pet || {};
  console.log("req", battleCode, nickname, pet);
  if (!/^\d{6}$/.test(battleCode)) {
    throw new HttpsError("invalid-argument", "코드는 6자리 숫자여야 합니다.");
  }
  if (!nickname) throw new HttpsError("invalid-argument", "닉네임을 입력해주세요");
  if (!pet) throw new HttpsError("invalid-argument", "펫을 선택해야 합니다.");
  const codeSnap = await db.ref(`battleCodes/${battleCode}`).get();
  if (!codeSnap.exists()) throw new HttpsError("not-found", "배틀 코드로 생성된 방이 없습니다.");

  const { roomId, expiresAt } = codeSnap.val();
  if (expiresAt < now()) throw new HttpsError("failed-precondition", "만료된 코드입니다.");

  await db.ref(`roomPlayers/${roomId}/${uid}`).update({
    nickname,
    pet,
    score: 0,
    connected: true,
    joinedAt: now(),
    lastSeenAt: now(),
  });
  return { roomId, pet };
});

// 2-1) 학생 방 퇴장
export const leaveBattleRoom = onCall({ region: REGION }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "로그인 필요");

  const roomId = String(req.data?.roomId || "");
  if (!roomId) throw new HttpsError("invalid-argument", "roomId 필요");

  const roomSnap = await db.ref(`rooms/${roomId}`).get();
  if (!roomSnap.exists()) throw new HttpsError("not-found", "방 없음");

  await db.ref(`roomPlayers/${roomId}/${uid}`).remove();
  return { ok: true };
});

// 2-2) 교사 학생 추방
export const kickBattlePlayer = onCall({ region: REGION }, async (req) => {
  const { roomId } = await hostCheck(req);
  const targetUid = String(req.data?.targetUid || "");
  if (!targetUid) throw new HttpsError("invalid-argument", "targetUid 필요");

  await db.ref(`roomPlayers/${roomId}/${targetUid}`).remove();
  return { ok: true };
});

// 3) 게임 시작
export const startGame = onCall({ region: REGION }, async (req) => {
  const { roomRef, room } = await hostCheck(req);
  console.log("startGame 호출");
  const studentList = req.data?.studentList || [];
  if (studentList.length === 0) throw new HttpsError("no-student", "학생이 없습니다.");
  const teamHp = (studentList || []).reduce((sum, student) => {
    return sum + Number(student?.pet?.hp || 0);
  }, 0);
  if (room?.status !== "waiting") throw new HttpsError("failed-precondition", "이미 시작되었거나 종료됨");
  const startedAt = now();
  await roomRef.update({
    status: "countdown",
    turn: 1,
    startedAt,
    boss: { atk: studentList.length * 30, def: studentList.length * 5, hp: studentList.length * 200, curHp: studentList.length * 200 },
    pet: { hp: teamHp, curHp: teamHp }
  });
  return { ok: true };
});

// 4) 페이즈 메니져
export const phaseManager = onCall({ region: REGION }, async (req) => {
  console.log("phaseManager 호출");
  const stauts = String(req.data?.status || "");
  if (!stauts) throw new HttpsError("invalid-argument", "호출 상태 필요");
  const roomId = String(req.data?.roomId || "");
  if (!roomId) throw new HttpsError("invalid-argument", "roomId 필요");
  const roomRef = db.ref(`rooms/${roomId}`);
  const roomSnap = await roomRef.get();
  if (!roomSnap.exists()) throw new HttpsError("not-found", "방 없음");
  await roomRef.update({ status: stauts, });
  return { ok: true };
});

// 5) 보스 스탠스
export const setBossStance = onCall({ region: REGION }, async (req) => {
  console.log("setBossStance 호출");
  const { roomRef } = await hostCheck(req);
  const stance = String(req.data?.stance || "");
  if (!stance) throw new HttpsError("invalid-argument", "보스 스탠스 필요");
  await roomRef.update({ bossStance: stance, });
  return { ok: true };
});

// 6) 학생 행동 제출
export const submitMyStance = onCall({ region: REGION }, async (req) => {
  console.log("submitMyStance 호출");
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "login required");
  // req
  const roomId = String(req.data?.roomId || "");
  const stance = String(req.data?.stance || "");
  const actionBall = Number(req.data?.actionBall || 0);
  if (!roomId) throw new HttpsError("invalid-argument", "roomId required");
  const roomRef = db.ref(`rooms/${roomId}`);
  const roomSnap = await roomRef.get();
  if (!roomSnap.exists()) throw new HttpsError("not-found", "room not found");
  const room = roomSnap.val();
  if (room.status !== "stance") {
    throw new HttpsError("failed-precondition", "not stance phase");
  }
  const playerSnap = await db.ref(`roomPlayers/${roomId}/${uid}`).get();
  if (!playerSnap.exists()) {
    throw new HttpsError("permission-denied", "not a participant");
  }
  const turn = Number(room.turn || 1);
  const player = playerSnap.val() || {};
  const pet = player.pet || {};
  const point = actionBall * pet[stance];

  await db.ref(`roomStances/${roomId}/${turn}/${uid}`).set({
    stance,
    point,
    submittedAt: now(),
  });
  // 집계(재계산 방식: 동시성에 안전하고 단순)
  const allSnap = await db.ref(`roomStances/${roomId}/${turn}`).get();
  const all = allSnap.val() || {};

  const summary = { atk: 0, def: 0, rest: 0, submittedCount: 0, closed: false };
  Object.values(all).forEach((v) => {
    if (!v?.stance || typeof v?.point !== "number") return;
    if (summary[v.stance] !== undefined) summary[v.stance] += v.point;
    summary.submittedCount += 1;
  });
  await db.ref(`roomStanceSummary/${roomId}/${turn}`).update(summary);
  return { ok: true, turn, summary };
});

// 7) 교사 결과 취합
export const closeStanceCollection = onCall({ region: REGION }, async (req) => {
  console.log("closeStanceCollection 호출");
  const { roomId, room } = await hostCheck(req);
  if (!room.bossStance) {
    throw new HttpsError("failed-precondition", "교사가 먼저 행동을 선택해야 합니다.");
  }
  const turn = Number(room.turn || 1);

  const nowTime = now();
  const stancesRef = db.ref(`roomStances/${roomId}/${turn}`);
  const stancesSnap = await stancesRef.get();
  const stances = stancesSnap.val() || {};
  const playersSnap = await db.ref(`roomPlayers/${roomId}`).get();
  const players = playersSnap.val() || {};
  const autoDefenseUpdates = {};

  Object.entries(players).forEach(([uid, player]) => {
    if (!player?.connected || stances[uid]) return;
    autoDefenseUpdates[uid] = {
      stance: "def",
      point: 0,
      auto: true,
      submittedAt: nowTime,
    };
  });

  if (Object.keys(autoDefenseUpdates).length > 0) {
    await stancesRef.update(autoDefenseUpdates);
  }

  const finalStancesSnap = await stancesRef.get();
  const finalStances = finalStancesSnap.val() || {};
  const nextSummary = { atk: 0, def: 0, rest: 0, submittedCount: 0, autoDefenseCount: 0, closed: true };
  Object.values(finalStances).forEach((v) => {
    if (!v?.stance || typeof v?.point !== "number") return;
    if (nextSummary[v.stance] !== undefined) nextSummary[v.stance] += v.point;
    if (v.auto && v.stance === "def") nextSummary.autoDefenseCount += 1;
    nextSummary.submittedCount += 1;
  });

  const summaryRef = db.ref(`roomStanceSummary/${roomId}/${turn}`);
  await summaryRef.set(nextSummary);
  return { ok: true, turn, summary: nextSummary };
});

// 8) 턴 취합 후 결과 확인
export const resolveBattleTurn = onCall({ region: REGION }, async (req) => {
  console.log("배틀 턴 결과 함수 호출");
  const { roomId, room } = await hostCheck(req); // host 검증 재사용
  // turn
  const turn = Number(room.turn || 1);
  const maxTurn = Number(room.maxTurn || room.maxRounds || 5);
  const summaryRef = db.ref(`roomStanceSummary/${roomId}/${turn}`);
  const summarySnap = await summaryRef.get();
  if (!summarySnap.exists()) {
    throw new HttpsError("failed-precondition", "stance summary not found");
  }
  const summary = summarySnap.val();
  if (!summary.closed) {
    throw new HttpsError("failed-precondition", "stance collection not closed");
  }
  // idempotent
  const resultRef = db.ref(`roomBattleResults/${roomId}/${turn}`);
  const resultSnap = await resultRef.get();
  if (resultSnap.exists()) return { ok: true, alreadyResolved: true, turn, result: resultSnap.val() };
  // stat
  const boss = room.boss || { atk: 0, def: 0, curHp: 0, hp: 0 };
  const pet = room.pet || { curHp: 0, hp: 0 }; // 팀 단일 객체
  const bossStance = String(room.bossStance || "atk");
  // collect
  const atkPoint = Number(summary.atk || 0);
  const defPoint = Number(summary.def || 0);
  const healToTeam = Number(summary.rest || 0);
  // result
  const nextTurn = turn + 1;
  let damageToBoss = 0;
  let damageToTeam = 0;
  let healToBoss = 0;
  if (bossStance === "atk") {
    damageToBoss = Math.max(atkPoint - boss.def, 0);
    damageToTeam = Math.max(boss.atk - defPoint, 1);
  } else if (bossStance === "def") {
    damageToBoss = Math.max(Math.floor(atkPoint * 0.6) - boss.def, 0);
    damageToTeam = 0;
  } else if (bossStance === "rest") {
    damageToBoss = Math.max(atkPoint * 1.2 - boss.def, 0);
    healToBoss = Math.floor(boss.hp * 0.1);
    damageToTeam = 0;
  }
  const bossHpAfterStudent = Math.max(0, Math.min(boss.hp, boss.curHp - damageToBoss));
  const canBossAct = bossHpAfterStudent > 0;
  const nextBossHp = canBossAct ? Math.max(0, Math.min(boss.hp, bossHpAfterStudent + healToBoss)) : bossHpAfterStudent;
  const petHpAfterBossAttack = canBossAct ? Math.max(0, Math.min(pet.hp, pet.curHp - damageToTeam)) : Number(pet.curHp || 0);
  const nextPetHp = Math.max(0, Math.min(pet.hp, petHpAfterBossAttack + healToTeam));
  const actionSequence = [
    {
      step: 1,
      actor: "student",
      action: "def",
      effect: "defenseToTeam",
      value: defPoint,
      point: defPoint,
    },
    {
      step: 2,
      actor: "boss",
      action: "def",
      effect: "defenseToBoss",
      value: Number(boss.def || 0),
    },
    {
      step: 3,
      actor: "student",
      action: "atk",
      effect: "damageToBoss",
      value: damageToBoss,
      point: atkPoint,
      nextBossHp: bossHpAfterStudent,
    },
    {
      step: 4,
      actor: "boss",
      action: "atk",
      effect: "damageToTeam",
      value: damageToTeam,
      nextPetHp: petHpAfterBossAttack,
    },
    {
      step: 5,
      actor: "student",
      action: "rest",
      effect: "healToTeam",
      value: healToTeam,
      point: healToTeam,
      nextPetHp,
    },
    {
      step: 6,
      actor: "boss",
      action: "rest",
      effect: "healToBoss",
      value: healToBoss,
      nextBossHp,
    },
  ].filter((event) => {
    if (event.actor === "student") return true;
    if (event.effect === "defenseToBoss") return bossStance === "def";
    if (event.actor === "boss" && !canBossAct) return false;
    if (event.effect === "damageToTeam") return bossStance === "atk";
    if (event.effect === "healToBoss") return bossStance === "rest";
    return Number(event.value || 0) > 0;
  });
  // endGame?
  const isBossDead = nextBossHp <= 0;
  const isTeamDead = nextPetHp <= 0;
  const isTurnOver = nextTurn > maxTurn; // 현재 턴 처리 후 다음 턴이 max 초과면 종료

  let endReason = null;
  let winner = null;

  if (isBossDead) {
    endReason = "boss_dead";
    winner = "team";
  } else if (isTeamDead) {
    endReason = "team_dead";
    winner = "boss";
  } else if (isTurnOver) {
    endReason = "max_turn";
    // 동점/판정 규칙 정하기 (예: 남은 체력 높은 쪽 승리)
    winner = nextBossHp < nextPetHp ? "team" : "boss";
  }
  const nextStatus = endReason ? "ended" : "quiz";
  const result = {
    bossStance,
    beforeBossHp: Number(boss.curHp || 0),
    beforePetHp: Number(pet.curHp || 0),
    actionSequence,
    damageToBoss,
    damageToTeam,
    healToBoss,
    healToTeam,
    nextBossHp,
    nextPetHp,
    nextStatus,
    resolved: true,
    resolvedAt: now(),
    winner,
  };
  await db.ref().update({
    [`roomBattleResults/${roomId}/${turn}`]: {
      turn,
      summary,
      ...result,
    },
    [`rooms/${roomId}/turn`]: nextTurn,
    [`rooms/${roomId}/bossStance`]: null,
    [`rooms/${roomId}/boss/curHp`]: nextBossHp,
    [`rooms/${roomId}/pet/curHp`]: nextPetHp,
  });
  return { ok: true, turn, result, };
});

// 9) 게임 재시작
export const restartBattleRoom = onCall({ region: REGION }, async (req) => {
  const { roomId, room } = await hostCheck(req);
  if (room?.status !== "ended") {
    throw new HttpsError("failed-precondition", "종료된 게임만 재시작할 수 있습니다.");
  }

  const playersSnap = await db.ref(`roomPlayers/${roomId}`).get();
  const players = playersSnap.val() || {};
  const studentList = Object.values(players).filter((player) => player?.connected);
  if (studentList.length === 0) {
    throw new HttpsError("failed-precondition", "접속한 학생이 없습니다.");
  }

  const teamHp = studentList.reduce((sum, student) => {
    return sum + Number(student?.pet?.hp || 0);
  }, 0);
  if (teamHp <= 0) {
    throw new HttpsError("failed-precondition", "학생 펫 체력을 계산할 수 없습니다.");
  }

  const startedAt = now();
  const updates = {
    [`rooms/${roomId}/status`]: "countdown",
    [`rooms/${roomId}/turn`]: 1,
    [`rooms/${roomId}/startedAt`]: startedAt,
    [`rooms/${roomId}/endedAt`]: null,
    [`rooms/${roomId}/bossStance`]: null,
    [`rooms/${roomId}/boss`]: {
      atk: studentList.length * 30,
      def: studentList.length * 5,
      hp: studentList.length * 200,
      curHp: studentList.length * 200,
    },
    [`rooms/${roomId}/pet`]: { hp: teamHp, curHp: teamHp },
    [`roomStances/${roomId}`]: null,
    [`roomStanceSummary/${roomId}`]: null,
    [`roomBattleResults/${roomId}`]: null,
    [`roomSubmissions/${roomId}`]: null,
    [`roomRuntime/${roomId}`]: null,
  };

  await db.ref().update(updates);
  return { ok: true };
});

// 4) 게임 종료
export const finalizeGame = onCall({ region: REGION }, async (req) => {
  const { roomId } = await hostCheck(req);

  // battleCode를 역조회해 현재 방을 가리키는 코드를 찾습니다.
  const codeSnap = await db.ref("battleCodes").get();
  const updates = {
    [`rooms/${roomId}`]: null,
    [`roomPlayers/${roomId}`]: null,
    [`roomStances/${roomId}`]: null,
    [`roomStanceSummary/${roomId}`]: null,
    [`roomSubmissions/${roomId}`]: null,
    [`roomRuntime/${roomId}`]: null,
  };

  if (codeSnap.exists()) {
    const allCodes = codeSnap.val();
    Object.entries(allCodes).forEach(([code, v]) => {
      if (v?.roomId === roomId) updates[`battleCodes/${code}`] = null;
    });
  }

  // roomBattleResults는 결과 확인을 위해 보존합니다.
  await db.ref().update(updates);
  return { ok: true };
});

// 5) 주기성 함수
export const cleanupExpiredRooms = onSchedule(
  { region: REGION, schedule: "every 30 minutes" },
  async () => {
    const current = now();
    // battleCodes 만료 삭제
    const codeSnap = await db.ref("battleCodes").get();
    if (codeSnap.exists()) {
      const codes = codeSnap.val();
      const codeUpdates = {};
      Object.entries(codes).forEach(([code, v]) => {
        if (v?.expiresAt && v.expiresAt < current) {
          codeUpdates[code] = null;
        }
      });
      if (Object.keys(codeUpdates).length > 0) {
        await db.ref("battleCodes").update(codeUpdates);
      }
    }
    // 종료 후 1시간 지난 방 정리
    const roomsSnap = await db.ref("rooms").get();
    if (!roomsSnap.exists()) return;

    const rooms = roomsSnap.val();
    const rootUpdates = {};
    const ttlMs = 1 * 60 * 60 * 1000;
    Object.entries(rooms).forEach(([roomId, room]) => {
      const isExpiredEndedRoom =
        room?.status === "ended" &&
        room?.endedAt &&
        current - room.endedAt > ttlMs;

      if (isExpiredEndedRoom) {
        rootUpdates[`rooms/${roomId}`] = null;
        rootUpdates[`roomPlayers/${roomId}`] = null;
        rootUpdates[`roomSubmissions/${roomId}`] = null;
        rootUpdates[`roomRuntime/${roomId}`] = null;
      }
    });

    if (Object.keys(rootUpdates).length > 0) {
      await db.ref().update(rootUpdates);
    }
  }
);


