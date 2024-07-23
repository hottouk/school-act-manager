import styled from "styled-components"
//데이터
import classNumberList from '../data/classNumberList'

//24.07.22 (반 데이터로 제공)
const CSInfoSelect = ({ grade, classNumber, handleOnChange, classMode }) => {
  return (
    <StyledSelectDiv>
      {!classMode && <p>학번: </p>}
      <select id="class_grade" required value={grade} onChange={handleOnChange}>
        <option value="default" disabled >학년</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>
      <select id="class_number" required value={classNumber} onChange={handleOnChange}>
        <option value='default' disabled >반</option>
        {classNumberList.map((classNumber) => {
          let key = Object.keys(classNumber)
          let value = Object.values(classNumber)
          return <option value={value}>{key}</option>
        })}
      </select>
    </StyledSelectDiv>
  )
}

const StyledSelectDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  p {
    margin: 0;
  }
  select {
    padding: 5px;
    border-radius: 7px;
    margin-left: 30px;
  }
`
export default CSInfoSelect