import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import unknwon from "../image/icon/unkown_icon.png"

const CircleList = ({ dataList, acti }) => {
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
    {(dataList && dataList.length > 0) && <>
      <div><p>참여 중..</p></div>
      <StyledCircleListUl>
        {dataList.map((item) => {
          let src = item.profileImg ? item.profileImg : unknwon
          return (<StyledLi key={item.uid} onClick={() => { handleItemClick(item) }}>
            <img src={src} alt="프사" />
            <p>{item.name} </p></StyledLi>)
        })}
      </StyledCircleListUl>
    </>
    }
  </StyledContainer>)
}

const StyledContainer = styled.div`
  max-width: 540px;
  background-color: #3454d1;
  color: #efefef;
  border-radius: 10px;
  border: rgb(120, 120, 120, 0.5) 1px solid;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  box-sizing: border-box;
  margin: 20px auto 50px;
  padding: 15px;
  @media screen and (max-width: 767px) {
    width: 100%;
    margin: 0;
    border: none;
    border-radius: 0;
    overflow-y: scroll;
    box-shadow: none;
  }
`
const StyledCircleListUl = styled.ul`
  color: #efefef;
  display: flex;
  padding: 0;
`
const StyledLi = styled.li`
  img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }
  p {
    margin: 0;
    text-align: center;
  }
  margin-right: 10px;
  cursor: pointer;
  `
export default CircleList