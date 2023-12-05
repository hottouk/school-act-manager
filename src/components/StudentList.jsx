//페이지 이동
import { useNavigate, useParams } from 'react-router-dom'

//이미지
import egg from "../image/egg.png"

//CSS
import styled from "styled-components"

//스타일
const StyledListItem = styled.li`
  width: 80px;
  margin: 10px;
`
const StyledImg = styled.div`
  width: 100%;
  height: 80px;
  padding: 20px;
  transition: transform 0.1s;
  background-image: url(${egg});
  background-size: cover;
  border: black 1px solid;
  border-radius: 15px;
  box-sizing: border-box;
  &:hover {
    background-color: orange;
    transform: scale(1.3) skewX(-14deg);
    z-index: 1;
  }
`
const StyledStudentNumber = styled.p`
  text-align: center;
  color:black;
`

const StudentList = ({ students }) => {
  const navigate = useNavigate()
  const classId = useParams().id //반 id

  const handleImgClick = (item) => {
    const studentId = item.id //클릭한 학생 id
    navigate(`/classrooms/${classId}/${studentId}`, { state: item })
  }

  return (
    <>
      {students.map((item) => {
        let studentNumber = item.studentNumber
        return (
          <StyledListItem key={item.id}>
            <StyledImg onClick={() => { handleImgClick(item) }}>
            </StyledImg>
            <StyledStudentNumber id="student_number">{studentNumber}</StyledStudentNumber>
          </StyledListItem>
        )
      })}
    </>
  )
}

export default StudentList