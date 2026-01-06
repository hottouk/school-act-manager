import React from 'react'
import styled from 'styled-components'
import ExamEditSection from './ExamEditSection'
import { useLocation } from 'react-router-dom';
import SubNav from '../../components/Bar/SubNav';
import BackBtn from '../../components/Btn/BackBtn';

const ExamItemPage = () => {
  const location = useLocation();
  const { state: examItem } = location;
  return <Container>
    <SubNav><BackBtn /></SubNav>
      <ExamEditSection examItem={examItem} />
  </Container>

}

export default ExamItemPage

const Row = styled.div`
  display: flex;
`
const Column = styled(Row)` 
  flex-direction: column;
`
const BasicText = styled.p`
  margin: 0;
`
const Container = styled(Column)`
  box-sizing: border-box;
  background-color: #efefef;
  min-height: 100dvh;
  gap: 10px;
`