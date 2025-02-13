import { Container, Graphics } from '@pixi/react';
import React from 'react'

const MarkingUI = ({ x, y, radius, crossSize, correct }) => {
  const drawCircle = (g) => {
    g.clear();
    g.lineStyle(11, 0x2F9D27); // 선 두께 5, 녹색 선
    g.drawCircle(x, y, radius); // 원 그리기
    g.endFill();
  };
  const drawCross = (g) => {
    g.clear();
    g.lineStyle(12, 0xff0000); // 빨간색 선
    // 첫 번째 대각선
    g.moveTo(x - crossSize / 2, y - crossSize / 2);
    g.lineTo(x + crossSize / 2, y + crossSize / 2);
    // 두 번째 대각선
    g.moveTo(x + crossSize / 2, y - crossSize / 2);
    g.lineTo(x - crossSize / 2, y + crossSize / 2);
  };
  return (
    <Container>
      {correct && <Graphics draw={drawCircle} />}
      {!correct && <Graphics draw={drawCross} />}
    </Container>
  );
};

export default MarkingUI
