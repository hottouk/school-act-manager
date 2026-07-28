export const BATTLE_PREMIUM_UNTIL_FIELD = "battlePremiumUntil";
export const BATTLE_PREMIUM_DURATION_DAYS = 30;
export const BATTLE_PREMIUM_DURATION_MS =
  BATTLE_PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000;

export const getPremiumUntilMillis = (value) => {
  if (value == null) return null;

  if (value instanceof Date) {
    const millis = value.getTime();
    return Number.isFinite(millis) ? millis : null;
  }

  if (typeof value?.toMillis === "function") {
    try {
      const millis = value.toMillis();
      return Number.isFinite(millis) ? millis : null;
    } catch {
      return null;
    }
  }

  if (typeof value === "object" && Number.isFinite(value.seconds)) {
    const nanoseconds = Number.isFinite(value.nanoseconds) ?
      value.nanoseconds :
      0;
    return value.seconds * 1000 + Math.floor(nanoseconds / 1000000);
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const millis = Date.parse(value);
    return Number.isFinite(millis) ? millis : null;
  }

  return null;
};

export const isBattlePremiumActive = (
    premiumUntil,
    now = Date.now(),
) => {
  const premiumUntilMillis = getPremiumUntilMillis(premiumUntil);
  const nowMillis = getPremiumUntilMillis(now);

  if (premiumUntilMillis == null || nowMillis == null) return false;
  return premiumUntilMillis > nowMillis;
};

export const isUserBattlePremium = (userData, now = Date.now()) => (
  isBattlePremiumActive(userData?.[BATTLE_PREMIUM_UNTIL_FIELD], now)
);
// 서비스에서 프리미엄 만료일을 갱신할 때, 현재 만료일이 이미 지났다면 현재 시각을 기준으로 갱신하고
// , 아직 남아있다면 기존 만료일을 기준으로 갱신하도록 한다.
export const calculateNextPremiumUntil = (
    currentPremiumUntil,
    now = Date.now(),
) => {
  const nowMillis = getPremiumUntilMillis(now);
  if (nowMillis == null) {
    throw new TypeError("현재 시각이 올바르지 않습니다.");
  }

  const currentPremiumUntilMillis =
    getPremiumUntilMillis(currentPremiumUntil);
  const baseMillis = currentPremiumUntilMillis > nowMillis ?
    currentPremiumUntilMillis :
    nowMillis;

  return baseMillis + BATTLE_PREMIUM_DURATION_MS;
};
