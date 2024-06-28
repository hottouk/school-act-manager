import React, { useState } from 'react'
import useFetchFireData from '../hooks/useFetchFireData'
import styled from 'styled-components'
import SmallBtn from './Btn/SmallBtn'
import CardList from './CardList'

const SSearchInputBtn = (props) => {
  const [_studentProp, setStudentProp] = useState("")
  const [_studentKndProp, setStudentKindProp] = useState("schoolName")
  const { fetchUserList } = useFetchFireData()

  const handleOnClick = () => {
    fetchUserList("student", _studentKndProp, _studentProp).then((studentList) => {
      props.searchReslt(studentList)
    })
  }

  return (
    <StyledContainer>
      <div className="input_selector">
        <input className="student_search_input"
          type="text"
          value={_studentProp}
          placeholder="학생 검색"
          onChange={(event) => { setStudentProp(event.target.value) }} />
        <select id="student_props_select" value={_studentKndProp} onChange={(event) => { setStudentKindProp(event.target.value) }}        >
          <option value="name">이름</option>
          <option value="schoolName">학교</option>
        </select>
        <SmallBtn id="search_btn" btnColor={"#3454d1"} btnOnClick={handleOnClick} btnName={"검색"} />
      </div>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  margin: 0;
  .input_selector {
    display: flex;
    margin: 20px auto;
    gap: 20px;
    justify-content: center;
    input, select {
      height: 30px;
      border-radius:  5px;
    }
    button { margin: 0;}
`

export default SSearchInputBtn