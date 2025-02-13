import { Graphics, Text } from '@pixi/react'
import React, { useEffect, useState } from 'react'
//2025.01.12
const QuizUI = ({ x, y, width, height, pivotX, pivotY, quiz }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let startTime = performance.now();
    const updateProgress = () => {
      const elapsed = (performance.now() - startTime) / 3000; // 3초 기준
      if (elapsed >= 1) {
        setProgress(1); // 100% 채우기 완료
      } else {
        setProgress(elapsed); // 진행률 업데이트
        requestAnimationFrame(updateProgress);
      }
    };
    updateProgress(); // 진행도 업데이트 시작
    return () => setProgress(0); // 새 단어로 리셋
  }, [quiz])

  let draw = (g) => {
    g.clear();
    g.lineStyle(4, 0x000000, 1); // 검정 테두리
    g.beginFill(0xffffff);       // 하얀색 배경
    g.drawRoundedRect(x, y, width, height, 10); // 직사각형 UI 위치와 크기
    g.endFill();

    g.beginFill(0xffff00);
    g.drawRoundedRect(x, y, width * progress, height, 10); // 왼쪽부터 채우기
    g.endFill();
  };

  return (<>
    <Graphics draw={draw} pivot={{ x: pivotX, y: pivotY }} />
    <Text
      text={quiz}
      x={x}
      y={y}
      anchor={0.5}
      style={{ fill: 'black', fontSize: 25, fontWeight: 'bold' }}
    />
  </>)
}

export default QuizUI
