import React from 'react'
import { Text, Container, Graphics } from '@pixi/react'
import useMediaQuery from '../../hooks/useMediaQuery';

//creation(250112) -> mobile(250213) -> codex(260704)
const BattleReport = ({ result, correct, x, y, winCount, exp, isMulti, battleStats, battleRankings }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const hasRankings = Array.isArray(battleRankings) && battleRankings.length > 0;
  const hasBattleStats = !!battleStats;
  const damage = Number(battleStats?.damage || 0);
  const heal = Number(battleStats?.heal || 0);
  const defense = Number(battleStats?.defense || 0);
  const displayResult = result || battleStats?.result || "Draw";
  const correctCount = Number(correct || 0);
  const width = isMobile ? window.innerWidth : hasRankings ? 560 : 540;
  const height = isMobile ? 660 : hasRankings ? 720 : hasBattleStats ? 640 : 620;
  const centerX = !isMobile ? x + width / 2 : window.innerWidth * 0.5;
  const panelPadding = 34;
  const contentX = x + panelPadding;
  const contentWidth = width - panelPadding * 2;
  const score = hasBattleStats ? Number(battleStats?.score ?? damage + heal + defense) : displayResult === "Win" ? correctCount * 100 * 2 : correctCount * 100 / 2;
  const resultMetaMap = {
    Win: { label: 'WIN', color: 0x2f6fed, fill: '#2f6fed', bg: 0xeaf1ff },
    Lose: { label: 'LOSE', color: 0xe34850, fill: '#e34850', bg: 0xffeef0 },
    Draw: { label: 'DRAW', color: 0x4b5563, fill: '#4b5563', bg: 0xf1f3f5 },
  };
  const resultMeta = resultMetaMap[displayResult] || resultMetaMap.Draw;
  const rankingRows = hasRankings
    ? battleRankings.slice(0, 8).map((student) => ({
      label: `${student.rank}위 ${student.nickname}`,
      value: `${student.score}점`,
      color: student.rank === 1 ? 0xf59f00 : student.rank === 2 ? 0x868e96 : student.rank === 3 ? 0xc07a2c : 0x3454d1,
    }))
    : [];
  const statRows = hasRankings
    ? rankingRows
    : hasBattleStats
      ? [
        { label: '맞춘 개수', value: `${correctCount}개`, color: 0x3454d1 },
        { label: '보스에게 입힌 데미지', value: damage, color: 0xe34850 },
        { label: '치유량', value: heal, color: 0x2f9e44 },
        { label: '방어력', value: defense, color: 0x1971c2 },
      ]
      : [
        { label: '맞춘 개수', value: `${correctCount}개 x 100점`, color: 0x3454d1 },
        ...(displayResult === "Win" ? [{ label: '승리 보너스', value: '현재 점수 x 2', color: 0x2f6fed }] : []),
        ...(displayResult === "Lose" ? [{ label: '패배 보정', value: '현재 점수 / 2', color: 0xe34850 }] : []),
        ...(!isMulti ? [{ label: '얻은 경험치', value: `+${exp} exp`, color: 0x2f9e44 }] : []),
        ...(!isMulti ? [{ label: '생기부 문구까지', value: `${winCount}번`, color: 0x7c3aed }] : []),
      ];
  const scoreBoxLabel = hasRankings ? '순위 산정 인원' : hasBattleStats ? '기여도 총점' : '총점';
  const scoreBoxValue = hasRankings ? `${battleRankings.length}명` : `${score}점`;

  const drawReportRect = (g) => {
    g.clear();
    g.beginFill(0x000000, 0.18);
    g.drawRoundedRect(x + 8, y + 10, width, height, 16);
    g.endFill();
    g.beginFill(0xffffff);
    g.drawRoundedRect(x, y, width, height, 16);
    g.endFill();
    g.beginFill(0xf4f7ff);
    g.drawRoundedRect(x, y, width, 114, 16);
    g.endFill();
    g.beginFill(0xffffff);
    g.drawRect(x, y + 98, width, 26);
    g.endFill();
  }
  const drawResultBadge = (g) => {
    g.clear();
    g.lineStyle(2, resultMeta.color, 1);
    g.beginFill(resultMeta.bg);
    g.drawRoundedRect(centerX - 118, y + 132, 236, 86, 12);
    g.endFill();
  }
  const drawScoreBox = (g) => {
    g.clear();
    g.lineStyle(2, 0x3454d1, 1);
    g.beginFill(0xeaf1ff);
    g.drawRoundedRect(contentX, y + height - 116, contentWidth, 78, 12);
    g.endFill();
  }
  const titleStyle = {
    fill: '#172033',
    fontSize: isMobile ? 30 : 34,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'center',
  };
  const subtitleStyle = {
    fill: '#667085',
    fontSize: isMobile ? 14 : 16,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'center',
  };
  const resultStyle = {
    fill: resultMeta.fill,
    fontSize: isMobile ? 54 : 64,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'center',
  };
  const labelStyle = {
    fill: '#4b5563',
    fontSize: isMobile ? 17 : 19,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
  };
  const valueStyle = {
    fill: '#111827',
    fontSize: isMobile ? 20 : 22,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'right',
  };
  const scoreLabelStyle = {
    fill: '#3454d1',
    fontSize: isMobile ? 18 : 20,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
  };
  const scoreStyle = {
    fill: '#172033',
    fontSize: isMobile ? 32 : 38,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'right',
  };

  const StatRow = ({ row, index }) => {
    const rowY = y + 252 + index * 54;
    const drawRow = (g) => {
      g.clear();
      g.lineStyle(1, 0xe6eaf3, 1);
      g.beginFill(index % 2 === 0 ? 0xffffff : 0xf8faff);
      g.drawRoundedRect(contentX, rowY, contentWidth, 42, 8);
      g.endFill();
      g.beginFill(row.color);
      g.drawRoundedRect(contentX + 14, rowY + 13, 16, 16, 4);
      g.endFill();
    }

    return (
      <Container>
        <Graphics draw={drawRow} />
        <Text text={row.label} x={contentX + 42} y={rowY + 21} anchor={{ x: 0, y: 0.5 }} style={labelStyle} />
        <Text text={String(row.value)} x={contentX + contentWidth - 18} y={rowY + 21} anchor={{ x: 1, y: 0.5 }} style={valueStyle} />
      </Container>
    )
  }

  return (<Container>
    <Graphics draw={drawReportRect} />
    <Text
      x={centerX}
      y={y + 42}
      text="Battle Result"
      anchor={0.5}
      style={titleStyle} />
    <Text
      text={hasRankings ? "학생 기여도 순위" : hasBattleStats ? "이번 전투 기여도" : "이번 전투 결과"}
      x={centerX}
      y={y + 78}
      anchor={0.5}
      style={subtitleStyle} />
    <Graphics draw={drawResultBadge} />
    <Text
      text={resultMeta.label}
      x={centerX}
      y={y + 174}
      anchor={0.5}
      style={resultStyle} />
    {statRows.map((row, index) => <StatRow key={row.label} row={row} index={index} />)}
    <Graphics draw={drawScoreBox} />
    <Text
      text={scoreBoxLabel}
      x={contentX + 24}
      y={y + height - 77}
      anchor={{ x: 0, y: 0.5 }}
      style={scoreLabelStyle} />
    <Text
      text={scoreBoxValue}
      x={contentX + contentWidth - 24}
      y={y + height - 77}
      anchor={{ x: 1, y: 0.5 }}
      style={scoreStyle} />
  </Container>
  )
}

export default BattleReport
