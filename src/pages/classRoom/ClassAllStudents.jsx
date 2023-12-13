import { useLocation } from "react-router-dom"
import styled from "styled-components"
import useGetByte from "../../hooks/useGetByte"

const StyledGirdContainer = styled.main`
  display: grid;
  grid-template-rows: 40px;
  grid-auto-rows: minmax(100px, auto);
  padding: 0 30px;
  margin: 60px auto;
`
const StyledTitleRow = styled.div`
  display: flex;
`
const StyledSmallDiv = styled.div`
  flex-basis: 60px;
  justify-content: center;
  display: flex;
  align-items: center;
`
const StyledMidlDiv = styled.div`
  flex-basis: 100px;
  justify-content: center;
  display: flex;
  align-items: center;
`
const StyledBiglDiv = styled.div`
  flex-grow: 1;
  justify-content: center;
  display: flex;
  align-items: center;
`
const StyledNameInput = styled.input`
  display: block;
  width: 100px;
  height: 50%;
`

const StyledTextArea = styled.textarea`
  display: block;
  width: 95%;
  height: 85%;
`

const ClassAllStudents = () => {
  //경로 이동 prop
  const { state } = useLocation()
  const studentList = state

  const { getByteLengthOfString } = useGetByte()
  return (
    <StyledGirdContainer>
      <StyledTitleRow>
        <StyledSmallDiv>연번</StyledSmallDiv>
        <StyledMidlDiv>학번</StyledMidlDiv>
        <StyledMidlDiv>이름</StyledMidlDiv>
        <StyledBiglDiv>생기부</StyledBiglDiv>
        <StyledSmallDiv>Byte</StyledSmallDiv>
      </StyledTitleRow>
      {studentList.map((student, index) => {
        let actList = student.actList
        let record = (actList && actList.reduce((acc, cur) => {
          return acc.concat(' ', cur.record)
        }, ''))

        let Bytes = (actList && getByteLengthOfString(record))

        return <StyledTitleRow key={student.id}>
          <StyledSmallDiv>{index + 1}</StyledSmallDiv>
          <StyledMidlDiv>{student.studentNumber}</StyledMidlDiv>
          <StyledMidlDiv><StyledNameInput type="text" /></StyledMidlDiv>
          <StyledBiglDiv><StyledTextArea value={(actList && record)} /></StyledBiglDiv>
          <StyledSmallDiv>{Bytes}</StyledSmallDiv>
        </StyledTitleRow>
      })}

    </StyledGirdContainer >
  )
}

export default ClassAllStudents