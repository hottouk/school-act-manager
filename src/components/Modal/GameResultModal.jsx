import React from 'react'
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';

//생성(250419)
const GameResultModal = ({ show, onHide, result }) => {
	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop="static"
			keyboard={false}
		>
			<Modal.Header style={{ backgroundColor: "#efefef", height: "40px", color: "white" }} closeButton />
			<Modal.Body style={{ backgroundColor: "#efefef", borderEndStartRadius: "10px", borderEndEndRadius: "10px" }}>
				<GridContainer>
					<TableHeaderWrapper>
						<Header>순위</Header>
						<Header>이름</Header>
						<Header>점수</Header>
						<Header>레벨</Header>
						<Header>날짜</Header>
					</TableHeaderWrapper>
					{result && result.sort((a, b) => b.score - a.score).map((result, index) => { //점수로 내림차순
						const { name, score, date, enmLevel } = result
						return <React.Fragment key={index}>
							<StyledGridItem>{index + 1}</StyledGridItem>
							<StyledGridItem>{name}</StyledGridItem>
							<StyledGridItem>{score}</StyledGridItem>
							<StyledGridItem>{enmLevel}</StyledGridItem>
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
  grid-template-columns: 70px 70px 70px 70px 120px; 
  grid-template-rows: 40px;
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

export default GameResultModal
