import React from 'react'
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';

//생성(250419)
const GameRankModal = ({ show, onHide, result }) => {
	//result 변형
	const addGameCountToHighestScores = (records) => {
		const countMap = new Map();
		const bestRecordMap = new Map();
		records.forEach((record) => {
			// 1. 게임 횟수 세기
			const count = countMap.get(record.uid) || 0;
			countMap.set(record.uid, count + 1);

			// 2. 최고 점수 저장
			const existing = bestRecordMap.get(record.uid);
			if (!existing || record.score > existing.score) {
				bestRecordMap.set(record.uid, record);
			}
		});
		// 3. howMany 필드 추가
		const result = Array.from(bestRecordMap.values())
			.map(record => ({
				...record,
				howManyTimes: countMap.get(record.uid)
			}));
		return result;
	};

	const changed = addGameCountToHighestScores(result);

	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop="static"
		>
			<Modal.Header style={{ backgroundColor: "#efefef", height: "40px", color: "white" }} closeButton />
			<Modal.Body style={{ backgroundColor: "#efefef", borderEndStartRadius: "10px", borderEndEndRadius: "10px" }}>
				<GridContainer>
					<TableHeaderWrapper>
						<Header>순위</Header>
						<Header>이름</Header>
						<Header>점수</Header>
						<Header>레벨</Header>
						<Header>횟수</Header>
						<Header>날짜</Header>
					</TableHeaderWrapper>
					{changed && changed.sort((a, b) => b.score - a.score).map((result, index) => { //점수로 내림차순
						const { name, score, date, enmLevel, howManyTimes } = result
						return <React.Fragment key={index}>
							<StyledGridItem>{index + 1}</StyledGridItem>
							<StyledGridItem>{name}</StyledGridItem>
							<StyledGridItem>{score}</StyledGridItem>
							<StyledGridItem>{enmLevel}</StyledGridItem>
							<StyledGridItem>{howManyTimes}</StyledGridItem>
							<StyledGridItem>{date}</StyledGridItem>
						</React.Fragment>
					})}
				</GridContainer>
			</Modal.Body>
		</Modal>
	)
}

const GridContainer = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: 70px 70px 70px 70px 70px 120px; 
  grid-template-rows: 40px;
	height: 500px;
	overflow-y: scroll;
`
const Row = styled.div`
  display: flex;
`
const TableHeaderWrapper = styled.div` 
  display: contents;
`
const Header = styled.div`
  display: flex;
  background-color: #3454d1;
  color: white;
  padding: 10px;
  font-weight: bold;
  justify-content: center;
  &: first-child {
    border-top-left-radius: 5px;
  }
  &: last-child {
    border-top-right-radius: 5px;
  }
`
const StyledGridItem = styled(Row)`
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.left-align { 
    text-align: left;
  }
`

export default GameRankModal
