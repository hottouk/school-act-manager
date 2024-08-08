import React from 'react'
//이미지
import classSort1 from '../../image/class/class_sort1.png'
import classSort2 from '../../image/class/class_sort2.png'
import classSort3 from '../../image/class/class_sort3.png'
import classSort4 from '../../image/class/class_sort4.png'
import classSort5 from '../../image/class/class_sort5.png'
import classSort6 from '../../image/class/class_sort6.png'
//css
import styled from 'styled-components'

const CardSortForm = ({ itemList, handleCardBtnClick }) => {
  //샘플 데이터
  const itemSampleList = [
    { id: "sample1", legend: "제목1", subTitle: "설명1", imgNumber: 1 },
    { id: "sample2", legend: "제목2", subTitle: "설명2", imgNumber: 2 },
    { id: "sample3", legend: "제목3", subTitle: "설명3", imgNumber: 3 }
  ]

  const getImgSrc = (imgNumber) => {
    switch (imgNumber) {
      case 1:
        return classSort1;
      case 2:
        return classSort2;
      case 3:
        return classSort3;
      case 4:
        return classSort4;
      case 5:
        return classSort5;
      case 6:
        return classSort6;
      default:
        return classSort1;
    }
  }

  //랜더링
  const renderItem = (item) => {
    const { id, legend, subTitle, imgNumber, ban, ing } = item;
    return (
      <StyledCardDiv $color={"#3454d1"} id={id} onClick={handleCardBtnClick} key={id}>
        <legend>{legend}</legend>
        <p>{subTitle}</p>
        {ban && <p className='ban'>추후 서비스</p>}
        {ing && <p className='ban'>현재 제작중</p>}
        <img src={getImgSrc(imgNumber)} alt="클래스5" id={id} onClick={handleCardBtnClick} />
      </StyledCardDiv>
    );
  };

  const itemListToRender = itemList && itemList.length > 0 ? itemList : itemSampleList;

  return (
    <StyledCardContainer>
      {itemListToRender.map(renderItem)}
    </StyledCardContainer>
  )
}

const StyledCardContainer = styled.div`
  width: 80%;
  margin: 20px auto;
  top: 160px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`
const StyledCardDiv = styled.div`
  width: 250px;
  height: 360px;
  padding: 20px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: ${(props) => { return props.$color }} 1px 1px 7px 1px;
  position: relative;
  legend {
    color: #3454d1;
    font-weight: bold;
    text-align: center;
  }
  p.ban {
    font-size: 22px;
    color: red;
    text-align: center;
    font-weight: 900;
  }
  p {
    diplay: inline-block;
    font-size: 14px;
    margin-bottom: 2px;
  }
  img {
    width: 70%;
    margin: 50px auto;
    position: absolute;
    bottom: 4px;
    right: 4px;
    left: 4px;
  }
  @media screen and (max-width: 767px){
    position: relative;
    height: 250px;
  }
`
export default CardSortForm

