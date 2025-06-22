import React from 'react'
import { Text, Container, Graphics } from '@pixi/react'
import PetSprite from './PetSprite';
import useMediaQuery from '../../hooks/useMediaQuery';

//250112 생성 -> 모바일(250213)
const BattleReport = ({ result, correct, src, x, y, score, winCount, exp }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const titleFontSize = isMobile ? 35 : 55;
  const width = isMobile ? window.innerWidth : 500;
  const height = isMobile ? 600 : 550;
  const headerStyle = {
    fill: ['#3454d1', '#4a77e2'], // 그라데이션 색상 (시작, 끝)
    fontSize: titleFontSize, // 크기 증가
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
    g.drawRoundedRect(x - 290, y + 600, 175, 175, 10);
    g.endFill();
  }
  //결과 보고
  const drawReportRect = (g) => {
    g.clear();
    g.lineStyle(4, 0x000000, 1);
    g.beginFill(0xffffff);
    g.drawRoundedRect(x, y, width, height, 10);
    g.endFill();
  }

  return (<Container>
    <Graphics draw={drawReportRect} anchor={0.5} />
    <Text
      x={!isMobile ? (x + 250) : (window.innerWidth * 0.5)}
      y={y + 50}
      text="Battle Result"
      anchor={0.5}
      style={headerStyle} />
    <Text
      text={result}
      x={!isMobile ? (x + 250) : (window.innerWidth * 0.5)}
      y={y + 200}
      anchor={0.5}
      style={resultStyles[result]} />
    <Text
      text={`맞춘 개수: ${correct}개 x 100점`}
      x={!isMobile ? (x + 250) : (window.innerWidth * 0.5)}
      y={y + 300}
      anchor={0.5}
      style={textStyle} />
    {result === "Win" && <Text
      text={`승리: 현재 점수 x 2`}
      x={!isMobile ? (x + 250) : (window.innerWidth * 0.5)}
      y={y + 344}
      anchor={0.5}
      style={textStyle} />}
    {result === "Lose" && <Text
      text={`패배: 현재 점수 / 2`}
      x={!isMobile ? (x + 250) : (window.innerWidth * 0.5)}
      y={y + 344}
      anchor={0.5}
      style={textStyle} />}
    <Text
      text={`총점: ${score}점`}
      x={!isMobile ? (x + 250) : (window.innerWidth * 0.5)}
      y={y + 388}
      anchor={0.5}
      style={textStyle} />
    <Text
      text={`얻은 경험치: +${exp} exp`}
      x={!isMobile ? (x + 250) : (window.innerWidth * 0.5)}
      y={y + 432}
      anchor={0.5}
      style={textStyle} />
    <Text
      text={`생기부 문구 획득까지 ${winCount}번!`}
      x={!isMobile ? (x + 250) : (window.innerWidth * 0.5)}
      y={y + 476}
      anchor={0.5}
      style={textStyle} />
    <Graphics draw={drawRoundedRect} />
    {!isMobile && <PetSprite src={src} x={x - 200} y={y + 685} width={175} height={175} />}
  </Container>
  )
}

export default BattleReport
