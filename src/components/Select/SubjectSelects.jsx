import React, { useEffect, useState } from 'react'
//데이터
import { subjectGroupList, homeroomGroupList } from '../../data/subjectGroupList'
//css
import styled from 'styled-components'

//24.07.22
const SubjectSelects = ({ sort, selectedGroup, selectedDetail, setSelectedGroup, setSelectedDetail }) => {
  let groupList = (sort === "subject" ? subjectGroupList : homeroomGroupList)
  const [_detailList, setDetailList] = useState([]) //선택한 교과군 세부 교과목
  useEffect(() => {
    let selectedSubjList = groupList.find((sbujGrp) => Object.keys(sbujGrp)[0] === selectedGroup) || [];
    setDetailList(...Object.values(selectedSubjList))
    setSelectedDetail("default")
  }, [selectedGroup])

  return (
    <StyledSubjContainer>
      <select className="acti_subjGrp" value={selectedGroup} onChange={(event) => { setSelectedGroup(event.target.value) }} required  >
        <option value="default" disabled >교과</option>
        {groupList.map((subjGroup) => {
          let subjGroupKey = Object.keys(subjGroup)[0]
          return <option key={subjGroupKey} value={subjGroupKey}>{subjGroupKey}과</option>
        })}
      </select>
      <select className="acti_subj" value={selectedDetail} onChange={(event) => { setSelectedDetail(event.target.value) }} required  >
        <option value="default" disabled >과목</option>
        {_detailList && _detailList.map((subj) => {
          return <option key={subj} value={subj}>{subj}</option>
        })}
      </select>
    </StyledSubjContainer>
  )
}

const StyledSubjContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  select {
    margin: 0 0 0 30px;
    height: 35px;
    border-radius: 7px;
    padding-left: 5px;
    &:disabled {             /* 해당 input disabled 되었을 때 */
      color: #efefef;        /* 글자 색을 white로 설정 */
    }
  }
`

export default SubjectSelects