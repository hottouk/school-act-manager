import React, { useState } from 'react'
import styled from 'styled-components'
import useFetchFireData from '../hooks/useFetchFireData'

const TSearchInputBtn = ({ setTeacherList }) => {
  const [_teacherPropKind, setTeacherPropKind] = useState("name")
  const [_teacherProp, setTeacherProp] = useState('')
  const { fetchDataList } = useFetchFireData()

  const handleOnClick = () => {
    fetchDataList("teacher", _teacherPropKind, _teacherProp).then((teacherList) => {
      teacherList.sort((a, b) => a.name.localeCompare(b.name)) //정렬
      setTeacherList(teacherList)
    })
  }

  return (<StyledContainer>
    <div className="input_selector">
      <input className="teacher_search_input" type="text" value={_teacherProp} onChange={(event) => { setTeacherProp(event.target.value) }} />
      <select id="teacher_props_select" value={_teacherPropKind} onChange={(event) => { setTeacherPropKind(event.target.value) }}>
        <option value="name">이름</option>
        <option value="uid">아이디</option>
        <option value="schoolName">학교</option>
      </select>
    </div>
    <button id="search_btn" onClick={handleOnClick}> 검색</button>
  </StyledContainer >
  )
}

const StyledContainer = styled.div`
  margin: 0;
  .input_selector {
    display: flex;
    margin: 0 auto;
    gap: 20px;
    justify-content: center;
    input, select {
      height: 30px;
      border-radius:  5px;
    } 
`
export default TSearchInputBtn