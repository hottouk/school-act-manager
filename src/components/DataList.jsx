import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { setSelectClass } from '../store/classSelectedSlice'

//2024.01.09
const DataList = ({ classRooms, activities }) => {//todo 데이터 리스트, 타입으로 정리하기
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
      dispatcher(setSelectClass(item))   //선택한 교실 비휘발성 전역변수화
      navigate(`/classrooms/${item.id}`) //url 이동
    }
    if (_actList) {
      navigate(`/activities/${item.id}`, { state: { acti: item } })
    }
  }

  return (
    <StyledListContainer>
      {_classRoomList && _classRoomList.map((classRoom) => {
        return (<li className='classRoomItem' key={classRoom.id} onClick={() => { handleItemClick(classRoom) }}>
          <h4>{classRoom.classTitle}</h4>
          <p>{classRoom.intro}</p>
          <p>과목: {classRoom.subject} </p>
        </li>)
      })}
      {_actList && _actList.map((acti) => {
        return (<StyledSubjectItem key={acti.id} onClick={() => { handleItemClick(acti) }}>
          <h4>{acti.title}</h4>
          <p>{acti.content}</p>
          <p>과목: {acti.subject}</p>
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
  cursor: pointer;
`
export default DataList