import { Text, Container, Graphics } from '@pixi/react'
import React from 'react'

const EnemyInfoUI = ({ x, y, info }) => {
  const drawRoundedRect = (g) => {
    g.clear();
    g.lineStyle(4, 0x000000, 1);
    g.beginFill(0xffffff);
    g.drawRoundedRect(x, y, 175, 175, 10);
    g.endFill();
  }
  return (
    <Graphics draw={drawRoundedRect} />
  )
}

export default EnemyInfoUI
