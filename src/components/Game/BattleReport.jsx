import React from 'react'
import { Text, Container, Graphics } from '@pixi/react'
import PetSprite from './PetSprite';

//250112 생성
const BattleReport = ({ result, correct, src, x, y, score, winCount }) => {
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
  const textStyle = {
    fill: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 40,
  }

  //아래 몬스터 스프라이트
  const drawRoundedRect = (g) => {
    g.clear();
    g.lineStyle(4, 0x000000, 1);
    g.beginFill(0xffffff);
    g.drawRoundedRect(x - 550, y + 600, 175, 175, 10);
    g.endFill();
  }
  //결과 보고
  const drawReportRect = (g) => {
    g.clear();
    g.lineStyle(4, 0x000000, 1);
    g.beginFill(0xffffff);
    g.drawRoundedRect(x - 550, y, 1100, 550, 10);
    g.endFill();
  }

  return (<Container>
    <Graphics draw={drawReportRect} />
    <Text
      x={x}
      y={y + 50}
      text="Battle Result"
      anchor={0.5}
      style={headerStyle} />
    <Text
      text={result}
      x={x}
      y={y + 200}
      anchor={0.5}
      style={resultStyles[result]} />
    <Text
      text={`맞춘 개수: ${correct}개 x 100점`}
      x={x}
      y={y + 300}
      anchor={0.5}
      style={textStyle} />
    {result === "Win" && <Text
      text={`승리: 현재 점수 x 2`}
      x={x}
      y={y + 344}
      anchor={0.5}
      style={textStyle} />}
    {result === "Lose" && <Text
      text={`패배: 현재 점수 / 2`}
      x={x}
      y={y + 344}
      anchor={0.5}
      style={textStyle} />}
    <Text
      text={`총점: ${score}점`}
      x={x}
      y={y + 388}
      anchor={0.5}
      style={textStyle} />
    <Text
      text={`얻은 경험치: +5 exp`}
      x={x}
      y={y + 432}
      anchor={0.5}
      style={textStyle} />
    <Text
      text={`생기부 문구 획득까지 ${winCount}번 더 승리하세요 `}
      x={x}
      y={y + 476}
      anchor={0.5}
      style={textStyle} />
    <Graphics draw={drawRoundedRect} />
    <PetSprite src={src} x={x - 460} y={y + 685} width={175} height={175} />
  </Container>
  )
}

export default BattleReport
