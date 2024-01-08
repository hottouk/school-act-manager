import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const StyledListContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  li {
    max-width: 500px;
    min-width: 280px;
    height: 155px;
    margin: 10px;    
    padding: 15px 25px;
    border: rgb(120, 120, 120, 0.5) 1px solid;
    border-radius: 15px;
    cursor: pointer;
  }
  h4 { 
    color: royalBlue;
    font-weight: 600;
  }
`

const ClassRoomList = ({ classRooms }) => {
  const navigate = useNavigate()
  const handleEnterRoom = (classUrl) => {
    navigate(`/classrooms/${classUrl}`)
  }

  return (
    <StyledListContainer>
      {classRooms.map((classRoom) => {
        return (
          <li key={classRoom.id} onClick={() => { handleEnterRoom(classRoom.id) }}>
            <h4>{classRoom.classTitle}</h4>
            <p>{classRoom.intro}</p>
            <p>{classRoom.subject}</p>
          </li>
        )
      })}
    </StyledListContainer>
  )
}

export default ClassRoomList