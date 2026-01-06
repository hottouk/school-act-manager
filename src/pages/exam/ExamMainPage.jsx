import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
//컴포넌트
import MainWrapper from '../../components/Styled/MainWrapper'
import CardList from '../../components/List/CardList'
//hooks
import useFireTestData from '../../hooks/Firebase/useFireTestData'
//생성(260106)
const ExamMainPage = () => {
	const user = useSelector(({ user }) => user);
	const { examDataListener } = useFireTestData();
	useEffect(() => { examDataListener(setExamData); }, []);
	//데이터
	const [examData, setExamData] = useState(null);
	return (
		<Container>
			<MainWrapper>
				<CardList dataList={examData?.questions} type={"exam"}></CardList>
			</MainWrapper>
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
  box-sizing: border-box;
  background-color: #efefef;
  min-height: 100dvh;
  gap: 10px;
	padding: 20px 0 0 0;
`
export default ExamMainPage
