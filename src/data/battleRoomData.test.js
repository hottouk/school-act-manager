import {
  BACKGROUND_OPTIONS,
  BOSS_OPTIONS,
  DEFAULT_BACKGROUND_ID,
  DEFAULT_BOSS_ID,
  ROUND_OPTIONS,
} from './battleRoomData'

test('무료 기본 설정과 프리미엄 선택지가 서버 정책과 일치한다', () => {
  expect(DEFAULT_BOSS_ID).toBe('shadow-lord')
  expect(DEFAULT_BACKGROUND_ID).toBe('crystal-cave')
  expect(ROUND_OPTIONS).toEqual([3, 5, 7, 10])
  expect(BOSS_OPTIONS.map(({ id }) => id)).toEqual([
    'shadow-lord',
    'iron-spider',
    'killer-eyes',
  ])
  expect(BACKGROUND_OPTIONS.map(({ id }) => id)).toEqual([
    'crystal-cave',
    'sunset-field',
    'moon-forest',
  ])
})

test('클라이언트 보스 능력치가 서버의 고정 능력치와 일치한다', () => {
  expect(BOSS_OPTIONS.map(({ id, statPerPlayer }) => ({
    id,
    statPerPlayer,
  }))).toEqual([
    {
      id: 'shadow-lord',
      statPerPlayer: { hp: 120, atk: 50, def: 1 },
    },
    {
      id: 'iron-spider',
      statPerPlayer: { hp: 200, atk: 30, def: 5 },
    },
    {
      id: 'killer-eyes',
      statPerPlayer: { hp: 150, atk: 35, def: 3 },
    },
  ])
})
