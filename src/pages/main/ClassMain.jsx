import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import iphone from '../../image/icon/iphone.png'
import useCollection from '../../hooks/useCollection'

const ClassMain = () => {
  const { documentList } = useCollection('user', ['isTeacher', '==', true], 'name')
  const [teacherList, setTeacherList] = useState([])
  useEffect(() => {
    if (documentList) {
      setTeacherList(documentList)
    }
  }, [documentList])

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
          <h3>사용 가능 서비스</h3>
          <div className='iconContainer'>
            <div className="itemContainer">
              <div className="iconBackground">
                <i />
              </div>
              <p>생기부도우미</p>
            </div>
            <div className="itemContainer">
              <div className="iconBackground">
                <i />
              </div>
              <p>생기부도우미</p>
            </div>
            <div className="itemContainer">
              <div className="iconBackground">
                <i />
              </div>
              <p>생기부도우미</p>
            </div>
            <div className="itemContainer">
              <div className="iconBackground">
                <i />
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
  box-sizing: border-box;
`
const StyledWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`
const StyledLandingBackground = styled.div`
  width: 100%;
  height: 550px;
  padding: 20px;
  color: #efefef;
  background-image: linear-gradient(to top, #499add, #3454d1);
  h1 {
    display: inline-block;
  }
  img {
    float: right;
    width: 400px;
    position: relative;
    right: 20px;
    bottom: 27px;
  }
  @media screen and (max-width: 767px) {
    height: 400px;
    position: relative;
    padding: 20px 20px 0 20px;
    h1 {
      font-size: 1.6em;
    }
    img {
      float: none;
      position: absolute;
      right: 50%;
      left: 50%;
      bottom: 0;
      margin: 20px 0 0;
      width: 250px;
      transform: translate(-50%, 0%);
    }
    p {
      display: none;
    }
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
  @media screen and (max-width: 767px) {
    height: 35px;
    span {
      display: none;
    }
    h3 {
      font-size: 20px;
      top: 0;
      display: block;
      margin: 3px;
      text-align: center;
    }
  }
`
const StyledBlueBackground = styled.div`
  background-color: #499add;
  height: 400px;
  color: #efefef;
  padding: 20px;
  p.bible {
    width: 400px;
    margin: auto;
    text-align: center;
  }
  h3{
    width: 800px;
    margin: 10px auto;
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
  @media screen and (max-width: 767px) {
    p.bible {
      width: 100%;
      margin: auto;
      font-size: 14px;
      text-align: center;
    }
    h3{
      font-size: 1.2em;
      width: 100%;
      margin: 10px auto;
      text-align: center;
    }
    .iconContainer {
      flex-wrap: wrap;
      width: 232px;
      margin: 0 auto;
    }
    .itemContainer{
      margin: 10px;
      p {
        margin: 10px 0 0;
      }
    }
    .iconBackground {
      width: 70px;
      height: 70px;
      border-radius: 35px;
    }
  }
`
export default ClassMain