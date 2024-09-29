import React, { useState } from 'react'
import styled from 'styled-components'
import PetImg from '../../components/PetImg'
import useGetLevel from '../../hooks/useGetLevel'
import { useLocation } from 'react-router-dom'
import MainBtn from '../../components/Btn/MainBtn'
import EmptyResult from '../../components/EmptyResult'
//data
import AbilityList from '../../data/AbilityList'
import TitledMultipleCkBox from '../../components/CheckBox/TitledMultipleCkBox'

const HomeStudentDetail = () => {
  const { getAbilityScores, getExpAndLevelByActList } = useGetLevel()
  const { state } = useLocation() //개별 학생 정보
  const [step, setStep] = useState('') //행발 작성 단계 
  let expAndLevel = { exp: 0, level: 0 }
  let abilityScores = {}
  return (
    <Container>
      <StyledStudentPannel>
        <StyledGrayPannel>
          <FlexWrapper>
            <ImgWrapper>
              <PetImg level={expAndLevel.level} onClick={() => { }} />
              <p>레벨: {expAndLevel.level}</p>
            </ImgWrapper>
            <InfoWrapper>
              <p>학번: {state.studentNumber}</p>
              <p>이름: {state.writtenName || '미등록'}</p>
              <p>직업: 미정</p>
            </InfoWrapper>
            <InfoWrapper>
              <p>행동특성 종합: 작성중</p>
            </InfoWrapper>
          </FlexWrapper>
        </StyledGrayPannel>
        <StyledGrayPannel>
          {(step === '') && <>
            <EmptyResult comment="현재 작성된 행발이 없습니다."></EmptyResult>
            <MainBtn btnName="행발 작성하기" btnOnClick={() => { setStep("first") }}></MainBtn>
          </>}
          {(step === "first") && <>
            <p>학생의 학업역량에 해당되는 것에 체크해주세요.</p>
            <input type="text" disabled />
            <TitledMultipleCkBox dataList={AbilityList} />
          </>}
        </StyledGrayPannel>
      </StyledStudentPannel>
    </Container >
  )
}

const Container = styled.div`
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 50px;
  @media screen and (max-width: 767px){
    width: 100%;
    height: 1200px;
    margin: 0;
  }
`
const StyledStudentPannel = styled.div`
  width: 50%;
  padding: 15px;
  margin: 15px auto;
  margin-top: 35px;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: royalBlue;
  border-radius: 20px;
  @media screen and (max-width: 767px){
    margin-top: 0;
    border: none;
    border-radius: 0;
  }
`
const StyledGrayPannel = styled.div`
  padding: 15px;
  background-color: #efefef;
  border-radius: 15px;
    @media screen and (max-width: 767px){
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }
`
const FlexWrapper = styled.div`
  display: flex;
`
const ImgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  img {
    display: inline-block;
    width: 120px;
    height: 120px;
    padding: 7px;
    border: 1px solid black;
    border-radius: 60px;
    background-color: white;
  }
  p { margin: 0;}
`
const InfoWrapper = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  p {
    display: flex;
    align-items: center;
  }
`

export default HomeStudentDetail