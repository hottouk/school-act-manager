import { Container, Graphics, Text } from '@pixi/react'
import React from 'react'

const MessageUI = ({ x, y, width, height, msg }) => {
  const padding = 15;
  const drawRoundRect = (g) => {
    g.clear();
    g.lineStyle(4, 0x000000, 1);
    g.beginFill(0xffffff);
    g.drawRoundedRect(x, y, width, height, 10);
    g.endFill();
  }
  return (
    <Container>
      <Graphics draw={drawRoundRect} />
      <Text
        text={msg}
        x={x + padding}
        y={y + height / 3 + 12}
        style={{ fill: 'black', fontSize: (24), fontWeight: 'bold' }}
      />
    </Container>
  )
}

export default MessageUI
