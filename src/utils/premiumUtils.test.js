import {
  BATTLE_PREMIUM_DURATION_DAYS,
  BATTLE_PREMIUM_PRICE,
  BATTLE_PREMIUM_UNTIL_FIELD,
  getPremiumUntilMillis,
  isBattlePremiumActive,
  isUserBattlePremium,
} from './premiumUtils'

const NOW = Date.UTC(2026, 6, 27, 0, 0, 0)

test('프리미엄 필드 이름을 한 곳에서 관리한다', () => {
  expect(BATTLE_PREMIUM_UNTIL_FIELD).toBe('battlePremiumUntil')
  expect(BATTLE_PREMIUM_PRICE).toBe(3300)
  expect(BATTLE_PREMIUM_DURATION_DAYS).toBe(30)
})

test('만료일이 현재 시각보다 뒤에 있을 때만 프리미엄으로 판단한다', () => {
  expect(isBattlePremiumActive(NOW + 1, NOW)).toBe(true)
  expect(isBattlePremiumActive(NOW, NOW)).toBe(false)
  expect(isBattlePremiumActive(NOW - 1, NOW)).toBe(false)
  expect(isBattlePremiumActive(null, NOW)).toBe(false)
})

test('Firestore Timestamp와 직렬화된 Timestamp를 지원한다', () => {
  expect(getPremiumUntilMillis({ toMillis: () => NOW + 123 })).toBe(NOW + 123)
  expect(getPremiumUntilMillis({
    seconds: Math.floor(NOW / 1000),
    nanoseconds: 456000000,
  })).toBe(NOW + 456)
})

test('사용자 데이터가 없거나 만료일 필드가 없으면 무료로 판단한다', () => {
  expect(isUserBattlePremium({
    battlePremiumUntil: NOW + 1,
  }, NOW)).toBe(true)
  expect(isUserBattlePremium({}, NOW)).toBe(false)
  expect(isUserBattlePremium(null, NOW)).toBe(false)
})
