import useClientHeight from "../../hooks/useClientHeight"
import { useEffect, useState } from "react"
//컴포넌트
import CardList from "../../components/List/CardList"
import SSearchInputBtn from "../../components/Form/SSearchInputBtn"
import useFetchFireData from "../../hooks/Firebase/useFetchFireData"
//css
import styled from "styled-components"

const UserMain = () => {
  const clientHeight = useClientHeight(document.documentElement)
  const [_searchResultList, setSearchResultList] = useState([])
  const [_teacherList, setTeacherList] = useState([])
  const { fetchTeacherList } = useFetchFireData()

  useEffect(() => {//마운트시 교사 정보 가져오기
    fetchTeacherList().then(teacherList => { setTeacherList(teacherList) })
  }, [])

  return (
    <StyledContainer $clientheight={clientHeight}>
      <CardList title={"이용 중인 다른 선생님들"} dataList={_teacherList} type={"teacher"} />
      <SSearchInputBtn searchReslt={(param) => { return setSearchResultList(param) }} />  {/*검색창*/}
      <StyledGirdContainer>
        <StyledTitleRow>
          <StyledSmallDiv>연번</StyledSmallDiv>
          <StyledMidlDiv>학교</StyledMidlDiv>
          <StyledMidlDiv>학번</StyledMidlDiv>
          <StyledMidlDiv>이름</StyledMidlDiv>
          <StyledMidlDiv>레벨</StyledMidlDiv>
          <StyledLargeDiv>펫</StyledLargeDiv>
        </StyledTitleRow>
        {_searchResultList.map((student, index) => {
          console.log(student)
          let schoolName = student.school.schoolName
          let studentNumber = student.studentNumber
          let name = student.name
          let userLevel = student.userLevel
          let petImgList = student.petImgList //펫이 등록되어 있다면
          return <StyledContentRow key={student.uid}>
            <StyledSmallDiv>{index + 1}</StyledSmallDiv> {/* 연번 */}
            <StyledMidlDiv>{schoolName}</StyledMidlDiv> {/* 학교 */}
            <StyledMidlDiv>{studentNumber}</StyledMidlDiv>
            <StyledMidlDiv>{name}</StyledMidlDiv>
            <StyledMidlDiv>{userLevel}</StyledMidlDiv>
            <StyledLargeDiv>{petImgList}</StyledLargeDiv>
          </StyledContentRow>
        })}
      </StyledGirdContainer>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 15px 30px;
  @media screen and (max-width: 767px){
    margin: 0;
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
const StyledGirdContainer = styled.div`
  display: grid;
  grid-template-rows: 40px;
  grid-auto-rows: minmax(100px, auto);
`
const StyledTitleRow = styled.div`
  display: flex;
  background-color: #3454d1; 
  color: white;
`
const StyledContentRow = styled.div`
  display: flex;
  background-color: #efefef;
`
const StyledSmallDiv = styled.div`
  flex-basis: 60px;
  justify-content: center;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  border-left: 1px solid black;
  @media screen and (max-width: 767px){
    display: none;
  }
`
const StyledMidlDiv = styled.div`
  flex-basis: 100px;
  justify-content: center;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  @media screen and (max-width: 767px){
    flex-basis: 65px;
  }
`
const StyledLargeDiv = styled.div`
  flex-grow: 1;
  justify-content: center;
  padding: 0 5px;
  width: 823px;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  img {
    width: 75px;
    height: 75px;
  }
  @media screen and (max-width: 767px){
    width: 0;
  }
`


export default UserMain