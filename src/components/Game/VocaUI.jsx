import { Graphics, Text } from '@pixi/react'
import React from 'react'

const VocaUI = ({ x, y, width, height, pivotX, pivotY, word }) => {
    let draw = (g) => {
        g.clear();
        g.lineStyle(4, 0x000000, 1); // 검정 테두리
        g.beginFill(0xffffff);       // 하얀색 배경
        g.drawRoundedRect(x, y, width, height, 10); // 직사각형 UI 위치와 크기
        g.endFill();
    };

    return (<>
        <Graphics draw={draw} pivot={{ x: pivotX, y: pivotY }} />
        <Text
            text={word}
            x={x}
            y={y}
            anchor={0.5}
            style={{ fill: 'black', fontSize: 25, fontWeight: 'bold' }}
        />
    </>)
}

export default VocaUI
