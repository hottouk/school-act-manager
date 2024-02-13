import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const CircleList = ({ dataList, type, acti, wholeInfo }) => {
  const user = useSelector(({ user }) => user)
  const navigate = useNavigate()

  const handleItemClick = (student) => {
    if (user.isTeacher) { //교사전용
      navigate(`/activities/${acti.id}/${student.uid}`, { state: { acti, student } })
    } else {
      window.alert("교사만 확인 가능합니다.")
    }
  }

  return (<StyledContainer>
    {(dataList && dataList.length > 0) &&
      <StyledCircleListUl>
        <h4>참여 학생</h4>
        {dataList.map((student) => {
          return (<StyledListItem key={student.uid} onClick={() => { handleItemClick(student) }}>
            <img src="null" alt="로고" />
            <p>{student.name} </p></StyledListItem>)
        })}
      </StyledCircleListUl>
    }
  </StyledContainer>)
}
const StyledListItem = styled.li`
  width: 80px;
  margin: 10px;
  cursor: pointer;
  `
const StyledCircleListUl = styled.ul`
  margin: 0 auto 30px;
  padding: 20px;
  color: #efefef;
  background-color: #3454d1;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  img {
    width: 45px;
    height: 45px;
    background-color: white;
  }
`
const StyledContainer = styled.div`
  max-width: 540px;
  box-sizing: border-box;
  margin: 20px auto;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
`
export default CircleList