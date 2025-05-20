//라이브러리
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
//hooks
import useFetchRtAllUserData from '../../hooks/RealTimeData/useFetchRtAllUserData'
import useFetchRtAllActiData from '../../hooks/RealTimeData/useFetchRtAllActiData'
import useMasterTool from '../../hooks/useMasterTool'
import useFireSchoolData from '../../hooks/Firebase/useFireSchoolData'

const Master = () => {
  const { teacherList, studentList, sortTListByCriterion } = useFetchRtAllUserData();//교사 rt데이터
  const { actiList, sortTActiListByCriterion, useFetchRtAllActiErr } = useFetchRtAllActiData()//활동 rt데이터
  const { addFieldToAllDocs } = useFireSchoolData();
  useEffect(() => {
    console.log("교사", teacherList.length);
    console.log("학생", studentList.length);
  }, [teacherList])

  const { plusLikedCount } = useMasterTool() //마스터 툴
  return (
    <Container>
      <p>교사 사용자: {teacherList.lenght}명</p>
      <p>학생 사용자: {studentList.lenght}명</p>
      {/* <button onClick={(addFieldToAllDocs)}>버튼 금단</button> */}
    </Container >
  )
}

const Container = styled.div`
  box-sizing: border-box;
`
const Row = styled.div`
  display: flex;
`

export default Master