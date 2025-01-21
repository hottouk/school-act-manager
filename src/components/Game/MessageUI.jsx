import { Container, Graphics, Text } from '@pixi/react'
import React from 'react'

const MessageUI = ({ x, y, width, height, msg, msg2, msg3 }) => {
  const padding = 15;
  const textStyle = {
    fill: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 40,
    wordWrap: true,
    wordWrapWidth: width - 20, // 텍스트가 Graphics를 넘지 않도록 제한
  }
  const drawRoundRect = (g) => {
    g.clear();
    g.lineStyle(4, 0x000000, 1);
    g.beginFill(0xffffff);
    g.drawRoundedRect(x, y, width, height, 10);
    g.endFill();
  }
  return (
    <Container>
      {!msg3 && <Graphics draw={drawRoundRect} />}
      {msg && <Text
        text={msg}
        x={x + padding}
        y={y + padding}
        style={textStyle}
      />}
      {msg2 && <Text
        text={msg2}
        x={x + padding}
        y={y + padding}
        style={textStyle}
      />}
      {msg3 && <Text
        text={msg3}
        x={x + padding}
        y={y + padding}
        style={textStyle}
      />}
    </Container>
  )
}

export default MessageUI
