import { Graphics, Text } from '@pixi/react'
import React from 'react'

const AnswerUI = ({ x, y, width, height, optionList, selected }) => {
    const padding = 50;
    const textWidth = 110;
    let draw = (g) => {
        g.clear();
        g.lineStyle(4, 0x000000, 1); // 검정 테두리
        g.beginFill(0xdddddd);       // 하얀색 배경
        g.drawRoundedRect(0, 0, width, height, 10); // 직사각형 UI 위치와 크기
        g.endFill();
    };
    return (<>
        <Graphics draw={draw} x={x} y={y} />
        {optionList.map((option, index) => {
            return (<Text
                key={option}
                text={`${index + 1}. ${option}`}
                x={x + padding + index * (textWidth + padding)}
                y={y + height / 3}
                style={{ fill: index === selected ? "red" : "black", fontSize: 25, fontWeight: index === selected ? "bold" : "normal" }}
            />)
        }
        )}
    </>)
}

export default AnswerUI
