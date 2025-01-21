import React from 'react'
import styled from 'styled-components'
import questionIcon from '../../../image/icon/question.png'

const SmCardListItem = ({ item, onClick, styles, type }) => {
  return (
    <Container>
      <img src={item.profileImg || questionIcon} alt="이미지" />
      <div>
        <p>{item.name} 선생님</p>
        {/* <p className="like_count"><img className={"like_icon"} src={likeIcon} alt={"받은좋아요"} />{item.likedCount} </p> */}
      </div>
    </Container>
  )
}


const Container = styled.div`
  flex: 0 0 200px;  /* 고정된 너비 설정 grow, shrink, basis */
  display: flex;
  position: relative;
  border: 1px solid #949192;
  border-radius: 10px;
  margin-right: 15px;
  img { 
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin: 10px;
  }
  p.like_count {
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #3454d1;
    font-weight: bold;
  }
  img.like_icon { 
    width: 30px;
    height: 30px; 
    margin-right: 5px;
    margin-bottom: 7px;
  }
  p { margin: 0;}
`

export default SmCardListItem
