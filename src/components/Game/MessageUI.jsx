import { Container, Graphics, Text } from '@pixi/react'
import React, { useRef } from 'react'
//수정(250801)
const MessageUI = ({ x, y, width, height, messages = [], styles, isMobile }) => {
  const textRefs = useRef([]);
  let visibleMessages = messages.slice(-3); // 마지막 3줄만 표시
  if (isMobile) { visibleMessages = messages.slice(-1); }
  const fontSize = styles?.fontSize || 24;
  const padding = styles?.padding || 15;
  const lineHeight = styles?.lineHeight || 40;
  const textStyle = {
    fill: 'black',
    fontSize: fontSize,
    fontWeight: 'bold',
    lineHeight: lineHeight,
    wordWrap: true,
    wordWrapWidth: width - 20, // 텍스트가 Graphics를 넘지 않도록 제한
  }
  //직사각형 틀
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
      {visibleMessages.map((msg, index) => {
        const isLast = index === 2;
        const isSecond = index === 1;
        const msgY = y + height - padding * 2 - lineHeight * (visibleMessages.length - index); // 아래부터 위로 쌓기
        return <Text
          key={index}
          ref={(ele) => (textRefs.current[index] = ele)}
          text={msg || "..."}
          x={x + padding}
          y={msgY}
          style={textStyle}
          alpha={isLast ? 1 : isSecond ? 0.4 : 0.2} // 마지막 줄은 진하게
        />
      }
      )}
    </Container>
  )
}

export default MessageUI
