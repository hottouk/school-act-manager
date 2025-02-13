import { Graphics, Sprite } from '@pixi/react'
const Background = ({ src, x, y, width, height }) => {
  // 임시 그리드 그리기 (50px 간격) 
  const drawGrid = (g) => {
    const gridSize = 50;
    const stageWidth = 1200;
    const stageHeight = 900;
    g.clear();
    g.lineStyle(1, 0xaaaaaa, 0.5);  // 회색 선, 투명도 0.5
    // 세로선 그리기
    for (let x = 0; x <= stageWidth; x += gridSize) {
      g.moveTo(x, 0);
      g.lineTo(x, stageHeight);
    }
    // 가로선 그리기
    for (let y = 0; y <= stageHeight; y += gridSize) {
      g.moveTo(0, y);
      g.lineTo(stageWidth, y);
    }
  };
  const drawFilter = (g) => {
    g.clear();
    g.beginFill(0xffffff, 0.6); // 흰색, 20% 투명도
    g.drawRect(0, 0, width, height); // 화면 전체 크기
    g.endFill();
  }
  return (<>
    <Sprite image={src} x={x} y={y} width={width} height={height} />
    <Graphics draw={drawFilter} />
    <Graphics draw={drawGrid} />

  </>)
}

export default Background
