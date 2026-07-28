export const FREE_BATTLE_SETTINGS = Object.freeze({
  bossType: "shadow-lord",
  backgroundId: "crystal-cave",
  maxRounds: 3,
});

const BOSS_SETTINGS = Object.freeze({
  "shadow-lord": Object.freeze({
    statPerPlayer: Object.freeze({hp: 120, atk: 50, def: 1}),
  }),
  "iron-spider": Object.freeze({
    statPerPlayer: Object.freeze({hp: 200, atk: 30, def: 5}),
  }),
  "killer-eyes": Object.freeze({
    statPerPlayer: Object.freeze({hp: 150, atk: 35, def: 3}),
  }),
});

const BACKGROUND_IDS = new Set([
  "crystal-cave",
  "sunset-field",
  "moon-forest",
]);
const ROUND_OPTIONS = new Set([3, 5, 7, 10]);

/**
 * 배틀 설정 규칙 위반을 Callable Function 오류로 변환하기 위한 오류입니다.
 */
export class BattleSettingRuleError extends Error {
  /**
   * @param {string} code Firebase Functions 오류 코드
   * @param {string} message 사용자에게 전달할 오류 메시지
   */
  constructor(code, message) {
    super(message);
    this.name = "BattleSettingRuleError";
    this.code = code;
  }
}

export const resolveBattleSettings = ({
  isPremium,
  bossType = FREE_BATTLE_SETTINGS.bossType,
  backgroundId = FREE_BATTLE_SETTINGS.backgroundId,
  maxRounds = FREE_BATTLE_SETTINGS.maxRounds,
}) => {
  const requestedRounds = Number(maxRounds);

  if (!Object.hasOwn(BOSS_SETTINGS, bossType)) {
    throw new BattleSettingRuleError(
        "invalid-argument",
        "지원하지 않는 보스 몬스터입니다.",
    );
  }
  if (!BACKGROUND_IDS.has(backgroundId)) {
    throw new BattleSettingRuleError(
        "invalid-argument",
        "지원하지 않는 배경화면입니다.",
    );
  }
  if (!ROUND_OPTIONS.has(requestedRounds)) {
    throw new BattleSettingRuleError(
        "invalid-argument",
        "지원하지 않는 라운드 수입니다.",
    );
  }

  const usesPremiumSetting =
    bossType !== FREE_BATTLE_SETTINGS.bossType ||
    backgroundId !== FREE_BATTLE_SETTINGS.backgroundId ||
    requestedRounds !== FREE_BATTLE_SETTINGS.maxRounds;

  if (usesPremiumSetting && !isPremium) {
    throw new BattleSettingRuleError(
        "permission-denied",
        "프리미엄 이용권이 필요한 배틀 설정입니다.",
    );
  }

  return {
    bossType,
    backgroundId,
    maxRounds: requestedRounds,
    bossStatPerPlayer: {...BOSS_SETTINGS[bossType].statPerPlayer},
    settingTier: isPremium ? "premium" : "free",
  };
};
