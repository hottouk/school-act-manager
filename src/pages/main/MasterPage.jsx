import React, { useEffect, useState } from 'react'
//컴포넌트
import TabBtn from '../../components/Btn/TabBtn'
import SmallBtn from '../../components/Btn/SmallBtn'
//hooks
import useFetchRtAllUserData from '../../hooks/RealTimeData/useFetchRtAllUserData'
import useFetchRtAllActiData from '../../hooks/RealTimeData/useFetchRtAllActiData'
//css
import styled from 'styled-components'
import useMasterTool from '../../hooks/useMasterTool'
import MainBtn from '../../components/Btn/MainBtn'
import { appFireStore } from '../../firebase/config'
import { collection, getDocs } from 'firebase/firestore'


//2024.07.24
const Master = () => {
  const db = appFireStore
  const { teacherList, sortTListByCriterion } = useFetchRtAllUserData()//교사 데이터 구독
  const { actiList, sortTActiListByCriterion, useFetchRtAllActiErr } = useFetchRtAllActiData()//활동 데이터 구독
  useEffect(() => { if (useFetchRtAllActiErr) window.alert(useFetchRtAllActiErr) }, [useFetchRtAllActiErr])
  const { plusLikedCount } = useMasterTool() //마스터 툴
  const [selectedTab, setSelectedTab] = useState("교사")

  const handleTempAddOn = async () => {
    const actiColRef = collection(db, "activities")
    const actiSnap = await getDocs(actiColRef)
  }

  return (
    <Container>
      <TabBtn tabItems={["교사", "활동"]} setActiveTab={setSelectedTab} />
      <MainBtn btnName="타입 추가" btnOnClick={handleTempAddOn} />
      {/* 교사 탭 */}
      {(selectedTab === "교사") && <StyledTcherGirdContainer>
        <StyledHeader>연번</StyledHeader>
        <StyledHeader>id</StyledHeader>
        <StyledHeader>성함</StyledHeader>
        <StyledHeader>학교
          <SortButton onClick={() => { sortTListByCriterion("school") }}>⇅</SortButton>
        </StyledHeader>
        <StyledHeader>이메일</StyledHeader>
        <StyledHeader>좋아요
          <SortButton onClick={() => { sortTListByCriterion("likedCount") }}>⇅</SortButton>
        </StyledHeader>
        <StyledHeader>기능버튼</StyledHeader>
        {teacherList.map((teacher, index) => {
          let school = teacher.school
          return (<React.Fragment key={teacher.id}>
            <StyledGridItem>{index + 1}</StyledGridItem>
            <StyledGridItem>{teacher.id}</StyledGridItem>
            <StyledGridItem>{teacher.name}</StyledGridItem>
            <StyledGridItem>{school.schoolName}</StyledGridItem>
            <StyledGridItem>{teacher.email}</StyledGridItem>
            <StyledGridItem>{teacher.likedCount || 0}</StyledGridItem>
            <StyledGridItem><SmallBtn btnName="좋아요" btnOnClick={() => { plusLikedCount(teacher.id, actiList) }} /></StyledGridItem>
          </React.Fragment>)
        })}
      </StyledTcherGirdContainer>}
      {/* 활동 탭 */}
      {(selectedTab === "활동") && <StyledActiGridContainer>
        <StyledHeader>연번</StyledHeader>
        <StyledHeader>고유id</StyledHeader>
        <StyledHeader>제목</StyledHeader>
        <StyledHeader>제작자
          <SortButton onClick={() => { sortTActiListByCriterion("madeBy") }}>⇅</SortButton>
        </StyledHeader>
        <StyledHeader>
          제작자 id
          <SortButton onClick={() => { sortTActiListByCriterion("uid") }}>⇅</SortButton>
        </StyledHeader>
        <StyledHeader>수행</StyledHeader>
        {actiList.map((acti, index) => {
          return (<React.Fragment key={acti.id}>
            <StyledGridItem>{index + 1}</StyledGridItem>
            <StyledGridItem>{acti.id}</StyledGridItem>
            <StyledGridItem>{acti.title}</StyledGridItem>
            <StyledGridItem>{acti.madeBy}</StyledGridItem>
            <StyledGridItem>{acti.uid}</StyledGridItem>
            <StyledGridItem>{acti.perfRecordList ? "O" : "X"}</StyledGridItem>
          </React.Fragment>)
        })}
      </StyledActiGridContainer>}
    </Container >

  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;  
`
const StyledTcherGirdContainer = styled.div`
  display: grid;
  grid-template-columns: 50px 400px 200px 400px 300px 80px 100px; /* index, id, 이름, 학교 이름 */
  margin: 15px 30px;
`
const StyledHeader = styled.div`
  background-color: #333;
  color: white;
  font-weight: bold;
  text-align: center;
  align-items: center;
  height: 30px;
`
const SortButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 0.8em;
  cursor: pointer;
`
const StyledGridItem = styled.div`
  background-color: #efefef;
  padding: 10px;
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  align-items: center;
`
const StyledActiGridContainer = styled.div`
  display:grid;
  grid-template-columns: 50px 300px 400px 200px 400px 50px; /* index, id, 제작자 id, 학교 이름 */
  margin: 15px 30px;
`


export default Master