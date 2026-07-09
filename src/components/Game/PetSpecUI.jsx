import React from 'react'
import styled from 'styled-components'
//생성(250722)
const PetSpecUI = ({ spec, styles }) => {
	const height = styles?.height || "75px"
	const width = styles?.width || "150px"
	if (!spec) return
	const { hp, atk, def, mat, mdf, spd } = spec;
	return (
		<Container $height={height} $width={width}>
			<SpecGrid>
				<Text>체력 <strong>{hp || 0}</strong></Text>
				<Text>공격 <strong>{atk || 0}</strong></Text>
				<Text>방어 <strong>{def || 0}</strong></Text>
				<Text>치유 <strong>{mat || 0}</strong></Text>
				<Text>마방 <strong>{mdf || 0}</strong></Text>
				<Text>민첩 <strong>{spd || 0}</strong></Text>
			</SpecGrid>
		</Container>
	)
}
const Row = styled.div`
	display: flex;
`
const Column = styled(Row)`
	flex-direction: column;
`
const Container = styled(Column)`
	flex-grow: 1;
	justify-content: center;
	box-sizing: border-box;
	width: ${({ $width }) => $width};
	height: ${({ $height }) => $height};
	padding: 8px;
	border: 1px solid #d9e2ff;
  border-radius: 8px;
  background: #ffffff;
`
const SpecGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 6px 8px;
	width: 100%;
`
const Text = styled.p`
	margin: 0;
	color: #677089;
	font-size: 12px;
	font-weight: 700;
	line-height: 1.2;
	white-space: nowrap;

	strong {
		color: #171b24;
		font-size: 13px;
		font-weight: 900;
	}
`
export default PetSpecUI
