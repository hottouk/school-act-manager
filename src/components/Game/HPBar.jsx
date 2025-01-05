import { Graphics, Text } from '@pixi/react';

const HPBar = ({ x, y, width, height, curHp, maxHp }) => {
  let draw = (g) => {
    g.clear();
    g.beginFill(0xff0000); // 전체 HP 바 (빨간색)
    g.drawRect(x, y, width, height);
    g.beginFill(0x00ff00); // 현재 HP 바 (초록색)
    g.drawRect(x, y, (curHp / maxHp) * width, height);
    g.endFill();
  }
  return (<>
    <Graphics draw={draw} />
    <Text
      text={`${curHp} / ${maxHp}`}
      x={x + width / 2}
      y={y - 5}
      anchor={0.5}
      style={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }}
    />
  </>
  )
}

export default HPBar
