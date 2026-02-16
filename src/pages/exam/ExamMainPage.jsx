import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
//컴포넌트
import MainWrapper from '../../components/Styled/MainWrapper'
import CardList from '../../components/List/CardList'
//hooks
import useFireTestData from '../../hooks/Firebase/useFireTestData'
import SearchBar from '../../components/Bar/SearchBar'
import MainContainer from '../../components/Styled/MainContainer'
//생성(260106)
const ExamMainPage = () => {
	const { examDataListener } = useFireTestData();
	useEffect(() => { examDataListener(setExamData); }, []);
	//데이터
	const [examData, setExamData] = useState(null);
	return (
		<MainContainer>
			<MainWrapper>
				<SearchBar title={"문항 관리"} />
				<CardList dataList={examData?.questions} type={"exam"}></CardList>
			</MainWrapper>
		</MainContainer>
	)
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
export default ExamMainPage
