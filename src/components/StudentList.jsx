//페이지 이동
import { useNavigate, useParams } from 'react-router-dom'
//이미지
import egg from "../image/myPet/egg.png"
import green1 from "../image/myPet/green_pet1.png"
import green2 from "../image/myPet/green_pet2.png"
import plus from "../image/icon/plus.png"
//CSS
import styled from "styled-components"
import useGetLevel from '../hooks/useGetLevel'
import AddNewStudentModal from './Modal/AddNewStudentModal'
import { useState } from 'react'


const StudentList = ({ studentList }) => {
  const navigate = useNavigate()
  const classId = useParams() //반 id
  const { getExpAndLevelByActList } = useGetLevel()
  //1. 변수
  //대화창 내부변수
  const [modalShow, setModalShow] = useState(false)

  //함수
  const handleImgClick = (student) => {
    const studentId = student.id //클릭한 학생 id
    navigate(`/classrooms/${classId.id}/${studentId}`, { state: student })
  }

  return (
    <StyledContainer>
      <Styledh4>2단계 - 반 학생별로 세부 수정하기</Styledh4>
      <StyledListContainer>
        {studentList.map((student) => {
          let name = '미등록'
          if (student.writtenName) {
            name = student.writtenName
          }
          let expAndLevel = { exp: 0, level: 0 }
          let actList = student.actList
          if (actList) { //기록된 활동이 있다면
            expAndLevel = getExpAndLevelByActList(actList)
          }
          let studentNumber = student.studentNumber
          return (
            <StyledListItem key={student.id}>
              {(expAndLevel.level === 0) && <img src={egg} alt='펫' onClick={() => { handleImgClick(student) }} />}
              {(expAndLevel.level === 1) && <img src={green1} alt='펫' onClick={() => { handleImgClick(student) }} />}
              {(expAndLevel.level === 2) && <img src={green2} alt='펫' onClick={() => { handleImgClick(student) }} />}
              {(expAndLevel.level === 3) && <img src={green2} alt='펫' onClick={() => { handleImgClick(student) }} />}
              <p className="student_number">{studentNumber}</p>
              <p className="student_name">{name}</p>
            </StyledListItem>
          )
        })}
        <StyledListItem><StyledPlusImg src={plus} onClick={() => { setModalShow(true) }} /></StyledListItem>
      </StyledListContainer>
      {/* 대화창 */}
      <AddNewStudentModal
        show={modalShow}
        onHide={() => { setModalShow(false) }}
        classId={classId} />
    </StyledContainer>
  )
}
const StyledContainer = styled.div`
  box-sizing: border-box;  
  width: 100%;
  padding: 5px;
`
const Styledh4 = styled.h4`
  display: flex;
  justify-content: center;
  margin: 10px auto;
`
const StyledListContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  @media screen and (max-width: 767px){
    padding: 0;
  }
`
const StyledListItem = styled.li`
  width: 80px;
  margin: 10px;
  img {
    width: 100%;
    height: 80px;
    transition: transform 0.1s;
    border: black 1px solid;
    border-radius: 15px;
    box-sizing: border-box;
    object-fit: cover;
    &:hover {
      background-color: orange;
      transform: scale(1.3);
      z-index: 1;
    }
  }
  p {
    text-align: center;
  }
  p.student_number {
    margin-bottom: 0px;
  }
  @media screen and (max-width: 767px){
    width: 70px;
    margin: 8px;
    img {
      height: 70px;
    }
    p {
      font-size: 14px;
      margin: 0;
    }
  }
`
const StyledPlusImg = styled.img`
  width: 100%;
  height: 80px;
  transition: transform 0.1s;
  border-radius: 15px;
  box-sizing: border-box;
  object-fit: cover;
  &:hover {
    background-color: orange;
    transform: scale(1.3);
    z-index: 1;
  }
  opacity: 0.8;
`
export default StudentList