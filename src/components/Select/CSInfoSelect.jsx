import styled from "styled-components"
//데이터
import classNumberList from '../../data/classNumberList'

//24.07.22 (반 데이터로 제공, 사용처: 클래스 만들기, 학생 회원 가입 2곳, 학생 myInfo 수정)
const CSInfoSelect = ({ grade, classNumber, number, handleOnChange }) => { //classMode true 교실 생성 진입
  return (
    <StyledSelectContainer>
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
          return <option key={value} value={value}>{key}</option>
        })}
      </select>
      {number && <StyledInput id="number_input" type="number" value={number} onChange={handleOnChange} min={1} max={99} required />}
    </StyledSelectContainer>
  )
}

const StyledSelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  p {
    margin: 0;
  }
  select {
    padding: 5px;
    border-radius: 7px;
  }
`
const StyledInput = styled.input`
  height: 35px;
  border: 1px solid black;
  border-radius: 5px;
`
export default CSInfoSelect