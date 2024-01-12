import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { setSelectClass } from '../store/classSelectedSlice'

//2024.01.09
const DataList = ({ classRooms, activities }) => {
  //1. 변수
  const navigate = useNavigate()
  const [_classRoomList, setClassRoomList] = useState(null);
  const [_actList, setActList] = useState(null);
  //전역변수
  const dispatcher = useDispatch()
  //2. UseEffect
  useEffect(() => {
    if (classRooms) { setClassRoomList(classRooms) }
    if (activities) { setActList(activities) }
  }, [classRooms, activities])

  //3. 함수
  const handleItemClick = (item) => {
    if (_classRoomList) {
      navigate(`/classrooms/${item.id}`) //url 이동
      dispatcher(setSelectClass(item)) //선택한 item 비휘발성 전역변수화
    }
    if (_actList) { navigate(`/activities/${item.id}`, { state: item }) }
  }

  return (
    <StyledListContainer>
      {_classRoomList && _classRoomList.map((classRoom) => {
        return (<li className='classRoomItem' key={classRoom.id} onClick={() => { handleItemClick(classRoom) }}>
          <h4>{classRoom.classTitle}</h4>
          <p>{classRoom.intro}</p>
          <p>{classRoom.subject}</p>
        </li>)
      })}
      {_actList && _actList.map((act) => {
        let subjectcolor = "rgb(120, 120, 120, 0.5)"
        if (act.subject) {
          switch (act.subject) {
            case "kor":
              subjectcolor = "blue"
              break;
            default:
          }
        }
        return (<StyledSubjectItem key={act.id} subjectcolor={subjectcolor} onClick={() => { handleItemClick(act) }}>
          <h4>{act.title}</h4>
          <p>{act.content}</p>
        </StyledSubjectItem>)
      })}
    </StyledListContainer>
  )
}
const StyledListContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  li.classRoomItem {
    width: 280px;
    height: 155px;
    margin: 10px;    
    padding: 15px 25px;
    border: rgb(120, 120, 120, 0.5) 1.5px solid;
    border-radius: 15px;
    cursor: pointer;
  }
  h4 { 
    color: royalBlue;
    font-weight: 600;
  }
  @media screen and (max-width: 767px){
    flex-direction: column;
    align-items: center;
    padding: 0;
  }
`

const StyledSubjectItem = styled.li`
  width: 280px;
  height: 155px;
  margin: 10px;    
  padding: 15px 25px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  border-radius: 15px;
  box-shadow: ${(props) => props.subjectcolor} 1px 1px 7px 1px;
  cursor: pointer;
`
export default DataList