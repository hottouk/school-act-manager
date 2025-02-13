import React from 'react'
import styled from 'styled-components'

const MyRecordSection = ({ myRecordList }) => {

	const RecordItem = ({ record, index }) => {
		return (<RecordWrapper>
			<td>{index + 1}</td>
			<td>{record.result}</td>
			<td>{record.enmLevel}</td>
			<td>{record.correct}</td>
			<td>{record.score}</td>
		</RecordWrapper>)
	}

	return (
		<Container>
			<table>
				<thead>
					<tr>
						<th>순위</th>
						<th>승부 결과</th>
						<th>상대방 레벨</th>
						<th>맞은 개수</th>
						<th>점수</th>
					</tr>
				</thead>
				<tbody>
					{myRecordList.map((item, index) => (
						<RecordItem key={index} record={item} index={index} />
					))}
				</tbody>
			</table>
		</Container>
	)
}
const Container = styled.ul`
  box-sizing: border-box;
  width: 1200px;
  height: 900px;
	display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  border-left: 1px solid rgba(120,120,120,0.5);
  border-right: 1px solid rgba(120,120,120,0.5);
  background-color: white;
`
const RecordWrapper = styled.tr`
	width: 100%;
	height: 40px;
	display: flex;
`

export default MyRecordSection
