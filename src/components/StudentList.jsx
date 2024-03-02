//라이브러리
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
//컴포넌트
import AddNewStudentModal from './Modal/AddNewStudentModal'
//hooks
import useGetLevel from '../hooks/useGetLevel'
//이미지
import plus from "../image/icon/plus.png"
//CSS
import styled from "styled-components"
import { useSelector } from 'react-redux'
import PetImg from './PetImg'

const StudentList = ({ petList }) => {
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  const navigate = useNavigate()
  const classId = useParams() //반 id
  const { getExpAndLevelByActList } = useGetLevel()
  //대화창 내부변수
  const [modalShow, setModalShow] = useState(false)

  //함수
  const handleImgClick = (pet) => {
    const petId = pet.id //클릭한 펫 id
    navigate(`/classrooms/${classId.id}/${petId}`, { state: pet })
  }

  return (
    <StyledContainer>
      <h4>학생 별 보기</h4>
      <StyledListContainer>
        {petList.map((item) => {
          let name = '미등록'
          if (item.writtenName) {
            name = item.writtenName
          }
          let expAndLevel = { exp: 0, level: 0 }
          let actList = item.actList
          if (actList) { //기록된 활동이 있다면
            expAndLevel = getExpAndLevelByActList(actList)
          }
          let studentNumber = item.studentNumber
          return (
            <StyledLi key={item.id}>
              <PetImg subject={item.subject} level={expAndLevel.level} onClick={() => { handleImgClick(item) }} />
              <p className="student_number">{studentNumber}</p>
              <p className="student_name">{name}</p>
            </StyledLi>
          )
        })}
        {user.isTeacher && <StyledLi><StyledPlusImg src={plus} onClick={() => { setModalShow(true) }} /></StyledLi>}
      </StyledListContainer>
      {/* 대화창 */}
      <AddNewStudentModal
        show={modalShow}
        onHide={() => { setModalShow(false) }}
        classId={classId.id} />
    </StyledContainer>
  )
}
const StyledContainer = styled.div`
  box-sizing: border-box;  
  width: 100%;
  padding: 5px;
  h4 {
    display: flex;
    justify-content: center;
    margin: 10px auto;
  }
`

const StyledListContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  @media screen and (max-width: 767px){
    padding: 0;
  }
`
const StyledLi = styled.li`
  width: 80px;
  margin: 10px;
  img {
    width: 100%;
    height: 80px;
    padding: 4px;
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