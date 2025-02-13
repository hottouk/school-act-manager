//라이브러리
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import styled from "styled-components"
//컴포넌트
import SquareListItem from './ListItem/SquareListItem'
//이미지
import plus from "../../image/icon/plus.png"

//2024.09.23(2차 수정: 모달 창, 제목 상위 page 이동) -> 250126(리펙토링) -> 학생 클릭 분기(250207)
const StudentList = ({ petList, plusBtnOnClick, classType, setIsPetInfoModal, setPetInfo }) => {
  const user = useSelector(({ user }) => { return user });
  //반 id
  const classId = useParams();
  const navigate = useNavigate();

  //유저 상호작용
  const handleOnClick = (pet) => {
    const petId = pet.id
    const masterId = pet.master?.studentId
    if (user.isTeacher) { // 교사
      if (classType === "subject") { navigate(`/classrooms/${classId.id}/${petId}`) }
      else { navigate(`/homeroom/${classId.id}/${pet.id}`) }
    } else {              // 학생
      if (user.uid === masterId) { navigate(`/classrooms/${classId.id}/${petId}`) }
      else {
        setPetInfo(pet)
        setIsPetInfoModal(true)
      }
    }
  }

  return (
    <Container>
      {petList.map((pet, index) => {
        return (<SquareListItem key={pet.id} item={pet} index={index} onClick={handleOnClick} type="student" />)
      })}
      {/* 학생 추가 버튼 */}
      {user.isTeacher && <StyledPlusImg src={plus} onClick={() => { plusBtnOnClick() }} />}
    </Container>
  )
}

const Container = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 5px 16px;
  list-style: none;
  @media screen and (max-width: 767px){
    padding: 0;
  }
`
const StyledPlusImg = styled.img`
  width: 80px;
  height: 80px;
  margin-top: 10px;
  border-radius: 20px;
  object-fit: cover;
  opacity: 0.8;
  transition: transform 0.1s;
  &:hover {
    background-color: orange;
    transform: scale(1.3);
    z-index: 1;
  }
`
export default StudentList