//라이브러리
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import styled from "styled-components"
//컴포넌트
import SquareListItem from './ListItem/SquareListItem'
import PlusBtn from '../Btn/PlusBtn'
//2차 수정: 모달 창, 제목 상위 page 이동(240923) -> 250126(리펙토링) -> 학생 클릭 분기(250207)
const StudentList = ({ petList, plusBtnOnClick, classType, setIsPetInfoModal, setPetInfo }) => {
  const user = useSelector(({ user }) => { return user });
  //반 id
  const classId = useParams();
  const navigate = useNavigate();
  const handleOnClick = (pet) => {
    const petId = pet.id;
    const masterId = pet.master?.studentId;
    if (user.isTeacher) { // 교사
      if (classType === "subject") { navigate(`/classrooms/${classId.id}/${petId}`) }
      else { navigate(`/homeroom/${classId.id}/${pet.id}`) }
    } else {              // 학생
      if (user.uid === masterId) { navigate(`/classrooms/${classId.id}/${petId}`) }
      else {
        setPetInfo(pet);
        setIsPetInfoModal(true);
      }
    }
  }

  return (
    <Container>
      {petList.map((pet, index) => (<SquareListItem key={pet.id} item={pet} index={index} onClick={handleOnClick} type="student" />))}
      {/* 학생 추가 버튼 */}
      {user.isTeacher && <PlusBtn onClick={() => { plusBtnOnClick(true) }} />}
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
export default StudentList