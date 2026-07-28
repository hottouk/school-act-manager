import crystalCaveBackground from '../image/battle/battle-crystal-cave.webp'
import sunsetFieldBackground from '../image/battle/battle-field.webp'
import moonForestBackground from '../image/battle/battle-moon-forest.webp'

export const BOSS_OPTIONS = [
  {
    id: 'shadow-lord',
    name: '악황가리',
    description: '어둠의 기운을 다루는 거대한 보스',
    frontPath: 'images/mon/mon_evil_001_3.png',
    backPath: 'images/mon/mon_evil_001_3_back.gif',
    accent: '#7c3aed',
    statPerPlayer: { hp: 120, atk: 50, def: 1 },
  },
  {
    id: 'iron-spider',
    name: '전자철거미',
    description: '단단한 장갑을 두른 기계 거미 보스',
    frontPath: 'images/mon/mon_evil_002_3.png',
    backPath: 'images/mon/mon_evil_002_3_back.png',
    accent: '#2563eb',
    statPerPlayer: { hp: 200, atk: 30, def: 5 },
  },
  {
    id: 'killer-eyes',
    name: '살목눈이',
    description: '수많은 눈으로 모험가의 동선을 예측하고 공격하는 보스.',
    frontPath: 'images/mon/mon_evil_003_3.webp',
    backPath: 'images/mon/mon_evil_003_3_back.webp',
    accent: '#db2777',
    statPerPlayer: { hp: 150, atk: 35, def: 3 },
  },
]

export const BACKGROUND_OPTIONS = [
  {
    id: 'crystal-cave',
    name: '수정 동굴',
    description: '푸른 수정이 빛나는 신비로운 동굴',
    image: crystalCaveBackground,
  },
  {
    id: 'sunset-field',
    name: '노을 평원',
    description: '붉은 노을이 펼쳐진 따뜻한 전장',
    image: sunsetFieldBackground,
  },
  {
    id: 'moon-forest',
    name: '달빛 숲',
    description: '별과 달빛이 비추는 깊은 숲',
    image: moonForestBackground,
  },
]

export const ROUND_OPTIONS = [3, 5, 7, 10]

export const DEFAULT_BOSS_ID = BOSS_OPTIONS[0].id
export const DEFAULT_BACKGROUND_ID = BACKGROUND_OPTIONS[0].id

export const getBossOption = (bossType) => (
  BOSS_OPTIONS.find(({ id }) => id === bossType) || BOSS_OPTIONS[0]
)

export const getBackgroundOption = (backgroundId) => (
  BACKGROUND_OPTIONS.find(({ id }) => id === backgroundId) || BACKGROUND_OPTIONS[0]
)
