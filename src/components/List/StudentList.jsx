//라이브러리
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
//컴포넌트
import PetImg from '../PetImg'
//hooks
import useGetLevel from '../../hooks/useGetLevel'
//이미지
import plus from "../../image/icon/plus.png"
//css
import styled from "styled-components"

//2024.09.23(2차 수정: 모달 창, 제목 상위 page 이동)
const StudentList = ({ petList, plusBtnOnClick, classType }) => {
  //1. 변수
  const user = useSelector(({ user }) => { return user })
  const classId = useParams() //반 id
  const navigate = useNavigate()
  const { getExpAndLevelByActList } = useGetLevel()
  //2. 함수
  const handleImgClick = (pet) => {
    let petId = pet.id //클릭한 펫 id
    if (classType === "subject") { navigate(`/classrooms/${classId.id}/${petId}`, { state: pet }) }
    else { navigate(`/homeroom/${classId.id}/${petId}`, { state: pet }) }
  }

  return (
    <UlContainer>
      {petList.map((pet) => {
        let name = '미등록'
        if (pet.writtenName) {
          name = pet.writtenName
        }
        let studentNumber = pet.studentNumber
        let expAndLevel = { exp: 0, level: 0 }
        let actList = pet.actList
        if (actList) { //기록된 활동이 있다면
          expAndLevel = getExpAndLevelByActList(actList)
        }
        return (
          <StyledLi key={pet.id}>
            <PetImg subject={pet.subject} level={expAndLevel.level} onClick={() => { handleImgClick(pet) }} />
            <p className="student_number">{studentNumber}</p>
            <p className="student_name">{name}</p>
          </StyledLi>
        )
      })}
      {/* 학생 추가 버튼 */}
      {user.isTeacher && <StyledLi><StyledPlusImg src={plus} onClick={() => { plusBtnOnClick() }} /></StyledLi>}
    </UlContainer>
  )
}

const UlContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 5px 16px;
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
  cursor: pointer;  
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