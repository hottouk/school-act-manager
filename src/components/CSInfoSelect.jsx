import styled from "styled-components"

//24.2.23
const CSInfoSelect = ({ grade, classNumber, number, subject, handleOnChange, classMode }) => {
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
        <option value="default" disabled >반</option>
        <option value="01">1반</option>
        <option value="02">2반</option>
        <option value="03">3반</option>
        <option value="04">4반</option>
        <option value="05">5반</option>
        <option value="06">6반</option>
        <option value="07">7반</option>
        <option value="08">8반</option>
        <option value="09">9반</option>
        <option value="10">10반</option>
        <option value="11">11반</option>
        <option value="12">12반</option>
        <option value="13">13반</option>
        <option value="14">14반</option>
        <option value="15">15반</option>
        <option value="16">16반</option>
        <option value="17">17반</option>
        <option value="18">18반</option>
        <option value="19">19반</option>
        <option value="20">기타</option>
      </select>
      {!classMode && <input type="number" id="number_input" value={number} onChange={handleOnChange} required min={1} max={99} />}
      {classMode && <select id="class_subject" required value={subject} onChange={handleOnChange}>
        <option value="default" disabled >과목 선택</option>
        <option value="국어">국어과</option>
        <option value="영어">영어과</option>
        <option value="수학">수학과</option>
        <option value="사회">사회과</option>
        <option value="과학">과학과</option>
        <option value="예체능">음,미,체</option>
        <option value="제2외국어">제2외국어과</option>
        <option value="정보">정보</option>
      </select>}
    </StyledSelectDiv>
  )
}

const StyledSelectDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  p {
    margin: 0;
  }
  select {
    padding: 5px;
    border-radius: 7px;
  }
  input {
    padding: 5px;
    border-radius: 7px;
  }
`
export default CSInfoSelect