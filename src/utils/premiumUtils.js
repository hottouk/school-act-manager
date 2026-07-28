export const BATTLE_PREMIUM_UNTIL_FIELD = 'battlePremiumUntil'
export const BATTLE_PREMIUM_PRICE = 3300
export const BATTLE_PREMIUM_DURATION_DAYS = 30

export const getPremiumUntilMillis = (value) => {
  if (value == null) return null

  if (value instanceof Date) {
    const millis = value.getTime()
    return Number.isFinite(millis) ? millis : null
  }

  if (typeof value?.toMillis === 'function') {
    try {
      const millis = value.toMillis()
      return Number.isFinite(millis) ? millis : null
    } catch {
      return null
    }
  }

  if (typeof value === 'object' && Number.isFinite(value.seconds)) {
    const nanoseconds = Number.isFinite(value.nanoseconds) ? value.nanoseconds : 0
    return value.seconds * 1000 + Math.floor(nanoseconds / 1000000)
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string' && value.trim()) {
    const millis = Date.parse(value)
    return Number.isFinite(millis) ? millis : null
  }

  return null
}

export const isBattlePremiumActive = (
  premiumUntil,
  now = Date.now()
) => {
  const premiumUntilMillis = getPremiumUntilMillis(premiumUntil)
  const nowMillis = getPremiumUntilMillis(now)

  if (premiumUntilMillis == null || nowMillis == null) return false
  return premiumUntilMillis > nowMillis
}

export const isUserBattlePremium = (userData, now = Date.now()) => (
  isBattlePremiumActive(userData?.[BATTLE_PREMIUM_UNTIL_FIELD], now)
)
