import React from 'react'
import styled from 'styled-components'

import question from '../image/icon/question.png'
import mon01 from '../image/enemies/mon_01.png'
import mon02 from '../image/enemies/mon_02.png'
import mon03 from '../image/enemies/mon_03.png'
import mon04 from '../image/enemies/mon_04.png'
import { useNavigate } from 'react-router-dom'

const ActivityList = ({ activityList }) => {
  const navigate = useNavigate()

  const handleOnClick = (acti) => {
    navigate(`/activities/${acti.id}`, { state: acti }) //url 이동
  }

  const handleQuestImg = (monImg) => {
    let img = question
    switch (monImg) {
      case "mon_01":
        img = mon01
        break;
      case "mon_02":
        img = mon02
        break;
      case "mon_03":
        img = mon03
        break;
      case "mon_04":
        img = mon04
        break;
      default:
        img = question;
    }
    return img
  }

  return (
    <StyledContainer>
      <h4>퀘스트 목록</h4>
      <StyledListContainer>
        {activityList.map((acti) => {
          let actiTitle = acti.title
          let monImg = acti.monImg
          return (
            <StyledListItem key={acti.id}>
              <img src={handleQuestImg(monImg)} alt="퀘스트 img" onClick={() => { handleOnClick(acti) }} />
              <p className="acti_title">{actiTitle}</p>
            </StyledListItem>
          )
        })}
      </StyledListContainer>
    </StyledContainer >
  )
}
const StyledContainer = styled.div`
  box-sizing: border-box;  
  width: 100%;
  padding: 5px;
  h4 {
    display: flex;
    justify-content: center;
    margin: 10px auto;
  }
`
const StyledListContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  @media screen and (max-width: 767px){
    padding: 0;
  }
`
const StyledListItem = styled.li`
  width: 80px;
  margin: 10px;
  img {
    width: 100%;
    height: 80px;
    padding: 10px;
    transition: transform 0.1s;
    border: black 1px solid;
    border-radius: 15px;
    box-sizing: border-box;
    object-fit: cover;
    &:hover {
      background-color: orange;
      transform: scale(1.3);
      z-index: 1;
    }
  }
  p {
    text-align: center;
  }
  p.student_number {
    margin-bottom: 0px;
  }
  @media screen and (max-width: 767px){
    width: 70px;
    margin: 8px;
    img {
      height: 70px;
    }
    p {
      font-size: 14px;
      margin: 0;
    }
  }
`

export default ActivityList