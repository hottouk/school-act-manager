import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
//컴포넌트
import MainWrapper from '../../components/Styled/MainWrapper'
import CardList from '../../components/List/CardList'
//hooks
import useFireTestData from '../../hooks/Firebase/useFireTestData'
import SearchBar from '../../components/Bar/SearchBar'
import MainContainer from '../../components/Styled/MainContainer'
import MainBtn from '../../components/Btn/MainBtn'
import useMediaQuery from '../../hooks/useMediaQuery'
//생성(260106)
const ExamMainPage = () => {
	const { examDataListener } = useFireTestData();
	useEffect(() => { examDataListener(setExamData); }, []);
	const isMobile = useMediaQuery("(max-width: 768px)");
	//데이터
	const [examData, setExamData] = useState(null);
	return (
		<MainContainer>
			<MainWrapper>
				<SearchBar title={"문항 관리"} />
				<CardList dataList={examData?.questions} type={"exam"}></CardList>
			</MainWrapper>
			{isMobile && <MainBtn styles={{ margin: "10px 0 0 0" }}>새 문항 생성</MainBtn>}
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
