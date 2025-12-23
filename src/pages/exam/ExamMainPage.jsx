import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useFireTestData from '../../hooks/Firebase/useFireTestData'
import styled from 'styled-components'
import MainWrapper from '../../components/Styled/MainWrapper'
import CardList from '../../components/List/CardList'

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
  align-items: center;
  gap: 10px;
`

export default ExamMainPage
