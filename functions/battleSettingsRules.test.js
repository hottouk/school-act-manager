import test from "node:test";
import assert from "node:assert/strict";
import {
  BattleSettingRuleError,
  FREE_BATTLE_SETTINGS,
  resolveBattleSettings,
} from "./battleSettingsRules.js";

test("무료 사용자는 악황가리, 수정 동굴, 3라운드만 사용할 수 있다", () => {
  const settings = resolveBattleSettings({
    isPremium: false,
    ...FREE_BATTLE_SETTINGS,
  });

  assert.deepEqual(settings, {
    bossType: "shadow-lord",
    backgroundId: "crystal-cave",
    maxRounds: 3,
    bossStatPerPlayer: {hp: 120, atk: 50, def: 1},
    settingTier: "free",
  });
});

[
  {bossType: "iron-spider"},
  {backgroundId: "sunset-field"},
  {maxRounds: 5},
].forEach((restrictedSetting) => {
  test("무료 사용자의 프리미엄 설정 요청을 거절한다", () => {
    assert.throws(
        () => resolveBattleSettings({
          isPremium: false,
          ...FREE_BATTLE_SETTINGS,
          ...restrictedSetting,
        }),
        (error) => (
          error instanceof BattleSettingRuleError &&
          error.code === "permission-denied"
        ),
    );
  });
});

test("프리미엄 사용자는 모든 프리미엄 설정을 사용할 수 있다", () => {
  const settings = resolveBattleSettings({
    isPremium: true,
    bossType: "killer-eyes",
    backgroundId: "moon-forest",
    maxRounds: 10,
  });

  assert.deepEqual(settings, {
    bossType: "killer-eyes",
    backgroundId: "moon-forest",
    maxRounds: 10,
    bossStatPerPlayer: {hp: 150, atk: 35, def: 3},
    settingTier: "premium",
  });
});

test("목록에 없는 설정은 프리미엄 사용자에게도 허용하지 않는다", () => {
  assert.throws(
      () => resolveBattleSettings({
        isPremium: true,
        bossType: "unknown-boss",
        backgroundId: "crystal-cave",
        maxRounds: 3,
      }),
      (error) => (
        error instanceof BattleSettingRuleError &&
        error.code === "invalid-argument"
      ),
  );
});
