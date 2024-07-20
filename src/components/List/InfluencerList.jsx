import React, { useEffect, useRef } from 'react'
//이미지
import questionIcon from '../../image/icon/question.png'
import likeIcon from '../../image/icon/like_icon.png'
//css
import styled from 'styled-components';
import useClientWidth from '../../hooks/useClientWidth';
//2024.07.21
const InfluencerList = (props) => {
  const listRef = useRef(null);
  const clientWidth = useClientWidth(document.documentElement)
  useEffect(() => {
    const listEl = listRef.current;
    let scrollAmount = 0;
    const scrollStep = 1;      // 스크롤 속도 조절
    const scrollInterval = 30; // 스크롤 애니매이션 시간 간격(0.03초)
    const scrollList = () => {
      scrollAmount += scrollStep;
      if (scrollAmount >= listEl.scrollWidth / 2) { //요소의 전체 스크롤 가능한 너비(2배니까 2로 나눔)
        scrollAmount = 0; //amount가 초과하면 끝에 도달한 것으로 간주하여 다시 0으로
      }
      listEl.scrollLeft = scrollAmount;
    };
    const scrollIntervalId = setInterval(scrollList, scrollInterval);  //시간 간격마다 scrollList 함수 반복
    return () => clearInterval(scrollIntervalId);                      //clean up

  }, [clientWidth, props.dataList])

  return (<>
    <StyledTitle>좋아요 top10 선생님</StyledTitle>
    <StyledUl ref={listRef}>
      {props.dataList.concat(props.dataList).map((data, index) => { //2번 복제 -> 무한 스크롤
        return <StyledSmCard key={index} >
          <img src={data.profileImg || questionIcon} alt="이미지" />
          <div>
            <p className="like_count"><img className={"like_icon"} src={likeIcon} alt={"받은좋아요"} />{data.likedCount} </p>
            <p>{data.name} 선생님</p>
          </div>
          {index < 3 && <StyledBadge>Top {index + 1}</StyledBadge>}
        </StyledSmCard>
      })}
    </StyledUl>
  </>
  )
}

const StyledTitle = styled.h4`
  margin-left: 10px;
  padding: 5px;
  font-weight: bold;
`

const StyledUl = styled.ul`
  display: flex;
  margin: 0;
  padding: 0 20px 20px 20px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
`
const StyledSmCard = styled.div`
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
const StyledBadge = styled.div`
  background-color: gold;
  color: black;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  position: absolute;
  top: 5px;
  right: 5px;
`
export default InfluencerList