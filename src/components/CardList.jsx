import React from 'react'
import { useSelector } from 'react-redux'
import EmptyResult from './EmptyResult'
import DataList from './DataList'
import styled from 'styled-components'

const CardList = ({ dataList, type, title, tComment, sComment }) => {
  const user = useSelector(({ user }) => { return user })
  return (<>
    {(dataList && dataList.length !== 0) && <>
      <h4>{title}</h4>
      {type === "classroom" && <StyledClassRoomListDiv>
        <DataList classRooms={dataList} />
      </StyledClassRoomListDiv>}
      {type === "activity" && <StyledClassRoomListDiv>
        <DataList activities={dataList} />
      </StyledClassRoomListDiv>}
    </>}
    {(!dataList || dataList.length === 0) && <>
      <h4>{title}</h4>
      <StyledClassRoomListDiv>
        {user.isTeacher && < EmptyResult comment={tComment} />}
        {!user.isTeacher && < EmptyResult comment={sComment} />}
      </StyledClassRoomListDiv></>}
  </>)
}

const StyledClassRoomListDiv = styled.div`
  margin: 4px auto 50px;
  border-radius: 15px;
  border: 4px dotted #3454d1;
  @media screen and (max-width: 767px) {
    border: none;
    border-top: 1px solid #3454d1;
    border-bottom: 1px solid #3454d1;
  }
`

export default CardList