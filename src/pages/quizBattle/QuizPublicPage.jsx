//라이브러리
import React, { useEffect, useState } from 'react'
//컴포넌트
import MainWrapper from '../../components/Styled/MainWrapper'
import MainContainer from '../../components/Styled/MainContainer'
import SearchBar from '../../components/Bar/SearchBar'
import CardList from '../../components/List/CardList'
//hooks
import useFireBasic from '../../hooks/Firebase/useFireBasic'
import SubNav from '../../components/Bar/SubNav'
import BackBtn from '../../components/Btn/BackBtn'

const QuizPublicPage = () => {
	//준비
	const { fetchAllData } = useFireBasic("quiz_public");
	//데이터
	const [quizSetList, setQuizSetList] = useState([]);

	useEffect(() => {
		const bindPublicQuizData = async () => {
			const allQuizData = await fetchAllData("quiz_public") || [];
			setQuizSetList(allQuizData);
		}
		bindPublicQuizData();
	}, [fetchAllData]);

	return (
		<MainContainer>
			<SubNav><BackBtn /></SubNav>
			<MainWrapper>
				<SearchBar title={"공개 단어장"} />
				<CardList dataList={quizSetList} type="quiz" />
			</MainWrapper>
		</MainContainer>
	)
}

export default QuizPublicPage
