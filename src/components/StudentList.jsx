//페이지 이동
import { useNavigate, useParams } from 'react-router-dom'

//이미지
import egg from "../image/myPet/egg.png"
import green1 from "../image/myPet/green_pet1.png"
import green2 from "../image/myPet/green_pet2.png"

//CSS
import styled from "styled-components"
import useGetLevel from '../hooks/useGetLevel'

//스타일
const StyledListItem = styled.li`
  width: 80px;
  margin: 10px;
`
const StyledPetImg = styled.img`
  width: 100%;
  height: 80px;
  transition: transform 0.1s;
  border: black 1px solid;
  border-radius: 15px;
  box-sizing: border-box;
  object-fit: cover;
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
const StudentList = ({ studentList }) => {
  const navigate = useNavigate()
  const classId = useParams().id //반 id
  const { getExpAndLevelByActList } = useGetLevel()

  //함수
  const handleImgClick = (item) => {
    const studentId = item.id //클릭한 학생 id
    navigate(`/classrooms/${classId}/${studentId}`, { state: item })
  }

  return (
    <>
      {studentList.map((student) => {
        let expAndLevel = { exp: 0, level: 0 }
        let actList = student.actList
        if (actList) { //기록된 활동이 있다면
          expAndLevel = getExpAndLevelByActList(actList)
        }
        let studentNumber = student.studentNumber
        return (
          <StyledListItem key={student.id}>
            {(expAndLevel.level === 0) && <StyledPetImg src={egg} onClick={() => { handleImgClick(student) }} />}
            {(expAndLevel.level === 1) && <StyledPetImg src={green1} onClick={() => { handleImgClick(student) }} />}
            {(expAndLevel.level === 2) && <StyledPetImg src={green2} onClick={() => { handleImgClick(student) }} />}
            {(expAndLevel.level === 3) && <StyledPetImg src={green2} onClick={() => { handleImgClick(student) }} />}
            <StyledStudentNumber id="student_number">{studentNumber}</StyledStudentNumber>
          </StyledListItem>
        )
      })}
    </>
  )
}

export default StudentList