import React, { useState } from 'react'
import useFetchFireData from '../../hooks/Firebase/useFetchFireData'
//css
import styled from 'styled-components'

const TSearchInputBtn = ({ setTeacherList }) => {
  const [_teacherKindProp, setTeacherKindProp] = useState("name")
  const [_teacherProp, setTeacherProp] = useState("교사 검색")
  const { fetcUserList } = useFetchFireData()
  const handleOnClick = () => {
    fetcUserList("teacher", _teacherKindProp, _teacherProp).then((teacherList) => {
      teacherList.sort((a, b) => a.name.localeCompare(b.name)) //정렬
      setTeacherList(teacherList)
    })
  }

  return (<StyledContainer>
    <div className="input_selector">
      <input className="teacher_search_input" type="text" value={_teacherProp} onChange={(event) => { setTeacherProp(event.target.value) }} />
      <select id="teacher_props_select" value={_teacherKindProp} onChange={(event) => { setTeacherKindProp(event.target.value) }}>
        <option value="name">이름</option>
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