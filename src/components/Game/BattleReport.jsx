import React from 'react'
import { Text, Container, Graphics } from '@pixi/react'
import PetSprite from './PetSprite';

//25.01.12
const BattleReport = ({ result, correct, src, x, y }) => {
  const headerStyle = {
    fill: ['#3454d1', '#4a77e2'], // 그라데이션 색상 (시작, 끝)
    fontSize: 55, // 크기 증가
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    stroke: '#1e3a8a', // 외곽선 색상
    strokeThickness: 3, // 외곽선 두께
    dropShadow: true, // 그림자 효과
    dropShadowColor: '#1e3a8a', // 그림자 색상
    dropShadowBlur: 8, // 그림자 블러 강도
    dropShadowAngle: Math.PI / 4, // 그림자 각도
    dropShadowDistance: 5, // 그림자 거리
    align: 'center', // 텍스트 정렬
  };
  const resultStyles = {
    Win: { fill: '#0000ff', fontSize: 155, fontWeight: 'bold' },  // 파랑
    Lose: { fill: '#ff0000', fontSize: 155, fontWeight: 'bold' }, // 빨강
    Draw: { fill: '#000000', fontSize: 155, fontWeight: 'bold' }, // 검정
  };
  const drawRoundedRect = (g) => {
    g.clear();
    g.lineStyle(4, 0x000000, 1);
    g.beginFill(0xffffff);
    g.drawRoundedRect(x - 1075, y + 500, 175, 175, 10);
    g.endFill();
  }

  return (<Container x={x} y={y}>
    <Text
      text="Battle Result"
      anchor={0.5}
      style={headerStyle} />
    <Text
      text={result}
      y={y + 150}
      anchor={0.5}
      style={resultStyles[result]} />
    <Text
      text={`맞춘 개수: ${correct}개`}
      y={y + 300}
      anchor={0.5}
      style={{ fill: '#000000', fontSize: 55, fontWeight: 'bold' }} />
    <Graphics draw={drawRoundedRect} />
    <PetSprite src={src} x={x - 985} y={y + 575} width={200} height={200} />
  </Container>
  )
}

export default BattleReport
