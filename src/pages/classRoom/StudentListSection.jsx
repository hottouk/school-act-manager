//라이브러리
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import styled from "styled-components"
//컴포넌트
import SquareListItem from '../../components/List/ListItem/SquareListItem'
import PlusBtn from '../../components/Btn/PlusBtn'
//모달 창, 제목 상위 page 이동(240923) -> 250126(리펙토링) -> 학생 클릭 분기(250207) -> 학생 분화 삭제
const StudentListSection = ({ petList, plusBtnOnClick, klassData, }) => {
  const user = useSelector(({ user }) => user);
  //반 id
  const classId = useParams();
  const navigate = useNavigate();

  //**함수**
  const handleOnClick = (pet) => {
    const petId = pet.id;
    if (user.isTeacher) { // 교사
      if (klassData?.type === "subject") {
        navigate(`/classrooms/${classId.id}/student`, {
          state: {
            petId,
            semester: klassData?.semester,
            klassType: klassData?.type,
            subject: klassData?.subject
          }
        })
      }
      else {
        navigate(`/homeroom/${classId.id}/student`, {
          state: {
            petId,
            klassType: klassData?.type
          }
        })
      }
    }
  }
  return (
    <Section>
      {petList.map((pet, index) =>
        <SquareListItem key={pet.id} item={pet} index={index} onClick={handleOnClick} type="student" />)}
      {/* 학생 추가 */}
      {user.isTeacher && <PlusBtn onClick={() => { plusBtnOnClick(true) }} />}
    </Section>
  )
}
const Section = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 5px 16px;
  list-style: none;
  @media screen and (max-width: 767px){
    padding: 0;
  }
`
export default StudentListSection