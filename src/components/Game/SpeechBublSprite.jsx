import React from 'react'
import { Container, Sprite, Text } from '@pixi/react'
//생성(250722)
const SpeechBublSprite = ({ x = 475, y = 200, src, width, height, reverse, fontSize = 58 }) => {
  return <>
    {src && <Container x={x} y={y}>
      <Sprite
        image={src}
        width={width || 425}
        height={height || 225}
        anchor={0.5}
        scale={reverse ? { x: -1, y: 1 } : { x: 0.5, y: 0.5 }} />
      <Text
        text='Ready'
        anchor={{ x: 0.5, y: 0.68 }}
        style={{ fill: 'black', fontSize, fontWeight: 'bold' }} />
    </Container>}
  </>
}

export default SpeechBublSprite
