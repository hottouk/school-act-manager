//라이브러리
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
//데이터
import { subjectGroupList, homeroomGroupList } from '../../data/subjectGroupList'

//240722 -> 250212 디자인 수정
const SubjectSelects = ({ sort, selectedGroup, selectedDetail, setSelectedGroup, setSelectedDetail, disabled }) => {
  const groupList = (sort === "subject" ? subjectGroupList : homeroomGroupList)
  const [_detailList, setDetailList] = useState([]) //선택한 교과군 세부 교과목
  useEffect(() => {
    const selectedSubjList = groupList.find((sbujGrp) => Object.keys(sbujGrp)[0] === selectedGroup) || [];
    setDetailList(...Object.values(selectedSubjList))
    if (!selectedDetail) setSelectedDetail("default")
  }, [selectedGroup])

  return (
    <Container>
      <StyledSelect className="acti_subjGrp" value={selectedGroup} onChange={(event) => { setSelectedGroup(event.target.value) }} required disabled={disabled} >
        <option value="default" disabled >교과</option>
        {groupList.map((subjGroup) => {
          const subjGroupKey = Object.keys(subjGroup)[0]
          return <option key={subjGroupKey} value={subjGroupKey}>{subjGroupKey}과</option>
        })}
      </StyledSelect>
      <StyledSelect className="acti_subj" value={selectedDetail} onChange={(event) => { setSelectedDetail(event.target.value) }} required disabled={disabled} >
        <option value="default" disabled >과목</option>
        {_detailList && _detailList.map((subj) => {
          return <option key={subj} value={subj}>{subj}</option>
        })}
      </StyledSelect>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`
const StyledSelect = styled.select`
  height: 35px;
  margin: 0 0 0 30px;
  padding-left: 5px;
  border: 1px solid rgba(120, 120, 120, 0.5);
  border-radius: 7px;
  &:disabled {            
    background-color: #efefef;
    color: fff;        
  }
`
export default SubjectSelects