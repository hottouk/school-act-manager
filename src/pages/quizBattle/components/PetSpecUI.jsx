import React from 'react'
import styled from 'styled-components'
//생성(250722)
const STAT_CONFIG = {
	boss: [
		{ key: 'hp', label: '체력', icon: '♥', color: '#e5484d' },
		{ key: 'atk', label: '공격', icon: '⚔', color: '#f59f00' },
		{ key: 'def', label: '방어', icon: '◆', color: '#3454d1' },
	],
	student: [
		{ key: 'hp', label: '체력', icon: '♥', color: '#e5484d' },
		{ key: 'atk', label: '공격', icon: '⚔', color: '#f59f00' },
		{ key: 'def', label: '방어', icon: '◆', color: '#3454d1' },
		{ key: 'rest', label: '회복력', icon: '✚', color: '#16a085' },
	],
}

const PetSpecUI = ({ spec, role = 'student' }) => {
	if (!spec) return null
	const stats = STAT_CONFIG[role] || STAT_CONFIG.student
	return (
		<Container>
			<SpecGrid>
				{stats.map(({ key, label, icon, color }) => (
					<StatItem key={key} $color={color}>
						<StatIcon $color={color} aria-hidden="true">{icon}</StatIcon>
						<StatText><span>{label}</span><strong>{spec[key] ?? 0}</strong></StatText>
					</StatItem>
				))}
			</SpecGrid>
		</Container>
	)
}
const Container = styled.div`
	width: 100%;
	box-sizing: border-box;
`
const SpecGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
	gap: 8px;
	width: 100%;
`
const StatItem = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
	padding: 8px 10px;
	border: 1px solid ${({ $color }) => `${$color}33`};
	border-radius: 10px;
	background: ${({ $color }) => `${$color}0d`};
	box-sizing: border-box;
`
const StatIcon = styled.span`
	color: ${({ $color }) => $color};
	font-size: 15px;
	font-weight: 900;
`
const StatText = styled.p`
	display: flex;
	min-width: 0;
	flex-direction: column;
	margin: 0;
	line-height: 1.1;

	span {
		color: #7b849b;
		font-size: 11px;
		font-weight: 700;
	}

	strong {
		margin-top: 3px;
		color: #172033;
		font-size: 16px;
		font-weight: 900;
	}
`
export default PetSpecUI
