import React from 'react'
import styled from 'styled-components'
import ExamEditSection from './ExamEditSection'
//컴포넌트
import { useLocation } from 'react-router-dom';
import MainContainer from '../../components/Styled/MainContainer';
import SubNav from '../../components/Bar/SubNav';
import BackBtn from '../../components/Btn/BackBtn';

const ExamItemPage = () => {
  const location = useLocation();
  const { state: examItem } = location;
  return <MainContainer>
    <SubNav><BackBtn /></SubNav>
    <Column style={{ marginTop: "30px" }}><ExamEditSection examItem={examItem} /></Column>
  </MainContainer>
}
export default ExamItemPage

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`