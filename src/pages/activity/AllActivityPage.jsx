//라이브러리
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
//컴포넌트
import MainContainer from '../../components/Styled/MainContainer'
import MainWrapper from '../../components/Styled/MainWrapper'
import SearchBar from '../../components/Bar/SearchBar'
import HorizontalBannerAd from '../../components/Ads/HorizontalBannerAd'
import HorizontalMobileAd from '../../components/Ads/HorizontalMobileAd'
import CardList from '../../components/List/CardList'
import TabBtn from '../../components/Btn/TabBtn'
import Pagenation from '../../components/Pagenation'
//hooks
import useFireActiData from '../../hooks/Firebase/useFireActiData'
import useClientHeight from '../../hooks/useClientHeight'
import useMediaQuery from '../../hooks/useMediaQuery'
//데이터
import { subjectGroupList } from '../../data/subjectGroupList'
//분화(260212) 
const AllActivityPage = () => {
	const user = useSelector(({ user }) => user);
	const navigate = useNavigate();
	const { fetchAllActis } = useFireActiData();
	//교과 목록
	const [subjectList, setSubjectList] = useState(null);
	useEffect(() => {
		//교과 제목 추출
		const extractSubjFromData = () => {
			const subjList = subjectGroupList.reduce((acc, curSubjObj) => {
				acc.push(...Object.keys(curSubjObj));
				return acc
			}, []);
			setSubjectList(subjList);
		}
		extractSubjFromData();
	}, []);
	//선택 과목
	const [selectedSubj, setSelectedSubj] = useState(null);
	//과목별 활동
	useEffect(() => {
		const fetchDataByLocation = async () => {
			const data = await fetchAllActis("subject", selectedSubj, "isPrivate", false);
			const sorted = data.sort((a, b) => a.title.localeCompare(b.title));
			setPageData(sorted.slice(0, itemsPerPage));
			setCurrentPage(1);
			setAllActiList(sorted);
		}
		fetchDataByLocation();
	}, [selectedSubj, fetchAllActis]);
	const [allActiList, setAllActiList] = useState([]);
	//페이지네이션
	const itemsPerPage = 30;
	const [currentPage, setCurrentPage] = useState(1);
	const [pageData, setPageData] = useState(allActiList?.slice(0, itemsPerPage));
	useEffect(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = currentPage * itemsPerPage;
		setPageData(allActiList?.slice(start, end));
	}, [currentPage, allActiList]);
	//css
	const clientHeight = useClientHeight(document.documentElement);
	//모바일
	const isMobile = useMediaQuery('(max-width: 768px)');
	//**함수부**
	//활동 클릭
	const handleActiOnClick = (item) => {
		navigate(`/activities/${item.id}?sort=subject`, { state: { acti: item } })
	}
	return (
		<MainContainer>
			{user.isTeacher && <>
				<TabBtnContainer>
					{subjectList && <TabBtn tabItems={subjectList} activeTab={selectedSubj} setActiveTab={setSelectedSubj} />}
				</TabBtnContainer>
				<MainWrapper>
					<HorizontalBannerAd />
					<SearchBar title={`서버에 총 ${allActiList ? allActiList.length : 0}개의 활동이 등록되어 있습니다.`}
						type="allActi" list={allActiList} setList={setAllActiList} />
					<CardList dataList={pageData} type="activity" comment="아직 활동이 없습니다. 활동을 생성해주세요" onClick={handleActiOnClick} />
					{allActiList?.length > itemsPerPage && <PageWrapper>
						<Pagenation
							totalItems={allActiList.length}
							currentPage={currentPage}
							itemsPerPage={itemsPerPage}
							onPageChange={setCurrentPage}
						/>
					</PageWrapper>}
				</MainWrapper>
			</>}
		</MainContainer>
	)
}
const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const TabBtnContainer = styled(Row)`
  align-items: center;
  background-color: #f0f0f0;
  height: 100px;
`
const PageWrapper = styled(Row)`
  justify-content: center;
  margin: 10px;
`
export default AllActivityPage