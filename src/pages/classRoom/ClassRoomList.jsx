import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const StyledUl = styled.ul`
  list-style-type: none;
  li {
    display: inline-block;
    max-width: 500px;
    min-width: 280px;
    height: 155px;
    border: rgb(120, 120, 120, 0.5) 1px solid;
    border-radius: 15px;
    padding: 15px 25px;
     cursor: pointer;
  }
  li + li {
    margin-left: 20px;
  }
`
const StyledTitle = styled.h4`
  color: royalBlue;
  font-weight: 600;
`

const ClassRoomList = ({ classRooms }) => {
  const navigate = useNavigate()
  const handleEnterRoom = (classUrl) => {
    navigate(`/classrooms/${classUrl}`)
  }

  return (
    <StyledUl>
      {classRooms.map((classRoom) => {
        return (
          <li key={classRoom.id} onClick={() => { handleEnterRoom(classRoom.id) }}>
            <StyledTitle>{classRoom.classTitle}</StyledTitle>
            <p>{classRoom.intro}</p>
            <p>{classRoom.subject}</p>
          </li>
        )
      })}
    </StyledUl>
  )
}

export default ClassRoomList