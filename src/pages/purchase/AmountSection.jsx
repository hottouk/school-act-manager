import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import SmallBtn from '../../components/Btn/SmallBtn';
import riraImg from '../../image/money.png';
//생성(260204)
const AmountSection = () => {
	const navigate = useNavigate();
	const amountList = [5000, 10000, 20000, 30000, 40000, 50000];
	const handleOnClick = (amount) => { navigate("widget", { state: amount }); };
	return (
		<section>
			<Row>
				<Title style={{ marginRight: "30px" }}>리라란?</Title>
				<BasicText>리라는 본 서비스 내에서 문제 제작 및 인공지능 서비스 이용, 학생 포인트 증정 등에 사용되는 가상 화폐입니다.</BasicText>
			</Row>
			<Column>
				<Title>리라 패키지</Title>
				<GridWrapper>
					{amountList.map((amount) =>
						<GridRow key={amount}>
							<Row>
								<img src={riraImg} alt="리라 아이콘" style={{ width: "25px", height: "25px" }} />
								<BasicText>{amount.toLocaleString()}</BasicText>
							</Row>
							<SmallBtn onClick={() => handleOnClick(amount)}>{amount.toLocaleString()}원</SmallBtn>
						</GridRow>
					)}
				</GridWrapper>
			</Column>
		</section>
	)
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 15px;
`
const GridRow = styled(Row)`
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
`
const BasicText = styled.p`
  margin: 0;
`
const Title = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`
export default AmountSection