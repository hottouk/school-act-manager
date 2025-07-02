//라이브러리
import * as PIXI from 'pixi.js'; //pixi 쓸 때 필수!
import React from 'react'
import { Graphics, Sprite } from '@pixi/react';
//이미지
import question_icon from '../../image/icon/question.png'

//생성(250625)
const ShopItemBox = ({ x, y, width, height, radius = 8, src, onClick }) => {
	const draw = React.useCallback((g) => {
		g.clear();
		g.lineStyle({
			width: 1,
			color: 0x000000,
			alpha: 1,
		});
		// 아래와 같이 직접 점선을 그려야 합니다.
		const dashLength = 4;
		const gapLength = 2;

		const drawDashedLine = (startX, startY, endX, endY) => {
			const dx = endX - startX;
			const dy = endY - startY;
			const length = Math.sqrt(dx * dx + dy * dy);
			const dashCount = Math.floor(length / (dashLength + gapLength));
			const deltaX = dx / length;
			const deltaY = dy / length;

			for (let i = 0; i < dashCount; i++) {
				const fromX = startX + (dashLength + gapLength) * i * deltaX;
				const fromY = startY + (dashLength + gapLength) * i * deltaY;
				const toX = fromX + dashLength * deltaX;
				const toY = fromY + dashLength * deltaY;
				g.moveTo(fromX, fromY);
				g.lineTo(toX, toY);
			}
		};
		const drawDashedArc = (cx, cy, r, startAngle, endAngle) => {
			const totalAngle = endAngle - startAngle;
			const arcLen = r * totalAngle;
			const steps = Math.floor(arcLen / (dashLength + gapLength));

			for (let i = 0; i < steps; i++) {
				const theta1 = startAngle + (totalAngle * i) / steps;
				const theta2 = theta1 + (dashLength / arcLen) * totalAngle;
				const x1 = cx + r * Math.cos(theta1);
				const y1 = cy + r * Math.sin(theta1);
				const x2 = cx + r * Math.cos(theta2);
				const y2 = cy + r * Math.sin(theta2);
				g.moveTo(x1, y1);
				g.lineTo(x2, y2);
			}
		};
		// Top line
		drawDashedLine(x + radius, y, x + width - radius, y);
		// Top-right corner
		drawDashedArc(x + width - radius, y + radius, radius, -Math.PI / 2, 0);
		// Right line
		drawDashedLine(x + width, y + radius, x + width, y + height - radius);
		// Bottom-right corner
		drawDashedArc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
		// Bottom line
		drawDashedLine(x + width - radius, y + height, x + radius, y + height);
		// Bottom-left corner
		drawDashedArc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
		// Left line
		drawDashedLine(x, y + height - radius, x, y + radius);
		// Top-left corner
		drawDashedArc(x + radius, y + radius, radius, Math.PI, (3 * Math.PI) / 2);
	}, [x, y, width, height, radius]);

	return (<>
		<Sprite
			texture={PIXI.Texture.from(src || question_icon)}
			x={x + 8}
			y={y + 8}
			width={width - 16}
			height={height - 16}
			eventMode="static"
			cursor="pointer"
			pointerdown={onClick}
		/>
		<Graphics draw={draw} eventMode="none" />
	</>
	)
}

export default ShopItemBox
