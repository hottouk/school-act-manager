import React from 'react';
import styled from 'styled-components';

const SVGWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.size}px;
  height: 100%;
  border-radius: 5px;
  background-color: white;
`;

const SVG = styled.svg`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

/**
 * 육각형 레이더 차트 컴포넌트
 * @param {Array<number>} values - 6개의 값 배열 [값1, 값2, 값3, 값4, 값5, 값6]
 * @param {number} maxValue - 최대값 (기본값: 100)
 * @param {Array<string>} labels - 각 축의 라벨 (선택사항)
 * @param {number} size - SVG 크기 (기본값: 300)
 * @param {string} fillColor - 채우기 색상 (기본값: 'rgba(100, 150, 255, 0.3)')
 * @param {string} strokeColor - 선 색상 (기본값: 'rgba(100, 150, 255, 0.8)')
 * @param {string} gridColor - 격자 색상 (기본값: 'rgba(200, 200, 200, 0.2)')
 * @param {string} labelColor - 라벨 색상 (기본값: '#333')
 */
const HexagonRadarChart = ({
  values = [0, 0, 0, 0, 0, 0],
  maxValue = 100,
  labels = ['축1', '축2', '축3', '축4', '축5', '축6'],
  size = 300,
  fillColor = 'rgba(100, 150, 255, 0.3)',
  strokeColor = 'rgba(100, 150, 255, 0.8)',
  gridColor = 'rgba(200, 200, 200, 0.2)',
  labelColor = '#333',
}) => {
  if (!Array.isArray(values) || values.length !== 6) {
    console.warn('HexagonRadarChart: values must be an array of 6 numbers');
    return null;
  }

  const center = size / 2;
  const radius = (size / 2) * 0.75;
  const angleSlice = (Math.PI * 2) / 6;
  const strokeWidth = 2;
  const gridLines = 4;

  // 각도를 데카르트 좌표로 변환
  const getCoordinates = (value, index) => {
    const angle = angleSlice * index - Math.PI / 2;
    const scaledRadius = (value / maxValue) * radius;
    const x = center + scaledRadius * Math.cos(angle);
    const y = center + scaledRadius * Math.sin(angle);
    return { x, y };
  };

  // 격자선 생성
  const gridPoints = Array.from({ length: gridLines }, (_, gridIndex) => {
    const gridRadius = (radius / gridLines) * (gridIndex + 1);
    const points = Array.from({ length: 6 }, (_, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = center + gridRadius * Math.cos(angle);
      const y = center + gridRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  // 축선 생성
  const axisLines = Array.from({ length: 6 }, (_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, index: i };
  });

  // 데이터 다각형 포인트
  const dataPoints = values
    .map((value, index) => getCoordinates(value, index))
    .map((coord) => `${coord.x},${coord.y}`)
    .join(' ');

  // 라벨 위치
  const labelRadius = radius * 1.15;
  const labelCoordinates = Array.from({ length: 6 }, (_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return { x, y, index: i };
  });

  return (
    <SVGWrapper size={size}>
      <SVG size={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 격자선 */}
        {gridPoints.map((points, index) => (
          <polygon
            key={`grid-${index}`}
            points={points}
            fill="none"
            stroke={gridColor}
            strokeWidth="1"
          />
        ))}

        {/* 축선 */}
        {axisLines.map((axis) => (
          <line
            key={`axis-${axis.index}`}
            x1={center}
            y1={center}
            x2={axis.x}
            y2={axis.y}
            stroke={gridColor}
            strokeWidth="1"
          />
        ))}

        {/* 데이터 다각형 */}
        <polygon
          points={dataPoints}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />

        {/* 데이터 포인트 표시 */}
        {values.map((value, index) => {
          const coords = getCoordinates(value, index);
          return (
            <circle
              key={`point-${index}`}
              cx={coords.x}
              cy={coords.y}
              r="4"
              fill={strokeColor}
            />
          );
        })}

        {/* 라벨 */}
        {labelCoordinates.map((coord) => (
          <text
            key={`label-${coord.index}`}
            x={coord.x}
            y={coord.y}
            textAnchor="middle"
            dy="0.3em"
            fontSize="12"
            fontWeight="500"
            fill={labelColor}
            fontFamily="Arial, sans-serif"
          >
            {labels[coord.index]}
          </text>
        ))}

        {/* 중심점 */}
        <circle cx={center} cy={center} r="2" fill={labelColor} />
      </SVG>
    </SVGWrapper>
  );
};

export default HexagonRadarChart;
