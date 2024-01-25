//라이브러리
import React, { useEffect, useState } from 'react'
//hooks
import useDevideTS from '../../hooks/useDevideTS'
//이미지
import iphone from '../../image/icon/iphone.png'
//css
import styled from 'styled-components'
import useClientHeight from '../../hooks/useClientHeight'

const ClassMain = () => {
  const { teacherList, studentList, errorByDevideTS } = useDevideTS(null, 'name')
  const [_teacherList, setTeacherList] = useState([])
  const [_studentList, setStudentList] = useState([])
  const clientHeight = useClientHeight(document.documentElement)

  useEffect(() => {
    if (teacherList) {
      setTeacherList(teacherList)
    }
    if (studentList) {
      setStudentList(studentList)
    }
    if(errorByDevideTS){
      console.log(errorByDevideTS)
    }
  }, [teacherList])

  return (
    <StyledContainer $clientheight={clientHeight}>
      <StyledLandingBackground>
        <StyledWrapper>
          <h1>App For the Teacher, by the Teacher, of the Teacher</h1>
          <p>체계적 세특 관리, 이제 (곧) 모바일로 세특쓰세요. (곧) 모바일 출시</p>
          <img className='landing_img' src={iphone} alt="랜딩이미지" />
        </StyledWrapper>
      </StyledLandingBackground>
      <StyledWhiteBackground>
        <StyledWrapper>
          <h3>현재 {_teacherList.length}명의 선생님, {_studentList.length}명의 학생이 이용중입니다.</h3>
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
  @media screen and (max-width: 767px) {
    position: fixed;
    width: 100%;
    height: ${(props) => props.$clientheight}px;
    marign: 0;
    padding-bottom: 20px;
    overflow-y: scroll;
  }
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
  .landing_img {
    float: right;
    width: 400px;
    position: relative;
    right: 20px;
    bottom: 27px;
  }
  @media screen and (max-width: 767px) {
    position: relative;
    p{
      display: none;
    }
    .landing_img{
      position: absolute;
      width: 300px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
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
    height: 50px;
    display: flex;
    align-items: center;
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
  @media screen and (max-width: 767px) {
    p.bible{
      width: 100%;
      font-size: 14px;
    }

    h3{
      width: 100%;
    }
    .iconContainer {
      width: 232px;
      margin: 0 auto;
      flex-wrap: wrap;
      p{
        margin-bottom: 4px;
      }
    }
    .itemContainer {
      margin: 10px;
    }
    .iconBackground {
      width: 75px;
      height: 75px;
    }
  }
`
export default ClassMain