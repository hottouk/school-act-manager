//라이브러리
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
//컴포넌트
import CardListItem from './ListItem/CardListItem'
import EmptyResult from '../EmptyResult'
import Pagenation from '../Pagenation'
import { useState } from 'react'
//2024.01.09 -> onClick 로직 분리(250122)
const CardList = ({ dataList, type, onClick, selected }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Container>
      <CardWrapper>
        {/* 데이터 없음 */}
        {(!dataList || dataList.length === 0) && <>
          <EmptyResult comment={"데이터가 없어요"} />
        </>}
        {/* 교사 */}
        {(type === "teacher") && dataList?.map((item) => {
          return (<CardListItem key={item.uid} item={item} onClick={onClick} type={"teacher"} styles={{ backgroundColor: `${item.uid === selected ? "rgba(52, 84, 209, 0.4)" : "white"}` }} />)
        })}
        {/* 교과반 */}
        {(type === "classroom" || type === "appliedClassList") && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={onClick} type={"classroom"} />)
        })}
        {/* 담임반 */}
        {(type === "homeroom") && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={onClick} type={"homeroom"} />)
        })}
        {/* 교과활동 */}
        {type === "activity" && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={onClick} type={"subjActi"} />)
        })}
        {/* 업어온 활동 */}
        {type === "copiedActi" && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={() => { navigate(`/activities/${item.id}`, { state: { acti: item } }) }} type={"copiedActi"} styles={{ hoverColor: "rgba(255, 105, 180, 0.2)" }} />)
        })}
        {/* 퀴즈 활동*/}
        {type === "quizActi" && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={onClick} type={"quizActi"} styles={{ hoverColor: "rgba(9, 138, 15,0.2)" }} />)
        })}
        {/* 단어 세트 */}
        {(type === "quiz") && dataList?.map((item) => {
          return (<CardListItem key={item.id} item={item} onClick={() => { navigate('/quiz_setting', { state: item }) }} type={"quiz"} />)
        })}
      </CardWrapper>
      {/* {(dataList && dataList.length !== 0) && <PageWrapper>
        <Pagenation
          totalItems={dataList.length}
          itemsPerPage={10}
          onPageChange={() => { }}
        />
      </PageWrapper>} */}
    </Container>
  )
}
const Container = styled.div`
  border-top: 1px solid rgba(120, 120, 120, 0.5);;
  border-bottom: 1px solid rgba(120, 120, 120, 0.5);
  margin: 5px auto 5px;
  list-style: none;
  @media screen and (max-width: 767px){
    flex-direction: column;
    align-items: center;
    padding: 0;  
    border: none;
    border-top: 1px solid #3454d1;
    border-bottom: 1px solid #3454d1;
  }
`
const CardWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`
export default CardList