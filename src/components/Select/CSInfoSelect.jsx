//라이브러리
import styled from "styled-components"
//데이터
import classNumberList from '../../data/classNumberList'
//반 데이터로 제공, 사용처: 클래스 만들기, 학생 회원 가입 2곳, 학생 myInfo 수정(240722)
const CSInfoSelect = ({ grade, classNumber, number, handleOnChange, classMode }) => { //classMode true 교실 생성 진입
  return (
    <Container>
      <select id="class_grade" value={grade} onChange={handleOnChange} required>
        <option value="default" disabled>학년</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>
      <select id="class_number" value={classNumber} onChange={handleOnChange} required>
        <option value="default" disabled>반</option>
        {classNumberList.map((classNumber) => {
          const key = Object.keys(classNumber);
          const value = Object.values(classNumber);
          return <option key={value} value={value}>{key}</option>;
        })}
      </select>
      {!classMode && <NumberInput id="number_input" type="number" value={number} onChange={handleOnChange} min={1} max={99} required />}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  select {
    padding: 5px;
    border: 1px solid rgba(120,120,120,0.5);
    border-radius: 7px;
  }
`
const NumberInput = styled.input`
  height: 35px;
  border: 1px solid rgba(120,120,120,0.5);
  border-radius: 5px;
`
export default CSInfoSelect