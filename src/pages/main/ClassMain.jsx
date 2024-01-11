import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import iphone from '../../image/icon/iphone.png'
import useCollection from '../../hooks/useCollection'

const ClassMain = () => {
  // const { documentList } = useCollection('user', ['isTeacher', '==', true], 'name')
  const [teacherList, setTeacherList] = useState([])
  // useEffect(() => {
  //   if (documentList) {
  //     setTeacherList(documentList)
  //   }
  // }, [documentList])

  return (
    <StyledContainer>
      <StyledLandingBackground>
        <StyledWrapper>
          <h1>App For the Teacher, by the Teacher, of the Teacher</h1>
          <p>체계적 세특 관리, 이제 (곧) 모바일로 세특쓰세요. (곧) 모바일 출시</p>
          <img src={iphone} alt="랜딩이미지" />
        </StyledWrapper>
      </StyledLandingBackground>
      <StyledWhiteBackground>
        <StyledWrapper>
          <h3>현재 {teacherList.length}명의 선생님이 이용중입니다.</h3>
          <span>GPT로 세특쓰기, 이제는 나도 할 수 있다!!! 절찬리 판매중!!</span>
        </StyledWrapper>
      </StyledWhiteBackground>
      <StyledBlueBackground>
        <StyledWrapper>
          <p className='bible'>너희는 먼저 그의 나라와 그의 의를 구하라. 그리하면 이 모든 것을 너희에게 더하시리라. 마태복음 6:33</p>
          <h3>사용 가능 서비스(응 아직 다른건 안돼!)</h3>
          <div className='iconContainer'>
            <div className="itemContainer">
              <div className="iconBackground">
                <i className='heart'/>
              </div>
              <p>생기부도우미</p>
            </div>
            <div className="itemContainer">
              <div className="iconBackground">
                <i/>
              </div>
              <p>생기부도우미</p>
            </div>
            <div className="itemContainer">
              <div className="iconBackground">
                <i/>
              </div>
              <p>생기부도우미</p>
            </div>
            <div className="itemContainer">
              <div className="iconBackground">
                <i/>
              </div>
              <p>생기부도우미</p>
            </div>
          </div>
        </StyledWrapper>
      </StyledBlueBackground>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  box-sizing: border
`
const StyledWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
`
const StyledLandingBackground = styled.div`
  background-image: linear-gradient(to top, #499add, #3454d1);
  height: 550px;
  padding: 20px;
  color: #efefef;
  h1{
    display: inline-block;
  }
  img{
    float: right;
    width: 400px;
    position: relative;
    right: 20px;
    bottom: 27px;
  }
`
const StyledWhiteBackground = styled.div`
  background-color: #efefef;
  height: 360px;
  h3, span {
    position: relative;
    top: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
`
const StyledBlueBackground = styled.div`
  background-color: #499add;
  height: 400px;
  color: #efefef;
  padding: 20px;
  h3{
    width: 800px;
    margin: 10px auto;
    text-align: center;
  }
  p.bible {
    width: 400px;
    margin: auto;
    text-align: center;
  }
  .iconContainer {
    display: flex;
    justify-content: center;
  }
  .itemContainer {
    margin: 30px; 
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .iconBackground {
    width: 100px;
    height: 100px;
    background-color: #efefef;
    border: 1px solid #efefef;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  p {
    margin-top: 10px;
  }
  i.heart {
    position: relative;
    bottom: 10px;
    --size: 50px;
    position: relative;
    width: var(--size);
    height: calc(var(--size) * 0.3);
  }
  
  i.heart:before,
  i.heart:after {
    position: absolute;
    content: "";
    left: calc(var(--size) * 0.55);
    top: 0;
    width: calc(var(--size) * 0.55);
    height: calc(var(--size) * 0.85);
    background: #333;
    border-radius: calc(var(--size) * 0.55) calc(var(--size) * 0.55) 0 0;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
  }
  
  i.heart:after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }
`
export default ClassMain