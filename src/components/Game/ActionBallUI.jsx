import { Container, Graphics, Text } from '@pixi/react';
import React from 'react'

const ActionBallUI = ({ x, y, width, height, correctAnswer = 0 }) => {
  const totalCircles = 5;
  const safeCorrectAnswer = Number.isFinite(Number(correctAnswer))
    ? Math.min(Math.max(Number(correctAnswer), 0), totalCircles)
    : 0;
  const isCompact = width < 360;
  const circleRadius = Math.min(15, height * 0.24);
  const availableBallWidth = Math.max(width - (isCompact ? 92 : 160), circleRadius * totalCircles);
  const circleSpacing = Math.min(42, availableBallWidth / (totalCircles - 1));
  const ballsWidth = (totalCircles - 1) * circleSpacing;
  const ballsCenterX = isCompact ? width / 2 - 18 : width / 2 + 22;
  const startX = ballsCenterX - ballsWidth / 2;
  const centerY = height / 2;

  const drawPanel = (g) => {
    g.clear();

    g.beginFill(0x07111f, 0.28);
    g.drawRoundedRect(4, 7, width - 8, height - 3, 16);
    g.endFill();

    g.lineStyle(2, 0x24405f, 0.95);
    g.beginFill(0xf7fbff, 0.96);
    g.drawRoundedRect(0, 0, width, height, 16);
    g.endFill();

    g.beginFill(0x2f80ed, 1);
    g.drawRoundedRect(12, 13, 6, height - 26, 3);
    g.endFill();
  };

  const drawTrack = (g) => {
    g.clear();
    const trackX = startX - circleRadius;
    const trackWidth = ballsWidth + circleRadius * 2;

    g.beginFill(0xdde7f4, 0.9);
    g.drawRoundedRect(trackX, centerY - 5, trackWidth, 10, 5);
    g.endFill();

    if (safeCorrectAnswer > 0) {
      const progressWidth = safeCorrectAnswer === totalCircles
        ? trackWidth
        : (safeCorrectAnswer - 1) * circleSpacing + circleRadius * 2;

      g.beginFill(0xffc43d, 1);
      g.drawRoundedRect(trackX, centerY - 5, progressWidth, 10, 5);
      g.endFill();
    }
  };

  const drawCircles = (g) => {
    g.clear();

    for (let i = 0; i < totalCircles; i++) {
      const cx = startX + i * circleSpacing;
      const isFilled = i < safeCorrectAnswer;

      if (isFilled) {
        g.beginFill(0xffb703, 0.22);
        g.drawCircle(cx, centerY, circleRadius + 8);
        g.endFill();

        g.lineStyle(3, 0x9a5b00, 1);
        g.beginFill(0xffc43d, 1);
      } else {
        g.lineStyle(2, 0x8ba1ba, 1);
        g.beginFill(0xf2f6fb, 1);
      }

      g.drawCircle(cx, centerY, circleRadius);
      g.endFill();

      g.lineStyle(0);
      g.beginFill(0xffffff, isFilled ? 0.68 : 0.45);
      g.drawCircle(cx - circleRadius * 0.35, centerY - circleRadius * 0.35, circleRadius * 0.32);
      g.endFill();
    }
  };

  return (
    <Container x={x} y={y}>
      <Graphics draw={drawPanel} />
      {!isCompact && (
        <Text
          text="ACTION"
          x={34}
          y={height / 2}
          anchor={{ x: 0, y: 0.5 }}
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            fill: 0x1d3557,
          }}
        />
      )}
      <Graphics draw={drawTrack} />
      <Graphics draw={drawCircles} />
      <Text
        text={`${safeCorrectAnswer}/${totalCircles}`}
        x={width - 34}
        y={height / 2}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          fill: 0x1d3557,
        }}
      />
    </Container>
  )
}

export default ActionBallUI
