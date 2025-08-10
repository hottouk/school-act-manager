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
			<Row style={{ gap: "10px", justifyContent: "space-around" }}>
				<Text>체력: {hp || 0}</Text>
				<Text>공격: {atk || 0}</Text>
				<Text>방어: {def || 0}</Text>
			</Row>
			<Row style={{ gap: "10px", justifyContent: "space-around" }}>
				<Text>마력: {mat || 0}</Text>
				<Text>지력: {mdf || 0}</Text>
				<Text>민첩: {spd || 0}</Text>
			</Row>
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
	gap: 5px;
	justify-content: center;
	box-sizing: border-box;
	width: ${({ $width }) => $width};
	height: ${({ $height }) => $height};
	padding: 2px;
	border: 1px solid rgb(185,185,185);
  border-radius: 10px;
`
const Text = styled.p`
	margin: 0;
`
export default PetSpecUI
