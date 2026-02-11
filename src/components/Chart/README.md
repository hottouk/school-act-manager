# 육각형 레이더 차트 컴포넌트

6개의 수치를 입력받아 SVG로 렌더링되는 육각형 레이더 차트 컴포넌트입니다.

## 설치

컴포넌트는 이미 `src/components/Chart/` 폴더에 있습니다.

## 사용법

### 기본 사용

```jsx
import { HexagonRadarChart } from './components/Chart';

function MyComponent() {
  return (
    <HexagonRadarChart
      values={[60, 75, 50, 80, 65, 70]}
      maxValue={100}
      labels={['힘', '속도', '지구력', '방어력', '마력', '행운']}
      size={300}
    />
  );
}
```

### Props

| Prop | Type | 기본값 | 설명 |
|------|------|--------|------|
| `values` | `Array<number>` | `[0,0,0,0,0,0]` | **필수** - 6개의 값 배열 |
| `maxValue` | `number` | `100` | 최대값 (스케일 기준) |
| `labels` | `Array<string>` | `['축1','축2',...,'축6']` | 각 축의 라벨 |
| `size` | `number` | `300` | SVG 크기 (픽셀) |
| `fillColor` | `string` | `rgba(100, 150, 255, 0.3)` | 채우기 색상 |
| `strokeColor` | `string` | `rgba(100, 150, 255, 0.8)` | 선 색상 |
| `gridColor` | `string` | `rgba(200, 200, 200, 0.2)` | 격자선 색상 |
| `labelColor` | `string` | `#333` | 라벨 텍스트 색상 |

## 예시 1: 게임 캐릭터 능력치

```jsx
<HexagonRadarChart
  values={[85, 70, 65, 80, 75, 60]}
  maxValue={100}
  labels={['공격력', '방어력', '속도', '체력', '마력', '행운']}
  size={350}
  fillColor="rgba(255, 100, 100, 0.3)"
  strokeColor="rgba(255, 100, 100, 0.8)"
/>
```

## 예시 2: 학생 평가 점수

```jsx
<HexagonRadarChart
  values={[80, 85, 75, 90, 70, 88]}
  maxValue={100}
  labels={['국어', '영어', '수학', '과학', '사회', '음악']}
  size={400}
  fillColor="rgba(100, 200, 100, 0.3)"
  strokeColor="rgba(100, 200, 100, 0.8)"
/>
```

## 데모

데모 컴포넌트를 사용하여 빠르게 테스트할 수 있습니다:

```jsx
import { HexagonRadarChartDemo } from './components/Chart';

function App() {
  return <HexagonRadarChartDemo />;
}
```

데모는 다음 기능을 제공합니다:
- 🎲 각 값을 슬라이더로 조정
- 🎲 최대값 동적 변경
- 🎲 축 라벨 커스터마이징
- 🎲 랜덤 값 생성
- 🎲 초기화 기능

## 특징

- ✅ **반응형 SVG** - 모든 크기로 자동 조정
- ✅ **커스터마이징** - 색상, 크기, 라벨 모두 변경 가능
- ✅ **부드러운 렌더링** - 고정도 표현
- ✅ **경량** - 외부 차트 라이브러리 불필요
- ✅ **접근성** - 시맨틱 SVG 마크업

## 기술 스택

- React 18+
- styled-components
- SVG (Canvas 불필요)

## 주의사항

- `values` 배열은 정확히 6개의 요소를 가져야 합니다
- 모든 값은 0 이상 `maxValue` 이하여야 합니다 (자동 정규화됨)
- `labels` 배열도 6개의 요소를 가져야 합니다
