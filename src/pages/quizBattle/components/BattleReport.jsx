import React from 'react'
import { Container, Graphics } from '@pixi/react'
import { Text } from '../../../components/Game/SafePixiText';
import useMediaQuery from '../../../hooks/useMediaQuery';

//creation(250112) -> mobile(250213) -> codex(260704)
const BattleReport = ({ result, endReason, correct, wrong, x, y, stageWidth = 1200, stageHeight = 900, winCount, exp, isMulti, battleStats, battleRankings }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const hasRankings = Array.isArray(battleRankings) && battleRankings.length > 0;
  const hasBattleStats = !!battleStats;
  const damage = Number(battleStats?.damage || 0);
  const heal = Number(battleStats?.heal || 0);
  const defense = Number(battleStats?.defense || 0);
  const displayResult = result || battleStats?.result || "Draw";
  const resultSubtitle = endReason === "questions_exhausted"
    ? "남은 문제를 모두 사용해 학생 팀이 패배했습니다."
    : hasRankings
      ? "학생 기여도 순위"
      : hasBattleStats
        ? "이번 전투 기여도"
        : "이번 전투 결과";
  const correctCount = Number(correct || 0);
  const hasWrongCount = wrong !== undefined && wrong !== null;
  const wrongCount = Number(wrong || 0);
  const safeStageWidth = Number(stageWidth) || 1200;
  const safeStageHeight = Number(stageHeight) || 900;
  const mobileMarginX = 60;
  const width = isMobile ? safeStageWidth - mobileMarginX * 2 : hasRankings ? 560 : 540;
  const height = isMobile
    ? hasRankings ? 820 : hasBattleStats ? 720 : 680
    : hasRankings ? 720 : hasBattleStats ? 640 : 620;
  const reportX = isMobile ? mobileMarginX : x;
  const reportY = isMobile ? (safeStageHeight - height) / 2 : y;
  const centerX = reportX + width / 2;
  const panelPadding = isMobile ? 52 : 34;
  const contentX = reportX + panelPadding;
  const contentWidth = width - panelPadding * 2;
  const resultBadgeWidth = isMobile ? 420 : 236;
  const resultBadgeHeight = isMobile ? 110 : 86;
  const scoreBoxHeight = isMobile ? 92 : 78;
  const scoreBoxBottom = 38;
  const scoreBoxY = reportY + height - scoreBoxBottom - scoreBoxHeight;
  const scoreBoxCenterY = scoreBoxY + scoreBoxHeight / 2;
  const statRowHeight = isMobile ? 48 : 42;
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
        ...(hasWrongCount ? [{ label: '틀린 개수', value: `${wrongCount}개`, color: 0xe34850 }] : []),
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
    g.drawRoundedRect(reportX + 8, reportY + 10, width, height, 16);
    g.endFill();
    g.beginFill(0xffffff);
    g.drawRoundedRect(reportX, reportY, width, height, 16);
    g.endFill();
    g.beginFill(0xf4f7ff);
    g.drawRoundedRect(reportX, reportY, width, 114, 16);
    g.endFill();
    g.beginFill(0xffffff);
    g.drawRect(reportX, reportY + 98, width, 26);
    g.endFill();
  }
  const drawResultBadge = (g) => {
    g.clear();
    g.lineStyle(2, resultMeta.color, 1);
    g.beginFill(resultMeta.bg);
    g.drawRoundedRect(centerX - resultBadgeWidth / 2, reportY + 132, resultBadgeWidth, resultBadgeHeight, 12);
    g.endFill();
  }
  const drawScoreBox = (g) => {
    g.clear();
    g.lineStyle(2, 0x3454d1, 1);
    g.beginFill(0xeaf1ff);
    g.drawRoundedRect(contentX, scoreBoxY, contentWidth, scoreBoxHeight, 12);
    g.endFill();
  }
  const titleStyle = {
    fill: '#172033',
    fontSize: isMobile ? 42 : 34,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'center',
  };
  const subtitleStyle = {
    fill: '#667085',
    fontSize: isMobile ? 22 : 16,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'center',
  };
  const resultStyle = {
    fill: resultMeta.fill,
    fontSize: isMobile ? 72 : 64,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'center',
  };
  const labelStyle = {
    fill: '#4b5563',
    fontSize: isMobile ? 28 : 19,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
  };
  const valueStyle = {
    fill: '#111827',
    fontSize: isMobile ? 30 : 22,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'right',
  };
  const scoreLabelStyle = {
    fill: '#3454d1',
    fontSize: isMobile ? 28 : 20,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
  };
  const scoreStyle = {
    fill: '#172033',
    fontSize: isMobile ? 44 : 38,
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
    align: 'right',
  };

  const StatRow = ({ row, index }) => {
    const rowY = reportY + 252 + index * 54;
    const drawRow = (g) => {
      g.clear();
      g.lineStyle(1, 0xe6eaf3, 1);
      g.beginFill(index % 2 === 0 ? 0xffffff : 0xf8faff);
      g.drawRoundedRect(contentX, rowY, contentWidth, statRowHeight, 8);
      g.endFill();
      g.beginFill(row.color);
      g.drawRoundedRect(contentX + 14, rowY + (statRowHeight - 16) / 2, 16, 16, 4);
      g.endFill();
    }

    return (
      <Container>
        <Graphics draw={drawRow} />
        <Text text={String(row.label ?? '')} x={contentX + 42} y={rowY + statRowHeight / 2} anchor={{ x: 0, y: 0.5 }} style={labelStyle} />
        <Text text={String(row.value ?? '')} x={contentX + contentWidth - 18} y={rowY + statRowHeight / 2} anchor={{ x: 1, y: 0.5 }} style={valueStyle} />
      </Container>
    )
  }

  return (<Container>
    <Graphics draw={drawReportRect} />
    <Text
      x={centerX}
      y={reportY + 42}
      text="Battle Result"
      anchor={0.5}
      style={titleStyle} />
    <Text
      text={resultSubtitle}
      x={centerX}
      y={reportY + 78}
      anchor={0.5}
      style={subtitleStyle} />
    <Graphics draw={drawResultBadge} />
    <Text
      text={resultMeta.label}
      x={centerX}
      y={reportY + (isMobile ? 187 : 174)}
      anchor={0.5}
      style={resultStyle} />
    {statRows.map((row, index) => <StatRow key={row.label} row={row} index={index} />)}
    <Graphics draw={drawScoreBox} />
    <Text
      text={scoreBoxLabel}
      x={contentX + 24}
      y={scoreBoxCenterY}
      anchor={{ x: 0, y: 0.5 }}
      style={scoreLabelStyle} />
    <Text
      text={scoreBoxValue}
      x={contentX + contentWidth - 24}
      y={scoreBoxCenterY}
      anchor={{ x: 1, y: 0.5 }}
      style={scoreStyle} />
  </Container>
  )
}

export default BattleReport
